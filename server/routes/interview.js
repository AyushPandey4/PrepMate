import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  createInterview,
  listInterviews,
  getInterview,
  handleMessage,
  completeInterview,
  getFeedback,
} from '../controllers/interviewController.js';

const router = Router();

// All interview routes require authentication
router.use(requireAuth);

// POST /api/interviews — create new interview + get first question
router.post('/', createInterview);

// GET  /api/interviews — list all interviews for current user
router.get('/', listInterviews);

// GET  /api/interviews/:id — get a single interview 
router.get('/:id', getInterview);

// POST /api/interviews/:id/message — send answer, receive next question
router.post('/:id/message', handleMessage);

// POST /api/interviews/:id/complete — end interview + generate feedback
router.post('/:id/complete', completeInterview);

// GET  /api/interviews/:id/feedback — get feedback report 
router.get('/:id/feedback', getFeedback);

export default router;
