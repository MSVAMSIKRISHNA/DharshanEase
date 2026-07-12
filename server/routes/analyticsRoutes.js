import { Router } from 'express';
import { getDashboardStats, getBookingAnalytics, getRevenueAnalytics, generateReport } from '../controllers/analyticsController.js';
import { auth } from '../middleware/auth.js';
import authorize from '../middleware/roleAuth.js';

const router = Router();
router.get('/dashboard', auth, authorize('admin'), getDashboardStats);
router.get('/bookings', auth, authorize('admin'), getBookingAnalytics);
router.get('/revenue', auth, authorize('admin'), getRevenueAnalytics);
router.get('/reports', auth, authorize('admin'), generateReport);

export default router;
