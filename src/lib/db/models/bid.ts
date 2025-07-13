import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBid extends Document {
  auction: Schema.Types.ObjectId;
  vehicle: Schema.Types.ObjectId;
  bidder: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  timestamp: Date;
  status: 'active' | 'winning' | 'outbid' | 'rejected' | 'cancelled';
  bidderIP?: string;
  bidderLocation?: {
    country?: string;
    city?: string;
  };
  bidderDevice?: string;
  notes?: string;
  isAutoBid: boolean;
  maxAutoBidAmount?: number;
  previousBid?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BidSchema = new Schema<IBid>({
  auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  bidder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'EUR' },
  timestamp: { type: Date, default: Date.now, index: true },
  status: { 
    type: String, 
    enum: ['active', 'winning', 'outbid', 'rejected', 'cancelled'],
    default: 'active',
    index: true
  },
  bidderIP: { type: String },
  bidderLocation: {
    country: { type: String },
    city: { type: String }
  },
  bidderDevice: { type: String },
  notes: { type: String },
  isAutoBid: { type: Boolean, default: false },
  maxAutoBidAmount: { type: Number },
  previousBid: { type: Schema.Types.ObjectId, ref: 'Bid' }
}, {
  timestamps: true
});

// Create indexes for performance
BidSchema.index({ auction: 1, vehicle: 1, amount: -1 });
BidSchema.index({ bidder: 1, auction: 1 });
BidSchema.index({ vehicle: 1, status: 1 });

// Create the Bid model if it doesn't already exist
const Bid = mongoose.models.Bid || mongoose.model<IBid>('Bid', BidSchema);

export default Bid as Model<IBid>;
