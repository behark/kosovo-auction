import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITaxRate extends Document {
  countryCode: string;     // ISO country code (e.g., 'XK', 'DE', 'US')
  region?: string;         // Optional sub-region/state/province
  name: string;            // Name of tax (e.g., 'VAT', 'Sales Tax')
  rate: number;            // Tax rate as decimal (e.g., 0.19 for 19%)
  category: 'standard' | 'reduced' | 'super_reduced' | 'zero' | 'exempt';
  applicableToVehicleTypes: string[];  // e.g., ['passenger', 'commercial']
  vehicleConditionFactors?: {
    new: number;           // Multiplier for new vehicles
    used: number;          // Multiplier for used vehicles
    collectible: number;   // Multiplier for collectible/vintage
    damaged: number;       // Multiplier for damaged vehicles
  };
  thresholds?: Array<{     // For progressive taxation
    threshold: number;     // Value threshold in EUR
    rate: number;          // Rate above threshold
  }>;
  specialRules?: string;   // Description of any special rules
  effectiveFrom: Date;     // When this tax rate comes into effect
  effectiveTo?: Date;      // When this tax rate expires (null if current)
  isActive: boolean;       // Whether this tax rate is currently active
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaxRateSchema = new Schema<ITaxRate>({
  countryCode: { type: String, required: true, uppercase: true },
  region: { type: String },
  name: { type: String, required: true },
  rate: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['standard', 'reduced', 'super_reduced', 'zero', 'exempt'],
    required: true,
    default: 'standard'
  },
  applicableToVehicleTypes: [{ type: String, required: true }],
  vehicleConditionFactors: {
    new: { type: Number },
    used: { type: Number },
    collectible: { type: Number },
    damaged: { type: Number }
  },
  thresholds: [{
    threshold: { type: Number, required: true },
    rate: { type: Number, required: true }
  }],
  specialRules: { type: String },
  effectiveFrom: { type: Date, required: true },
  effectiveTo: { type: Date },
  isActive: { type: Boolean, default: true },
  notes: { type: String }
}, {
  timestamps: true
});

// Create indexes for query performance
TaxRateSchema.index({ countryCode: 1, region: 1, isActive: 1 });
TaxRateSchema.index({ effectiveFrom: 1, effectiveTo: 1 });

// Create the TaxRate model if it doesn't already exist
const TaxRate = mongoose.models.TaxRate || mongoose.model<ITaxRate>('TaxRate', TaxRateSchema);

export default TaxRate as Model<ITaxRate>;
