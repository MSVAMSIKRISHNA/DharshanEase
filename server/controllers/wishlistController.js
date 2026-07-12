import Wishlist from '../models/Wishlist.js';
import ApiResponse from '../utils/ApiResponse.js';

export const toggleWishlist = async (req, res, next) => {
  try {
    const { templeId } = req.params;
    const existing = await Wishlist.findOne({ user: req.user.id, temple: templeId });

    if (existing) {
      await Wishlist.findByIdAndDelete(existing._id);
      return ApiResponse.success(res, 'Removed from wishlist', { wishlisted: false });
    }

    await Wishlist.create({ user: req.user.id, temple: templeId });
    return ApiResponse.success(res, 'Added to wishlist', { wishlisted: true });
  } catch (error) { next(error); }
};

export const getUserWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id })
      .populate({
        path: 'temple',
        select: 'name heroBanner address averageRating totalRatings darshanTypes slug',
      })
      .sort({ createdAt: -1 });

    return ApiResponse.success(res, 'Wishlist fetched', wishlist);
  } catch (error) { next(error); }
};
