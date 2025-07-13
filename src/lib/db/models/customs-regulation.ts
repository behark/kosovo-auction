import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomsRegulation extends Document {
  countryCode: string;           // ISO country code
  countryName: string;           // Full country name
  importRequirements: Array<{
    documentType: string;        // E.g., 'Title', 'Certificate of Conformity'
    required: boolean;
    description: string;
    issuingAuthority?: string;
    validityPeriod?: string;     // E.g., '6 months', '1 year'
    format?: string;            // E.g., 'Original', 'Certified Copy', 'Electronic'
    notes?: string;
  }>;
  vehicleRestrictions: Array<{
    type: string;               // E.g., 'Age', 'Emissions', 'Left-hand drive'
    description: string;
    threshold?: string;         // E.g., '15 years', 'Euro 5', 'Not allowed'
    exceptions?: string[];
  }>;
  dutyAndTaxes: {
    importDuty: number;         // Percentage as decimal
    exciseTax?: number;         // Percentage as decimal
    registrationTax?: number;   // Percentage as decimal
    luxuryTax?: number;         // Percentage as decimal
    otherFees?: Array<{
      name: string;
      amount: number;
      type: 'fixed' | 'percentage';
      currency?: string;
    }>;
  };
  specialProvisions: Array<{
    name: string;               // E.g., 'Temporary Import', 'Returning Resident'
    description: string;
    eligibilityCriteria?: string[];
    documentation?: string[];
    taxImplications?: string;
  }>;
  carnetRequired: boolean;      // Whether ATA Carnet is required
  temporaryImportPeriod?: string; // E.g., '6 months', '1 year'
  prohibitedVehicles?: string[]; // E.g., ['Right-hand drive', 'Diesel pre-2010']
  emissionStandards?: string;   // E.g., 'Euro 6', 'Euro 5'
  inspectionRequirements?: string;
  registrationProcess?: string;
  customsContactInfo?: {
    website?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  lastUpdated: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomsRegulationSchema = new Schema<ICustomsRegulation>({
  countryCode: { type: String, required: true, unique: true, uppercase: true },
  countryName: { type: String, required: true },
  importRequirements: [{
    documentType: { type: String, required: true },
    required: { type: Boolean, required: true },
    description: { type: String, required: true },
    issuingAuthority: { type: String },
    validityPeriod: { type: String },
    format: { type: String },
    notes: { type: String }
  }],
  vehicleRestrictions: [{
    type: { type: String, required: true },
    description: { type: String, required: true },
    threshold: { type: String },
    exceptions: [{ type: String }]
  }],
  dutyAndTaxes: {
    importDuty: { type: Number, required: true },
    exciseTax: { type: Number },
    registrationTax: { type: Number },
    luxuryTax: { type: Number },
    otherFees: [{
      name: { type: String, required: true },
      amount: { type: Number, required: true },
      type: { type: String, enum: ['fixed', 'percentage'], required: true },
      currency: { type: String }
    }]
  },
  specialProvisions: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    eligibilityCriteria: [{ type: String }],
    documentation: [{ type: String }],
    taxImplications: { type: String }
  }],
  carnetRequired: { type: Boolean, default: false },
  temporaryImportPeriod: { type: String },
  prohibitedVehicles: [{ type: String }],
  emissionStandards: { type: String },
  inspectionRequirements: { type: String },
  registrationProcess: { type: String },
  customsContactInfo: {
    website: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String }
  },
  lastUpdated: { type: Date, required: true, default: Date.now },
  isActive: { type: Boolean, default: true },
  notes: { type: String }
}, {
  timestamps: true
});

// Create indexes
CustomsRegulationSchema.index({ countryCode: 1 });
CustomsRegulationSchema.index({ isActive: 1 });

// Create the CustomsRegulation model if it doesn't already exist
const CustomsRegulation = mongoose.models.CustomsRegulation || mongoose.model<ICustomsRegulation>('CustomsRegulation', CustomsRegulationSchema);

export default CustomsRegulation as Model<ICustomsRegulation>;
