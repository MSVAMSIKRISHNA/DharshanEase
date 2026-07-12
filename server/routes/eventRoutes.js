import { Router } from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { auth } from '../middleware/auth.js';
import authorize from '../middleware/roleAuth.js';

const router = Router();
router.get('/', getEvents);
router.post('/', auth, authorize('organizer', 'admin'), createEvent);
router.put('/:id', auth, authorize('organizer', 'admin'), updateEvent);
router.delete('/:id', auth, authorize('organizer', 'admin'), deleteEvent);

export default router;
