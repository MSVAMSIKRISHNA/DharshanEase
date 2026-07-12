import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { generateToken, hashToken } from '../utils/helpers.js';
import { sendVerificationEmail, sendResetPasswordEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const verificationToken = generateToken();
    const user = await User.create({
      name,
      email,
      password,
      phone,
      verificationToken: hashToken(verificationToken),
      verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    try {
      await sendVerificationEmail(email, name, verificationToken);
    } catch (emailErr) {
      logger.error(`Failed to send verification email: ${emailErr.message}`);
    }

    logger.info(`New user registered: ${email}`);

    return ApiResponse.created(res, 'Registration successful. Please verify your email.', {
      token,
      refreshToken,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    logger.info(`User logged in: ${email}`);

    return ApiResponse.success(res, 'Login successful', {
      token,
      refreshToken,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: '' });
    logger.info(`User logged out: ${req.user.email}`);
    return ApiResponse.success(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return ApiResponse.success(res, 'User fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return ApiResponse.success(res, 'If the email exists, a reset link has been sent');
    }

    const resetToken = generateToken();
    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    try {
      await sendResetPasswordEmail(email, user.name, resetToken);
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      logger.error(`Failed to send reset email: ${emailErr.message}`);
      throw ApiError.internal('Failed to send reset email. Please try again later.');
    }

    return ApiResponse.success(res, 'Password reset email sent');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = hashToken(req.params.token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired reset token');
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info(`Password reset successful for: ${user.email}`);
    return ApiResponse.success(res, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = hashToken(req.params.token);

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    logger.info(`Email verified for: ${user.email}`);
    return ApiResponse.success(res, 'Email verified successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh-token
 * @access  Private
 */
export const refreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    const token = user.generateAuthToken();
    return ApiResponse.success(res, 'Token refreshed', { token });
  } catch (error) {
    next(error);
  }
};
