import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IValuationFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  valueEffect: number; // Percentage or absolute amount
  isPercentage: boolean;
  notes?: string;
}

export interface IValuation extends Document {
  vehicleId: Schema.Types.ObjectId;
  date: Date;
  baseValue: number;
  adjustedValue: number;
  currency: string;
  condition: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
  mileage: number;
  marketSegment: 'retail' | 'wholesale' | 'trade-in' | 'auction';
  valuationMethod: 'market_comparison' | 'cost_approach' | 'algorithm' | 'expert_opinion' | 'combined';
  factors: IValuationFactor[];
  comparables?: Array<{
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
    salePrice: number;
    saleDate: Date;
    source: string;
    location?: string;
    adjustmentFactor?: number;
  }>;
  regionAdjustment?: number;
  seasonalAdjustment?: number;
  demandIndex?: number;
  confidenceScore: number; // 1-10 rating of valuation confidence
  expiration: Date;
  evaluator: {
    name: string;
    organization?: string;
    isAutomatic: boolean;
    userId?: Schema.Types.ObjectId;
  };
  notes?: string;
  isVerified: boolean;
  verifiedBy?: Schema.Types.ObjectId;
  verificationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ValuationSchema = new Schema<IValuation>({
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
  date: { type: Date, default: Date.now, required: true },
  baseValue: { type: Number, required: true },
  adjustedValue: { type: Number, required: true },
  currency: { type: String, required: true, default: 'EUR' },
  condition: { 
    type: String, 
    enum: ['excellent', 'good', 'average', 'fair', 'poor'],
    required: true 
  },
  mileage: { type: Number, required: true },
  marketSegment: { 
    type: String, 
    enum: ['retail', 'wholesale', 'trade-in', 'auction'],
    required: true 
  },
  valuationMethod: { 
    type: String, 
    enum: ['market_comparison', 'cost_approach', 'algorithm', 'expert_opinion', 'combined'],
    required: true 
  },
  factors: [{
    name: { type: String, required: true },
    impact: { 
      type: String, 
      enum: ['positive', 'negative', 'neutral'],
      required: true 
    },
    valueEffect: { type: Number, required: true },
    isPercentage: { type: Boolean, default: true },
    notes: { type: String }
  }],
  comparables: [{
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true },
    condition: { type: String, required: true },
    salePrice: { type: Number, required: true },
    saleDate: { type: Date, required: true },
    source: { type: String, required: true },
    location: { type: String },
    adjustmentFactor: { type: Number }
  }],
  regionAdjustment: { type: Number },
  seasonalAdjustment: { type: Number },
  demandIndex: { type: Number },
  confidenceScore: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10
  },
  expiration: { type: Date, required: true },
  evaluator: {
    name: { type: String, required: true },
    organization: { type: String },
    isAutomatic: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  notes: { type: String },
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verificationDate: { type: Date }
}, {
  timestamps: true
});

// Create indexes for query performance
ValuationSchema.index({ vehicleId: 1, date: -1 });
ValuationSchema.index({ adjustedValue: 1 });
ValuationSchema.index({ condition: 1 });
ValuationSchema.index({ marketSegment: 1 });

// Create the Valuation model if it doesn't already exist
const Valuation = mongoose.models.Valuation || mongoose.model<IValuation>('Valuation', ValuationSchema);

export default Valuation as Model<IValuation>;
