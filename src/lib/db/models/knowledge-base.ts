import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IKnowledgeArticle extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  subcategory?: string;
  tags: string[];
  relatedArticles?: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  viewCount: number;
  helpfulVotes: number;
  notHelpfulVotes: number;
  attachments?: Array<{
    title: string;
    filename: string;
    url: string;
    contentType: string;
    size: number;
  }>;
  relatedEntities?: Array<{
    entityType: string;
    entityId: Schema.Types.ObjectId;
  }>;
  translations?: Record<string, {
    title: string;
    content: string;
    excerpt?: string;
  }>;
  isPublished: boolean;
  publishedAt?: Date;
  lastReviewedAt?: Date;
  reviewedBy?: Schema.Types.ObjectId;
  version: number;
  revisions?: Array<{
    version: number;
    content: string;
    title: string;
    updatedAt: Date;
    updatedBy: Schema.Types.ObjectId;
    changeNotes?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IKnowledgeCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  subcategories?: Array<{
    name: string;
    slug: string;
    description?: string;
    order: number;
  }>;
  isVisible: boolean;
  translations?: Record<string, {
    name: string;
    description?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeArticleSchema = new Schema<IKnowledgeArticle>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String, required: true, index: true },
  subcategory: { type: String },
  tags: [{ type: String, index: true }],
  relatedArticles: [{ type: Schema.Types.ObjectId, ref: 'KnowledgeArticle' }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  viewCount: { type: Number, default: 0 },
  helpfulVotes: { type: Number, default: 0 },
  notHelpfulVotes: { type: Number, default: 0 },
  attachments: [{
    title: { type: String, required: true },
    filename: { type: String, required: true },
    url: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true }
  }],
  relatedEntities: [{
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true }
  }],
  translations: { type: Schema.Types.Mixed },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  lastReviewedAt: { type: Date },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  version: { type: Number, default: 1, required: true },
  revisions: [{
    version: { type: Number, required: true },
    content: { type: String, required: true },
    title: { type: String, required: true },
    updatedAt: { type: Date, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    changeNotes: { type: String }
  }]
}, {
  timestamps: true
});

const KnowledgeCategorySchema = new Schema<IKnowledgeCategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  icon: { type: String },
  order: { type: Number, default: 0 },
  subcategories: [{
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 }
  }],
  isVisible: { type: Boolean, default: true },
  translations: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

// Create a revision when article is updated
KnowledgeArticleSchema.pre('save', function(next) {
  if (this.isModified('content') || this.isModified('title')) {
    // Only create revision if content or title changed
    if (!this.isNew) {
      // Increment version number
      this.version += 1;
      
      // Add to revisions array
      if (!this.revisions) {
        this.revisions = [];
      }
      
      this.revisions.push({
        version: this.version,
        content: this.content,
        title: this.title,
        updatedAt: new Date(),
        updatedBy: this.get('currentUserId') || this.author, // Assuming currentUserId is set before saving
        changeNotes: this.get('changeNotes') || 'Updated content'
      });
      
      // Limit the number of stored revisions
      const MAX_REVISIONS = 20;
      if (this.revisions.length > MAX_REVISIONS) {
        this.revisions = this.revisions.slice(-MAX_REVISIONS);
      }
    }
  }
  
  // Set publishedAt date if publishing for the first time
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Auto-generate slug from title if not provided
KnowledgeArticleSchema.pre('save', function(next) {
  if (this.isNew && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

KnowledgeCategorySchema.pre('save', function(next) {
  if (this.isNew && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

// Create indexes for search
KnowledgeArticleSchema.index({ title: 'text', content: 'text', excerpt: 'text', tags: 'text' });
KnowledgeArticleSchema.index({ isPublished: 1 });
KnowledgeArticleSchema.index({ category: 1, subcategory: 1 });

KnowledgeCategorySchema.index({ isVisible: 1 });
KnowledgeCategorySchema.index({ 'subcategories.slug': 1 });

// Create the models if they don't already exist
const KnowledgeArticle = mongoose.models.KnowledgeArticle || 
  mongoose.model<IKnowledgeArticle>('KnowledgeArticle', KnowledgeArticleSchema);

const KnowledgeCategory = mongoose.models.KnowledgeCategory || 
  mongoose.model<IKnowledgeCategory>('KnowledgeCategory', KnowledgeCategorySchema);

export { KnowledgeArticle, KnowledgeCategory };
