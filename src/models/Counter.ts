import mongoose, { Schema, Document } from 'mongoose';

export interface ICounter extends Document {
  counterId: string;
  name: string;
  domain: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const CounterSchema = new Schema<ICounter>({
  counterId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Counter = mongoose.models.Counter || mongoose.model<ICounter>('Counter', CounterSchema);
