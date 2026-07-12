import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Temple from '../models/Temple.js';
import Donation from '../models/Donation.js';
import Payment from '../models/Payment.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalTemples, totalBookings, totalDonations, revenueResult, recentBookings] = await Promise.all([
      User.countDocuments(),
      Temple.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Donation.countDocuments({ status: 'success' }),
      Payment.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Booking.find()
        .populate('user', 'name email')
        .populate('temple', 'name')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    return ApiResponse.success(res, 'Dashboard stats', {
      totalUsers, totalTemples, totalBookings, totalDonations, totalRevenue, recentBookings,
    });
  } catch (error) { next(error); }
};

export const getBookingAnalytics = async (req, res, next) => {
  try {
    const { period = 'monthly' } = req.query;
    const now = new Date();
    let startDate;

    if (period === 'daily') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    } else {
      startDate = new Date(now.getFullYear() - 5, 0, 1);
    }

    const dateFormat = period === 'daily' ? '%Y-%m-%d' : period === 'monthly' ? '%Y-%m' : '%Y';

    const bookingTrends = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const statusDistribution = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const popularTemples = await Booking.aggregate([
      { $group: { _id: '$temple', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'temples', localField: '_id', foreignField: '_id', as: 'templeInfo',
        },
      },
      { $unwind: '$templeInfo' },
      { $project: { name: '$templeInfo.name', count: 1, revenue: 1 } },
    ]);

    return ApiResponse.success(res, 'Booking analytics', { bookingTrends, statusDistribution, popularTemples });
  } catch (error) { next(error); }
};

export const getRevenueAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    const revenueTrends = await Payment.aggregate([
      { $match: { status: 'success', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const paymentMethods = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: '$method', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    const donationTrends = await Donation.aggregate([
      { $match: { status: 'success', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return ApiResponse.success(res, 'Revenue analytics', { revenueTrends, paymentMethods, donationTrends });
  } catch (error) { next(error); }
};

export const generateReport = async (req, res, next) => {
  try {
    const { type = 'bookings', startDate, endDate } = req.query;
    const filter = {};
    if (startDate) filter.createdAt = { $gte: new Date(startDate) };
    if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };

    let data;
    if (type === 'bookings') {
      data = await Booking.find(filter).populate('user', 'name email').populate('temple', 'name').sort({ createdAt: -1 }).limit(500);
    } else if (type === 'revenue') {
      data = await Payment.find({ ...filter, status: 'success' }).populate('booking', 'bookingId').sort({ createdAt: -1 }).limit(500);
    } else if (type === 'donations') {
      data = await Donation.find({ ...filter, status: 'success' }).populate('user', 'name').populate('temple', 'name').sort({ createdAt: -1 }).limit(500);
    } else if (type === 'users') {
      data = await User.find(filter).sort({ createdAt: -1 }).limit(500);
    }

    return ApiResponse.success(res, 'Report generated', { type, count: data?.length || 0, data });
  } catch (error) { next(error); }
};
