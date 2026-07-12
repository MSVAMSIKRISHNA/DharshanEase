import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Minimum donation is ₹1'],
    },
    purpose: {
      type: String,
      enum: ['General', 'Temple Renovation', 'Annadanam', 'Festival', 'Pooja', 'Education', 'Other'],
      default: 'General',
    },
    method: {
      type: String,
      enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'],
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      maxlength: 500,
    },
    receipt: String,
  },
  {
    timestamps: true,
  }
);

donationSchema.index({ user: 1, createdAt: -1 });
donationSchema.index({ temple: 1 });
donationSchema.index({ status: 1 });

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
