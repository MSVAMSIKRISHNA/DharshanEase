import Notification from '../models/Notification.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getPagination } from '../utils/helpers.js';

export const getUserNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { user: req.user.id };

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter),
      Notification.countDocuments({ ...filter, isRead: false }),
    ]);

    return ApiResponse.paginated(res, 'Notifications fetched', { notifications, unreadCount }, {
      page, limit, total, pages: Math.ceil(total / limit),
    });
  } catch (error) { next(error); }
};

export const markAsRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    return ApiResponse.success(res, 'Notification marked as read');
  } catch (error) { next(error); }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
    return ApiResponse.success(res, 'All notifications marked as read');
  } catch (error) { next(error); }
};
