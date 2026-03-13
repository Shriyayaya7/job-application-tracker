import mongoose, { Document, Schema } from 'mongoose';

export interface ICoverLetter extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  companyName: string;
  jobTitle: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const coverLetterSchema: Schema = new mongoose.Schema({
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
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
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
}, {
  timestamps: true,
});

export default mongoose.model<ICoverLetter>('CoverLetter', coverLetterSchema);
