import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServiceRecord {
  date: Date;
  type: string;
  description: string;
  mileage: number;
  serviceCenter?: string;
  technician?: string;
  parts?: string[];
  cost?: number;
  warranty?: boolean;
  documents?: string[]; // URLs to receipts/documentation
}

export interface IOwnershipRecord {
  startDate: Date;
  endDate?: Date;
  ownerType: 'private' | 'business' | 'rental' | 'leasing' | 'demo' | 'other';
  country: string;
  region?: string;
  city?: string;
  registrationNumber?: string;
  verified: boolean;
  verificationMethod?: 'documents' | 'database' | 'dealer' | 'unverified';
  documents?: string[]; // URLs to ownership documents
}

export interface IIncidentRecord {
  date: Date;
  type: 'accident' | 'theft' | 'fire' | 'flood' | 'hail' | 'recall' | 'other';
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'total_loss';
  location?: {
    country: string;
    region?: string;
    city?: string;
    address?: string;
  };
  repaired: boolean;
  repairDate?: Date;
  repairCost?: number;
  insuranceClaim?: boolean;
  claimNumber?: string;
  documents?: string[]; // URLs to incident/repair documents
  photos?: string[]; // URLs to incident photos
}

export interface IOdometerRecord {
  date: Date;
  reading: number;
  unit: 'km' | 'miles';
  source: 'service' | 'inspection' | 'registration' | 'sale' | 'owner' | 'other';
  notes?: string;
  verified: boolean;
}

export interface IVehicleHistory extends Document {
  vehicleId: Schema.Types.ObjectId;
  vin: string;
  reportProvider?: string;
  reportId?: string;
  reportDate: Date;
  reportUrl?: string;
  services: IServiceRecord[];
  ownership: IOwnershipRecord[];
  incidents: IIncidentRecord[];
  odometerReadings: IOdometerRecord[];
  recalls?: Array<{
    date: Date;
    campaignNumber: string;
    description: string;
    risk: string;
    remedy: string;
    status: 'open' | 'closed';
    completionDate?: Date;
  }>;
  warrantyHistory?: Array<{
    type: string;
    provider: string;
    startDate: Date;
    endDate: Date;
    mileageLimit?: number;
    coverage?: string[];
    active: boolean;
    transferable: boolean;
    documents?: string[];
  }>;
  importExport?: Array<{
    type: 'import' | 'export';
    date: Date;
    fromCountry: string;
    toCountry: string;
    customsDocuments?: string[];
    notes?: string;
  }>;
  inspections?: Schema.Types.ObjectId[]; // References to inspection reports
  valueHistory?: Array<{
    date: Date;
    value: number;
    currency: string;
    condition: 'excellent' | 'good' | 'average' | 'fair' | 'poor';
    source: string;
  }>;
  modifications?: Array<{
    date: Date;
    type: string;
    description: string;
    installer?: string;
    reversible: boolean;
    affectsWarranty: boolean;
    documents?: string[];
    photos?: string[];
  }>;
  flags?: Array<{
    type: string;
    description: string;
    severity: 'info' | 'warning' | 'critical';
    addedBy?: Schema.Types.ObjectId;
    addedDate: Date;
    resolved: boolean;
    resolvedDate?: Date;
    notes?: string;
  }>;
  summaryData: {
    numberOfOwners: number;
    numberOfAccidents: number;
    totalServiceRecords: number;
    averageAnnualMileage?: number;
    lastKnownMileage?: number;
    lastKnownMileageDate?: Date;
    hasOpenRecalls: boolean;
    maintenanceScore?: number; // 0-100 rating of maintenance history
    historyScore?: number; // 0-100 overall vehicle history score
  };
  isVerified: boolean;
  verificationDate?: Date;
  verifiedBy?: Schema.Types.ObjectId;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleHistorySchema = new Schema<IVehicleHistory>({
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
  vin: { type: String, required: true, index: true },
  reportProvider: { type: String },
  reportId: { type: String },
  reportDate: { type: Date, required: true, default: Date.now },
  reportUrl: { type: String },
  services: [{
    date: { type: Date, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    mileage: { type: Number, required: true },
    serviceCenter: { type: String },
    technician: { type: String },
    parts: [{ type: String }],
    cost: { type: Number },
    warranty: { type: Boolean },
    documents: [{ type: String }]
  }],
  ownership: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    ownerType: { 
      type: String, 
      enum: ['private', 'business', 'rental', 'leasing', 'demo', 'other'],
      required: true 
    },
    country: { type: String, required: true },
    region: { type: String },
    city: { type: String },
    registrationNumber: { type: String },
    verified: { type: Boolean, required: true, default: false },
    verificationMethod: { 
      type: String, 
      enum: ['documents', 'database', 'dealer', 'unverified']
    },
    documents: [{ type: String }]
  }],
  incidents: [{
    date: { type: Date, required: true },
    type: { 
      type: String, 
      enum: ['accident', 'theft', 'fire', 'flood', 'hail', 'recall', 'other'],
      required: true 
    },
    description: { type: String, required: true },
    severity: { 
      type: String, 
      enum: ['minor', 'moderate', 'severe', 'total_loss'],
      required: true 
    },
    location: {
      country: { type: String },
      region: { type: String },
      city: { type: String },
      address: { type: String }
    },
    repaired: { type: Boolean, default: false },
    repairDate: { type: Date },
    repairCost: { type: Number },
    insuranceClaim: { type: Boolean },
    claimNumber: { type: String },
    documents: [{ type: String }],
    photos: [{ type: String }]
  }],
  odometerReadings: [{
    date: { type: Date, required: true },
    reading: { type: Number, required: true },
    unit: { 
      type: String, 
      enum: ['km', 'miles'],
      required: true,
      default: 'km' 
    },
    source: { 
      type: String, 
      enum: ['service', 'inspection', 'registration', 'sale', 'owner', 'other'],
      required: true 
    },
    notes: { type: String },
    verified: { type: Boolean, required: true, default: false }
  }],
  recalls: [{
    date: { type: Date, required: true },
    campaignNumber: { type: String, required: true },
    description: { type: String, required: true },
    risk: { type: String, required: true },
    remedy: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['open', 'closed'],
      required: true,
      default: 'open'
    },
    completionDate: { type: Date }
  }],
  warrantyHistory: [{
    type: { type: String, required: true },
    provider: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    mileageLimit: { type: Number },
    coverage: [{ type: String }],
    active: { type: Boolean, required: true },
    transferable: { type: Boolean, required: true },
    documents: [{ type: String }]
  }],
  importExport: [{
    type: { 
      type: String, 
      enum: ['import', 'export'],
      required: true 
    },
    date: { type: Date, required: true },
    fromCountry: { type: String, required: true },
    toCountry: { type: String, required: true },
    customsDocuments: [{ type: String }],
    notes: { type: String }
  }],
  inspections: [{ type: Schema.Types.ObjectId, ref: 'Inspection' }],
  valueHistory: [{
    date: { type: Date, required: true },
    value: { type: Number, required: true },
    currency: { type: String, required: true, default: 'EUR' },
    condition: { 
      type: String, 
      enum: ['excellent', 'good', 'average', 'fair', 'poor'],
      required: true 
    },
    source: { type: String, required: true }
  }],
  modifications: [{
    date: { type: Date, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    installer: { type: String },
    reversible: { type: Boolean, required: true },
    affectsWarranty: { type: Boolean, required: true },
    documents: [{ type: String }],
    photos: [{ type: String }]
  }],
  flags: [{
    type: { type: String, required: true },
    description: { type: String, required: true },
    severity: { 
      type: String, 
      enum: ['info', 'warning', 'critical'],
      required: true 
    },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    addedDate: { type: Date, required: true, default: Date.now },
    resolved: { type: Boolean, required: true, default: false },
    resolvedDate: { type: Date },
    notes: { type: String }
  }],
  summaryData: {
    numberOfOwners: { type: Number, required: true, default: 0 },
    numberOfAccidents: { type: Number, required: true, default: 0 },
    totalServiceRecords: { type: Number, required: true, default: 0 },
    averageAnnualMileage: { type: Number },
    lastKnownMileage: { type: Number },
    lastKnownMileageDate: { type: Date },
    hasOpenRecalls: { type: Boolean, required: true, default: false },
    maintenanceScore: { type: Number, min: 0, max: 100 },
    historyScore: { type: Number, min: 0, max: 100 }
  },
  isVerified: { type: Boolean, default: false },
  verificationDate: { type: Date },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Create indexes for query performance
VehicleHistorySchema.index({ vin: 1 });
VehicleHistorySchema.index({ 'ownership.verified': 1 });
VehicleHistorySchema.index({ 'summaryData.numberOfAccidents': 1 });
VehicleHistorySchema.index({ 'summaryData.historyScore': 1 });

// Create a pre-save hook to update summary data
VehicleHistorySchema.pre('save', function(next) {
  // Calculate number of owners
  if (this.ownership) {
    this.summaryData.numberOfOwners = this.ownership.length;
  }
  
  // Calculate number of accidents (incidents of type 'accident')
  if (this.incidents) {
    this.summaryData.numberOfAccidents = this.incidents.filter(
      incident => incident.type === 'accident'
    ).length;
  }
  
  // Calculate total service records
  if (this.services) {
    this.summaryData.totalServiceRecords = this.services.length;
  }
  
  // Check for open recalls
  if (this.recalls && this.recalls.length > 0) {
    this.summaryData.hasOpenRecalls = this.recalls.some(recall => recall.status === 'open');
  }
  
  // Calculate last known mileage
  if (this.odometerReadings && this.odometerReadings.length > 0) {
    // Sort by date descending
    const sortedReadings = [...this.odometerReadings].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Get the most recent reading
    const latestReading = sortedReadings[0];
    this.summaryData.lastKnownMileage = latestReading.reading;
    this.summaryData.lastKnownMileageDate = latestReading.date;
    
    // Calculate average annual mileage if we have enough data
    if (sortedReadings.length > 1) {
      const oldestReading = sortedReadings[sortedReadings.length - 1];
      const newestReading = sortedReadings[0];
      
      // Get time difference in years
      const timeDiffMs = new Date(newestReading.date).getTime() - new Date(oldestReading.date).getTime();
      const timeDiffYears = timeDiffMs / (1000 * 60 * 60 * 24 * 365);
      
      // If we have meaningful time difference (more than a month)
      if (timeDiffYears > 0.08) {
        const mileageDiff = newestReading.reading - oldestReading.reading;
        this.summaryData.averageAnnualMileage = Math.round(mileageDiff / timeDiffYears);
      }
    }
  }
  
  next();
});

// Create the VehicleHistory model if it doesn't already exist
const VehicleHistory = mongoose.models.VehicleHistory || mongoose.model<IVehicleHistory>('VehicleHistory', VehicleHistorySchema);

export default VehicleHistory as Model<IVehicleHistory>;
