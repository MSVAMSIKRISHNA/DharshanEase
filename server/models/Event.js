import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    image: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ temple: 1, startDate: 1 });
eventSchema.index({ isActive: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
