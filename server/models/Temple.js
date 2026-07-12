import mongoose from 'mongoose';

const templeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Temple name is required'],
      trim: true,
      maxlength: [150, 'Temple name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    history: {
      type: String,
      maxlength: [5000, 'History cannot exceed 5000 characters'],
    },
    heroBanner: {
      type: String,
      default: '',
    },
    gallery: [{
      type: String,
    }],
    address: {
      line: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    googleMapsUrl: String,
    timings: {
      openTime: { type: String, required: true },
      closeTime: { type: String, required: true },
    },
    darshanTypes: [{
      name: {
        type: String,
        required: true,
        enum: ['General Darshan', 'VIP Darshan', 'Special Entry', 'Seva Darshan', 'Aarti Darshan'],
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      duration: {
        type: String,
        default: '30 mins',
      },
      description: String,
    }],
    dressCode: {
      type: String,
      default: 'Traditional attire recommended',
    },
    facilities: [{
      type: String,
    }],
    parking: {
      available: { type: Boolean, default: true },
      details: String,
    },
    nearbyHotels: [{
      name: String,
      distance: String,
      rating: Number,
    }],
    nearbyRestaurants: [{
      name: String,
      distance: String,
      cuisine: String,
    }],
    prasadamDetails: {
      type: String,
    },
    rules: [{
      type: String,
    }],
    faqs: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
    }],
    festivals: [{
      name: { type: String, required: true },
      month: String,
      description: String,
    }],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* Indexes */
templeSchema.index({ name: 'text', description: 'text', 'address.district': 'text', 'address.state': 'text' });
templeSchema.index({ 'address.state': 1 });
templeSchema.index({ 'address.district': 1 });
templeSchema.index({ organizer: 1 });
templeSchema.index({ isActive: 1, isFeatured: 1 });
templeSchema.index({ averageRating: -1 });
templeSchema.index({ totalBookings: -1 });

/* Generate slug before saving */
templeSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    this.slug += '-' + this._id.toString().slice(-6);
  }
  next();
});

const Temple = mongoose.model('Temple', templeSchema);
export default Temple;
