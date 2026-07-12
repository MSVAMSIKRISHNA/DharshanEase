import { Router } from 'express';
import { processPayment, getPaymentById, getPaymentHistory } from '../controllers/paymentController.js';
import { auth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { paymentValidator } from '../validators/index.js';

const router = Router();
router.post('/process', auth, paymentValidator, validate, processPayment);
router.get('/history', auth, getPaymentHistory);
router.get('/:id', auth, getPaymentById);

export default router;
