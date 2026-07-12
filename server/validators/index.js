import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid Indian phone number'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

export const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
];

export const resetPasswordValidator = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid Indian phone number'),
];

export const templeValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Temple name is required')
    .isLength({ max: 150 }).withMessage('Temple name cannot exceed 150 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),
  body('address.line').notEmpty().withMessage('Address is required'),
  body('address.district').notEmpty().withMessage('District is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('timings.openTime').notEmpty().withMessage('Opening time is required'),
  body('timings.closeTime').notEmpty().withMessage('Closing time is required'),
];

export const slotValidator = [
  body('temple').notEmpty().withMessage('Temple ID is required').isMongoId().withMessage('Invalid temple ID'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Invalid date format'),
  body('darshanType').notEmpty().withMessage('Darshan type is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('endTime').notEmpty().withMessage('End time is required'),
  body('totalCapacity').notEmpty().withMessage('Capacity is required').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price cannot be negative'),
];

export const bookingValidator = [
  body('temple').notEmpty().withMessage('Temple ID is required').isMongoId().withMessage('Invalid temple ID'),
  body('slot').notEmpty().withMessage('Slot ID is required').isMongoId().withMessage('Invalid slot ID'),
  body('visitDate').notEmpty().withMessage('Visit date is required'),
  body('devotees')
    .isArray({ min: 1, max: 10 }).withMessage('Devotees must be between 1 and 10'),
  body('devotees.*.name').notEmpty().withMessage('Devotee name is required'),
  body('devotees.*.age').isInt({ min: 0, max: 150 }).withMessage('Valid age is required'),
  body('devotees.*.gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
  body('devotees.*.idType').isIn(['Aadhaar', 'PAN', 'Voter ID', 'Passport', 'Driving License']).withMessage('Valid ID type is required'),
  body('devotees.*.idNumber').notEmpty().withMessage('ID number is required'),
];

export const donationValidator = [
  body('temple').notEmpty().withMessage('Temple ID is required').isMongoId().withMessage('Invalid temple ID'),
  body('amount').notEmpty().withMessage('Amount is required').isFloat({ min: 1 }).withMessage('Minimum donation is ₹1'),
  body('method').isIn(['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet']).withMessage('Valid payment method is required'),
];

export const feedbackValidator = [
  body('temple').notEmpty().withMessage('Temple ID is required').isMongoId().withMessage('Invalid temple ID'),
  body('message').trim().notEmpty().withMessage('Feedback message is required').isLength({ max: 1000 }).withMessage('Feedback cannot exceed 1000 characters'),
  body('category').optional().isIn(['General', 'Service', 'Cleanliness', 'Facilities', 'Staff', 'Timing', 'Suggestion', 'Complaint']),
];

export const ratingValidator = [
  body('temple').notEmpty().withMessage('Temple ID is required').isMongoId().withMessage('Invalid temple ID'),
  body('rating').notEmpty().withMessage('Rating is required').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters'),
];

export const paymentValidator = [
  body('bookingId').notEmpty().withMessage('Booking ID is required').isMongoId().withMessage('Invalid booking ID'),
  body('method').isIn(['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet']).withMessage('Valid payment method is required'),
];
