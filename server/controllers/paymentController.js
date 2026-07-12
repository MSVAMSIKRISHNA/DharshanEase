import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { generateTransactionId, getPagination } from '../utils/helpers.js';

/**
 * @desc    Simulate payment processing
 * @route   POST /api/payments/process
 */
export const processPayment = async (req, res, next) => {
  try {
    const { bookingId, method } = req.body;

    const booking = await Booking.findById(bookingId).populate('temple', 'name');
    if (!booking) throw ApiError.notFound('Booking not found');
    if (booking.user.toString() !== req.user.id) throw ApiError.forbidden('Not authorized');
    if (booking.status === 'confirmed') throw ApiError.badRequest('Booking already paid');
    if (booking.status === 'cancelled') throw ApiError.badRequest('Cannot pay for cancelled booking');

    const transactionId = generateTransactionId();

    const payment = await Payment.create({
      booking: booking._id,
      user: req.user.id,
      amount: booking.totalAmount,
      method,
      transactionId,
      status: 'success',
      gatewayResponse: {
        simulatedAt: new Date(),
        message: 'Payment processed successfully (simulated)',
      },
    });

    booking.status = 'confirmed';
    booking.paymentId = payment._id;
    await booking.save();

    await Notification.create({
      user: req.user.id,
      title: 'Payment Successful',
      message: `Payment of ₹${booking.totalAmount} for booking ${booking.bookingId} at ${booking.temple?.name || 'temple'} was successful.`,
      type: 'payment',
      link: `/ticket/${booking._id}`,
    });

    return ApiResponse.success(res, 'Payment processed successfully', {
      payment,
      booking,
    });
  } catch (error) { next(error); }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking', 'bookingId totalAmount status')
      .populate('user', 'name email');
    if (!payment) throw ApiError.notFound('Payment not found');
    return ApiResponse.success(res, 'Payment fetched', payment);
  } catch (error) { next(error); }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { user: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate('booking', 'bookingId totalAmount visitDate')
        .sort({ createdAt: -1 }).skip(skip).limit(limit),
      Payment.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, 'Payment history', payments, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) { next(error); }
};
