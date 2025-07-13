import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVideoTutorial extends Document {
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  category: string;
  subcategory?: string;
  tags: string[];
  viewCount: number;
  featured: boolean;
  author: Schema.Types.ObjectId;
  publishedAt: Date;
  isPublished: boolean;
  transcripts?: Record<string, string>; // language code -> transcript text
  captions?: Array<{
    language: string; // ISO language code
    fileUrl: string;
    format: string; // e.g., 'vtt', 'srt'
  }>;
  relatedVideos?: Schema.Types.ObjectId[];
  relatedArticles?: Schema.Types.ObjectId[];
  chapters?: Array<{
    title: string;
    timeStart: number; // in seconds
    description?: string;
  }>;
  resources?: Array<{
    title: string;
    description?: string;
    url: string;
    type: 'link' | 'pdf' | 'doc' | 'code' | 'other';
  }>;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  likeCount: number;
  dislikeCount: number;
  comments?: Array<{
    userId: Schema.Types.ObjectId;
    userName: string;
    content: string;
    timestamp: Date;
    isHidden: boolean;
  }>;
  translations?: Record<string, {
    title: string;
    description: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVideoCategory extends Document {
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

const VideoTutorialSchema = new Schema<IVideoTutorial>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  duration: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, index: true },
  subcategory: { type: String },
  tags: [{ type: String, index: true }],
  viewCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false, index: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: { type: Date },
  isPublished: { type: Boolean, default: false, index: true },
  transcripts: { type: Schema.Types.Mixed }, // language code -> transcript text
  captions: [{
    language: { type: String, required: true }, // ISO language code
    fileUrl: { type: String, required: true },
    format: { type: String, required: true } // e.g., 'vtt', 'srt'
  }],
  relatedVideos: [{ type: Schema.Types.ObjectId, ref: 'VideoTutorial' }],
  relatedArticles: [{ type: Schema.Types.ObjectId, ref: 'KnowledgeArticle' }],
  chapters: [{
    title: { type: String, required: true },
    timeStart: { type: Number, required: true, min: 0 }, // in seconds
    description: { type: String }
  }],
  resources: [{
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['link', 'pdf', 'doc', 'code', 'other'],
      required: true
    }
  }],
  difficultyLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
    default: 'beginner'
  },
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 },
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    isHidden: { type: Boolean, default: false }
  }],
  translations: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

const VideoCategorySchema = new Schema<IVideoCategory>({
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

// Auto-generate slug from title if not provided
VideoTutorialSchema.pre('save', function(next) {
  if (this.isNew && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

VideoCategorySchema.pre('save', function(next) {
  if (this.isNew && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

// Create indexes for search
VideoTutorialSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Create the models if they don't already exist
const VideoTutorial = mongoose.models.VideoTutorial || 
  mongoose.model<IVideoTutorial>('VideoTutorial', VideoTutorialSchema);

const VideoCategory = mongoose.models.VideoCategory || 
  mongoose.model<IVideoCategory>('VideoCategory', VideoCategorySchema);

export { VideoTutorial, VideoCategory };
