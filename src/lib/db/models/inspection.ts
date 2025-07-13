import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInspectionItem {
  category: string;
  component: string;
  condition: 'excellent' | 'good' | 'average' | 'fair' | 'poor' | 'needs_repair' | 'damaged' | 'replaced';
  notes?: string;
  photos?: string[];
  estimatedRepairCost?: number;
}

export interface IDamageItem {
  location: string;
  type: string;
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
  repaired: boolean;
  photos?: string[];
  estimatedRepairCost?: number;
}

export interface IInspection extends Document {
  vehicleId: Schema.Types.ObjectId;
  inspectorName: string;
  inspectorCompany?: string;
  inspectionType: 'standard' | 'detailed' | 'pre-sale' | 'post-repair' | 'custom';
  inspectionDate: Date;
  location: {
    address?: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    }
  };
  overallCondition: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
  overallRating: number; // 1-10 rating
  mileageVerified: boolean;
  mileageReading: number;
  odometerAccurate: boolean;
  odometerDiscrepancy?: string;
  vinVerified: boolean;
  exterior: IInspectionItem[];
  interior: IInspectionItem[];
  mechanical: IInspectionItem[];
  electrical: IInspectionItem[];
  underbody: IInspectionItem[];
  damages: IDamageItem[];
  fluidLevels: {
    engine: 'full' | 'adequate' | 'low' | 'empty' | 'leaking';
    transmission: 'full' | 'adequate' | 'low' | 'empty' | 'leaking';
    brake: 'full' | 'adequate' | 'low' | 'empty' | 'leaking';
    power_steering: 'full' | 'adequate' | 'low' | 'empty' | 'leaking';
    coolant: 'full' | 'adequate' | 'low' | 'empty' | 'leaking';
    washer: 'full' | 'adequate' | 'low' | 'empty';
  };
  tires: {
    frontLeft: {
      brand?: string;
      treadDepth: number; // in mm
      condition: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
      needsReplacement: boolean;
    };
    frontRight: {
      brand?: string;
      treadDepth: number;
      condition: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
      needsReplacement: boolean;
    };
    rearLeft: {
      brand?: string;
      treadDepth: number;
      condition: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
      needsReplacement: boolean;
    };
    rearRight: {
      brand?: string;
      treadDepth: number;
      condition: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
      needsReplacement: boolean;
    };
    spare?: {
      present: boolean;
      condition?: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
    }
  };
  testDrive: {
    performed: boolean;
    issues: string[];
    performance: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
    notes?: string;
  };
  diagnosticCodes?: string[];
  additionalEquipment?: string[];
  recommendedServices: string[];
  estimatedTotalRepairCost?: number;
  photos: string[];
  videos?: string[];
  pdfReport?: string;
  notes?: string;
  signature?: string;
  isVerified: boolean;
  verifiedBy?: Schema.Types.ObjectId;
  verificationDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InspectionSchema = new Schema<IInspection>({
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
  inspectorName: { type: String, required: true },
  inspectorCompany: { type: String },
  inspectionType: { 
    type: String, 
    enum: ['standard', 'detailed', 'pre-sale', 'post-repair', 'custom'],
    required: true,
    default: 'standard'
  },
  inspectionDate: { type: Date, required: true, default: Date.now },
  location: {
    address: { type: String },
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  overallCondition: { 
    type: String, 
    enum: ['excellent', 'good', 'average', 'fair', 'poor'],
    required: true 
  },
  overallRating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10
  },
  mileageVerified: { type: Boolean, default: false },
  mileageReading: { type: Number, required: true },
  odometerAccurate: { type: Boolean, default: true },
  odometerDiscrepancy: { type: String },
  vinVerified: { type: Boolean, default: false },
  exterior: [{
    category: { type: String, required: true },
    component: { type: String, required: true },
    condition: { 
      type: String, 
      enum: ['excellent', 'good', 'average', 'fair', 'poor', 'needs_repair', 'damaged', 'replaced'],
      required: true
    },
    notes: { type: String },
    photos: [{ type: String }],
    estimatedRepairCost: { type: Number }
  }],
  interior: [{
    category: { type: String, required: true },
    component: { type: String, required: true },
    condition: { 
      type: String, 
      enum: ['excellent', 'good', 'average', 'fair', 'poor', 'needs_repair', 'damaged', 'replaced'],
      required: true
    },
    notes: { type: String },
    photos: [{ type: String }],
    estimatedRepairCost: { type: Number }
  }],
  mechanical: [{
    category: { type: String, required: true },
    component: { type: String, required: true },
    condition: { 
      type: String, 
      enum: ['excellent', 'good', 'average', 'fair', 'poor', 'needs_repair', 'damaged', 'replaced'],
      required: true
    },
    notes: { type: String },
    photos: [{ type: String }],
    estimatedRepairCost: { type: Number }
  }],
  electrical: [{
    category: { type: String, required: true },
    component: { type: String, required: true },
    condition: { 
      type: String, 
      enum: ['excellent', 'good', 'average', 'fair', 'poor', 'needs_repair', 'damaged', 'replaced'],
      required: true
    },
    notes: { type: String },
    photos: [{ type: String }],
    estimatedRepairCost: { type: Number }
  }],
  underbody: [{
    category: { type: String, required: true },
    component: { type: String, required: true },
    condition: { 
      type: String, 
      enum: ['excellent', 'good', 'average', 'fair', 'poor', 'needs_repair', 'damaged', 'replaced'],
      required: true
    },
    notes: { type: String },
    photos: [{ type: String }],
    estimatedRepairCost: { type: Number }
  }],
  damages: [{
    location: { type: String, required: true },
    type: { type: String, required: true },
    severity: { 
      type: String, 
      enum: ['minor', 'moderate', 'severe'],
      required: true
    },
    description: { type: String, required: true },
    repaired: { type: Boolean, default: false },
    photos: [{ type: String }],
    estimatedRepairCost: { type: Number }
  }],
  fluidLevels: {
    engine: { 
      type: String, 
      enum: ['full', 'adequate', 'low', 'empty', 'leaking'],
      required: true
    },
    transmission: { 
      type: String, 
      enum: ['full', 'adequate', 'low', 'empty', 'leaking'],
      required: true
    },
    brake: { 
      type: String, 
      enum: ['full', 'adequate', 'low', 'empty', 'leaking'],
      required: true
    },
    power_steering: { 
      type: String, 
      enum: ['full', 'adequate', 'low', 'empty', 'leaking'],
      required: true
    },
    coolant: { 
      type: String, 
      enum: ['full', 'adequate', 'low', 'empty', 'leaking'],
      required: true
    },
    washer: { 
      type: String, 
      enum: ['full', 'adequate', 'low', 'empty'],
      required: true
    }
  },
  tires: {
    frontLeft: {
      brand: { type: String },
      treadDepth: { type: Number, required: true },
      condition: { 
        type: String, 
        enum: ['excellent', 'good', 'average', 'fair', 'poor'],
        required: true
      },
      needsReplacement: { type: Boolean, default: false }
    },
    frontRight: {
      brand: { type: String },
      treadDepth: { type: Number, required: true },
      condition: { 
        type: String, 
        enum: ['excellent', 'good', 'average', 'fair', 'poor'],
        required: true
      },
      needsReplacement: { type: Boolean, default: false }
    },
    rearLeft: {
      brand: { type: String },
      treadDepth: { type: Number, required: true },
      condition: { 
        type: String, 
        enum: ['excellent', 'good', 'average', 'fair', 'poor'],
        required: true
      },
      needsReplacement: { type: Boolean, default: false }
    },
    rearRight: {
      brand: { type: String },
      treadDepth: { type: Number, required: true },
      condition: { 
        type: String, 
        enum: ['excellent', 'good', 'average', 'fair', 'poor'],
        required: true
      },
      needsReplacement: { type: Boolean, default: false }
    },
    spare: {
      present: { type: Boolean, default: false },
      condition: { 
        type: String, 
        enum: ['excellent', 'good', 'average', 'fair', 'poor']
      }
    }
  },
  testDrive: {
    performed: { type: Boolean, default: false },
    issues: [{ type: String }],
    performance: { 
      type: String, 
      enum: ['excellent', 'good', 'average', 'fair', 'poor']
    },
    notes: { type: String }
  },
  diagnosticCodes: [{ type: String }],
  additionalEquipment: [{ type: String }],
  recommendedServices: [{ type: String }],
  estimatedTotalRepairCost: { type: Number },
  photos: [{ type: String, required: true }],
  videos: [{ type: String }],
  pdfReport: { type: String },
  notes: { type: String },
  signature: { type: String },
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verificationDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Create indexes for query performance
InspectionSchema.index({ vehicleId: 1, inspectionDate: -1 });
InspectionSchema.index({ overallCondition: 1 });
InspectionSchema.index({ overallRating: 1 });
InspectionSchema.index({ isVerified: 1 });

// Create the Inspection model if it doesn't already exist
const Inspection = mongoose.models.Inspection || mongoose.model<IInspection>('Inspection', InspectionSchema);

export default Inspection as Model<IInspection>;
