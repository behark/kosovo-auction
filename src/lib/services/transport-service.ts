import dbConnect from '@/lib/db/mongodb';
import { 
  TransportProvider, 
  TransportBooking, 
  ITransportProvider,
  ITransportBooking 
} from '@/lib/db/models/transport';
import Currency from '@/lib/db/models/currency';
import CustomsRegulation from '@/lib/db/models/customs-regulation';
import TaxRate from '@/lib/db/models/tax-rate';
import { CurrencyService } from './currency-service';
import mongoose, { FilterQuery, SortOrder } from 'mongoose';

export interface TransportQuote {
  providerId: string;
  providerName: string;
  price: number;
  currency: string;
  estimatedDays: number;
  insuranceOptions: Array<{
    name: string;
    coverage: number;
    price: number;
  }>;
  additionalServices: Array<{
    name: string;
    description: string;
    price: number;
  }>;
  validUntil: Date;
}

export interface TransportBookingFilters {
  vehicleId?: string;
  auctionId?: string;
  buyerId?: string;
  sellerId?: string;
  providerId?: string;
  status?: string | string[];
  pickupCountry?: string;
  deliveryCountry?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  scheduledAfter?: Date;
  scheduledBefore?: Date;
}

export interface BookingOptions {
  expedited?: boolean;
  requestInsurance?: boolean;
  insuranceOption?: string;
  customsHandling?: boolean;
  doorToDoor?: boolean;
  specialInstructions?: string;
  additionalServices?: string[];
}

export class TransportService {
  /**
   * Get transport providers based on route and vehicle
   */
  static async getEligibleProviders(
    pickupCountry: string,
    deliveryCountry: string,
    vehicleType: string = 'sedan'
  ): Promise<ITransportProvider[]> {
    await dbConnect();
    
    // Find providers that operate in both countries
    return await TransportProvider.find({
      isActive: true,
      operatingCountries: { $all: [pickupCountry.toUpperCase(), deliveryCountry.toUpperCase()] },
      'pricing.baseRates': {
        $elemMatch: {
          fromCountry: pickupCountry.toUpperCase(),
          toCountry: deliveryCountry.toUpperCase(),
          vehicleType: vehicleType
        }
      }
    }).sort({ isPreferred: -1, averageRating: -1 }).lean();
  }
  
  /**
   * Get transport quotes for a specific vehicle and route
   */
  static async getQuotes(
    pickupCountry: string,
    pickupCity: string,
    deliveryCountry: string,
    deliveryCity: string,
    vehicleType: string,
    vehicleMake: string,
    vehicleModel: string,
    vehicleYear: number,
    dimensions?: { 
      length?: number, 
      width?: number, 
      height?: number, 
      weight?: number 
    },
    condition: 'running' | 'non_running' = 'running',
    requestedCurrency: string = 'EUR'
  ): Promise<TransportQuote[]> {
    await dbConnect();
    
    const providers = await this.getEligibleProviders(pickupCountry, deliveryCountry, vehicleType);
    const quotes: TransportQuote[] = [];
    
    // Get customs information for the destination country
    const customsInfo = await CustomsRegulation.findOne({
      countryCode: deliveryCountry.toUpperCase(),
      isActive: true
    }).lean();
    
    // Default values if we can't calculate precisely
    const defaultEstimatedDays = 
      pickupCountry === deliveryCountry ? 3 : 
      (customsInfo?.carnetRequired ? 14 : 7);
      
    for (const provider of providers) {
      // Find the appropriate base rate
      const baseRate = provider.pricing?.baseRates?.find(rate => 
        rate.fromCountry === pickupCountry.toUpperCase() &&
        rate.toCountry === deliveryCountry.toUpperCase() &&
        rate.vehicleType === vehicleType
      );
      
      if (!baseRate) continue;
      
      // Calculate the price
      let price = baseRate.price;
      
      // Apply additional fees
      if (provider.pricing?.additionalFees) {
        for (const fee of provider.pricing.additionalFees) {
          if (fee.type === 'fixed') {
            price += fee.amount;
          } else {
            price += (price * fee.amount / 100);
          }
        }
      }
      
      // Non-running vehicles often cost more
      if (condition === 'non_running') {
        price *= 1.25; // 25% surcharge
      }
      
      // Convert price to requested currency
      let convertedPrice = price;
      
      if (baseRate.currency !== requestedCurrency) {
        try {
          const conversion = await CurrencyService.convertCurrency(
            price,
            baseRate.currency,
            requestedCurrency
          );
          convertedPrice = conversion.convertedAmount;
        } catch (error) {
          console.error('Currency conversion failed:', error);
          // Fall back to original price and currency
        }
      }
      
      // Create quote object
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 7); // Quote valid for 7 days
      
      quotes.push({
        providerId: provider._id.toString(),
        providerName: provider.name,
        price: parseFloat(convertedPrice.toFixed(2)),
        currency: requestedCurrency,
        estimatedDays: defaultEstimatedDays,
        insuranceOptions: provider.insuranceOptions?.map(option => ({
          name: option.name,
          coverage: option.coverageLimit,
          price: option.price
        })) || [],
        additionalServices: [
          {
            name: 'Customs Handling',
            description: 'We handle all customs paperwork and fees',
            price: pickupCountry === deliveryCountry ? 0 : 250
          },
          {
            name: 'Door-to-Door',
            description: 'Pickup and delivery to exact addresses',
            price: 150
          },
          {
            name: 'Expedited',
            description: 'Priority handling and faster delivery',
            price: 300
          }
        ],
        validUntil
      });
    }
    
    return quotes;
  }
  
  /**
   * Create a new transport booking
   */
  static async createBooking(
    vehicleId: string,
    buyerId: string,
    sellerId: string,
    providerId: string,
    pickupDetails: ITransportBooking['pickupDetails'],
    deliveryDetails: ITransportBooking['deliveryDetails'],
    vehicleDetails: ITransportBooking['vehicleDetails'],
    pricing: {
      quoteAmount: number;
      currency: string;
    },
    auctionId?: string,
    options?: BookingOptions,
    createdById: string = buyerId
  ): Promise<ITransportBooking> {
    await dbConnect();
    
    // Validate that the provider exists
    const provider = await TransportProvider.findById(providerId);
    if (!provider) {
      throw new Error('Transport provider not found');
    }
    
    // Check if cross-border and determine if customs clearance is needed
    const needsCustoms = pickupDetails.country !== deliveryDetails.country;
    
    // Get customs information if needed
    let customsInfo = null;
    if (needsCustoms) {
      customsInfo = await CustomsRegulation.findOne({
        countryCode: deliveryDetails.country.toUpperCase(),
        isActive: true
      }).lean();
    }
    
    // Create the booking
    const booking = new TransportBooking({
      vehicleId: new mongoose.Types.ObjectId(vehicleId),
      buyerId: new mongoose.Types.ObjectId(buyerId),
      sellerId: new mongoose.Types.ObjectId(sellerId),
      providerId: new mongoose.Types.ObjectId(providerId),
      status: 'quote_requested',
      pickupDetails,
      deliveryDetails,
      vehicleDetails,
      pricing: {
        quoteAmount: pricing.quoteAmount,
        currency: pricing.currency,
        isPaid: false,
      },
      tracking: {
        statusHistory: [{
          status: 'Booking created',
          timestamp: new Date(),
          notes: 'Transport booking initiated'
        }]
      },
      customsClearance: needsCustoms ? {
        required: true,
        status: 'not_started',
        notes: customsInfo ? `Import requirements for ${customsInfo.countryName}` : undefined
      } : undefined,
      insurance: {
        isInsured: options?.requestInsurance || false
      },
      createdBy: new mongoose.Types.ObjectId(createdById)
    });
    
    if (auctionId) {
      booking.auctionId = new mongoose.Types.ObjectId(auctionId);
    }
    
    // Add route details if cross-border
    if (needsCustoms) {
      booking.routeDetails = {
        borderCrossings: [{
          fromCountry: pickupDetails.country,
          toCountry: deliveryDetails.country
        }],
        waypoints: [
          {
            type: 'pickup',
            location: `${pickupDetails.city}, ${pickupDetails.country}`
          },
          {
            type: 'customs',
            location: `Border ${pickupDetails.country}-${deliveryDetails.country}`
          },
          {
            type: 'delivery',
            location: `${deliveryDetails.city}, ${deliveryDetails.country}`
          }
        ]
      };
    }
    
    // Save and return the booking
    await booking.save();
    return booking;
  }

  /**
   * Update a transport booking status
   */
  static async updateBookingStatus(
    bookingId: string,
    status: ITransportBooking['status'],
    notes?: string,
    location?: string
  ): Promise<ITransportBooking> {
    await dbConnect();
    
    const booking = await TransportBooking.findById(bookingId);
    if (!booking) {
      throw new Error('Transport booking not found');
    }
    
    booking.status = status;
    
    // Add to status history
    booking.tracking.statusHistory.push({
      status,
      timestamp: new Date(),
      location,
      notes
    });
    
    // Update current status and location
    booking.tracking.currentStatus = status;
    if (location) {
      booking.tracking.currentLocation = location;
    }
    
    // Special handling for certain statuses
    switch (status) {
      case 'delivered':
        booking.tracking.actualDelivery = new Date();
        break;
      case 'customs_clearance':
        if (booking.customsClearance) {
          booking.customsClearance.status = 'in_progress';
        }
        break;
    }
    
    await booking.save();
    return booking;
  }
  
  /**
   * Get transport bookings with filtering and pagination
   */
  static async getBookings(
    filters: TransportBookingFilters,
    page: number = 1,
    limit: number = 20,
    sortField: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{
    bookings: ITransportBooking[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    await dbConnect();
    
    // Build the query filter
    const queryFilter: FilterQuery<ITransportBooking> = {};
    
    if (filters.vehicleId) {
      queryFilter.vehicleId = new mongoose.Types.ObjectId(filters.vehicleId);
    }
    
    if (filters.auctionId) {
      queryFilter.auctionId = new mongoose.Types.ObjectId(filters.auctionId);
    }
    
    if (filters.buyerId) {
      queryFilter.buyerId = new mongoose.Types.ObjectId(filters.buyerId);
    }
    
    if (filters.sellerId) {
      queryFilter.sellerId = new mongoose.Types.ObjectId(filters.sellerId);
    }
    
    if (filters.providerId) {
      queryFilter.providerId = new mongoose.Types.ObjectId(filters.providerId);
    }
    
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        queryFilter.status = { $in: filters.status };
      } else {
        queryFilter.status = filters.status;
      }
    }
    
    if (filters.pickupCountry) {
      queryFilter['pickupDetails.country'] = filters.pickupCountry;
    }
    
    if (filters.deliveryCountry) {
      queryFilter['deliveryDetails.country'] = filters.deliveryCountry;
    }
    
    // Date range filters
    if (filters.createdAfter || filters.createdBefore) {
      queryFilter.createdAt = {};
      
      if (filters.createdAfter) {
        queryFilter.createdAt.$gte = filters.createdAfter;
      }
      
      if (filters.createdBefore) {
        queryFilter.createdAt.$lte = filters.createdBefore;
      }
    }
    
    if (filters.scheduledAfter || filters.scheduledBefore) {
      queryFilter.$or = [];
      
      const pickupRange: any = {};
      const deliveryRange: any = {};
      
      if (filters.scheduledAfter) {
        pickupRange.$gte = filters.scheduledAfter;
        deliveryRange.$gte = filters.scheduledAfter;
      }
      
      if (filters.scheduledBefore) {
        pickupRange.$lte = filters.scheduledBefore;
        deliveryRange.$lte = filters.scheduledBefore;
      }
      
      if (Object.keys(pickupRange).length > 0) {
        queryFilter.$or.push({ 'pickupDetails.scheduledDate': pickupRange });
      }
      
      if (Object.keys(deliveryRange).length > 0) {
        queryFilter.$or.push({ 'deliveryDetails.scheduledDate': deliveryRange });
      }
    }
    
    // Count total documents
    const total = await TransportBooking.countDocuments(queryFilter);
    
    // Apply sorting and pagination
    const sortOptions: { [key: string]: SortOrder } = {};
    sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query
    const bookings = await TransportBooking.find(queryFilter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    return {
      bookings,
      total,
      page,
      limit,
      totalPages
    };
  }
  
  /**
   * Get details of a specific booking
   */
  static async getBookingDetails(bookingId: string): Promise<ITransportBooking> {
    await dbConnect();
    
    const booking = await TransportBooking.findById(bookingId).lean();
    if (!booking) {
      throw new Error('Transport booking not found');
    }
    
    return booking;
  }
  
  /**
   * Complete customs clearance for a booking
   */
  static async completeCustomsClearance(
    bookingId: string,
    clearanceDetails: {
      clearanceDate: Date;
      customsOffice: string;
      customsAgent?: string;
      duties?: {
        amount: number;
        currency: string;
        paidBy: 'buyer' | 'seller' | 'platform' | 'shipping_provider';
        paymentStatus: 'pending' | 'paid' | 'waived';
      };
      documents?: Array<{
        type: string;
        referenceNumber?: string;
        issueDate?: Date;
        documentUrl?: string;
      }>;
      notes?: string;
    }
  ): Promise<ITransportBooking> {
    await dbConnect();
    
    const booking = await TransportBooking.findById(bookingId);
    if (!booking) {
      throw new Error('Transport booking not found');
    }
    
    if (!booking.customsClearance?.required) {
      throw new Error('This booking does not require customs clearance');
    }
    
    // Update customs clearance details
    booking.customsClearance.status = 'completed';
    booking.customsClearance.clearanceDate = clearanceDetails.clearanceDate;
    booking.customsClearance.customsOffice = clearanceDetails.customsOffice;
    
    if (clearanceDetails.customsAgent) {
      booking.customsClearance.customsAgent = clearanceDetails.customsAgent;
    }
    
    if (clearanceDetails.duties) {
      booking.customsClearance.duties = clearanceDetails.duties;
    }
    
    if (clearanceDetails.documents && clearanceDetails.documents.length > 0) {
      if (!booking.customsClearance.customsDocuments) {
        booking.customsClearance.customsDocuments = [];
      }
      
      booking.customsClearance.customsDocuments.push(...clearanceDetails.documents);
    }
    
    if (clearanceDetails.notes) {
      booking.customsClearance.notes = clearanceDetails.notes;
    }
    
    // Update booking status if currently in customs
    if (booking.status === 'customs_clearance') {
      booking.status = 'in_transit';
      
      // Add to status history
      booking.tracking.statusHistory.push({
        status: 'in_transit',
        timestamp: new Date(),
        notes: 'Customs clearance completed, continuing to destination'
      });
    }
    
    await booking.save();
    return booking;
  }
  
  /**
   * Add tracking information
   */
  static async updateTracking(
    bookingId: string,
    trackingDetails: {
      trackingNumber?: string;
      trackingUrl?: string;
      estimatedDelivery?: Date;
      currentLocation?: string;
      currentStatus?: string;
      statusUpdate?: {
        status: string;
        location?: string;
        notes?: string;
      };
    }
  ): Promise<ITransportBooking> {
    await dbConnect();
    
    const booking = await TransportBooking.findById(bookingId);
    if (!booking) {
      throw new Error('Transport booking not found');
    }
    
    if (trackingDetails.trackingNumber) {
      booking.tracking.trackingNumber = trackingDetails.trackingNumber;
    }
    
    if (trackingDetails.trackingUrl) {
      booking.tracking.trackingUrl = trackingDetails.trackingUrl;
    }
    
    if (trackingDetails.estimatedDelivery) {
      booking.tracking.estimatedDelivery = trackingDetails.estimatedDelivery;
    }
    
    if (trackingDetails.currentLocation) {
      booking.tracking.currentLocation = trackingDetails.currentLocation;
    }
    
    if (trackingDetails.currentStatus) {
      booking.tracking.currentStatus = trackingDetails.currentStatus;
    }
    
    if (trackingDetails.statusUpdate) {
      booking.tracking.statusHistory.push({
        status: trackingDetails.statusUpdate.status,
        location: trackingDetails.statusUpdate.location,
        timestamp: new Date(),
        notes: trackingDetails.statusUpdate.notes
      });
    }
    
    await booking.save();
    return booking;
  }
  
  /**
   * Add a document to a booking
   */
  static async addDocument(
    bookingId: string,
    document: {
      type: string;
      filename: string;
      url: string;
    }
  ): Promise<ITransportBooking> {
    await dbConnect();
    
    const booking = await TransportBooking.findById(bookingId);
    if (!booking) {
      throw new Error('Transport booking not found');
    }
    
    booking.documents.push({
      type: document.type,
      filename: document.filename,
      url: document.url,
      uploadDate: new Date()
    });
    
    await booking.save();
    return booking;
  }
  
  /**
   * Add a note to a booking
   */
  static async addNote(
    bookingId: string,
    note: {
      author: string;
      content: string;
      isPublic?: boolean;
    }
  ): Promise<ITransportBooking> {
    await dbConnect();
    
    const booking = await TransportBooking.findById(bookingId);
    if (!booking) {
      throw new Error('Transport booking not found');
    }
    
    if (!booking.notes) {
      booking.notes = [];
    }
    
    booking.notes.push({
      author: note.author,
      date: new Date(),
      content: note.content,
      isPublic: note.isPublic !== undefined ? note.isPublic : true
    });
    
    await booking.save();
    return booking;
  }
}

export default TransportService;
