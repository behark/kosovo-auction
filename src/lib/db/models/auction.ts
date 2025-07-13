import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuction extends Document {
  title: string;
  description: string;
  type: 'live' | 'timed';
  vehicles: Schema.Types.ObjectId[];
  vehicleCount: number;
  startDate: Date;
  endDate: Date;
  timezone: string;
  status: 'upcoming' | 'active' | 'ended' | 'cancelled';
  organizer: Schema.Types.ObjectId;
  featuredImage?: string;
  location?: {
    venue?: string;
    address?: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    }
  };
  streamUrl?: string; // For live auctions with video streaming
  registeredBidders?: Schema.Types.ObjectId[];
  bidderCount: number;
  termsAndConditions: string;
  depositRequired: boolean;
  depositAmount?: number;
  currency: string;
  accessRestriction: 'open' | 'invitation' | 'subscription';
  specialRequirements?: string[];
  internationalBidding: boolean;
  fees?: {
    buyerPremium: {
      percentage: number;
      minAmount?: number;
      maxAmount?: number;
    };
    sellerFee?: {
      percentage: number;
      flatRate?: number;
    };
    additionalFees?: Array<{
      name: string;
      amount: number;
      isPercentage: boolean;
      applicableTo: 'buyer' | 'seller' | 'both';
      description?: string;
    }>;
  };
  paymentMethods: string[];
  paymentDueWithin: number; // Hours
  metadata?: Record<string, any>;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AuctionSchema = new Schema<IAuction>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['live', 'timed'], required: true },
  vehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
  vehicleCount: { type: Number, default: 0 },
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true, index: true },
  timezone: { type: String, default: 'UTC' },
  status: { 
    type: String, 
    enum: ['upcoming', 'active', 'ended', 'cancelled'],
    default: 'upcoming',
    index: true
  },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  featuredImage: { type: String },
  location: {
    venue: { type: String },
    address: { type: String },
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  streamUrl: { type: String },
  registeredBidders: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  bidderCount: { type: Number, default: 0 },
  termsAndConditions: { type: String, required: true },
  depositRequired: { type: Boolean, default: false },
  depositAmount: { type: Number },
  currency: { type: String, default: 'EUR' },
  accessRestriction: { 
    type: String, 
    enum: ['open', 'invitation', 'subscription'], 
    default: 'open' 
  },
  specialRequirements: [{ type: String }],
  internationalBidding: { type: Boolean, default: true },
  fees: {
    buyerPremium: {
      percentage: { type: Number, required: true },
      minAmount: { type: Number },
      maxAmount: { type: Number }
    },
    sellerFee: {
      percentage: { type: Number },
      flatRate: { type: Number }
    },
    additionalFees: [{
      name: { type: String, required: true },
      amount: { type: Number, required: true },
      isPercentage: { type: Boolean, default: false },
      applicableTo: { type: String, enum: ['buyer', 'seller', 'both'] },
      description: { type: String }
    }]
  },
  paymentMethods: [{ type: String, required: true }],
  paymentDueWithin: { type: Number, default: 48 }, // Hours
  metadata: { type: Schema.Types.Mixed },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Create indexes for search performance
AuctionSchema.index({ startDate: 1, status: 1 });
AuctionSchema.index({ 'location.country': 1, 'location.city': 1 });
AuctionSchema.index({ organizer: 1 });

// Pre-save hook to update vehicleCount
AuctionSchema.pre('save', function(next) {
  if (this.vehicles) {
    this.vehicleCount = this.vehicles.length;
  }
  if (this.registeredBidders) {
    this.bidderCount = this.registeredBidders.length;
  }
  next();
});

// Create the Auction model if it doesn't already exist
const Auction = mongoose.models.Auction || mongoose.model<IAuction>('Auction', AuctionSchema);

export default Auction as Model<IAuction>;
