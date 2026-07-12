import { Router } from 'express';
import { getAllUsers, getUserById, updateProfile, uploadAvatar, updateUserRole, deleteUser } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import authorize from '../middleware/roleAuth.js';
import upload from '../middleware/upload.js';
import validate from '../middleware/validate.js';
import { updateProfileValidator } from '../validators/index.js';

const router = Router();

router.get('/', auth, authorize('admin'), getAllUsers);
router.get('/:id', auth, authorize('admin'), getUserById);
router.put('/profile', auth, updateProfileValidator, validate, updateProfile);
router.put('/avatar', auth, upload.single('avatar'), uploadAvatar);
router.put('/:id/role', auth, authorize('admin'), updateUserRole);
router.delete('/:id', auth, authorize('admin'), deleteUser);

export default router;
