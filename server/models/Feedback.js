import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: ['General', 'Service', 'Cleanliness', 'Facilities', 'Staff', 'Timing', 'Suggestion', 'Complaint'],
      default: 'General',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminReply: {
      message: String,
      repliedAt: Date,
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ user: 1 });
feedbackSchema.index({ temple: 1 });
feedbackSchema.index({ status: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
