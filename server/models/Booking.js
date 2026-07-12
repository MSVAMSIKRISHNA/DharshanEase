import mongoose from 'mongoose';

const devoteeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0, max: 150 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  idType: { type: String, enum: ['Aadhaar', 'PAN', 'Voter ID', 'Passport', 'Driving License'], required: true },
  idNumber: { type: String, required: true, trim: true },
}, { _id: false });

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple reference is required'],
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DarshanSlot',
      required: [true, 'Slot reference is required'],
    },
    visitDate: {
      type: Date,
      required: [true, 'Visit date is required'],
    },
    darshanType: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    devotees: {
      type: [devoteeSchema],
      required: true,
      validate: {
        validator: (v) => v.length >= 1 && v.length <= 10,
        message: 'Number of devotees must be between 1 and 10',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'expired'],
      default: 'pending',
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    qrCode: {
      type: String,
    },
    cancellationReason: String,
    cancelledAt: Date,
    refundStatus: {
      type: String,
      enum: ['none', 'pending', 'processed', 'failed'],
      default: 'none',
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

/* Indexes */
bookingSchema.index({ bookingId: 1 }, { unique: true });
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ temple: 1, visitDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ visitDate: 1 });

/* Virtual: devotee count */
bookingSchema.virtual('devoteeCount').get(function () {
  return this.devotees ? this.devotees.length : 0;
});

bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
