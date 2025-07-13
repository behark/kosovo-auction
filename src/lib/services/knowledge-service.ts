import dbConnect from '@/lib/db/mongodb';
import { 
  KnowledgeArticle, 
  KnowledgeCategory,
  IKnowledgeArticle, 
  IKnowledgeCategory 
} from '@/lib/db/models/knowledge-base';
import mongoose, { FilterQuery } from 'mongoose';

export interface ArticleFilters {
  category?: string;
  subcategory?: string;
  tags?: string[];
  isPublished?: boolean;
  search?: string;
  author?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export class KnowledgeService {
  /**
   * Create a new knowledge base article
   */
  static async createArticle(
    title: string,
    content: string,
    category: string,
    authorId: string,
    options: {
      excerpt?: string;
      subcategory?: string;
      tags?: string[];
      attachments?: Array<{
        title: string;
        filename: string;
        url: string;
        contentType: string;
        size: number;
      }>;
      isPublished?: boolean;
      slug?: string;
      relatedArticleIds?: string[];
      relatedEntities?: Array<{
        entityType: string;
        entityId: string;
      }>;
      translations?: Record<string, {
        title: string;
        content: string;
        excerpt?: string;
      }>;
    } = {}
  ): Promise<IKnowledgeArticle> {
    await dbConnect();
    
    // Check if category exists
    const categoryExists = await KnowledgeCategory.exists({ 
      $or: [
        { slug: category }, 
        { name: category }
      ]
    });
    
    if (!categoryExists) {
      throw new Error(`Category ${category} does not exist`);
    }
    
    // Generate slug if not provided
    const slug = options.slug || 
      title.toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    
    // Check for slug uniqueness
    const existingWithSlug = await KnowledgeArticle.findOne({ slug });
    if (existingWithSlug) {
      // Append a number to make the slug unique
      const slugBase = slug;
      let counter = 1;
      let newSlug = `${slugBase}-${counter}`;
      
      while (await KnowledgeArticle.findOne({ slug: newSlug })) {
        counter++;
        newSlug = `${slugBase}-${counter}`;
      }
      
      // Use the unique slug
      slug = newSlug;
    }
    
    // Process related articles if provided
    const relatedArticles = [];
    if (options.relatedArticleIds && options.relatedArticleIds.length > 0) {
      for (const id of options.relatedArticleIds) {
        relatedArticles.push(new mongoose.Types.ObjectId(id));
      }
    }
    
    // Process related entities if provided
    const relatedEntities = [];
    if (options.relatedEntities && options.relatedEntities.length > 0) {
      for (const entity of options.relatedEntities) {
        relatedEntities.push({
          entityType: entity.entityType,
          entityId: new mongoose.Types.ObjectId(entity.entityId)
        });
      }
    }
    
    // Create the article
    const article = new KnowledgeArticle({
      title,
      slug,
      content,
      excerpt: options.excerpt,
      category,
      subcategory: options.subcategory,
      tags: options.tags || [],
      author: new mongoose.Types.ObjectId(authorId),
      relatedArticles,
      relatedEntities,
      attachments: options.attachments || [],
      translations: options.translations,
      isPublished: options.isPublished || false,
      publishedAt: options.isPublished ? new Date() : undefined,
      version: 1
    });
    
    await article.save();
    return article;
  }
  
  /**
   * Update an existing knowledge article
   */
  static async updateArticle(
    articleId: string,
    userId: string,
    updates: {
      title?: string;
      content?: string;
      excerpt?: string;
      category?: string;
      subcategory?: string;
      tags?: string[];
      isPublished?: boolean;
      relatedArticleIds?: string[];
      changeNotes?: string;
      attachments?: Array<{
        title: string;
        filename: string;
        url: string;
        contentType: string;
        size: number;
      }>;
      translations?: Record<string, {
        title: string;
        content: string;
        excerpt?: string;
      }>;
    }
  ): Promise<IKnowledgeArticle> {
    await dbConnect();
    
    const article = await KnowledgeArticle.findById(articleId);
    if (!article) {
      throw new Error('Article not found');
    }
    
    // Check if category exists if changing it
    if (updates.category) {
      const categoryExists = await KnowledgeCategory.exists({ 
        $or: [
          { slug: updates.category }, 
          { name: updates.category }
        ] 
      });
      
      if (!categoryExists) {
        throw new Error(`Category ${updates.category} does not exist`);
      }
    }
    
    // Set the current user for revision tracking
    article.set('currentUserId', new mongoose.Types.ObjectId(userId));
    article.set('changeNotes', updates.changeNotes || 'Updated article');
    
    // Update fields
    if (updates.title) article.title = updates.title;
    if (updates.content) article.content = updates.content;
    if (updates.excerpt !== undefined) article.excerpt = updates.excerpt;
    if (updates.category) article.category = updates.category;
    if (updates.subcategory !== undefined) article.subcategory = updates.subcategory;
    if (updates.tags) article.tags = updates.tags;
    
    if (updates.isPublished !== undefined && article.isPublished !== updates.isPublished) {
      article.isPublished = updates.isPublished;
      if (updates.isPublished && !article.publishedAt) {
        article.publishedAt = new Date();
      }
    }
    
    // Update related articles if provided
    if (updates.relatedArticleIds) {
      article.relatedArticles = updates.relatedArticleIds.map(
        id => new mongoose.Types.ObjectId(id)
      );
    }
    
    // Update attachments if provided
    if (updates.attachments) {
      article.attachments = updates.attachments;
    }
    
    // Update translations if provided
    if (updates.translations) {
      article.translations = updates.translations;
    }
    
    await article.save();
    return article;
  }
  
  /**
   * Get an article by ID or slug
   */
  static async getArticle(
    idOrSlug: string,
    options: {
      incrementViewCount?: boolean;
      includeRelated?: boolean;
      language?: string;
    } = {}
  ): Promise<IKnowledgeArticle> {
    await dbConnect();
    
    // Determine if the parameter is an ID or slug
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    
    // Find the article
    let query: FilterQuery<IKnowledgeArticle> = {};
    if (isObjectId) {
      query._id = idOrSlug;
    } else {
      query.slug = idOrSlug;
    }
    
    const article = await KnowledgeArticle.findOne(query)
      .populate('author', 'name email profileImage')
      .lean();
    
    if (!article) {
      throw new Error('Article not found');
    }
    
    // Increment view count if requested
    if (options.incrementViewCount) {
      await KnowledgeArticle.updateOne(
        { _id: article._id },
        { $inc: { viewCount: 1 } }
      );
      article.viewCount++;
    }
    
    // Fetch related articles if requested
    if (options.includeRelated && article.relatedArticles && article.relatedArticles.length > 0) {
      const relatedArticles = await KnowledgeArticle.find({
        _id: { $in: article.relatedArticles },
        isPublished: true
      })
        .select('title slug excerpt category tags')
        .lean();
      
      article.relatedArticles = relatedArticles;
    }
    
    // Return translated content if requested and available
    if (options.language && article.translations && article.translations[options.language]) {
      const translation = article.translations[options.language];
      
      return {
        ...article,
        title: translation.title || article.title,
        content: translation.content || article.content,
        excerpt: translation.excerpt || article.excerpt
      };
    }
    
    return article;
  }
  
  /**
   * Get articles with filtering and pagination
   */
  static async getArticles(
    filters: ArticleFilters = {},
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'updatedAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<{
    articles: IKnowledgeArticle[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    await dbConnect();
    
    // Build query filter
    const query: FilterQuery<IKnowledgeArticle> = {};
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    if (filters.subcategory) {
      query.subcategory = filters.subcategory;
    }
    
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    
    if (filters.isPublished !== undefined) {
      query.isPublished = filters.isPublished;
    }
    
    if (filters.author) {
      query.author = new mongoose.Types.ObjectId(filters.author);
    }
    
    // Handle related entity filtering
    if (filters.relatedEntityId || filters.relatedEntityType) {
      query.relatedEntities = {};
      
      if (filters.relatedEntityId) {
        query.relatedEntities.entityId = new mongoose.Types.ObjectId(filters.relatedEntityId);
      }
      
      if (filters.relatedEntityType) {
        query.relatedEntities.entityType = filters.relatedEntityType;
      }
    }
    
    // Handle text search
    if (filters.search) {
      query.$text = { $search: filters.search };
    }
    
    // Count total documents
    const total = await KnowledgeArticle.countDocuments(query);
    
    // Create sort options
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const articles = await KnowledgeArticle.find(query)
      .populate('author', 'name email profileImage')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    return {
      articles,
      total,
      page,
      limit,
      totalPages
    };
  }
  
  /**
   * Delete an article
   */
  static async deleteArticle(articleId: string): Promise<boolean> {
    await dbConnect();
    
    const result = await KnowledgeArticle.deleteOne({ _id: articleId });
    return result.deletedCount > 0;
  }
  
  /**
   * Record a vote on article helpfulness
   */
  static async recordHelpfulnessVote(
    articleId: string,
    isHelpful: boolean
  ): Promise<IKnowledgeArticle> {
    await dbConnect();
    
    const updateField = isHelpful ? 'helpfulVotes' : 'notHelpfulVotes';
    
    const article = await KnowledgeArticle.findByIdAndUpdate(
      articleId,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );
    
    if (!article) {
      throw new Error('Article not found');
    }
    
    return article;
  }
  
  /**
   * Get article revision history
   */
  static async getArticleRevisions(articleId: string): Promise<IKnowledgeArticle['revisions']> {
    await dbConnect();
    
    const article = await KnowledgeArticle.findById(articleId)
      .select('revisions')
      .populate('revisions.updatedBy', 'name email')
      .lean();
    
    if (!article) {
      throw new Error('Article not found');
    }
    
    return article.revisions || [];
  }
  
  /**
   * Restore article to a previous version
   */
  static async restoreArticleVersion(
    articleId: string,
    version: number,
    userId: string,
    note: string = 'Restored previous version'
  ): Promise<IKnowledgeArticle> {
    await dbConnect();
    
    const article = await KnowledgeArticle.findById(articleId);
    if (!article) {
      throw new Error('Article not found');
    }
    
    // Find the revision
    const revision = article.revisions?.find(rev => rev.version === version);
    if (!revision) {
      throw new Error(`Version ${version} not found`);
    }
    
    // Set the current user for revision tracking
    article.set('currentUserId', new mongoose.Types.ObjectId(userId));
    article.set('changeNotes', `${note} (restored version ${version})`);
    
    // Update content and title from the revision
    article.content = revision.content;
    article.title = revision.title;
    
    await article.save();
    return article;
  }
  
  /**
   * Mark article as reviewed
   */
  static async markArticleReviewed(
    articleId: string,
    userId: string
  ): Promise<IKnowledgeArticle> {
    await dbConnect();
    
    const article = await KnowledgeArticle.findByIdAndUpdate(
      articleId,
      {
        lastReviewedAt: new Date(),
        reviewedBy: new mongoose.Types.ObjectId(userId)
      },
      { new: true }
    );
    
    if (!article) {
      throw new Error('Article not found');
    }
    
    return article;
  }
  
  /**
   * Create a new category
   */
  static async createCategory(
    name: string,
    options: {
      description?: string;
      icon?: string;
      order?: number;
      subcategories?: Array<{
        name: string;
        description?: string;
        order?: number;
      }>;
      translations?: Record<string, {
        name: string;
        description?: string;
      }>;
    } = {}
  ): Promise<IKnowledgeCategory> {
    await dbConnect();
    
    // Generate slug
    const slug = name.toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    
    // Check if category with this name or slug already exists
    const existing = await KnowledgeCategory.findOne({
      $or: [{ name }, { slug }]
    });
    
    if (existing) {
      throw new Error(`Category with name '${name}' or slug '${slug}' already exists`);
    }
    
    // Process subcategories if provided
    const subcategories = [];
    if (options.subcategories && options.subcategories.length > 0) {
      for (const sub of options.subcategories) {
        const subSlug = sub.name.toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-');
          
        subcategories.push({
          name: sub.name,
          slug: subSlug,
          description: sub.description,
          order: sub.order || 0
        });
      }
    }
    
    // Create the category
    const category = new KnowledgeCategory({
      name,
      slug,
      description: options.description,
      icon: options.icon,
      order: options.order || 0,
      subcategories,
      isVisible: true,
      translations: options.translations
    });
    
    await category.save();
    return category;
  }
  
  /**
   * Update an existing category
   */
  static async updateCategory(
    categoryId: string,
    updates: {
      name?: string;
      description?: string;
      icon?: string;
      order?: number;
      isVisible?: boolean;
      subcategories?: Array<{
        name: string;
        slug?: string;
        description?: string;
        order?: number;
      }>;
      translations?: Record<string, {
        name: string;
        description?: string;
      }>;
    }
  ): Promise<IKnowledgeCategory> {
    await dbConnect();
    
    const category = await KnowledgeCategory.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Update basic fields
    if (updates.name) category.name = updates.name;
    if (updates.description !== undefined) category.description = updates.description;
    if (updates.icon !== undefined) category.icon = updates.icon;
    if (updates.order !== undefined) category.order = updates.order;
    if (updates.isVisible !== undefined) category.isVisible = updates.isVisible;
    if (updates.translations !== undefined) category.translations = updates.translations;
    
    // Handle subcategory updates
    if (updates.subcategories) {
      // Map of existing subcategories by slug for quick lookup
      const existingBySlug = {};
      category.subcategories.forEach(sub => {
        existingBySlug[sub.slug] = sub;
      });
      
      const newSubcategories = [];
      
      for (const sub of updates.subcategories) {
        let slug = sub.slug;
        
        if (!slug) {
          // Generate slug if not provided
          slug = sub.name.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
        }
        
        if (existingBySlug[slug]) {
          // Update existing subcategory
          const existing = existingBySlug[slug];
          newSubcategories.push({
            name: sub.name || existing.name,
            slug,
            description: sub.description !== undefined ? sub.description : existing.description,
            order: sub.order !== undefined ? sub.order : existing.order
          });
        } else {
          // Add new subcategory
          newSubcategories.push({
            name: sub.name,
            slug,
            description: sub.description,
            order: sub.order || 0
          });
        }
      }
      
      // Replace subcategories with the new array
      category.subcategories = newSubcategories;
    }
    
    await category.save();
    return category;
  }
  
  /**
   * Get all categories
   */
  static async getAllCategories(includeHidden: boolean = false): Promise<IKnowledgeCategory[]> {
    await dbConnect();
    
    const query: FilterQuery<IKnowledgeCategory> = {};
    if (!includeHidden) {
      query.isVisible = true;
    }
    
    return await KnowledgeCategory.find(query)
      .sort({ order: 1 })
      .lean();
  }
  
  /**
   * Get a category by ID or slug
   */
  static async getCategory(idOrSlug: string): Promise<IKnowledgeCategory> {
    await dbConnect();
    
    // Determine if the parameter is an ID or slug
    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    
    // Find the category
    let query: FilterQuery<IKnowledgeCategory> = {};
    if (isObjectId) {
      query._id = idOrSlug;
    } else {
      query.slug = idOrSlug;
    }
    
    const category = await KnowledgeCategory.findOne(query).lean();
    
    if (!category) {
      throw new Error('Category not found');
    }
    
    return category;
  }
  
  /**
   * Delete a category
   */
  static async deleteCategory(categoryId: string): Promise<boolean> {
    await dbConnect();
    
    // Check if there are articles using this category
    const categoryData = await KnowledgeCategory.findById(categoryId).lean();
    if (!categoryData) {
      return false;
    }
    
    const articlesCount = await KnowledgeArticle.countDocuments({
      $or: [
        { category: categoryData.slug },
        { category: categoryData.name }
      ]
    });
    
    if (articlesCount > 0) {
      throw new Error(`Cannot delete category that has ${articlesCount} associated articles`);
    }
    
    const result = await KnowledgeCategory.deleteOne({ _id: categoryId });
    return result.deletedCount > 0;
  }
  
  /**
   * Get article statistics
   */
  static async getArticleStatistics(): Promise<{
    totalArticles: number;
    publishedArticles: number;
    totalViews: number;
    categoryCounts: Record<string, number>;
    topViewedArticles: Array<{
      _id: string;
      title: string;
      slug: string;
      viewCount: number;
    }>;
    mostHelpfulArticles: Array<{
      _id: string;
      title: string;
      slug: string;
      helpfulVotes: number;
      notHelpfulVotes: number;
      helpfulnessRatio: number;
    }>;
  }> {
    await dbConnect();
    
    // Basic counts
    const totalArticles = await KnowledgeArticle.countDocuments();
    const publishedArticles = await KnowledgeArticle.countDocuments({ isPublished: true });
    
    // Total views
    const viewsResult = await KnowledgeArticle.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$viewCount' } } }
    ]);
    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;
    
    // Category counts
    const categoryResults = await KnowledgeArticle.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const categoryCounts: Record<string, number> = {};
    categoryResults.forEach(result => {
      categoryCounts[result._id] = result.count;
    });
    
    // Top viewed articles
    const topViewedArticles = await KnowledgeArticle.find({ isPublished: true })
      .select('title slug viewCount')
      .sort({ viewCount: -1 })
      .limit(10)
      .lean();
    
    // Most helpful articles
    const helpfulArticles = await KnowledgeArticle.find({
      isPublished: true,
      helpfulVotes: { $gt: 0 }
    })
      .select('title slug helpfulVotes notHelpfulVotes')
      .sort({ helpfulVotes: -1 })
      .limit(10)
      .lean();
    
    const mostHelpfulArticles = helpfulArticles.map(article => ({
      ...article,
      helpfulnessRatio: article.helpfulVotes / (article.helpfulVotes + article.notHelpfulVotes || 1)
    }));
    
    return {
      totalArticles,
      publishedArticles,
      totalViews,
      categoryCounts,
      topViewedArticles,
      mostHelpfulArticles
    };
  }
  
  /**
   * Search articles by query text
   */
  static async searchArticles(
    query: string,
    options: {
      onlyPublished?: boolean;
      limit?: number;
      language?: string;
    } = {}
  ): Promise<IKnowledgeArticle[]> {
    await dbConnect();
    
    const filter: FilterQuery<IKnowledgeArticle> = {
      $text: { $search: query }
    };
    
    if (options.onlyPublished) {
      filter.isPublished = true;
    }
    
    const articles = await KnowledgeArticle.find(filter)
      .select('title slug excerpt category tags viewCount')
      .sort({ score: { $meta: 'textScore' } })
      .limit(options.limit || 10)
      .lean();
    
    // If language is specified and translations exist, return translated content
    if (options.language) {
      return articles.map(article => {
        if (article.translations && article.translations[options.language]) {
          const translation = article.translations[options.language];
          return {
            ...article,
            title: translation.title || article.title,
            excerpt: translation.excerpt || article.excerpt
          };
        }
        return article;
      });
    }
    
    return articles;
  }
}

export default KnowledgeService;
