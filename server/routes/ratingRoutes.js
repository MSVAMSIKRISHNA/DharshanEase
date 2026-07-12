import { Router } from 'express';
import { createRating, getTempleRatings } from '../controllers/ratingController.js';
import { auth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { ratingValidator } from '../validators/index.js';

const router = Router();
router.post('/', auth, ratingValidator, validate, createRating);
router.get('/temple/:templeId', getTempleRatings);

export default router;
