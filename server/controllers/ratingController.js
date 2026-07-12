import Rating from '../models/Rating.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getPagination } from '../utils/helpers.js';

export const createRating = async (req, res, next) => {
  try {
    const existing = await Rating.findOne({ user: req.user.id, temple: req.body.temple });
    if (existing) {
      existing.rating = req.body.rating;
      existing.review = req.body.review || existing.review;
      await existing.save();
      return ApiResponse.success(res, 'Rating updated', existing);
    }

    const rating = await Rating.create({ ...req.body, user: req.user.id });
    return ApiResponse.created(res, 'Rating submitted', rating);
  } catch (error) { next(error); }
};

export const getTempleRatings = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { temple: req.params.templeId };

    const [ratings, total] = await Promise.all([
      Rating.find(filter).populate('user', 'name avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Rating.countDocuments(filter),
    ]);

    const stats = await Rating.aggregate([
      { $match: { temple: ratings.length > 0 ? ratings[0].temple : null } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);

    return ApiResponse.paginated(res, 'Ratings fetched', { ratings, distribution: stats }, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};
