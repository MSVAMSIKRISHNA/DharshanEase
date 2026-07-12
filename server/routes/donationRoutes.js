import { Router } from 'express';
import { createDonation, getUserDonations, getTempleDonations, getAllDonations } from '../controllers/donationController.js';
import { auth } from '../middleware/auth.js';
import authorize from '../middleware/roleAuth.js';
import validate from '../middleware/validate.js';
import { donationValidator } from '../validators/index.js';

const router = Router();
router.post('/', auth, donationValidator, validate, createDonation);
router.get('/', auth, getUserDonations);
router.get('/all', auth, authorize('admin'), getAllDonations);
router.get('/temple/:templeId', auth, authorize('organizer', 'admin'), getTempleDonations);

export default router;
