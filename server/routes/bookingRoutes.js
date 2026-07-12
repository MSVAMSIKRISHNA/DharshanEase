import { Router } from 'express';
import { createBooking, getUserBookings, getBookingById, cancelBooking, getBookingTicket, downloadPDF, verifyBooking, getTempleBookings } from '../controllers/bookingController.js';
import { auth } from '../middleware/auth.js';
import authorize from '../middleware/roleAuth.js';
import validate from '../middleware/validate.js';
import { bookingValidator } from '../validators/index.js';

const router = Router();

router.post('/', auth, bookingValidator, validate, createBooking);
router.get('/', auth, getUserBookings);
router.get('/verify/:bookingId', auth, authorize('organizer', 'admin'), verifyBooking);
router.get('/temple/:templeId', auth, authorize('organizer', 'admin'), getTempleBookings);
router.get('/:id', auth, getBookingById);
router.put('/:id/cancel', auth, cancelBooking);
router.get('/:id/ticket', auth, getBookingTicket);
router.get('/:id/pdf', auth, downloadPDF);

export default router;
