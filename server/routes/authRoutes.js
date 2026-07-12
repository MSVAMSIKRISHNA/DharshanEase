import { Router } from 'express';
import { register, login, logout, getMe, forgotPassword, resetPassword, verifyEmail, refreshToken } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '../validators/index.js';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, validate, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh-token', auth, refreshToken);

export default router;
