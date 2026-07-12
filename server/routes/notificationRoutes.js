import { Router } from 'express';
import { getUserNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.get('/', auth, getUserNotifications);
router.put('/read-all', auth, markAllAsRead);
router.put('/:id/read', auth, markAsRead);

export default router;
