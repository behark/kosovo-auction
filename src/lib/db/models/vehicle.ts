import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVehicle extends Document {
  make: string;
  model: string;
  year: number;
  vin: string;
  engineType: string;
  fuelType: string;
  transmission: string;
  mileage: number;
  mileageUnit: 'km' | 'mi';
  exteriorColor: string;
  interiorColor: string;
  bodyType: string;
  registrationCountry: string;
  registrationNumber?: string;
  firstRegistrationDate?: Date;
  numberOfDoors: number;
  numberOfSeats: number;
  images: string[];
  featuredImage?: string;
  videos?: string[];
  documents?: string[];
  condition: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
  conditionReport?: {
    exterior: {
      score: number;
      notes: string;
      damages?: Array<{
        type: string;
        severity: 'minor' | 'moderate' | 'major';
        location: string;
        images?: string[];
        repairEstimate?: number;
      }>;
    };
    interior: {
      score: number;
      notes: string;
      damages?: Array<{
        type: string;
        severity: 'minor' | 'moderate' | 'major';
        location: string;
        images?: string[];
        repairEstimate?: number;
      }>;
    };
    mechanical: {
      score: number;
      notes: string;
      issues?: Array<{
        component: string;
        severity: 'minor' | 'moderate' | 'major';
        description: string;
        repairEstimate?: number;
      }>;
    };
    overallScore: number;
  };
  features: string[];
  description: string;
  sellerNotes?: string;
  manufacturerWarranty?: {
    hasWarranty: boolean;
    expiryDate?: Date;
    description?: string;
  };
  serviceHistory?: {
    complete: boolean;
    lastServiceDate?: Date;
    lastServiceMileage?: number;
    records?: string[];
  };
  ownerHistory?: {
    numberOfOwners: number;
    details?: string;
  };
  technicalSpecifications?: {
    engine: {
      displacement?: number;
      power?: number;
      powerUnit: 'hp' | 'kw' | 'ps';
      torque?: number;
      torqueUnit: 'nm' | 'lb-ft';
    };
    performance: {
      acceleration0To100?: number;
      topSpeed?: number;
      speedUnit: 'kph' | 'mph';
    };
    dimensions: {
      length?: number;
      width?: number;
      height?: number;
      wheelbase?: number;
      dimensionUnit: 'mm' | 'in';
      weight?: number;
      weightUnit: 'kg' | 'lbs';
    };
    consumption: {
      city?: number;
      highway?: number;
      combined?: number;
      consumptionUnit: 'l/100km' | 'mpg';
    };
    emissions: {
      co2?: number;
      emissionStandard?: string;
    };
  };
  estimatedValue?: {
    amount: number;
    currency: string;
    date: Date;
    source?: string;
  };
  auctionDetails?: {
    auctionId: Schema.Types.ObjectId;
    startBid: number;
    reservePrice?: number;
    currentBid?: number;
    bidCount?: number;
    currency: string;
    status: 'scheduled' | 'active' | 'ended' | 'sold' | 'not_sold';
    startDate: Date;
    endDate: Date;
    winningBid?: {
      amount: number;
      bidder: Schema.Types.ObjectId;
      timestamp: Date;
    };
  };
  location: {
    country: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  customFields?: Record<string, any>;
  seller: Schema.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>({
  make: { type: String, required: true, index: true },
  model: { type: String, required: true, index: true },
  year: { type: Number, required: true, index: true },
  vin: { type: String, required: true, unique: true },
  engineType: { type: String, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  mileage: { type: Number, required: true },
  mileageUnit: { type: String, enum: ['km', 'mi'], default: 'km' },
  exteriorColor: { type: String, required: true },
  interiorColor: { type: String, required: true },
  bodyType: { type: String, required: true },
  registrationCountry: { type: String, required: true },
  registrationNumber: { type: String },
  firstRegistrationDate: { type: Date },
  numberOfDoors: { type: Number, required: true },
  numberOfSeats: { type: Number, required: true },
  images: [{ type: String, required: true }],
  featuredImage: { type: String },
  videos: [{ type: String }],
  documents: [{ type: String }],
  condition: { 
    type: String, 
    enum: ['excellent', 'good', 'average', 'fair', 'poor'], 
    required: true 
  },
  conditionReport: {
    exterior: {
      score: { type: Number, min: 0, max: 10 },
      notes: { type: String },
      damages: [{
        type: { type: String },
        severity: { type: String, enum: ['minor', 'moderate', 'major'] },
        location: { type: String },
        images: [{ type: String }],
        repairEstimate: { type: Number }
      }]
    },
    interior: {
      score: { type: Number, min: 0, max: 10 },
      notes: { type: String },
      damages: [{
        type: { type: String },
        severity: { type: String, enum: ['minor', 'moderate', 'major'] },
        location: { type: String },
        images: [{ type: String }],
        repairEstimate: { type: Number }
      }]
    },
    mechanical: {
      score: { type: Number, min: 0, max: 10 },
      notes: { type: String },
      issues: [{
        component: { type: String },
        severity: { type: String, enum: ['minor', 'moderate', 'major'] },
        description: { type: String },
        repairEstimate: { type: Number }
      }]
    },
    overallScore: { type: Number, min: 0, max: 10 }
  },
  features: [{ type: String }],
  description: { type: String, required: true },
  sellerNotes: { type: String },
  manufacturerWarranty: {
    hasWarranty: { type: Boolean, default: false },
    expiryDate: { type: Date },
    description: { type: String }
  },
  serviceHistory: {
    complete: { type: Boolean },
    lastServiceDate: { type: Date },
    lastServiceMileage: { type: Number },
    records: [{ type: String }]
  },
  ownerHistory: {
    numberOfOwners: { type: Number },
    details: { type: String }
  },
  technicalSpecifications: {
    engine: {
      displacement: { type: Number },
      power: { type: Number },
      powerUnit: { type: String, enum: ['hp', 'kw', 'ps'], default: 'hp' },
      torque: { type: Number },
      torqueUnit: { type: String, enum: ['nm', 'lb-ft'], default: 'nm' }
    },
    performance: {
      acceleration0To100: { type: Number },
      topSpeed: { type: Number },
      speedUnit: { type: String, enum: ['kph', 'mph'], default: 'kph' }
    },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
      wheelbase: { type: Number },
      dimensionUnit: { type: String, enum: ['mm', 'in'], default: 'mm' },
      weight: { type: Number },
      weightUnit: { type: String, enum: ['kg', 'lbs'], default: 'kg' }
    },
    consumption: {
      city: { type: Number },
      highway: { type: Number },
      combined: { type: Number },
      consumptionUnit: { type: String, enum: ['l/100km', 'mpg'], default: 'l/100km' }
    },
    emissions: {
      co2: { type: Number },
      emissionStandard: { type: String }
    }
  },
  estimatedValue: {
    amount: { type: Number },
    currency: { type: String },
    date: { type: Date },
    source: { type: String }
  },
  auctionDetails: {
    auctionId: { type: Schema.Types.ObjectId, ref: 'Auction' },
    startBid: { type: Number },
    reservePrice: { type: Number },
    currentBid: { type: Number },
    bidCount: { type: Number, default: 0 },
    currency: { type: String, default: 'EUR' },
    status: { 
      type: String, 
      enum: ['scheduled', 'active', 'ended', 'sold', 'not_sold'],
      default: 'scheduled'
    },
    startDate: { type: Date },
    endDate: { type: Date },
    winningBid: {
      amount: { type: Number },
      bidder: { type: Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date }
    }
  },
  location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  customFields: { type: Schema.Types.Mixed },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

// Create indexes for search performance
VehicleSchema.index({ make: 1, model: 1, year: 1 });
VehicleSchema.index({ 'auctionDetails.status': 1, 'auctionDetails.startDate': 1 });
VehicleSchema.index({ 'location.country': 1 });
VehicleSchema.index({ seller: 1 });

// Create the Vehicle model if it doesn't already exist
const Vehicle = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);

export default Vehicle as Model<IVehicle>;
