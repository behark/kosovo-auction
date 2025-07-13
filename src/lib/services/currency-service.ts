import Currency, { ICurrency } from '@/lib/db/models/currency';
import dbConnect from '@/lib/db/mongodb';

export class CurrencyService {
  /**
   * Fetches all active currencies
   */
  static async getAllCurrencies(): Promise<ICurrency[]> {
    await dbConnect();
    return await Currency.find({ isActive: true }).sort({ code: 1 }).lean();
  }

  /**
   * Gets the default currency
   */
  static async getDefaultCurrency(): Promise<ICurrency> {
    await dbConnect();
    const defaultCurrency = await Currency.findOne({ isDefault: true }).lean();
    
    if (!defaultCurrency) {
      // If no default is set, use EUR as fallback
      return await Currency.findOne({ code: 'EUR' }).lean() || 
        await Currency.findOne().lean() || // Take any currency if EUR not found
        { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, exchangeRate: 1, lastUpdated: new Date(), isActive: true, countries: ['EU'] };
    }
    
    return defaultCurrency;
  }

  /**
   * Gets a currency by its code
   */
  static async getCurrencyByCode(code: string): Promise<ICurrency | null> {
    await dbConnect();
    return await Currency.findOne({ code: code.toUpperCase(), isActive: true }).lean();
  }

  /**
   * Converts an amount from one currency to another
   */
  static async convertCurrency(
    amount: number,
    fromCurrencyCode: string,
    toCurrencyCode: string
  ): Promise<{ 
    convertedAmount: number; 
    exchangeRate: number;
    fromCurrency: ICurrency;
    toCurrency: ICurrency;
  }> {
    await dbConnect();
    
    // Get currencies
    const fromCurrency = await Currency.findOne({ 
      code: fromCurrencyCode.toUpperCase(),
      isActive: true
    }).lean();
    
    const toCurrency = await Currency.findOne({ 
      code: toCurrencyCode.toUpperCase(),
      isActive: true
    }).lean();
    
    if (!fromCurrency) {
      throw new Error(`Currency not found: ${fromCurrencyCode}`);
    }
    
    if (!toCurrency) {
      throw new Error(`Currency not found: ${toCurrencyCode}`);
    }
    
    // Calculate exchange rate and converted amount
    // First convert to base currency (EUR), then to target currency
    const exchangeRate = toCurrency.exchangeRate / fromCurrency.exchangeRate;
    const convertedAmount = amount * exchangeRate;
    
    return {
      convertedAmount: Number(convertedAmount.toFixed(toCurrency.decimals)),
      exchangeRate: Number(exchangeRate.toFixed(6)),
      fromCurrency,
      toCurrency
    };
  }

  /**
   * Formats a number as a currency string
   */
  static formatCurrency(amount: number, currency: ICurrency): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    });
    
    return formatter.format(amount);
  }

  /**
   * Updates exchange rates from an external API
   * This would typically be called by a scheduled job
   */
  static async updateExchangeRates(): Promise<boolean> {
    try {
      await dbConnect();
      
      // In a real implementation, this would call an external currency API
      // For example: Open Exchange Rates, Fixer.io, or European Central Bank API
      
      // Simulated API response with exchange rates against EUR as the base
      const rates = {
        EUR: 1,
        USD: 1.09,
        GBP: 0.85,
        CHF: 0.97,
        JPY: 158.75,
        AUD: 1.63,
        CAD: 1.49,
        CNY: 7.86,
        SEK: 11.45,
        NOK: 11.23,
        RUB: 96.82,
        TRY: 34.12,
        MKD: 61.70, // North Macedonia Denar
        ALL: 103.50, // Albanian Lek
        RSD: 117.20, // Serbian Dinar
        BAM: 1.96, // Bosnia and Herzegovina Mark
        HRK: 7.53  // Croatian Kuna
      };
      
      // Update each currency in our database
      const now = new Date();
      const bulkOps = [];
      
      for (const [code, rate] of Object.entries(rates)) {
        bulkOps.push({
          updateOne: {
            filter: { code },
            update: { $set: { exchangeRate: rate, lastUpdated: now } },
            upsert: false
          }
        });
      }
      
      if (bulkOps.length > 0) {
        await Currency.bulkWrite(bulkOps);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating exchange rates:', error);
      return false;
    }
  }

  /**
   * Seeds initial currency data if the collection is empty
   */
  static async seedCurrencyData(): Promise<void> {
    await dbConnect();
    const count = await Currency.countDocuments();
    
    if (count === 0) {
      // Initialize with common currencies
      const currencies = [
        {
          code: 'EUR',
          name: 'Euro',
          symbol: '€',
          decimals: 2,
          exchangeRate: 1,
          isActive: true,
          isDefault: true,
          countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'FI', 'IE', 'SK', 'SI', 'LV', 'LT', 'EE', 'LU', 'MT', 'CY', 'GR']
        },
        {
          code: 'USD',
          name: 'US Dollar',
          symbol: '$',
          decimals: 2,
          exchangeRate: 1.09,
          isActive: true,
          isDefault: false,
          countries: ['US', 'EC', 'SV', 'PA', 'ZW']
        },
        {
          code: 'GBP',
          name: 'British Pound',
          symbol: '£',
          decimals: 2,
          exchangeRate: 0.85,
          isActive: true,
          isDefault: false,
          countries: ['GB']
        },
        {
          code: 'CHF',
          name: 'Swiss Franc',
          symbol: 'CHF',
          decimals: 2,
          exchangeRate: 0.97,
          isActive: true,
          isDefault: false,
          countries: ['CH', 'LI']
        },
        {
          code: 'MKD',
          name: 'North Macedonia Denar',
          symbol: 'ден',
          decimals: 2,
          exchangeRate: 61.70,
          isActive: true,
          isDefault: false,
          countries: ['MK']
        },
        {
          code: 'ALL',
          name: 'Albanian Lek',
          symbol: 'L',
          decimals: 2,
          exchangeRate: 103.50,
          isActive: true,
          isDefault: false,
          countries: ['AL']
        },
        {
          code: 'RSD',
          name: 'Serbian Dinar',
          symbol: 'РСД',
          decimals: 2,
          exchangeRate: 117.20,
          isActive: true,
          isDefault: false,
          countries: ['RS']
        }
      ];
      
      await Currency.insertMany(currencies);
    }
  }
}

// Export singleton instance
export default CurrencyService;
