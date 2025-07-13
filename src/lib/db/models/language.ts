import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILanguage extends Document {
  code: string;           // ISO 639-1 code (e.g., 'en', 'de', 'sq')
  name: string;           // Native name (e.g., 'English', 'Deutsch', 'Shqip')
  englishName: string;    // Name in English
  isActive: boolean;      // Whether this language is available on the platform
  isDefault: boolean;     // Whether this is the default language
  direction: 'ltr' | 'rtl'; // Text direction (left-to-right or right-to-left)
  flag: string;           // Country flag code or URL
  dateFormat: string;     // Default date format (e.g., 'MM/DD/YYYY')
  timeFormat: string;     // Default time format (e.g., 'HH:mm')
  translationProgress: number; // Percentage of UI translated (0-100)
  order: number;          // Display order
  createdAt: Date;
  updatedAt: Date;
}

export interface ITranslationNamespace extends Document {
  namespace: string;      // e.g., 'common', 'auction', 'vehicle'
  description: string;    // Description of this namespace
  isSystem: boolean;      // Whether this namespace is a system namespace
  createdAt: Date;
  updatedAt: Date;
}

export interface ITranslationKey extends Document {
  key: string;            // Translation key
  namespace: string;      // The namespace this key belongs to
  description?: string;   // Optional description/context for translators
  isSystemKey: boolean;   // Whether this is a system key (not editable by users)
  translations: Record<string, {
    value: string;        // Translated text
    isVerified: boolean;  // Whether this translation has been verified
    verifiedBy?: Schema.Types.ObjectId;
    lastUpdated: Date;
  }>;
  tags?: string[];        // Optional tags for grouping/filtering
  createdAt: Date;
  updatedAt: Date;
}

const LanguageSchema = new Schema<ILanguage>({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: /^[a-z]{2}(-[a-z]{2,4})?$/  // e.g., 'en', 'en-us', 'zh-hant'
  },
  name: { type: String, required: true },
  englishName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false },
  direction: { 
    type: String, 
    enum: ['ltr', 'rtl'],
    default: 'ltr',
    required: true
  },
  flag: { type: String, required: true },
  dateFormat: { type: String, default: 'MM/DD/YYYY' },
  timeFormat: { type: String, default: 'HH:mm' },
  translationProgress: { 
    type: Number, 
    min: 0,
    max: 100,
    default: 0
  },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

const TranslationNamespaceSchema = new Schema<ITranslationNamespace>({
  namespace: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { type: String, required: true },
  isSystem: { type: Boolean, default: false }
}, {
  timestamps: true
});

const TranslationKeySchema = new Schema<ITranslationKey>({
  key: { 
    type: String, 
    required: true,
    trim: true
  },
  namespace: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  description: { type: String },
  isSystemKey: { type: Boolean, default: false },
  translations: {
    type: Map,
    of: new Schema({
      value: { type: String, required: true },
      isVerified: { type: Boolean, default: false },
      verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      lastUpdated: { type: Date, default: Date.now }
    })
  },
  tags: [{ type: String }]
}, {
  timestamps: true
});

// Create a compound unique index on namespace + key
TranslationKeySchema.index({ namespace: 1, key: 1 }, { unique: true });

// Ensure only one default language
LanguageSchema.pre('save', async function(next) {
  if (this.isDefault) {
    // Find any other languages marked as default and unmark them
    await mongoose.models.Language.updateMany(
      { _id: { $ne: this._id }, isDefault: true },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Create the models if they don't already exist
const Language = mongoose.models.Language || mongoose.model<ILanguage>('Language', LanguageSchema);

const TranslationNamespace = mongoose.models.TranslationNamespace || 
  mongoose.model<ITranslationNamespace>('TranslationNamespace', TranslationNamespaceSchema);

const TranslationKey = mongoose.models.TranslationKey || 
  mongoose.model<ITranslationKey>('TranslationKey', TranslationKeySchema);

export { Language, TranslationNamespace, TranslationKey };
