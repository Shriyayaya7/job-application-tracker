import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  uploadResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  uploadCoverLetter,
  getCoverLetters,
  getCoverLetter,
  deleteCoverLetter,
} from '../controllers/resumeController';

const router = express.Router();

router.use(authenticate);

// Resume routes
router.post('/resume', uploadResume);
router.get('/resumes', getResumes);
router.get('/resume/:id', getResume);
router.put('/resume/:id', updateResume);
router.delete('/resume/:id', deleteResume);

// Cover letter routes
router.post('/cover-letter', uploadCoverLetter);
router.get('/cover-letters', getCoverLetters);
router.get('/cover-letter/:id', getCoverLetter);
router.delete('/cover-letter/:id', deleteCoverLetter);

export default router;
