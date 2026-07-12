import mongoose from 'mongoose';

const darshanSlotSchema = new mongoose.Schema(
  {
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple reference is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    darshanType: {
      type: String,
      required: [true, 'Darshan type is required'],
      enum: ['General Darshan', 'VIP Darshan', 'Special Entry', 'Seva Darshan', 'Aarti Darshan'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    totalCapacity: {
      type: Number,
      required: [true, 'Total capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['available', 'filling', 'full', 'closed'],
      default: 'available',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* Compound index for efficient lookups */
darshanSlotSchema.index({ temple: 1, date: 1, darshanType: 1 });
darshanSlotSchema.index({ date: 1, status: 1 });
darshanSlotSchema.index({ temple: 1, date: 1, isActive: 1 });

/* Virtual: available count */
darshanSlotSchema.virtual('availableCount').get(function () {
  return Math.max(0, this.totalCapacity - this.bookedCount);
});

/* Virtual: availability percentage */
darshanSlotSchema.virtual('availabilityPercentage').get(function () {
  if (this.totalCapacity === 0) return 0;
  return Math.round(((this.totalCapacity - this.bookedCount) / this.totalCapacity) * 100);
});

/* Update status based on booking count */
darshanSlotSchema.pre('save', function (next) {
  const percentage = this.totalCapacity > 0
    ? ((this.totalCapacity - this.bookedCount) / this.totalCapacity) * 100
    : 0;

  if (this.bookedCount >= this.totalCapacity) {
    this.status = 'full';
  } else if (percentage <= 20) {
    this.status = 'filling';
  } else {
    this.status = 'available';
  }

  next();
});

const DarshanSlot = mongoose.model('DarshanSlot', darshanSlotSchema);
export default DarshanSlot;
