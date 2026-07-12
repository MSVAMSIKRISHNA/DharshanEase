import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getPagination, getSortOptions } from '../utils/helpers.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query.sort);
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, 'Users fetched successfully', users, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) { next(error); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw ApiError.notFound('User not found');
    return ApiResponse.success(res, 'User fetched successfully', user);
  } catch (error) { next(error); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) throw ApiError.notFound('User not found');
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();
    return ApiResponse.success(res, 'Profile updated successfully', user);
  } catch (error) { next(error); }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw ApiError.badRequest('Please upload an image');
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.filename },
      { new: true }
    );
    return ApiResponse.success(res, 'Avatar uploaded successfully', user);
  } catch (error) { next(error); }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'organizer', 'admin'].includes(role)) {
      throw ApiError.badRequest('Invalid role');
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) throw ApiError.notFound('User not found');
    return ApiResponse.success(res, 'User role updated', user);
  } catch (error) { next(error); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw ApiError.notFound('User not found');
    return ApiResponse.success(res, 'User deleted successfully');
  } catch (error) { next(error); }
};
