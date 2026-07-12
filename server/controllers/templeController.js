import Temple from '../models/Temple.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getPagination, getSortOptions } from '../utils/helpers.js';

export const getAllTemples = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSortOptions(req.query.sort, '-createdAt');
    const filter = { isActive: true };

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    if (req.query.state) filter['address.state'] = req.query.state;
    if (req.query.district) filter['address.district'] = req.query.district;
    if (req.query.darshanType) {
      filter['darshanTypes.name'] = req.query.darshanType;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter['darshanTypes.price'] = {};
      if (req.query.minPrice) filter['darshanTypes.price'].$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter['darshanTypes.price'].$lte = Number(req.query.maxPrice);
    }
    if (req.query.featured === 'true') filter.isFeatured = true;

    const [temples, total] = await Promise.all([
      Temple.find(filter)
        .populate('organizer', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-history -faqs -rules -nearbyHotels -nearbyRestaurants'),
      Temple.countDocuments(filter),
    ]);

    return ApiResponse.paginated(res, 'Temples fetched successfully', temples, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) { next(error); }
};

export const getTempleById = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id).populate('organizer', 'name email');
    if (!temple) throw ApiError.notFound('Temple not found');
    return ApiResponse.success(res, 'Temple fetched successfully', temple);
  } catch (error) { next(error); }
};

export const createTemple = async (req, res, next) => {
  try {
    req.body.organizer = req.user.id;
    const temple = await Temple.create(req.body);
    return ApiResponse.created(res, 'Temple created successfully', temple);
  } catch (error) { next(error); }
};

export const updateTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) throw ApiError.notFound('Temple not found');

    if (req.user.role !== 'admin' && temple.organizer.toString() !== req.user.id) {
      throw ApiError.forbidden('You are not authorized to update this temple');
    }

    Object.assign(temple, req.body);
    await temple.save();
    return ApiResponse.success(res, 'Temple updated successfully', temple);
  } catch (error) { next(error); }
};

export const deleteTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findByIdAndDelete(req.params.id);
    if (!temple) throw ApiError.notFound('Temple not found');
    return ApiResponse.success(res, 'Temple deleted successfully');
  } catch (error) { next(error); }
};

export const uploadTempleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw ApiError.badRequest('Please upload at least one image');
    }
    const temple = await Temple.findById(req.params.id);
    if (!temple) throw ApiError.notFound('Temple not found');
    if (req.user.role !== 'admin' && temple.organizer.toString() !== req.user.id) {
      throw ApiError.forbidden('Not authorized');
    }

    const filenames = req.files.map((f) => f.filename);
    temple.gallery.push(...filenames);
    if (!temple.heroBanner && filenames.length > 0) {
      temple.heroBanner = filenames[0];
    }
    await temple.save();
    return ApiResponse.success(res, 'Images uploaded successfully', temple);
  } catch (error) { next(error); }
};

export const getPopularTemples = async (req, res, next) => {
  try {
    const temples = await Temple.find({ isActive: true })
      .sort({ totalBookings: -1, averageRating: -1 })
      .limit(8)
      .select('name heroBanner address averageRating totalRatings darshanTypes slug');
    return ApiResponse.success(res, 'Popular temples fetched', temples);
  } catch (error) { next(error); }
};
