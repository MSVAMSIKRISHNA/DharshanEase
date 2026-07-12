import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import DarshanSlot from '../models/DarshanSlot.js';
import Temple from '../models/Temple.js';
import Notification from '../models/Notification.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { generateBookingId, getPagination, getSortOptions, runInTransaction } from '../utils/helpers.js';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';

/**
 * @desc    Create booking with MongoDB transaction
 * @route   POST /api/bookings
 */
export const createBooking = async (req, res, next) => {
  try {
    const booking = await runInTransaction(async (session) => {
      const { temple, slot, visitDate, devotees, darshanType, timeSlot } = req.body;

      const templeDoc = await Temple.findById(temple).session(session);
      if (!templeDoc) throw ApiError.notFound('Temple not found');

      const slotDoc = await DarshanSlot.findById(slot).session(session);
      if (!slotDoc) throw ApiError.notFound('Slot not found');

      if (slotDoc.bookedCount + devotees.length > slotDoc.totalCapacity) {
        throw ApiError.badRequest(`Only ${slotDoc.totalCapacity - slotDoc.bookedCount} spots available`);
      }

      const totalAmount = slotDoc.price * devotees.length;
      const bookingId = generateBookingId();

      const qrData = JSON.stringify({
        bookingId,
        temple: templeDoc.name,
        date: visitDate,
        devotees: devotees.length,
      });
      const qrCode = await QRCode.toDataURL(qrData);

      const [newBooking] = await Booking.create(
        [{
          bookingId,
          user: req.user.id,
          temple,
          slot,
          visitDate,
          darshanType: darshanType || slotDoc.darshanType,
          timeSlot: timeSlot || `${slotDoc.startTime} - ${slotDoc.endTime}`,
          devotees,
          totalAmount,
          qrCode,
          status: 'pending',
        }],
        { session }
      );

      slotDoc.bookedCount += devotees.length;
      await slotDoc.save({ session });

      templeDoc.totalBookings += 1;
      await templeDoc.save({ session });

      await Notification.create(
        [{
          user: req.user.id,
          title: 'Booking Created',
          message: `Your booking ${bookingId} for ${templeDoc.name} has been created. Please complete payment.`,
          type: 'booking',
          link: `/payment/${newBooking._id}`,
        }],
        { session }
      );

      return newBooking;
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('temple', 'name heroBanner address')
      .populate('slot', 'startTime endTime darshanType price');

    return ApiResponse.created(res, 'Booking created successfully', populatedBooking);
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query.sort, '-createdAt');
    const filter = { user: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('temple', 'name heroBanner address')
        .populate('slot', 'startTime endTime darshanType')
        .sort(sort).skip(skip).limit(limit),
      Booking.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, 'Bookings fetched', bookings, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) { next(error); }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('temple', 'name heroBanner address timings darshanTypes organizer')
      .populate('slot', 'startTime endTime darshanType price date')
      .populate('user', 'name email phone');

    if (!booking) throw ApiError.notFound('Booking not found');
    
    // Authorization Check
    if (req.user.role === 'user' && booking.user?._id?.toString() !== req.user.id) {
      throw ApiError.forbidden('Not authorized to view this booking');
    }
    if (req.user.role === 'organizer') {
      const templeObj = await Temple.findById(booking.temple?._id || booking.temple);
      if (templeObj && templeObj.organizer.toString() !== req.user.id) {
        throw ApiError.forbidden('Not authorized to view bookings of this temple');
      }
    }
    
    return ApiResponse.success(res, 'Booking fetched', booking);
  } catch (error) { next(error); }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await runInTransaction(async (session) => {
      const bookingDoc = await Booking.findById(req.params.id).session(session);
      if (!bookingDoc) throw ApiError.notFound('Booking not found');
      if (bookingDoc.user.toString() !== req.user.id && req.user.role === 'user') {
        throw ApiError.forbidden('Not authorized');
      }
      if (bookingDoc.status === 'cancelled') throw ApiError.badRequest('Booking already cancelled');
      if (bookingDoc.status === 'completed') throw ApiError.badRequest('Completed bookings cannot be cancelled');

      bookingDoc.status = 'cancelled';
      bookingDoc.cancellationReason = req.body.reason || 'Cancelled by user';
      bookingDoc.cancelledAt = new Date();
      bookingDoc.refundStatus = bookingDoc.status === 'confirmed' ? 'pending' : 'none';
      bookingDoc.refundAmount = bookingDoc.status === 'confirmed' ? bookingDoc.totalAmount : 0;
      await bookingDoc.save({ session });

      const slot = await DarshanSlot.findById(bookingDoc.slot).session(session);
      if (slot) {
        slot.bookedCount = Math.max(0, slot.bookedCount - bookingDoc.devotees.length);
        await slot.save({ session });
      }

      await Notification.create(
        [{
          user: bookingDoc.user,
          title: 'Booking Cancelled',
          message: `Your booking ${bookingDoc.bookingId} has been cancelled.${bookingDoc.refundStatus === 'pending' ? ' Refund is being processed.' : ''}`,
          type: 'cancellation',
        }],
        { session }
      );

      return bookingDoc;
    });

    return ApiResponse.success(res, 'Booking cancelled successfully', booking);
  } catch (error) {
    next(error);
  }
};

export const getBookingTicket = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('temple', 'name heroBanner address organizer')
      .populate('slot', 'startTime endTime darshanType price')
      .populate('user', 'name email phone');

    if (!booking) throw ApiError.notFound('Booking not found');

    // Authorization Check
    if (req.user.role === 'user' && booking.user?._id?.toString() !== req.user.id) {
      throw ApiError.forbidden('Not authorized to view this ticket');
    }
    if (req.user.role === 'organizer') {
      const templeObj = await Temple.findById(booking.temple?._id || booking.temple);
      if (templeObj && templeObj.organizer.toString() !== req.user.id) {
        throw ApiError.forbidden('Not authorized to view tickets of this temple');
      }
    }

    return ApiResponse.success(res, 'Ticket data fetched', booking);
  } catch (error) { next(error); }
};

export const downloadPDF = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('temple', 'name address organizer')
      .populate('slot', 'startTime endTime darshanType price')
      .populate('user', 'name email phone');

    if (!booking) throw ApiError.notFound('Booking not found');

    // Authorization Check
    if (req.user.role === 'user' && booking.user?._id?.toString() !== req.user.id) {
      throw ApiError.forbidden('Not authorized to download this ticket');
    }
    if (req.user.role === 'organizer') {
      const templeObj = await Temple.findById(booking.temple?._id || booking.temple);
      if (templeObj && templeObj.organizer.toString() !== req.user.id) {
        throw ApiError.forbidden('Not authorized to download tickets of this temple');
      }
    }

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking.bookingId}.pdf`);
    doc.pipe(res);

    doc.fontSize(24).font('Helvetica-Bold').text('DarshanEase', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('Temple Darshan Ticket', { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#FF9933');
    doc.moveDown();

    doc.fontSize(16).font('Helvetica-Bold').text(booking.temple?.name || 'Temple');
    doc.fontSize(10).font('Helvetica').text(
      `${booking.temple?.address?.line || ''}, ${booking.temple?.address?.district || ''}, ${booking.temple?.address?.state || ''}`
    );
    doc.moveDown();

    const details = [
      ['Booking ID', booking.bookingId],
      ['Date', new Date(booking.visitDate).toLocaleDateString('en-IN', { dateStyle: 'long' })],
      ['Time Slot', booking.timeSlot],
      ['Darshan Type', booking.darshanType],
      ['Devotees', String(booking.devotees.length)],
      ['Total Amount', `₹${booking.totalAmount}`],
      ['Status', booking.status.toUpperCase()],
    ];

    details.forEach(([label, value]) => {
      doc.fontSize(10).font('Helvetica-Bold').text(`${label}: `, { continued: true });
      doc.font('Helvetica').text(value);
    });

    doc.moveDown();
    doc.fontSize(12).font('Helvetica-Bold').text('Devotee Details');
    booking.devotees.forEach((d, i) => {
      doc.fontSize(9).font('Helvetica')
        .text(`${i + 1}. ${d.name} | Age: ${d.age} | ${d.gender} | ${d.idType}: ${d.idNumber}`);
    });

    doc.moveDown(2);
    doc.fontSize(8).fillColor('#708090').text('This is a computer-generated ticket. Please carry a valid photo ID.', { align: 'center' });
    doc.text('© DarshanEase - Temple Darshan Ticket Booking', { align: 'center' });

    doc.end();
  } catch (error) { next(error); }
};

export const verifyBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId })
      .populate('temple', 'name')
      .populate('user', 'name email');

    if (!booking) throw ApiError.notFound('Booking not found');

    return ApiResponse.success(res, 'Booking verification', {
      valid: booking.status === 'confirmed',
      booking,
    });
  } catch (error) { next(error); }
};

export const getTempleBookings = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    // Authorization Check for organizers
    if (req.user.role === 'organizer') {
      const templeObj = await Temple.findById(req.params.templeId);
      if (!templeObj || templeObj.organizer.toString() !== req.user.id) {
        throw ApiError.forbidden('Not authorized to view bookings of this temple');
      }
    }

    const filter = { temple: req.params.templeId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.date) {
      const d = new Date(req.query.date);
      filter.visitDate = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59, 999)) };
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 }).skip(skip).limit(limit),
      Booking.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, 'Temple bookings fetched', bookings, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) { next(error); }
};
