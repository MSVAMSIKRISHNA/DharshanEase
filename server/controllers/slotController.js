import DarshanSlot from '../models/DarshanSlot.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const createSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.create(req.body);
    return ApiResponse.created(res, 'Slot created successfully', slot);
  } catch (error) { next(error); }
};

export const updateSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!slot) throw ApiError.notFound('Slot not found');
    return ApiResponse.success(res, 'Slot updated successfully', slot);
  } catch (error) { next(error); }
};

export const deleteSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findByIdAndDelete(req.params.id);
    if (!slot) throw ApiError.notFound('Slot not found');
    return ApiResponse.success(res, 'Slot deleted successfully');
  } catch (error) { next(error); }
};

export const getAvailability = async (req, res, next) => {
  try {
    const { temple, date, darshanType } = req.query;
    const filter = { isActive: true };
    if (temple) filter.temple = temple;
    if (date) {
      const d = new Date(date);
      filter.date = {
        $gte: new Date(d.setHours(0, 0, 0, 0)),
        $lte: new Date(d.setHours(23, 59, 59, 999)),
      };
    }
    if (darshanType) filter.darshanType = darshanType;

    const slots = await DarshanSlot.find(filter)
      .populate('temple', 'name')
      .sort({ startTime: 1 });

    return ApiResponse.success(res, 'Availability fetched', slots);
  } catch (error) { next(error); }
};

export const getSlotsByTemple = async (req, res, next) => {
  try {
    const { date, darshanType } = req.query;
    const filter = { temple: req.params.templeId, isActive: true };

    if (date) {
      const d = new Date(date);
      filter.date = {
        $gte: new Date(d.setHours(0, 0, 0, 0)),
        $lte: new Date(d.setHours(23, 59, 59, 999)),
      };
    }
    if (darshanType) filter.darshanType = darshanType;

    const slots = await DarshanSlot.find(filter).sort({ date: 1, startTime: 1 });
    return ApiResponse.success(res, 'Slots fetched', slots);
  } catch (error) { next(error); }
};
