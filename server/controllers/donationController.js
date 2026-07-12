import Donation from '../models/Donation.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { generateTransactionId, getPagination } from '../utils/helpers.js';

export const createDonation = async (req, res, next) => {
  try {
    const { temple, amount, purpose, method, isAnonymous, message } = req.body;
    const transactionId = generateTransactionId();

    const donation = await Donation.create({
      user: req.user.id, temple, amount, purpose, method, transactionId,
      status: 'success', isAnonymous, message,
    });

    return ApiResponse.created(res, 'Donation successful. Thank you!', donation);
  } catch (error) { next(error); }
};

export const getUserDonations = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const [donations, total] = await Promise.all([
      Donation.find({ user: req.user.id })
        .populate('temple', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Donation.countDocuments({ user: req.user.id }),
    ]);
    return ApiResponse.paginated(res, 'Donations fetched', donations, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

export const getTempleDonations = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { temple: req.params.templeId };
    const [donations, total] = await Promise.all([
      Donation.find(filter).populate('user', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Donation.countDocuments(filter),
    ]);
    return ApiResponse.paginated(res, 'Temple donations', donations, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

export const getAllDonations = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const [donations, total] = await Promise.all([
      Donation.find().populate('user', 'name email').populate('temple', 'name')
        .sort({ createdAt: -1 }).skip(skip).limit(limit),
      Donation.countDocuments(),
    ]);
    return ApiResponse.paginated(res, 'All donations', donations, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};
