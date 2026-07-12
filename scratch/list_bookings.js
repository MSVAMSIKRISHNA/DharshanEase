import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../server/.env' });

import Booking from '../server/models/Booking.js';
import User from '../server/models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/darshanease';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const bookings = await Booking.find().populate('user').populate('temple');
  console.log('Total bookings in DB:', bookings.length);
  for (const b of bookings) {
    console.log(`Booking ID: ${b.bookingId}, Status: ${b.status}`);
    console.log(`  User: ${b.user ? `${b.user.name} (${b.user.email}) [ID: ${b.user._id}]` : 'None'}`);
    console.log(`  Temple: ${b.temple ? b.temple.name : 'None'}`);
  }

  const users = await User.find();
  console.log('Total users in DB:', users.length);
  for (const u of users) {
    console.log(`User: ${u.name} (${u.email}) [ID: ${u._id}] [Role: ${u.role}]`);
  }

  await mongoose.disconnect();
}

run().catch(console.error);
