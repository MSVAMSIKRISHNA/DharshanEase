import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

/* One entry per user per temple */
wishlistSchema.index({ user: 1, temple: 1 }, { unique: true });
wishlistSchema.index({ user: 1 });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;
