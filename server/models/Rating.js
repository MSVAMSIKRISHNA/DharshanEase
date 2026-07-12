import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    review: {
      type: String,
      maxlength: [500, 'Review cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

/* One rating per user per temple */
ratingSchema.index({ user: 1, temple: 1 }, { unique: true });
ratingSchema.index({ temple: 1, rating: -1 });

/* Update temple average rating after save */
ratingSchema.post('save', async function () {
  const Rating = this.constructor;
  const stats = await Rating.aggregate([
    { $match: { temple: this.temple } },
    {
      $group: {
        _id: '$temple',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  const Temple = mongoose.model('Temple');
  if (stats.length > 0) {
    await Temple.findByIdAndUpdate(this.temple, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalRatings: stats[0].totalRatings,
    });
  }
});

/* Update average on delete */
ratingSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const Rating = mongoose.model('Rating');
    const stats = await Rating.aggregate([
      { $match: { temple: doc.temple } },
      {
        $group: {
          _id: '$temple',
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const Temple = mongoose.model('Temple');
    if (stats.length > 0) {
      await Temple.findByIdAndUpdate(doc.temple, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        totalRatings: stats[0].totalRatings,
      });
    } else {
      await Temple.findByIdAndUpdate(doc.temple, {
        averageRating: 0,
        totalRatings: 0,
      });
    }
  }
});

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
