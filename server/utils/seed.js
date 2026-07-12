import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import Temple from '../models/Temple.js';
import DarshanSlot from '../models/DarshanSlot.js';
import Event from '../models/Event.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/darshanease';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    /* Clear existing data */
    await Promise.all([
      User.deleteMany({}),
      Temple.deleteMany({}),
      DarshanSlot.deleteMany({}),
      Event.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    /* Create Users */
    const hashedPassword = await bcrypt.hash('password123', 12);

    const [admin, organizer1, organizer2, user1, user2] = await User.create([
      { name: 'Admin User', email: 'admin@darshanease.com', password: hashedPassword, role: 'admin', isVerified: true, phone: '9876543210' },
      { name: 'Organizer Ravi', email: 'organizer@darshanease.com', password: hashedPassword, role: 'organizer', isVerified: true, phone: '9876543211' },
      { name: 'Organizer Priya', email: 'priya@darshanease.com', password: hashedPassword, role: 'organizer', isVerified: true, phone: '9876543212' },
      { name: 'Devotee Rahul', email: 'user@darshanease.com', password: hashedPassword, role: 'user', isVerified: true, phone: '9876543213' },
      { name: 'Devotee Lakshmi', email: 'lakshmi@darshanease.com', password: hashedPassword, role: 'user', isVerified: true, phone: '9876543214' },
    ]);
    console.log('Created 5 users');

    /* Create Temples */
    const temples = await Temple.create([
      {
        name: 'Sri Tirumala Tirupati Devasthanam',
        description: 'One of the most famous and richest temples in the world, dedicated to Lord Venkateswara. The temple sits atop the seven hills of Tirumala in Andhra Pradesh. Millions of devotees visit each year for divine darshan.',
        history: 'The temple has a history spanning over 2000 years. The Pallava kings built the first significant structures, followed by contributions from the Chola dynasty, Vijayanagara Empire, and various other rulers.',
        address: { line: 'Tirumala Hills', district: 'Tirupati', state: 'Andhra Pradesh', pincode: '517504', coordinates: { lat: 13.6833, lng: 79.3472 } },
        googleMapsUrl: 'https://maps.google.com/?q=Tirumala+Tirupati',
        timings: { openTime: '03:00', closeTime: '22:00' },
        darshanTypes: [
          { name: 'General Darshan', price: 300, duration: '2-3 hours', description: 'Free darshan through general queue' },
          { name: 'VIP Darshan', price: 500, duration: '45 mins', description: 'Special entry with priority access' },
          { name: 'Special Entry', price: 300, duration: '1 hour', description: 'Special entry darshan ticket' },
        ],
        dressCode: 'Traditional attire mandatory. Men: Dhoti/Pant with shirt. Women: Saree/Salwar.',
        facilities: ['Free Prasadam', 'Locker Rooms', 'Shoe Stand', 'Drinking Water', 'Rest Rooms', 'Wheel Chair', 'Medical Aid'],
        parking: { available: true, details: 'Multi-level parking available at Alipiri and Tirumala' },
        nearbyHotels: [
          { name: 'Fortune Kences Hotel', distance: '2 km', rating: 4.2 },
          { name: 'Hotel Bliss', distance: '3 km', rating: 3.8 },
        ],
        nearbyRestaurants: [
          { name: 'TTD Annadanam Complex', distance: '0.5 km', cuisine: 'South Indian' },
          { name: 'Maya Restaurant', distance: '2 km', cuisine: 'Multi-cuisine' },
        ],
        prasadamDetails: 'The famous Tirupati Laddu (Srivari Laddu) is offered to all devotees. Special prasadam available for VIP ticket holders.',
        rules: ['No leather items allowed', 'Mobile phones must be deposited at counters', 'Photography not allowed inside sanctum', 'Maintain queue discipline'],
        faqs: [
          { question: 'How to reach Tirumala?', answer: 'You can reach via Alipiri footpath (3,550 steps), Srivari Mettu (2 km trek), or by bus/private vehicle via the ghat road.' },
          { question: 'What is the darshan timing?', answer: 'Temple opens at 3:00 AM and closes at 10:00 PM. Darshan tokens are distributed from 3:00 AM.' },
          { question: 'Is accommodation available?', answer: 'Yes, TTD provides various accommodation options. Book online through the TTD website.' },
        ],
        festivals: [
          { name: 'Brahmotsavam', month: 'September-October', description: '9-day grand annual festival' },
          { name: 'Vaikuntha Ekadashi', month: 'December-January', description: 'Special darshan through Vaikuntha Dwaram' },
        ],
        heroBanner: 'tirumala.jpg',
        gallery: [
          'tirumala.jpg'
        ],
        organizer: organizer1._id,
        averageRating: 4.8,
        totalRatings: 1250,
        totalBookings: 50000,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Varanasi Kashi Vishwanath Temple',
        description: 'One of the twelve Jyotirlingas dedicated to Lord Shiva, located on the western bank of the holy river Ganga. The temple is the spiritual heart of Varanasi.',
        history: 'The temple has been destroyed and rebuilt multiple times over centuries. The current structure was built in 1780 by Maharani Ahilyabai Holkar. The Kashi Vishwanath Corridor was inaugurated in 2021.',
        address: { line: 'Lahori Tola', district: 'Varanasi', state: 'Uttar Pradesh', pincode: '221001', coordinates: { lat: 25.3109, lng: 83.0107 } },
        googleMapsUrl: 'https://maps.google.com/?q=Kashi+Vishwanath',
        timings: { openTime: '03:00', closeTime: '23:00' },
        darshanTypes: [
          { name: 'General Darshan', price: 0, duration: '30 mins', description: 'Regular darshan' },
          { name: 'Special Entry', price: 200, duration: '20 mins', description: 'Priority darshan' },
          { name: 'Aarti Darshan', price: 500, duration: '45 mins', description: 'Attend the divine Ganga Aarti' },
        ],
        dressCode: 'Traditional/Modest attire recommended',
        facilities: ['Ganga Aarti', 'Prasadam', 'Shoe Stand', 'Drinking Water', 'Rest Rooms'],
        parking: { available: true, details: 'Parking at Godowlia and nearby areas' },
        nearbyHotels: [
          { name: 'BrijRama Palace', distance: '1 km', rating: 4.5 },
        ],
        nearbyRestaurants: [
          { name: 'Kashi Chat Bhandar', distance: '0.5 km', cuisine: 'Street Food' },
        ],
        prasadamDetails: 'Bel Patra and Bhasma prasadam offered to devotees.',
        rules: ['Remove footwear before entering', 'Carry valid ID', 'No photography inside'],
        faqs: [
          { question: 'Best time to visit?', answer: 'Early morning (3-5 AM) for less crowd. Dev Deepawali in November is spectacular.' },
        ],
        festivals: [
          { name: 'Mahashivratri', month: 'February-March', description: 'Grand celebration of Lord Shiva' },
          { name: 'Dev Deepawali', month: 'November', description: 'Festival of lights on Ganga ghats' },
        ],
        heroBanner: 'kashi.jpg',
        gallery: [
          'kashi.jpg'
        ],
        organizer: organizer1._id,
        averageRating: 4.6,
        totalRatings: 890,
        totalBookings: 35000,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Meenakshi Amman Temple',
        description: 'A historic Hindu temple dedicated to Goddess Meenakshi (Parvati) and Lord Sundareswarar (Shiva). Famous for its stunning Dravidian architecture with 14 gateway towers (gopurams).',
        history: 'Built between 1623 and 1655 CE, though the original temple dates back over 2000 years. The temple complex covers 14 acres and contains 33,000 sculptures.',
        address: { line: 'Temple Area', district: 'Madurai', state: 'Tamil Nadu', pincode: '625001', coordinates: { lat: 9.9195, lng: 78.1193 } },
        googleMapsUrl: 'https://maps.google.com/?q=Meenakshi+Temple+Madurai',
        timings: { openTime: '05:00', closeTime: '21:30' },
        darshanTypes: [
          { name: 'General Darshan', price: 0, duration: '1 hour', description: 'Regular entry darshan' },
          { name: 'VIP Darshan', price: 200, duration: '30 mins', description: 'Priority darshan' },
          { name: 'Special Entry', price: 100, duration: '45 mins', description: 'Skip-the-line entry' },
        ],
        dressCode: 'Traditional attire preferred. No shorts or sleeveless tops.',
        facilities: ['Museum', 'Hall of 1000 Pillars', 'Golden Lotus Tank', 'Shoe Stand', 'Guide Service'],
        parking: { available: true, details: 'Parking available near East Tower' },
        nearbyHotels: [
          { name: 'Heritage Madurai', distance: '3 km', rating: 4.3 },
        ],
        nearbyRestaurants: [
          { name: 'Murugan Idli Shop', distance: '1 km', cuisine: 'South Indian' },
        ],
        prasadamDetails: 'Traditional prasadam including sweet pongal and vibhuti.',
        rules: ['Mobile phones allowed but no photography in sanctum', 'Bags at counter', 'No leather inside'],
        faqs: [
          { question: 'How many gopurams are there?', answer: 'The temple has 14 gopurams (gateway towers), with the tallest being the Southern tower at 52 meters.' },
        ],
        festivals: [
          { name: 'Chithirai Festival', month: 'April-May', description: 'Celestial wedding of Meenakshi and Sundareswarar' },
          { name: 'Navaratri', month: 'September-October', description: 'Nine nights of divine celebration' },
        ],
        heroBanner: 'meenakshi_temple.jpg',
        gallery: [
          'meenakshi_temple.jpg'
        ],
        organizer: organizer2._id,
        averageRating: 4.7,
        totalRatings: 670,
        totalBookings: 28000,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Jagannath Temple Puri',
        description: 'One of the Char Dhams, dedicated to Lord Jagannath (Vishnu). Famous for the annual Rath Yatra festival where massive chariots carry the deities through the streets.',
        history: 'Built in the 12th century by King Anantavarman Chodaganga Deva. The temple stands at 214 feet and is visible from far away, dominating the Puri skyline.',
        address: { line: 'Grand Road', district: 'Puri', state: 'Odisha', pincode: '752001', coordinates: { lat: 19.8048, lng: 85.8181 } },
        googleMapsUrl: 'https://maps.google.com/?q=Jagannath+Temple+Puri',
        timings: { openTime: '05:00', closeTime: '22:00' },
        darshanTypes: [
          { name: 'General Darshan', price: 0, duration: '1-2 hours', description: 'Regular darshan' },
          { name: 'Special Entry', price: 200, duration: '30 mins', description: 'Quick darshan' },
        ],
        dressCode: 'Traditional attire. Only Hindus allowed inside.',
        facilities: ['Ananda Bazaar', 'Mahaprasad', 'Rest Rooms', 'Shoe Stand'],
        parking: { available: true, details: 'Parking near Grand Road' },
        nearbyHotels: [
          { name: 'Mayfair Heritage', distance: '2 km', rating: 4.4 },
        ],
        nearbyRestaurants: [
          { name: 'Wildgrass Restaurant', distance: '1 km', cuisine: 'Odia Cuisine' },
        ],
        prasadamDetails: 'The famous Mahaprasad (56 dishes) cooked without onion and garlic in the world\'s largest kitchen.',
        rules: ['Non-Hindus not allowed inside', 'No leather items', 'No cameras/phones inside'],
        faqs: [
          { question: 'When is Rath Yatra?', answer: 'Rath Yatra falls in June-July on the second day of Shukla Paksha of Ashadha month.' },
        ],
        festivals: [
          { name: 'Rath Yatra', month: 'June-July', description: 'Grand chariot festival' },
          { name: 'Snana Yatra', month: 'June', description: 'Bathing ceremony of the deities' },
        ],
        heroBanner: 'jaganath.jpg',
        gallery: [
          'jaganath.jpg'
        ],
        organizer: organizer2._id,
        averageRating: 4.5,
        totalRatings: 520,
        totalBookings: 22000,
        isActive: true,
        isFeatured: false,
      },
      {
        name: 'Golden Temple (Harmandir Sahib)',
        description: 'The holiest Gurdwara and the most important pilgrimage site of Sikhism. Known for its stunning gold-plated architecture and the world\'s largest free kitchen (Langar).',
        history: 'Construction began in 1581 under Guru Arjan Dev Ji. The temple was rebuilt in marble and copper overlaid with gold foil in the early 19th century by Maharaja Ranjit Singh.',
        address: { line: 'Golden Temple Road', district: 'Amritsar', state: 'Punjab', pincode: '143006', coordinates: { lat: 31.6200, lng: 74.8765 } },
        googleMapsUrl: 'https://maps.google.com/?q=Golden+Temple+Amritsar',
        timings: { openTime: '02:00', closeTime: '22:00' },
        darshanTypes: [
          { name: 'General Darshan', price: 0, duration: '1-2 hours', description: 'Open to all, no ticket required' },
          { name: 'Seva Darshan', price: 0, duration: '3 hours', description: 'Participate in community service (Seva)' },
        ],
        dressCode: 'Head covering mandatory for all. Remove footwear. Modest attire.',
        facilities: ['Langar (Free Kitchen)', 'Sarovar', 'Museum', 'Accommodation', 'Shoe Stand'],
        parking: { available: true, details: 'Free parking available nearby' },
        nearbyHotels: [
          { name: 'Taj Swarna', distance: '3 km', rating: 4.6 },
        ],
        nearbyRestaurants: [
          { name: 'Bharawan Da Dhaba', distance: '1 km', cuisine: 'Punjabi' },
        ],
        prasadamDetails: 'Karah Prasad (sacred pudding) distributed to all visitors. Free Langar serves over 100,000 meals daily.',
        rules: ['Cover your head', 'Wash feet before entering', 'No smoking or alcohol', 'Photography allowed in outer areas only'],
        faqs: [
          { question: 'Is entry free?', answer: 'Yes, the Golden Temple is open to everyone regardless of religion, caste, or gender. Entry is completely free.' },
        ],
        festivals: [
          { name: 'Guru Nanak Jayanti', month: 'November', description: 'Birth anniversary of Guru Nanak Dev Ji' },
          { name: 'Baisakhi', month: 'April', description: 'Sikh New Year celebration' },
        ],
        heroBanner: 'golden_temple.jpg',
        gallery: [
          'golden_temple.jpg'
        ],
        organizer: organizer1._id,
        averageRating: 4.9,
        totalRatings: 2100,
        totalBookings: 60000,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Somnath Temple',
        description: 'The first among the twelve Aadi Jyotirlingas of Lord Shiva, located at the shore of the Arabian Sea. The temple has been destroyed and rebuilt several times throughout history.',
        history: 'The first temple was believed to have been built in gold by the Moon God. The current temple was reconstructed in 1951 under the initiative of Sardar Vallabhbhai Patel.',
        address: { line: 'Somnath Mandir Road', district: 'Gir Somnath', state: 'Gujarat', pincode: '362268', coordinates: { lat: 20.8880, lng: 70.4014 } },
        googleMapsUrl: 'https://maps.google.com/?q=Somnath+Temple',
        timings: { openTime: '06:00', closeTime: '21:00' },
        darshanTypes: [
          { name: 'General Darshan', price: 0, duration: '30 mins', description: 'Free darshan for all' },
          { name: 'Aarti Darshan', price: 100, duration: '45 mins', description: 'Attend the beach-side evening aarti' },
        ],
        dressCode: 'Traditional/Modest attire',
        facilities: ['Light & Sound Show', 'Museum', 'Beach Promenade', 'Prasadam', 'Rest Rooms'],
        parking: { available: true, details: 'Spacious parking available' },
        nearbyHotels: [
          { name: 'Lords Inn Somnath', distance: '1 km', rating: 4.0 },
        ],
        nearbyRestaurants: [
          { name: 'Shreeji Restaurant', distance: '0.5 km', cuisine: 'Gujarati' },
        ],
        prasadamDetails: 'Vibhuti and Bilva Patra prasadam.',
        rules: ['No photography inside sanctum', 'Deposit bags and shoes', 'Maintain silence'],
        faqs: [
          { question: 'What is the Light & Sound show timing?', answer: 'The show runs every evening from 8:00 PM to 9:00 PM. Entry fee: ₹25.' },
        ],
        festivals: [
          { name: 'Mahashivratri', month: 'February-March', description: 'Grand festival with night-long worship' },
          { name: 'Kartik Purnima', month: 'November', description: 'Full moon celebration at the seashore temple' },
        ],
        heroBanner: 'somnath.jpg',
        gallery: [
          'somnath.jpg'
        ],
        organizer: organizer2._id,
        averageRating: 4.4,
        totalRatings: 380,
        totalBookings: 15000,
        isActive: true,
        isFeatured: false,
      },
    ]);
    console.log(`Created ${temples.length} temples`);

    /* Create Darshan Slots */
    const today = new Date();
    const slots = [];

    for (let t = 0; t < temples.length; t++) {
      const temple = temples[t];
      for (let d = 0; d < 14; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() + d);

        for (const dt of temple.darshanTypes) {
          const timeSlots = [
            { start: '06:00', end: '08:00' },
            { start: '08:00', end: '10:00' },
            { start: '10:00', end: '12:00' },
            { start: '14:00', end: '16:00' },
            { start: '16:00', end: '18:00' },
          ];

          for (const ts of timeSlots) {
            const capacity = dt.name === 'VIP Darshan' ? 50 : dt.name === 'Special Entry' ? 100 : 200;
            const booked = Math.floor(Math.random() * capacity * 0.6);
            slots.push({
              temple: temple._id,
              date,
              darshanType: dt.name,
              startTime: ts.start,
              endTime: ts.end,
              totalCapacity: capacity,
              bookedCount: booked,
              price: dt.price,
              isActive: true,
            });
          }
        }
      }
    }

    await DarshanSlot.insertMany(slots);
    console.log(`Created ${slots.length} darshan slots`);

    /* Create Events */
    await Event.create([
      {
        temple: temples[0]._id,
        name: 'Brahmotsavam 2026',
        description: 'The grand annual 9-day festival at Tirumala with special processions and rituals.',
        startDate: new Date('2026-10-01'),
        endDate: new Date('2026-10-09'),
        isActive: true,
      },
      {
        temple: temples[1]._id,
        name: 'Dev Deepawali 2026',
        description: 'The festival of lights celebrated on the ghats of Varanasi with millions of diyas.',
        startDate: new Date('2026-11-15'),
        endDate: new Date('2026-11-15'),
        isActive: true,
      },
      {
        temple: temples[2]._id,
        name: 'Chithirai Festival 2026',
        description: 'The celestial wedding festival of Goddess Meenakshi and Lord Sundareswarar.',
        startDate: new Date('2026-04-20'),
        endDate: new Date('2026-05-03'),
        isActive: true,
      },
    ]);
    console.log('Created events');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Test Accounts:');
    console.log('─────────────────────────────────');
    console.log('Admin:     admin@darshanease.com / password123');
    console.log('Organizer: organizer@darshanease.com / password123');
    console.log('User:      user@darshanease.com / password123');
    console.log('─────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();
