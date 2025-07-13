import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransportProvider extends Document {
  name: string;
  description?: string;
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
    address?: string;
  };
  servicesOffered: string[];  // e.g., ['domestic', 'international', 'containerized', 'open trailer']
  operatingCountries: string[];  // ISO country codes
  pricing?: {
    baseRates: Array<{
      fromCountry: string;
      toCountry: string;
      vehicleType: string;   // e.g., 'sedan', 'suv', 'truck'
      price: number;
      currency: string;
      priceUnit: 'per_vehicle' | 'per_km' | 'per_mile';
      minPrice?: number;
    }>;
    additionalFees?: Array<{
      name: string;
      amount: number;
      type: 'fixed' | 'percentage';
      description?: string;
    }>;
  };
  insuranceOptions?: Array<{
    name: string;
    description: string;
    coverageLimit: number;
    price: number;
    currency: string;
  }>;
  averageRating?: number;  // 1-5 stars
  reviewCount?: number;
  integrationDetails?: {
    apiEnabled: boolean;
    apiKey?: string;
    trackingUrlTemplate?: string;  // e.g., "https://provider.com/track/{trackingNumber}"
    quotationApiEndpoint?: string;
  };
  isActive: boolean;
  isPreferred?: boolean;  // Whether this is a preferred partner
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransportBooking extends Document {
  vehicleId: Schema.Types.ObjectId;
  auctionId?: Schema.Types.ObjectId;
  buyerId: Schema.Types.ObjectId;
  sellerId: Schema.Types.ObjectId;
  providerId?: Schema.Types.ObjectId;  // Link to transport provider
  status: 'draft' | 'quote_requested' | 'quoted' | 'booked' | 'pickup_scheduled' | 
          'in_transit' | 'customs_clearance' | 'delivered' | 'cancelled' | 'failed';
  pickupDetails: {
    address: string;
    city: string;
    postalCode?: string;
    country: string;
    contactName: string;
    contactPhone: string;
    scheduledDate?: Date;
    instructions?: string;
    accessRestrictions?: string;
  };
  deliveryDetails: {
    address: string;
    city: string;
    postalCode?: string;
    country: string;
    contactName: string;
    contactPhone: string;
    scheduledDate?: Date;
    instructions?: string;
    accessRestrictions?: string;
  };
  routeDetails?: {
    distance?: number;
    estimatedDuration?: number;  // in hours
    borderCrossings?: Array<{
      fromCountry: string;
      toCountry: string;
      estimatedCrossingTime?: number;  // in hours
    }>;
    waypoints?: Array<{
      type: 'pickup' | 'customs' | 'handover' | 'storage' | 'inspection' | 'delivery';
      location: string;
      scheduledArrival?: Date;
      actualArrival?: Date;
      notes?: string;
    }>;
  };
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    vin: string;
    dimensions?: {
      length?: number;  // in cm
      width?: number;   // in cm
      height?: number;  // in cm
      weight?: number;  // in kg
    };
    runningCondition: 'running' | 'non_running' | 'unknown';
    specialHandlingNeeded?: boolean;
    specialHandlingNotes?: string;
  };
  pricing: {
    quoteAmount: number;
    actualAmount?: number;
    currency: string;
    breakdown?: Array<{
      description: string;
      amount: number;
    }>;
    isPaid: boolean;
    paymentDate?: Date;
    paymentMethod?: string;
    paymentReference?: string;
  };
  tracking: {
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    currentLocation?: string;
    currentStatus?: string;
    statusHistory: Array<{
      status: string;
      location?: string;
      timestamp: Date;
      notes?: string;
    }>;
  };
  customsClearance?: {
    required: boolean;
    status?: 'not_started' | 'in_progress' | 'completed' | 'issues';
    clearanceDate?: Date;
    customsOffice?: string;
    customsAgent?: string;
    customsDocuments?: Array<{
      type: string;
      referenceNumber?: string;
      issueDate?: Date;
      documentUrl?: string;
    }>;
    duties?: {
      amount: number;
      currency: string;
      paidBy: 'buyer' | 'seller' | 'platform' | 'shipping_provider';
      paymentStatus: 'pending' | 'paid' | 'waived';
    };
    notes?: string;
  };
  insurance?: {
    isInsured: boolean;
    provider?: string;
    coverageAmount?: number;
    currency?: string;
    policyNumber?: string;
    validFrom?: Date;
    validTo?: Date;
    premium?: number;
    documents?: string[];
  };
  documents: Array<{
    type: string;  // e.g., 'bill_of_lading', 'cmr', 'condition_report'
    filename: string;
    url: string;
    uploadDate: Date;
  }>;
  notes?: Array<{
    author: string;
    date: Date;
    content: string;
    isPublic: boolean;
  }>;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TransportProviderSchema = new Schema<ITransportProvider>({
  name: { type: String, required: true },
  description: { type: String },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },
    address: { type: String }
  },
  servicesOffered: [{ type: String, required: true }],
  operatingCountries: [{ type: String, required: true, uppercase: true }],
  pricing: {
    baseRates: [{
      fromCountry: { type: String, required: true, uppercase: true },
      toCountry: { type: String, required: true, uppercase: true },
      vehicleType: { type: String, required: true },
      price: { type: Number, required: true },
      currency: { type: String, required: true, uppercase: true },
      priceUnit: { 
        type: String, 
        enum: ['per_vehicle', 'per_km', 'per_mile'],
        required: true
      },
      minPrice: { type: Number }
    }],
    additionalFees: [{
      name: { type: String, required: true },
      amount: { type: Number, required: true },
      type: { type: String, enum: ['fixed', 'percentage'], required: true },
      description: { type: String }
    }]
  },
  insuranceOptions: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverageLimit: { type: Number, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true, uppercase: true }
  }],
  averageRating: { 
    type: Number,
    min: 1,
    max: 5
  },
  reviewCount: { type: Number },
  integrationDetails: {
    apiEnabled: { type: Boolean, default: false },
    apiKey: { type: String },
    trackingUrlTemplate: { type: String },
    quotationApiEndpoint: { type: String }
  },
  isActive: { type: Boolean, default: true },
  isPreferred: { type: Boolean, default: false }
}, {
  timestamps: true
});

const TransportBookingSchema = new Schema<ITransportBooking>({
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  auctionId: { type: Schema.Types.ObjectId, ref: 'Auction' },
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: Schema.Types.ObjectId, ref: 'TransportProvider' },
  status: { 
    type: String, 
    enum: [
      'draft', 'quote_requested', 'quoted', 'booked', 
      'pickup_scheduled', 'in_transit', 'customs_clearance',
      'delivered', 'cancelled', 'failed'
    ],
    required: true,
    default: 'draft',
    index: true
  },
  pickupDetails: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    country: { type: String, required: true },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    scheduledDate: { type: Date },
    instructions: { type: String },
    accessRestrictions: { type: String }
  },
  deliveryDetails: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    country: { type: String, required: true },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    scheduledDate: { type: Date },
    instructions: { type: String },
    accessRestrictions: { type: String }
  },
  routeDetails: {
    distance: { type: Number },
    estimatedDuration: { type: Number },
    borderCrossings: [{
      fromCountry: { type: String, required: true },
      toCountry: { type: String, required: true },
      estimatedCrossingTime: { type: Number }
    }],
    waypoints: [{
      type: { 
        type: String, 
        enum: ['pickup', 'customs', 'handover', 'storage', 'inspection', 'delivery'],
        required: true
      },
      location: { type: String, required: true },
      scheduledArrival: { type: Date },
      actualArrival: { type: Date },
      notes: { type: String }
    }]
  },
  vehicleDetails: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    vin: { type: String, required: true },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      weight: { type: Number }
    },
    runningCondition: { 
      type: String, 
      enum: ['running', 'non_running', 'unknown'],
      required: true
    },
    specialHandlingNeeded: { type: Boolean, default: false },
    specialHandlingNotes: { type: String }
  },
  pricing: {
    quoteAmount: { type: Number, required: true },
    actualAmount: { type: Number },
    currency: { type: String, required: true },
    breakdown: [{
      description: { type: String, required: true },
      amount: { type: Number, required: true }
    }],
    isPaid: { type: Boolean, default: false },
    paymentDate: { type: Date },
    paymentMethod: { type: String },
    paymentReference: { type: String }
  },
  tracking: {
    trackingNumber: { type: String },
    trackingUrl: { type: String },
    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date },
    currentLocation: { type: String },
    currentStatus: { type: String },
    statusHistory: [{
      status: { type: String, required: true },
      location: { type: String },
      timestamp: { type: Date, required: true, default: Date.now },
      notes: { type: String }
    }]
  },
  customsClearance: {
    required: { type: Boolean, required: true, default: false },
    status: { 
      type: String, 
      enum: ['not_started', 'in_progress', 'completed', 'issues']
    },
    clearanceDate: { type: Date },
    customsOffice: { type: String },
    customsAgent: { type: String },
    customsDocuments: [{
      type: { type: String, required: true },
      referenceNumber: { type: String },
      issueDate: { type: Date },
      documentUrl: { type: String }
    }],
    duties: {
      amount: { type: Number },
      currency: { type: String },
      paidBy: { 
        type: String, 
        enum: ['buyer', 'seller', 'platform', 'shipping_provider']
      },
      paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'waived']
      }
    },
    notes: { type: String }
  },
  insurance: {
    isInsured: { type: Boolean, default: false },
    provider: { type: String },
    coverageAmount: { type: Number },
    currency: { type: String },
    policyNumber: { type: String },
    validFrom: { type: Date },
    validTo: { type: Date },
    premium: { type: Number },
    documents: [{ type: String }]
  },
  documents: [{
    type: { type: String, required: true },
    filename: { type: String, required: true },
    url: { type: String, required: true },
    uploadDate: { type: Date, required: true, default: Date.now }
  }],
  notes: [{
    author: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    content: { type: String, required: true },
    isPublic: { type: Boolean, default: true }
  }],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Create indexes for query performance
TransportProviderSchema.index({ isActive: 1 });
TransportProviderSchema.index({ operatingCountries: 1 });
TransportProviderSchema.index({ isPreferred: 1 });

TransportBookingSchema.index({ vehicleId: 1 });
TransportBookingSchema.index({ buyerId: 1 });
TransportBookingSchema.index({ sellerId: 1 });
TransportBookingSchema.index({ auctionId: 1 });
TransportBookingSchema.index({ 'pickupDetails.country': 1 });
TransportBookingSchema.index({ 'deliveryDetails.country': 1 });
TransportBookingSchema.index({ status: 1, createdAt: -1 });

// Create the models if they don't already exist
const TransportProvider = mongoose.models.TransportProvider || 
  mongoose.model<ITransportProvider>('TransportProvider', TransportProviderSchema);

const TransportBooking = mongoose.models.TransportBooking || 
  mongoose.model<ITransportBooking>('TransportBooking', TransportBookingSchema);

export { TransportProvider, TransportBooking };
