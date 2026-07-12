import { Router } from 'express';
import { createSlot, updateSlot, deleteSlot, getAvailability } from '../controllers/slotController.js';
import { auth } from '../middleware/auth.js';
import authorize from '../middleware/roleAuth.js';
import validate from '../middleware/validate.js';
import { slotValidator } from '../validators/index.js';

const router = Router();

router.get('/availability', getAvailability);
router.post('/', auth, authorize('organizer', 'admin'), slotValidator, validate, createSlot);
router.put('/:id', auth, authorize('organizer', 'admin'), updateSlot);
router.delete('/:id', auth, authorize('organizer', 'admin'), deleteSlot);

export default router;
