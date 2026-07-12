import Event from '../models/Event.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getEvents = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    if (req.query.temple) filter.temple = req.query.temple;
    if (req.query.upcoming === 'true') filter.endDate = { $gte: new Date() };

    const events = await Event.find(filter).populate('temple', 'name').sort({ startDate: 1 }).limit(20);
    return ApiResponse.success(res, 'Events fetched', events);
  } catch (error) { next(error); }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    return ApiResponse.created(res, 'Event created', event);
  } catch (error) { next(error); }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) throw ApiError.notFound('Event not found');
    return ApiResponse.success(res, 'Event updated', event);
  } catch (error) { next(error); }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) throw ApiError.notFound('Event not found');
    return ApiResponse.success(res, 'Event deleted');
  } catch (error) { next(error); }
};
