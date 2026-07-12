import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: 200,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ['booking', 'payment', 'cancellation', 'reminder', 'system', 'promotion', 'feedback'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: String,
    icon: String,
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
