import mongoose, { Document, Schema } from 'mongoose';

export interface IJobApplication extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
  applicationDate: Date;
  lastUpdated: Date;
  location: string;
  salary: string;
  jobUrl: string;
  notes: string;
  resumeId?: mongoose.Types.ObjectId;
  coverLetterId?: mongoose.Types.ObjectId;
  followUpDate?: Date;
  reminderType?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema: Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  jobDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'interviewing', 'offered', 'rejected', 'withdrawn'],
    default: 'applied',
  },
  applicationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    trim: true,
  },
  salary: {
    type: String,
    trim: true,
  },
  jobUrl: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
  },
  coverLetterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoverLetter',
  },
  followUpDate: {
    type: Date,
  },
  reminderType: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
