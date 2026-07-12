import { Router } from 'express';
import { getAllTemples, getTempleById, createTemple, updateTemple, deleteTemple, uploadTempleImages, getPopularTemples } from '../controllers/templeController.js';
import { getSlotsByTemple } from '../controllers/slotController.js';
import { auth } from '../middleware/auth.js';
import authorize from '../middleware/roleAuth.js';
import upload from '../middleware/upload.js';
import validate from '../middleware/validate.js';
import { templeValidator } from '../validators/index.js';

const router = Router();

router.get('/', getAllTemples);
router.get('/popular', getPopularTemples);
router.get('/:id', getTempleById);
router.get('/:templeId/slots', getSlotsByTemple);
router.post('/', auth, authorize('organizer', 'admin'), templeValidator, validate, createTemple);
router.put('/:id', auth, authorize('organizer', 'admin'), updateTemple);
router.delete('/:id', auth, authorize('admin'), deleteTemple);
router.post('/:id/images', auth, authorize('organizer', 'admin'), upload.array('images', 10), uploadTempleImages);

export default router;
