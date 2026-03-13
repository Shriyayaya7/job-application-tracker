import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createJobApplication,
  getJobApplications,
  getJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getJobAnalytics,
} from '../controllers/jobController';

const router = express.Router();

router.use(authenticate);

router.post('/', createJobApplication);
router.get('/', getJobApplications);
router.get('/analytics', getJobAnalytics);
router.get('/:id', getJobApplication);
router.put('/:id', updateJobApplication);
router.delete('/:id', deleteJobApplication);

export default router;
