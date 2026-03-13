import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import resumeRoutes from './routes/resumes';
import aiRoutes from './routes/ai';
import emailRoutes from './routes/email';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/email', emailRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Job Application Tracker API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
