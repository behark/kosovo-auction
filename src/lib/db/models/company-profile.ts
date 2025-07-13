import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompanyProfile extends Document {
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  foundedYear?: number;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  specialties?: string[];
  businessType: 'dealership' | 'auction_house' | 'broker' | 'fleet_manager' | 'other';
  verificationLevel: 'basic' | 'verified' | 'premium' | 'trusted';
  primaryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    }
  };
  additionalAddresses?: Array<{
    type: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>;
  contactEmail: string;
  contactPhone: string;
  socialProfiles?: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
  memberSince: Date;
  licenseNumbers?: Array<{
    type: string;
    number: string;
    expiryDate: Date;
    country: string;
  }>;
  taxIdentifiers?: Array<{
    type: string;
    number: string;
    country: string;
  }>;
  verifiedDocuments?: string[];
  rating?: number;
  reviewCount?: number;
  transactionHistory?: {
    totalPurchases: number;
    totalSales: number;
    totalValue: number;
    currency: string;
  };
  preferredPaymentMethods?: string[];
  preferredShippingMethods?: string[];
  customFields?: Record<string, any>;
  isActive: boolean;
}

const CompanyProfileSchema = new Schema<ICompanyProfile>({
  name: { type: String, required: true },
  logo: { type: String },
  description: { type: String },
  website: { type: String },
  foundedYear: { type: Number },
  size: { 
    type: String, 
    enum: ['small', 'medium', 'large', 'enterprise']
  },
  specialties: [{ type: String }],
  businessType: { 
    type: String, 
    enum: ['dealership', 'auction_house', 'broker', 'fleet_manager', 'other'],
    required: true
  },
  verificationLevel: { 
    type: String, 
    enum: ['basic', 'verified', 'premium', 'trusted'],
    default: 'basic'
  },
  primaryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  additionalAddresses: [{
    type: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  }],
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  socialProfiles: {
    facebook: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    twitter: { type: String }
  },
  memberSince: { type: Date, default: Date.now },
  licenseNumbers: [{
    type: { type: String },
    number: { type: String },
    expiryDate: { type: Date },
    country: { type: String }
  }],
  taxIdentifiers: [{
    type: { type: String },
    number: { type: String },
    country: { type: String }
  }],
  verifiedDocuments: [{ type: String }],
  rating: { type: Number, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  transactionHistory: {
    totalPurchases: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' }
  },
  preferredPaymentMethods: [{ type: String }],
  preferredShippingMethods: [{ type: String }],
  customFields: { type: Schema.Types.Mixed },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Create the CompanyProfile model if it doesn't already exist
const CompanyProfile = mongoose.models.CompanyProfile || 
  mongoose.model<ICompanyProfile>('CompanyProfile', CompanyProfileSchema);

export default CompanyProfile as Model<ICompanyProfile>;
