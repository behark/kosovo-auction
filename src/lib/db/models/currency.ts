import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICurrency extends Document {
  code: string;          // ISO 4217 currency code (e.g., EUR, USD, GBP)
  name: string;          // Full name (e.g., Euro, US Dollar, British Pound)
  symbol: string;        // Currency symbol (e.g., €, $, £)
  decimals: number;      // Number of decimal places typically used
  exchangeRate: number;  // Exchange rate against base currency (EUR)
  lastUpdated: Date;     // When the exchange rate was last updated
  isActive: boolean;     // Whether the currency is currently supported
  countries: string[];   // ISO country codes where this currency is used
  isDefault: boolean;    // Whether this is the platform's default currency
  createdAt: Date;
  updatedAt: Date;
}

const CurrencySchema = new Schema<ICurrency>({
  code: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  decimals: { type: Number, required: true, default: 2 },
  exchangeRate: { type: Number, required: true },
  lastUpdated: { type: Date, required: true, default: Date.now },
  isActive: { type: Boolean, default: true },
  countries: [{ type: String, uppercase: true }],
  isDefault: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Ensure only one default currency
CurrencySchema.pre('save', async function(next) {
  // If this currency is being set as default
  if (this.isDefault) {
    // Find any other currencies marked as default and unmark them
    await mongoose.models.Currency.updateMany(
      { _id: { $ne: this._id }, isDefault: true },
      { $set: { isDefault: false } }
    );
  }
  next();
});

// Create indexes
CurrencySchema.index({ code: 1 });
CurrencySchema.index({ isDefault: 1 });

// Create the Currency model if it doesn't already exist
const Currency = mongoose.models.Currency || mongoose.model<ICurrency>('Currency', CurrencySchema);

export default Currency as Model<ICurrency>;
