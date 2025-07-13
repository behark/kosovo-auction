import dbConnect from '@/lib/db/mongodb';
import { 
  Language, 
  TranslationNamespace, 
  TranslationKey,
  ILanguage,
  ITranslationNamespace,
  ITranslationKey
} from '@/lib/db/models/language';
import mongoose, { FilterQuery } from 'mongoose';

export class LanguageService {
  /**
   * Get all available languages
   */
  static async getAllLanguages(activeOnly: boolean = true): Promise<ILanguage[]> {
    await dbConnect();
    
    const query: FilterQuery<ILanguage> = {};
    if (activeOnly) {
      query.isActive = true;
    }
    
    return await Language.find(query)
      .sort({ order: 1, englishName: 1 })
      .lean();
  }
  
  /**
   * Get a specific language by code
   */
  static async getLanguageByCode(code: string): Promise<ILanguage> {
    await dbConnect();
    
    const language = await Language.findOne({ code: code.toLowerCase() }).lean();
    if (!language) {
      throw new Error(`Language with code "${code}" not found`);
    }
    
    return language;
  }
  
  /**
   * Get the default language
   */
  static async getDefaultLanguage(): Promise<ILanguage> {
    await dbConnect();
    
    const language = await Language.findOne({ isDefault: true }).lean();
    if (!language) {
      // If no default language is set, return the first active language
      const firstActive = await Language.findOne({ isActive: true }).lean();
      
      if (!firstActive) {
        throw new Error('No active languages found in the system');
      }
      
      return firstActive;
    }
    
    return language;
  }
  
  /**
   * Create a new language
   */
  static async createLanguage(
    code: string,
    name: string,
    englishName: string,
    flag: string,
    options: {
      isActive?: boolean;
      isDefault?: boolean;
      direction?: 'ltr' | 'rtl';
      dateFormat?: string;
      timeFormat?: string;
      order?: number;
    } = {}
  ): Promise<ILanguage> {
    await dbConnect();
    
    // Check if language already exists
    const existing = await Language.findOne({ code: code.toLowerCase() });
    if (existing) {
      throw new Error(`Language with code "${code}" already exists`);
    }
    
    const language = new Language({
      code: code.toLowerCase(),
      name,
      englishName,
      flag,
      isActive: options.isActive !== undefined ? options.isActive : true,
      isDefault: options.isDefault !== undefined ? options.isDefault : false,
      direction: options.direction || 'ltr',
      dateFormat: options.dateFormat || 'MM/DD/YYYY',
      timeFormat: options.timeFormat || 'HH:mm',
      translationProgress: 0,
      order: options.order || 0
    });
    
    await language.save();
    return language;
  }
  
  /**
   * Update an existing language
   */
  static async updateLanguage(
    code: string,
    updates: {
      name?: string;
      englishName?: string;
      flag?: string;
      isActive?: boolean;
      isDefault?: boolean;
      direction?: 'ltr' | 'rtl';
      dateFormat?: string;
      timeFormat?: string;
      translationProgress?: number;
      order?: number;
    }
  ): Promise<ILanguage> {
    await dbConnect();
    
    const language = await Language.findOne({ code: code.toLowerCase() });
    if (!language) {
      throw new Error(`Language with code "${code}" not found`);
    }
    
    // Update fields
    if (updates.name) language.name = updates.name;
    if (updates.englishName) language.englishName = updates.englishName;
    if (updates.flag) language.flag = updates.flag;
    if (updates.isActive !== undefined) language.isActive = updates.isActive;
    if (updates.isDefault !== undefined) language.isDefault = updates.isDefault;
    if (updates.direction) language.direction = updates.direction;
    if (updates.dateFormat) language.dateFormat = updates.dateFormat;
    if (updates.timeFormat) language.timeFormat = updates.timeFormat;
    if (updates.translationProgress !== undefined) {
      language.translationProgress = Math.max(0, Math.min(100, updates.translationProgress));
    }
    if (updates.order !== undefined) language.order = updates.order;
    
    await language.save();
    return language;
  }
  
  /**
   * Set a language as the default
   */
  static async setDefaultLanguage(code: string): Promise<ILanguage> {
    await dbConnect();
    
    const language = await Language.findOne({ code: code.toLowerCase() });
    if (!language) {
      throw new Error(`Language with code "${code}" not found`);
    }
    
    language.isDefault = true;
    await language.save();
    
    return language;
  }
  
  /**
   * Delete a language
   */
  static async deleteLanguage(code: string): Promise<boolean> {
    await dbConnect();
    
    // Check if it's the default language
    const language = await Language.findOne({ code: code.toLowerCase() });
    if (!language) {
      return false;
    }
    
    if (language.isDefault) {
      throw new Error('Cannot delete the default language');
    }
    
    // Delete the language
    await Language.deleteOne({ _id: language._id });
    
    // Note: We don't delete translations as they might be useful to keep
    return true;
  }
  
  /**
   * Calculate translation progress for a language
   */
  static async calculateTranslationProgress(languageCode: string): Promise<number> {
    await dbConnect();
    
    // Get total number of translation keys
    const totalKeys = await TranslationKey.countDocuments();
    if (totalKeys === 0) return 100; // If no keys, progress is 100%
    
    // Count how many keys have translations for this language
    const translatedKeys = await TranslationKey.countDocuments({
      [`translations.${languageCode}`]: { $exists: true }
    });
    
    // Calculate percentage
    const progress = Math.floor((translatedKeys / totalKeys) * 100);
    
    // Update the language's progress
    await Language.updateOne(
      { code: languageCode.toLowerCase() },
      { translationProgress: progress }
    );
    
    return progress;
  }
  
  /**
   * Create a new translation namespace
   */
  static async createNamespace(
    namespace: string,
    description: string,
    isSystem: boolean = false
  ): Promise<ITranslationNamespace> {
    await dbConnect();
    
    // Check if namespace already exists
    const normalizedNamespace = namespace.toLowerCase().trim();
    
    const existing = await TranslationNamespace.findOne({ namespace: normalizedNamespace });
    if (existing) {
      throw new Error(`Namespace "${namespace}" already exists`);
    }
    
    const newNamespace = new TranslationNamespace({
      namespace: normalizedNamespace,
      description,
      isSystem
    });
    
    await newNamespace.save();
    return newNamespace;
  }
  
  /**
   * Get all translation namespaces
   */
  static async getAllNamespaces(): Promise<ITranslationNamespace[]> {
    await dbConnect();
    return await TranslationNamespace.find().sort({ namespace: 1 }).lean();
  }
  
  /**
   * Add a translation key
   */
  static async addTranslationKey(
    namespace: string,
    key: string,
    defaultValue: string,
    options: {
      description?: string;
      isSystemKey?: boolean;
      tags?: string[];
      translations?: Record<string, string>;
    } = {}
  ): Promise<ITranslationKey> {
    await dbConnect();
    
    const normalizedNamespace = namespace.toLowerCase().trim();
    
    // Check if namespace exists
    const namespaceExists = await TranslationNamespace.exists({ namespace: normalizedNamespace });
    if (!namespaceExists) {
      throw new Error(`Namespace "${namespace}" does not exist`);
    }
    
    // Check if key already exists in this namespace
    const existingKey = await TranslationKey.findOne({
      namespace: normalizedNamespace,
      key
    });
    
    if (existingKey) {
      throw new Error(`Translation key "${key}" already exists in namespace "${namespace}"`);
    }
    
    // Get default language
    const defaultLanguage = await Language.findOne({ isDefault: true });
    if (!defaultLanguage) {
      throw new Error('No default language is set');
    }
    
    // Create translations map
    const translations = {};
    
    // Add default value for default language
    translations[defaultLanguage.code] = {
      value: defaultValue,
      isVerified: true,
      lastUpdated: new Date()
    };
    
    // Add other translations if provided
    if (options.translations) {
      for (const [langCode, value] of Object.entries(options.translations)) {
        if (langCode !== defaultLanguage.code) {
          translations[langCode] = {
            value,
            isVerified: false,
            lastUpdated: new Date()
          };
        }
      }
    }
    
    // Create the translation key
    const translationKey = new TranslationKey({
      key,
      namespace: normalizedNamespace,
      description: options.description,
      isSystemKey: options.isSystemKey !== undefined ? options.isSystemKey : false,
      translations,
      tags: options.tags || []
    });
    
    await translationKey.save();
    return translationKey;
  }
  
  /**
   * Update a translation
   */
  static async updateTranslation(
    namespace: string,
    key: string,
    languageCode: string,
    value: string,
    userId?: string
  ): Promise<ITranslationKey> {
    await dbConnect();
    
    const normalizedNamespace = namespace.toLowerCase().trim();
    
    // Find the translation key
    const translationKey = await TranslationKey.findOne({
      namespace: normalizedNamespace,
      key
    });
    
    if (!translationKey) {
      throw new Error(`Translation key "${key}" not found in namespace "${namespace}"`);
    }
    
    // Check if language exists
    const language = await Language.findOne({ code: languageCode.toLowerCase() });
    if (!language) {
      throw new Error(`Language with code "${languageCode}" not found`);
    }
    
    // Initialize translations map if it doesn't exist
    if (!translationKey.translations) {
      translationKey.translations = new Map();
    }
    
    // Create or update translation
    translationKey.translations.set(languageCode, {
      value,
      isVerified: !!userId, // Mark as verified if userId is provided
      verifiedBy: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      lastUpdated: new Date()
    });
    
    await translationKey.save();
    
    // Recalculate translation progress
    this.calculateTranslationProgress(languageCode).catch(console.error);
    
    return translationKey;
  }
  
  /**
   * Get translations for a namespace in a specific language
   */
  static async getNamespaceTranslations(
    namespace: string,
    languageCode: string,
    fallbackLanguageCode?: string
  ): Promise<Record<string, string>> {
    await dbConnect();
    
    const normalizedNamespace = namespace.toLowerCase().trim();
    const normalizedLanguageCode = languageCode.toLowerCase();
    
    // Get all translation keys for this namespace
    const keys = await TranslationKey.find({ namespace: normalizedNamespace }).lean();
    
    // Prepare result object
    const translations: Record<string, string> = {};
    
    // For each key, get the translation in the requested language or fallback
    for (const translationKey of keys) {
      if (translationKey.translations && translationKey.translations[normalizedLanguageCode]) {
        // Translation exists in requested language
        translations[translationKey.key] = translationKey.translations[normalizedLanguageCode].value;
      } else if (fallbackLanguageCode && translationKey.translations && translationKey.translations[fallbackLanguageCode]) {
        // Use fallback language
        translations[translationKey.key] = translationKey.translations[fallbackLanguageCode].value;
      } else {
        // No translation found, use key as value
        translations[translationKey.key] = translationKey.key;
      }
    }
    
    return translations;
  }
  
  /**
   * Export all translations for a language
   */
  static async exportLanguageTranslations(
    languageCode: string
  ): Promise<Record<string, Record<string, string>>> {
    await dbConnect();
    
    const normalizedLanguageCode = languageCode.toLowerCase();
    
    // Get all namespaces
    const namespaces = await TranslationNamespace.find().lean();
    
    // Prepare result object
    const result: Record<string, Record<string, string>> = {};
    
    // For each namespace, get translations
    for (const namespaceDoc of namespaces) {
      result[namespaceDoc.namespace] = await this.getNamespaceTranslations(
        namespaceDoc.namespace,
        normalizedLanguageCode
      );
    }
    
    return result;
  }
  
  /**
   * Import translations for a language
   */
  static async importLanguageTranslations(
    languageCode: string,
    translations: Record<string, Record<string, string>>,
    userId?: string
  ): Promise<{ success: number; failed: number }> {
    await dbConnect();
    
    const normalizedLanguageCode = languageCode.toLowerCase();
    
    let successCount = 0;
    let failedCount = 0;
    
    // Check if language exists
    const language = await Language.findOne({ code: normalizedLanguageCode });
    if (!language) {
      throw new Error(`Language with code "${languageCode}" not found`);
    }
    
    // For each namespace in the import data
    for (const [namespace, keys] of Object.entries(translations)) {
      // Check if namespace exists
      const namespaceDoc = await TranslationNamespace.findOne({ namespace: namespace.toLowerCase() });
      
      if (!namespaceDoc) {
        // Skip this namespace
        failedCount += Object.keys(keys).length;
        continue;
      }
      
      // For each key in this namespace
      for (const [key, value] of Object.entries(keys)) {
        try {
          // Find the translation key
          const translationKey = await TranslationKey.findOne({
            namespace: namespace.toLowerCase(),
            key
          });
          
          if (!translationKey) {
            // Skip this key
            failedCount++;
            continue;
          }
          
          // Update translation
          if (!translationKey.translations) {
            translationKey.translations = new Map();
          }
          
          translationKey.translations.set(normalizedLanguageCode, {
            value,
            isVerified: !!userId,
            verifiedBy: userId ? new mongoose.Types.ObjectId(userId) : undefined,
            lastUpdated: new Date()
          });
          
          await translationKey.save();
          successCount++;
        } catch (error) {
          failedCount++;
        }
      }
    }
    
    // Recalculate translation progress
    this.calculateTranslationProgress(languageCode).catch(console.error);
    
    return { success: successCount, failed: failedCount };
  }
  
  /**
   * Get missing translations for a language compared to the default language
   */
  static async getMissingTranslations(
    languageCode: string
  ): Promise<Array<{ namespace: string; key: string; defaultValue: string }>> {
    await dbConnect();
    
    const normalizedLanguageCode = languageCode.toLowerCase();
    
    // Get default language
    const defaultLanguage = await Language.findOne({ isDefault: true });
    if (!defaultLanguage) {
      throw new Error('No default language is set');
    }
    
    if (normalizedLanguageCode === defaultLanguage.code) {
      return []; // No missing translations for default language
    }
    
    // Find all keys that have default language translations but not target language
    const keys = await TranslationKey.find({
      [`translations.${defaultLanguage.code}`]: { $exists: true },
      [`translations.${normalizedLanguageCode}`]: { $exists: false }
    }).lean();
    
    return keys.map(key => ({
      namespace: key.namespace,
      key: key.key,
      defaultValue: key.translations[defaultLanguage.code].value
    }));
  }
  
  /**
   * Search for translation keys
   */
  static async searchTranslationKeys(
    query: string,
    options: {
      namespace?: string;
      tags?: string[];
      includeValues?: boolean;
      language?: string;
    } = {}
  ): Promise<Array<{
    namespace: string;
    key: string;
    description?: string;
    tags?: string[];
    value?: string;
  }>> {
    await dbConnect();
    
    const filter: FilterQuery<ITranslationKey> = {};
    
    if (options.namespace) {
      filter.namespace = options.namespace.toLowerCase();
    }
    
    if (options.tags && options.tags.length > 0) {
      filter.tags = { $in: options.tags };
    }
    
    // Text search
    if (query) {
      filter.$or = [
        { key: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
      
      // Also search in translations if language is provided
      if (options.language && options.includeValues) {
        filter.$or.push({
          [`translations.${options.language}.value`]: { $regex: query, $options: 'i' }
        });
      }
    }
    
    const keys = await TranslationKey.find(filter).lean();
    
    return keys.map(key => {
      const result: {
        namespace: string;
        key: string;
        description?: string;
        tags?: string[];
        value?: string;
      } = {
        namespace: key.namespace,
        key: key.key,
        description: key.description,
        tags: key.tags
      };
      
      // Include translation value if requested
      if (options.includeValues && options.language && 
          key.translations && key.translations[options.language]) {
        result.value = key.translations[options.language].value;
      }
      
      return result;
    });
  }
  
  /**
   * Initialize system with default language and namespaces
   */
  static async initializeSystem(): Promise<void> {
    await dbConnect();
    
    // Check if any languages exist
    const langCount = await Language.countDocuments();
    
    if (langCount === 0) {
      // Create default English language
      await this.createLanguage('en', 'English', 'English', '🇬🇧', { isDefault: true });
      
      // Create system namespaces
      await this.createNamespace('common', 'Common strings used throughout the application', true);
      await this.createNamespace('auction', 'Auction-related translations', true);
      await this.createNamespace('vehicle', 'Vehicle-related translations', true);
      await this.createNamespace('user', 'User and authentication related translations', true);
      await this.createNamespace('support', 'Support system translations', true);
      await this.createNamespace('admin', 'Admin panel translations', true);
      
      // Add some basic translation keys
      await this.addTranslationKey('common', 'app_name', 'BidVista', { 
        isSystemKey: true,
        description: 'The name of the application'
      });
      
      await this.addTranslationKey('common', 'language', 'Language', {
        isSystemKey: true,
        description: 'Language selection label'
      });
      
      await this.addTranslationKey('common', 'save', 'Save', {
        isSystemKey: true
      });
      
      await this.addTranslationKey('common', 'cancel', 'Cancel', {
        isSystemKey: true
      });
      
      await this.addTranslationKey('common', 'confirm', 'Confirm', {
        isSystemKey: true
      });
      
      await this.addTranslationKey('common', 'error', 'Error', {
        isSystemKey: true
      });
      
      await this.addTranslationKey('common', 'success', 'Success', {
        isSystemKey: true
      });
    }
  }
}

export default LanguageService;
