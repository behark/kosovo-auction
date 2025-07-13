import dbConnect from '@/lib/db/mongodb';
import SupportTicket, { ISupportTicket } from '@/lib/db/models/support-ticket';
import mongoose, { FilterQuery, SortOrder } from 'mongoose';
import { User } from '@/lib/db/models/user';

export interface TicketFilters {
  userId?: string;
  companyId?: string;
  assignedToId?: string;
  status?: string | string[];
  category?: string | string[];
  priority?: string | string[];
  isEscalated?: boolean;
  fromDate?: Date;
  toDate?: Date;
  language?: string;
  tags?: string[];
  search?: string;
}

export interface TicketCreation {
  userId: string;
  companyId?: string;
  subject: string;
  description: string;
  category: 'account' | 'auction' | 'payment' | 'vehicle' | 'transport' | 'technical' | 'other';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  language?: string;
  attachments?: Array<{
    filename: string;
    url: string;
    contentType: string;
    size: number;
  }>;
  relatedEntities?: Array<{
    entityType: 'auction' | 'vehicle' | 'user' | 'transport' | 'payment' | 'company';
    entityId: string;
  }>;
  tags?: string[];
  metadata?: Record<string, any>;
}

export class SupportService {
  /**
   * Create a new support ticket
   */
  static async createTicket(ticketData: TicketCreation): Promise<ISupportTicket> {
    await dbConnect();
    
    // Validate that user exists
    const user = await User.findById(ticketData.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create new ticket
    const ticket = new SupportTicket({
      user: new mongoose.Types.ObjectId(ticketData.userId),
      subject: ticketData.subject,
      description: ticketData.description,
      category: ticketData.category,
      priority: ticketData.priority || 'medium',
      status: 'new',
      language: ticketData.language || 'en',
      tags: ticketData.tags || [],
      isEscalated: false,
      messages: []
    });
    
    // Add company if provided
    if (ticketData.companyId) {
      ticket.companyId = new mongoose.Types.ObjectId(ticketData.companyId);
    }
    
    // Add initial message from the user
    ticket.messages.push({
      sender: new mongoose.Types.ObjectId(ticketData.userId),
      senderType: 'user',
      content: ticketData.description,
      attachments: ticketData.attachments || [],
      isInternal: false,
      readBy: []
    });
    
    // Add related entities if provided
    if (ticketData.relatedEntities && ticketData.relatedEntities.length > 0) {
      ticket.relatedEntities = ticketData.relatedEntities.map(entity => ({
        entityType: entity.entityType,
        entityId: new mongoose.Types.ObjectId(entity.entityId)
      }));
    }
    
    // Add metadata if provided
    if (ticketData.metadata) {
      ticket.metadata = ticketData.metadata;
    }
    
    await ticket.save();
    return ticket;
  }
  
  /**
   * Get tickets with filtering and pagination
   */
  static async getTickets(
    filters: TicketFilters,
    page: number = 1,
    limit: number = 20,
    sortField: string = 'lastActivity',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{
    tickets: ISupportTicket[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    await dbConnect();
    
    // Build query filter
    const queryFilter: FilterQuery<ISupportTicket> = {};
    
    if (filters.userId) {
      queryFilter.user = new mongoose.Types.ObjectId(filters.userId);
    }
    
    if (filters.companyId) {
      queryFilter.companyId = new mongoose.Types.ObjectId(filters.companyId);
    }
    
    if (filters.assignedToId) {
      queryFilter.assignedTo = new mongoose.Types.ObjectId(filters.assignedToId);
    }
    
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        queryFilter.status = { $in: filters.status };
      } else {
        queryFilter.status = filters.status;
      }
    }
    
    if (filters.category) {
      if (Array.isArray(filters.category)) {
        queryFilter.category = { $in: filters.category };
      } else {
        queryFilter.category = filters.category;
      }
    }
    
    if (filters.priority) {
      if (Array.isArray(filters.priority)) {
        queryFilter.priority = { $in: filters.priority };
      } else {
        queryFilter.priority = filters.priority;
      }
    }
    
    if (filters.isEscalated !== undefined) {
      queryFilter.isEscalated = filters.isEscalated;
    }
    
    if (filters.language) {
      queryFilter.language = filters.language;
    }
    
    if (filters.tags && filters.tags.length > 0) {
      queryFilter.tags = { $in: filters.tags };
    }
    
    // Date range filter
    if (filters.fromDate || filters.toDate) {
      queryFilter.createdAt = {};
      
      if (filters.fromDate) {
        queryFilter.createdAt.$gte = filters.fromDate;
      }
      
      if (filters.toDate) {
        queryFilter.createdAt.$lte = filters.toDate;
      }
    }
    
    // Text search
    if (filters.search) {
      queryFilter.$or = [
        { subject: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { 'messages.content': { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    // Count total documents
    const total = await SupportTicket.countDocuments(queryFilter);
    
    // Apply sorting and pagination
    const sortOptions: { [key: string]: SortOrder } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with population
    const tickets = await SupportTicket.find(queryFilter)
      .populate('user', 'name email profileImage')
      .populate('assignedTo', 'name email profileImage')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    return {
      tickets,
      total,
      page,
      limit,
      totalPages
    };
  }
  
  /**
   * Get a single ticket by ID
   */
  static async getTicketById(ticketId: string): Promise<ISupportTicket> {
    await dbConnect();
    
    const ticket = await SupportTicket.findById(ticketId)
      .populate('user', 'name email profileImage')
      .populate('assignedTo', 'name email profileImage')
      .lean();
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    return ticket;
  }
  
  /**
   * Get a ticket by ticket number
   */
  static async getTicketByNumber(ticketNumber: string): Promise<ISupportTicket> {
    await dbConnect();
    
    const ticket = await SupportTicket.findOne({ ticketNumber })
      .populate('user', 'name email profileImage')
      .populate('assignedTo', 'name email profileImage')
      .lean();
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    return ticket;
  }
  
  /**
   * Add a message to a ticket
   */
  static async addMessage(
    ticketId: string, 
    userId: string,
    senderType: 'user' | 'staff' | 'system',
    content: string,
    attachments?: Array<{
      filename: string;
      url: string;
      contentType: string;
      size: number;
    }>,
    isInternal: boolean = false
  ): Promise<ISupportTicket> {
    await dbConnect();
    
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    // Add the message
    ticket.messages.push({
      sender: new mongoose.Types.ObjectId(userId),
      senderType,
      content,
      attachments: attachments || [],
      isInternal,
      readBy: [new mongoose.Types.ObjectId(userId)]
    });
    
    // Update ticket status based on sender type
    if (senderType === 'user') {
      if (ticket.status === 'waiting_for_user' || ticket.status === 'resolved') {
        ticket.status = 'open';
      }
    } else if (senderType === 'staff') {
      if (ticket.status === 'new' || ticket.status === 'open') {
        ticket.status = 'in_progress';
      } else if (ticket.status === 'waiting_for_staff') {
        ticket.status = 'in_progress';
      }
    }
    
    await ticket.save();
    return ticket;
  }
  
  /**
   * Update ticket status
   */
  static async updateStatus(
    ticketId: string,
    status: ISupportTicket['status'],
    userId: string,
    note?: string
  ): Promise<ISupportTicket> {
    await dbConnect();
    
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    const oldStatus = ticket.status;
    ticket.status = status;
    
    // Handle special case for resolved/closed status
    if (status === 'resolved' || status === 'closed') {
      if (!ticket.resolution) {
        ticket.resolution = {
          resolvedBy: new mongoose.Types.ObjectId(userId),
          resolutionDate: new Date(),
          resolutionNote: note || `Ticket ${status} by staff`
        };
      }
    }
    
    // Add system message for status change
    if (note) {
      ticket.messages.push({
        sender: new mongoose.Types.ObjectId(userId),
        senderType: 'system',
        content: `Status changed from ${oldStatus} to ${status}: ${note}`,
        isInternal: false,
        readBy: [new mongoose.Types.ObjectId(userId)]
      });
    } else {
      ticket.messages.push({
        sender: new mongoose.Types.ObjectId(userId),
        senderType: 'system',
        content: `Status changed from ${oldStatus} to ${status}`,
        isInternal: false,
        readBy: [new mongoose.Types.ObjectId(userId)]
      });
    }
    
    await ticket.save();
    return ticket;
  }
  
  /**
   * Assign ticket to staff member
   */
  static async assignTicket(
    ticketId: string,
    staffId: string,
    assignedById: string
  ): Promise<ISupportTicket> {
    await dbConnect();
    
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    // Verify staff user exists
    const staffUser = await User.findById(staffId);
    if (!staffUser) {
      throw new Error('Staff user not found');
    }
    
    const previousAssignee = ticket.assignedTo ? ticket.assignedTo.toString() : 'unassigned';
    ticket.assignedTo = new mongoose.Types.ObjectId(staffId);
    
    // Add system message for assignment
    ticket.messages.push({
      sender: new mongoose.Types.ObjectId(assignedById),
      senderType: 'system',
      content: `Ticket reassigned from ${previousAssignee} to ${staffUser.name || staffId}`,
      isInternal: true,
      readBy: [new mongoose.Types.ObjectId(assignedById)]
    });
    
    if (ticket.status === 'new') {
      ticket.status = 'open';
    }
    
    await ticket.save();
    return ticket;
  }
  
  /**
   * Mark ticket as escalated
   */
  static async escalateTicket(
    ticketId: string,
    escalatedById: string,
    reason: string
  ): Promise<ISupportTicket> {
    await dbConnect();
    
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    ticket.isEscalated = true;
    ticket.escalationReason = reason;
    ticket.escalationDate = new Date();
    
    // Add escalation note
    ticket.messages.push({
      sender: new mongoose.Types.ObjectId(escalatedById),
      senderType: 'system',
      content: `Ticket escalated: ${reason}`,
      isInternal: true,
      readBy: [new mongoose.Types.ObjectId(escalatedById)]
    });
    
    if (ticket.priority !== 'urgent') {
      ticket.priority = 'high';
    }
    
    await ticket.save();
    return ticket;
  }
  
  /**
   * Add customer satisfaction rating and feedback
   */
  static async addSatisfactionRating(
    ticketId: string,
    userId: string,
    rating: number,
    feedback?: string
  ): Promise<ISupportTicket> {
    await dbConnect();
    
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    // Verify the user owns this ticket
    if (ticket.user.toString() !== userId) {
      throw new Error('User not authorized to rate this ticket');
    }
    
    // Verify the ticket is resolved
    if (ticket.status !== 'resolved' && ticket.status !== 'closed') {
      throw new Error('Only resolved or closed tickets can be rated');
    }
    
    // Validate rating (1-5 stars)
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      throw new Error('Rating must be an integer between 1 and 5');
    }
    
    // Add or update rating
    if (!ticket.resolution) {
      ticket.resolution = {
        resolvedBy: ticket.assignedTo || new mongoose.Types.ObjectId(),
        resolutionDate: new Date(),
        resolutionNote: 'Ticket resolved',
        satisfactionRating: rating,
        feedback
      };
    } else {
      ticket.resolution.satisfactionRating = rating;
      if (feedback) {
        ticket.resolution.feedback = feedback;
      }
    }
    
    // Add system message for rating
    ticket.messages.push({
      sender: new mongoose.Types.ObjectId(userId),
      senderType: 'system',
      content: `Customer satisfaction rating: ${rating}/5${feedback ? ` - Feedback: ${feedback}` : ''}`,
      isInternal: false,
      readBy: []
    });
    
    await ticket.save();
    return ticket;
  }
  
  /**
   * Add or update ticket tags
   */
  static async updateTags(
    ticketId: string,
    tags: string[],
    userId: string
  ): Promise<ISupportTicket> {
    await dbConnect();
    
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    const oldTags = [...ticket.tags];
    ticket.tags = tags;
    
    // Add system message for tag update
    ticket.messages.push({
      sender: new mongoose.Types.ObjectId(userId),
      senderType: 'system',
      content: `Tags updated from [${oldTags.join(', ')}] to [${tags.join(', ')}]`,
      isInternal: true,
      readBy: [new mongoose.Types.ObjectId(userId)]
    });
    
    await ticket.save();
    return ticket;
  }
  
  /**
   * Schedule follow-up for a ticket
   */
  static async scheduleFollowUp(
    ticketId: string,
    followUpDate: Date,
    userId: string,
    note?: string
  ): Promise<ISupportTicket> {
    await dbConnect();
    
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    ticket.followUpDate = followUpDate;
    
    // Add system message for follow-up
    ticket.messages.push({
      sender: new mongoose.Types.ObjectId(userId),
      senderType: 'system',
      content: `Follow-up scheduled for ${followUpDate.toISOString().split('T')[0]}${note ? `: ${note}` : ''}`,
      isInternal: true,
      readBy: [new mongoose.Types.ObjectId(userId)]
    });
    
    await ticket.save();
    return ticket;
  }
  
  /**
   * Mark messages as read for a user
   */
  static async markMessagesAsRead(
    ticketId: string,
    userId: string
  ): Promise<ISupportTicket> {
    await dbConnect();
    
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // Mark all unread messages as read for this user
    ticket.messages.forEach(message => {
      if (!message.readBy.some(id => id.equals(userObjectId))) {
        message.readBy.push(userObjectId);
      }
    });
    
    await ticket.save();
    return ticket;
  }
  
  /**
   * Get support statistics
   */
  static async getSupportStatistics(
    fromDate?: Date,
    toDate?: Date
  ): Promise<{
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    avgResolutionTime: number; // in hours
    avgResponseTime: number; // in hours
    ticketsByCategory: Record<string, number>;
    ticketsByPriority: Record<string, number>;
    satisfactionAvg: number;
    satisfactionCount: number;
  }> {
    await dbConnect();
    
    const dateFilter: any = {};
    if (fromDate || toDate) {
      dateFilter.createdAt = {};
      
      if (fromDate) {
        dateFilter.createdAt.$gte = fromDate;
      }
      
      if (toDate) {
        dateFilter.createdAt.$lte = toDate;
      }
    }
    
    // Basic counts
    const totalTickets = await SupportTicket.countDocuments(dateFilter);
    
    const openTicketsFilter = { 
      ...dateFilter, 
      status: { $in: ['new', 'open', 'in_progress', 'waiting_for_user', 'waiting_for_staff'] } 
    };
    const openTickets = await SupportTicket.countDocuments(openTicketsFilter);
    
    const resolvedTicketsFilter = { 
      ...dateFilter, 
      status: { $in: ['resolved', 'closed'] } 
    };
    const resolvedTickets = await SupportTicket.countDocuments(resolvedTicketsFilter);
    
    // Category and priority breakdown
    const categoryResults = await SupportTicket.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const ticketsByCategory: Record<string, number> = {};
    categoryResults.forEach(result => {
      ticketsByCategory[result._id] = result.count;
    });
    
    const priorityResults = await SupportTicket.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    const ticketsByPriority: Record<string, number> = {};
    priorityResults.forEach(result => {
      ticketsByPriority[result._id] = result.count;
    });
    
    // Resolution time calculation
    const resolvedTicketsWithTime = await SupportTicket.find({
      ...dateFilter,
      status: { $in: ['resolved', 'closed'] },
      'resolution.resolutionDate': { $exists: true }
    }).lean();
    
    let totalResolutionTime = 0;
    
    resolvedTicketsWithTime.forEach(ticket => {
      if (ticket.resolution?.resolutionDate) {
        const createdAt = new Date(ticket.createdAt);
        const resolvedAt = new Date(ticket.resolution.resolutionDate);
        const resolutionTimeHours = (resolvedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        totalResolutionTime += resolutionTimeHours;
      }
    });
    
    const avgResolutionTime = resolvedTicketsWithTime.length > 0 ? 
      totalResolutionTime / resolvedTicketsWithTime.length : 0;
    
    // Response time calculation (time to first staff response)
    const ticketsWithResponses = await SupportTicket.find({
      ...dateFilter,
      'messages.senderType': 'staff'
    }).lean();
    
    let totalResponseTime = 0;
    let ticketsWithResponseTime = 0;
    
    ticketsWithResponses.forEach(ticket => {
      const createdAt = new Date(ticket.createdAt);
      
      // Find first staff response
      const firstStaffResponse = ticket.messages.find(msg => 
        msg.senderType === 'staff' && !msg.isInternal
      );
      
      if (firstStaffResponse) {
        const responseAt = new Date(firstStaffResponse.createdAt);
        const responseTimeHours = (responseAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        totalResponseTime += responseTimeHours;
        ticketsWithResponseTime++;
      }
    });
    
    const avgResponseTime = ticketsWithResponseTime > 0 ? 
      totalResponseTime / ticketsWithResponseTime : 0;
    
    // Customer satisfaction stats
    const satisfactionResults = await SupportTicket.aggregate([
      { 
        $match: { 
          ...dateFilter,
          'resolution.satisfactionRating': { $exists: true } 
        } 
      },
      { 
        $group: { 
          _id: null, 
          avgRating: { $avg: '$resolution.satisfactionRating' },
          count: { $sum: 1 }
        } 
      }
    ]);
    
    const satisfactionAvg = satisfactionResults.length > 0 ? satisfactionResults[0].avgRating : 0;
    const satisfactionCount = satisfactionResults.length > 0 ? satisfactionResults[0].count : 0;
    
    return {
      totalTickets,
      openTickets,
      resolvedTickets,
      avgResolutionTime,
      avgResponseTime,
      ticketsByCategory,
      ticketsByPriority,
      satisfactionAvg,
      satisfactionCount
    };
  }
}

export default SupportService;
