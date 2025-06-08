import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  counterId: string;
  sessionId: string;
  goalName: string;
  goalValue?: number;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

const GoalSchema = new Schema<IGoal>({
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
  goalName: {
    type: String,
    required: true
  },
  goalValue: {
    type: Number
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

GoalSchema.index({ counterId: 1, timestamp: -1 });

export const Goal = mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);
