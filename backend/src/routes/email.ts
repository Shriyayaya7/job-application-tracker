import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  sendFollowUpReminder,
  scheduleFollowUp,
  getUpcomingReminders,
  sendWeeklyDigest,
} from '../controllers/emailController';

const router = express.Router();

router.use(authenticate);

router.post('/follow-up-reminder', sendFollowUpReminder);
router.post('/schedule-follow-up', scheduleFollowUp);
router.get('/upcoming-reminders', getUpcomingReminders);
router.post('/weekly-digest', sendWeeklyDigest);

export default router;
