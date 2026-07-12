import Feedback from '../models/Feedback.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getPagination } from '../utils/helpers.js';

export const createFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.create({ ...req.body, user: req.user.id });
    return ApiResponse.created(res, 'Feedback submitted successfully', feedback);
  } catch (error) { next(error); }
};

export const getTempleFeedback = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { temple: req.params.templeId };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const [feedback, total] = await Promise.all([
      Feedback.find(filter).populate('user', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Feedback.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, 'Feedback fetched', feedback, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

export const replyToFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        status: 'reviewed',
        adminReply: { message: req.body.message, repliedAt: new Date(), repliedBy: req.user.id },
      },
      { new: true }
    );
    if (!feedback) throw ApiError.notFound('Feedback not found');
    return ApiResponse.success(res, 'Reply sent', feedback);
  } catch (error) { next(error); }
};
