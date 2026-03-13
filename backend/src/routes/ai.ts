import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  analyzeResume,
  generateInterviewQuestions,
  improveResume,
  extractKeywords,
} from '../controllers/aiController';

const router = express.Router();

router.use(authenticate);

router.post('/analyze-resume/:resumeId', analyzeResume);
router.post('/generate-interview-questions', generateInterviewQuestions);
router.post('/improve-resume', improveResume);
router.post('/extract-keywords', extractKeywords);

export default router;
