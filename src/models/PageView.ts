import mongoose, { Schema, Document } from 'mongoose';

export interface IPageView extends Document {
  counterId: string;
  sessionId: string;
  url: string;
  referrer?: string;
  userAgent: string;
  ip?: string;
  country?: string;
  city?: string;
  timestamp: Date;
  duration?: number;
}

const PageViewSchema = new Schema<IPageView>({
  counterId: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true
  },
  referrer: {
    type: String
  },
  userAgent: {
    type: String,
    required: true
  },
  ip: {
    type: String
  },
  country: {
    type: String
  },
  city: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  duration: {
    type: Number
  }
});

PageViewSchema.index({ counterId: 1, timestamp: -1 });

export const PageView = mongoose.models.PageView || mongoose.model<IPageView>('PageView', PageViewSchema);
