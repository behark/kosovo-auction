import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string; // Hash only
  company: string;
  role: 'admin' | 'dealer' | 'manager' | 'staff';
  companyProfile?: Schema.Types.ObjectId;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationDocuments?: string[];
  businessLicense?: string;
  taxId?: string;
  businessAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phoneNumber?: string;
  preferredLanguage?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  accountManager?: Schema.Types.ObjectId;
  subscriptionTier?: 'basic' | 'premium' | 'enterprise';
  isActive: boolean;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String },
  company: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'dealer', 'manager', 'staff'], 
    default: 'dealer',
    required: true
  },
  companyProfile: { type: Schema.Types.ObjectId, ref: 'CompanyProfile' },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
    required: true
  },
  verificationDocuments: [{ type: String }],
  businessLicense: { type: String },
  taxId: { type: String },
  businessAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  phoneNumber: { type: String },
  preferredLanguage: { type: String, default: 'en' },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  accountManager: { type: Schema.Types.ObjectId, ref: 'User' },
  subscriptionTier: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

// Create the User model if it doesn't already exist
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User as Model<IUser>;
