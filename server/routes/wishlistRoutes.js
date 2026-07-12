import { Router } from 'express';
import { toggleWishlist, getUserWishlist } from '../controllers/wishlistController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.get('/', auth, getUserWishlist);
router.post('/:templeId', auth, toggleWishlist);

export default router;
