import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
  sender: Schema.Types.ObjectId;
  senderType: 'user' | 'staff' | 'system';
  content: string;
  attachments?: Array<{
    filename: string;
    url: string;
    contentType: string;
    size: number;
  }>;
  isInternal: boolean;  // Internal notes only visible to staff
  readBy: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISupportTicket extends Document {
  ticketNumber: string;
  user: Schema.Types.ObjectId;
  companyId?: Schema.Types.ObjectId;
  subject: string;
  description: string;
  category: 'account' | 'auction' | 'payment' | 'vehicle' | 'transport' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'open' | 'in_progress' | 'waiting_for_user' | 'waiting_for_staff' | 'resolved' | 'closed';
  assignedTo?: Schema.Types.ObjectId;
  relatedEntities?: Array<{
    entityType: 'auction' | 'vehicle' | 'user' | 'transport' | 'payment' | 'company';
    entityId: Schema.Types.ObjectId;
  }>;
  messages: IMessage[];
  resolution?: {
    resolvedBy: Schema.Types.ObjectId;
    resolutionDate: Date;
    resolutionNote: string;
    satisfactionRating?: number; // 1-5 stars
    feedback?: string;
  };
  language: string; // ISO language code (e.g., 'en', 'de', 'sq')
  tags: string[];
  isEscalated: boolean;
  escalationReason?: string;
  escalationDate?: Date;
  followUpDate?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastActivity: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderType: { 
    type: String, 
    enum: ['user', 'staff', 'system'],
    required: true
  },
  content: { type: String, required: true },
  attachments: [{
    filename: { type: String, required: true },
    url: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true }
  }],
  isInternal: { type: Boolean, default: false },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

const SupportTicketSchema = new Schema<ISupportTicket>({
  ticketNumber: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['account', 'auction', 'payment', 'vehicle', 'transport', 'technical', 'other'],
    required: true,
    index: true
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    required: true,
    default: 'medium',
    index: true
  },
  status: { 
    type: String, 
    enum: ['new', 'open', 'in_progress', 'waiting_for_user', 'waiting_for_staff', 'resolved', 'closed'],
    required: true,
    default: 'new',
    index: true
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  relatedEntities: [{
    entityType: { 
      type: String, 
      enum: ['auction', 'vehicle', 'user', 'transport', 'payment', 'company'],
      required: true 
    },
    entityId: { type: Schema.Types.ObjectId, required: true, refPath: 'relatedEntities.entityType' }
  }],
  messages: [MessageSchema],
  resolution: {
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolutionDate: { type: Date },
    resolutionNote: { type: String },
    satisfactionRating: { 
      type: Number,
      min: 1,
      max: 5
    },
    feedback: { type: String }
  },
  language: { 
    type: String, 
    required: true, 
    default: 'en',
    index: true
  },
  tags: [{ type: String }],
  isEscalated: { type: Boolean, default: false },
  escalationReason: { type: String },
  escalationDate: { type: Date },
  followUpDate: { type: Date },
  metadata: { type: Schema.Types.Mixed },
  lastActivity: { type: Date, default: Date.now, required: true }
}, {
  timestamps: true
});

// Generate ticket number before saving
SupportTicketSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate ticket number format: BVS-YYMMDD-XXXX
    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    
    // Find last ticket of the day
    const lastTicket = await mongoose.models.SupportTicket
      .findOne({ ticketNumber: new RegExp(`BVS-${dateString}-`) })
      .sort({ ticketNumber: -1 });
    
    let counter = 1;
    if (lastTicket) {
      const lastCounter = parseInt(lastTicket.ticketNumber.split('-')[2]);
      counter = isNaN(lastCounter) ? 1 : lastCounter + 1;
    }
    
    this.ticketNumber = `BVS-${dateString}-${counter.toString().padStart(4, '0')}`;
    this.lastActivity = new Date();
  }
  next();
});

// Update lastActivity timestamp when messages are added
SupportTicketSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
  }
  next();
});

// Create indexes for query performance
SupportTicketSchema.index({ user: 1, status: 1 });
SupportTicketSchema.index({ assignedTo: 1, status: 1 });
SupportTicketSchema.index({ companyId: 1, status: 1 });
SupportTicketSchema.index({ createdAt: 1 });
SupportTicketSchema.index({ lastActivity: -1 });
SupportTicketSchema.index({ tags: 1 });

// Create the SupportTicket model if it doesn't already exist
const SupportTicket = mongoose.models.SupportTicket || mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema);

export default SupportTicket as Model<ISupportTicket>;
