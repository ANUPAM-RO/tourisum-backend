import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  author: mongoose.Types.ObjectId;
  image: string;
  category: string;
  tags: string[];
  published: boolean;
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String },
    category: { type: String },
    tags: [{ type: String }],
    published: { type: Boolean, default: true },
    seo: {
      title: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', blogSchema);
