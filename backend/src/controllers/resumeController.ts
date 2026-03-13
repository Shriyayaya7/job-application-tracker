import { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Resume from '../models/Resume';
import CoverLetter from '../models/CoverLetter';
import { AuthRequest } from '../middleware/auth';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

export const uploadResume = [
  upload.single('file'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const { title, content, keywords } = req.body;

      const resume = new Resume({
        userId: req.user!._id,
        title: title || req.file.originalname,
        content: content || '',
        fileName: req.file.filename,
        fileType: path.extname(req.file.originalname).slice(1),
        fileSize: req.file.size,
        keywords: keywords ? keywords.split(',').map((k: string) => k.trim()) : [],
      });

      await resume.save();
      res.status(201).json(resume);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  },
];

export const getResumes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resumes = await Resume.find({ userId: req.user!._id })
      .sort({ createdAt: -1 });

    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const deleteResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }

    const filePath = path.join(__dirname, '../../uploads', resume.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const uploadCoverLetter = [
  upload.single('file'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const { title, content, companyName, jobTitle } = req.body;

      const coverLetter = new CoverLetter({
        userId: req.user!._id,
        title: title || req.file.originalname,
        content: content || '',
        companyName: companyName || '',
        jobTitle: jobTitle || '',
        fileName: req.file.filename,
        fileType: path.extname(req.file.originalname).slice(1),
        fileSize: req.file.size,
      });

      await coverLetter.save();
      res.status(201).json(coverLetter);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  },
];

export const getCoverLetters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coverLetters = await CoverLetter.find({ userId: req.user!._id })
      .sort({ createdAt: -1 });

    res.json(coverLetters);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getCoverLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coverLetter = await CoverLetter.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!coverLetter) {
      res.status(404).json({ message: 'Cover letter not found' });
      return;
    }

    res.json(coverLetter);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const deleteCoverLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coverLetter = await CoverLetter.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!coverLetter) {
      res.status(404).json({ message: 'Cover letter not found' });
      return;
    }

    const filePath = path.join(__dirname, '../../uploads', coverLetter.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Cover letter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
