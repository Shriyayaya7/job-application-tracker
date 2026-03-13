import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  keywords: string[];
  aiAnalysis?: {
    score: number;
    suggestions: string[];
    improvements: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema: Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
    trim: true,
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'docx', 'txt'],
  },
  fileSize: {
    type: Number,
    required: true,
  },
  keywords: [{
    type: String,
    trim: true,
  }],
  aiAnalysis: {
    score: Number,
    suggestions: [String],
    improvements: [String],
  },
}, {
  timestamps: true,
});

export default mongoose.model<IResume>('Resume', resumeSchema);
