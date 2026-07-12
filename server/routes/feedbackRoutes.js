import { Router } from 'express';
import { createFeedback, getTempleFeedback, replyToFeedback } from '../controllers/feedbackController.js';
import { auth } from '../middleware/auth.js';
import authorize from '../middleware/roleAuth.js';
import validate from '../middleware/validate.js';
import { feedbackValidator } from '../validators/index.js';

const router = Router();
router.post('/', auth, feedbackValidator, validate, createFeedback);
router.get('/temple/:templeId', getTempleFeedback);
router.put('/:id/reply', auth, authorize('admin'), replyToFeedback);

export default router;
