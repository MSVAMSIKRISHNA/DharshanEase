import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Star, Users, Calendar, ChevronRight, Heart, Share2, Ticket, Info, HelpCircle, Building } from 'lucide-react';
import { templeAPI, wishlistAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader';
import { formatTime, getImageUrl } from '../../utils/helpers';

const TempleDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useNotification();
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [wishlisted, setWishlisted] = useState(false);

  /* ── Fallback Temple Data (used when DB is empty or API fails) ── */
  const fallbackTemplesMap = {
    'temp_tirupati_001': {
      _id: 'temp_tirupati_001',
      name: 'Sri Tirumala Tirupati Devasthanam',
      description: 'One of the most famous and richest temples in the world, dedicated to Lord Venkateswara. The temple sits atop the seven hills of Tirumala in Andhra Pradesh. Millions of devotees visit each year making it the most visited holy place in the world. The presiding deity Lord Venkateswara is believed to have appeared here to save mankind from the trials and troubles of Kali Yuga.',
      history: 'The temple has a history spanning over 2000 years. The Pallava kings built the first significant structures, followed by contributions from the Chola dynasty, Vijayanagara Empire, and various other rulers. The temple was enriched by many dynasties who contributed to its architecture and endowments.',
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
      rules: ['No leather items allowed', 'Mobile phones must be deposited at counters', 'Photography not allowed inside sanctum', 'Maintain queue discipline', 'Carry valid ID proof'],
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
      averageRating: 4.8, totalRatings: 1250, totalBookings: 50000, isFeatured: true,
    },
    'temp_varanasi_002': {
      _id: 'temp_varanasi_002',
      name: 'Varanasi Kashi Vishwanath Temple',
      description: 'One of the twelve Jyotirlingas dedicated to Lord Shiva, located on the western bank of the holy river Ganga. The temple is the spiritual heart of Varanasi, one of the oldest living cities in the world. The temple has been a center of worship, pilgrimage, and spiritual enlightenment for thousands of years.',
      history: 'The temple has been destroyed and rebuilt multiple times over centuries. The current structure was built in 1780 by Maharani Ahilyabai Holkar. The Kashi Vishwanath Corridor was inaugurated in 2021, transforming the temple complex into a world-class pilgrimage destination.',
      address: { line: 'Lahori Tola', district: 'Varanasi', state: 'Uttar Pradesh', pincode: '221001', coordinates: { lat: 25.3109, lng: 83.0107 } },
      googleMapsUrl: 'https://maps.google.com/?q=Kashi+Vishwanath',
      timings: { openTime: '03:00', closeTime: '23:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '30 mins', description: 'Regular darshan' },
        { name: 'Special Entry', price: 200, duration: '20 mins', description: 'Priority darshan' },
        { name: 'Aarti Darshan', price: 500, duration: '45 mins', description: 'Attend the divine Ganga Aarti' },
      ],
      dressCode: 'Traditional/Modest attire recommended',
      facilities: ['Ganga Aarti', 'Prasadam', 'Shoe Stand', 'Drinking Water', 'Rest Rooms', 'Locker Facility'],
      parking: { available: true, details: 'Parking at Godowlia and nearby areas' },
      nearbyHotels: [
        { name: 'BrijRama Palace', distance: '1 km', rating: 4.5 },
        { name: 'Hotel Surya', distance: '2 km', rating: 4.0 },
      ],
      nearbyRestaurants: [
        { name: 'Kashi Chat Bhandar', distance: '0.5 km', cuisine: 'Street Food' },
        { name: 'Brown Bread Bakery', distance: '1 km', cuisine: 'Multi-cuisine' },
      ],
      prasadamDetails: 'Bel Patra and Bhasma prasadam offered to devotees.',
      rules: ['Remove footwear before entering', 'Carry valid ID', 'No photography inside', 'Maintain silence in sanctum'],
      faqs: [
        { question: 'Best time to visit?', answer: 'Early morning (3-5 AM) for less crowd. Dev Deepawali in November is spectacular.' },
        { question: 'Is the Ganga Aarti daily?', answer: 'Yes, the Ganga Aarti takes place every evening at the Dashashwamedh Ghat at around 6:30 PM.' },
      ],
      festivals: [
        { name: 'Mahashivratri', month: 'February-March', description: 'Grand celebration of Lord Shiva' },
        { name: 'Dev Deepawali', month: 'November', description: 'Festival of lights on Ganga ghats' },
      ],
      heroBanner: 'kashi.jpg',
      gallery: [
        'kashi.jpg'
      ],
      averageRating: 4.6, totalRatings: 890, totalBookings: 35000, isFeatured: true,
    },
    'temp_madurai_003': {
      _id: 'temp_madurai_003',
      name: 'Meenakshi Amman Temple',
      description: 'A historic Hindu temple dedicated to Goddess Meenakshi (Parvati) and Lord Sundareswarar (Shiva). Famous for its stunning Dravidian architecture with 14 gateway towers (gopurams). The temple complex covers 14 acres and contains 33,000 sculptures making it a masterpiece of South Indian architecture.',
      history: 'Built between 1623 and 1655 CE, though the original temple dates back over 2000 years. The temple was rebuilt by the Nayak rulers of Madurai. The Hall of Thousand Pillars is an architectural marvel.',
      address: { line: 'Temple Area', district: 'Madurai', state: 'Tamil Nadu', pincode: '625001', coordinates: { lat: 9.9195, lng: 78.1193 } },
      googleMapsUrl: 'https://maps.google.com/?q=Meenakshi+Temple+Madurai',
      timings: { openTime: '05:00', closeTime: '21:30' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '1 hour', description: 'Regular entry darshan' },
        { name: 'VIP Darshan', price: 200, duration: '30 mins', description: 'Priority darshan' },
        { name: 'Special Entry', price: 100, duration: '45 mins', description: 'Skip-the-line entry' },
      ],
      dressCode: 'Traditional attire preferred. No shorts or sleeveless tops.',
      facilities: ['Museum', 'Hall of 1000 Pillars', 'Golden Lotus Tank', 'Shoe Stand', 'Guide Service', 'Art Gallery'],
      parking: { available: true, details: 'Parking available near East Tower' },
      nearbyHotels: [
        { name: 'Heritage Madurai', distance: '3 km', rating: 4.3 },
        { name: 'GRT Regency', distance: '2 km', rating: 4.1 },
      ],
      nearbyRestaurants: [
        { name: 'Murugan Idli Shop', distance: '1 km', cuisine: 'South Indian' },
        { name: 'Amma Mess', distance: '0.5 km', cuisine: 'Traditional Tamil' },
      ],
      prasadamDetails: 'Traditional prasadam including sweet pongal and vibhuti.',
      rules: ['Mobile phones allowed but no photography in sanctum', 'Bags at counter', 'No leather inside', 'Maintain decorum'],
      faqs: [
        { question: 'How many gopurams are there?', answer: 'The temple has 14 gopurams (gateway towers), with the tallest being the Southern tower at 52 meters.' },
        { question: 'What is the Golden Lotus Tank?', answer: 'The Potramarai Kulam (Golden Lotus Tank) is a sacred tank within the temple where devotees take a holy dip.' },
      ],
      festivals: [
        { name: 'Chithirai Festival', month: 'April-May', description: 'Celestial wedding of Meenakshi and Sundareswarar' },
        { name: 'Navaratri', month: 'September-October', description: 'Nine nights of divine celebration' },
      ],
      heroBanner: 'meenakshi_temple.jpg',
      gallery: [
        'meenakshi_temple.jpg'
      ],
      averageRating: 4.7, totalRatings: 670, totalBookings: 28000, isFeatured: true,
    },
    'temp_puri_004': {
      _id: 'temp_puri_004',
      name: 'Jagannath Temple Puri',
      description: 'One of the Char Dhams, dedicated to Lord Jagannath (Vishnu). Famous for the annual Rath Yatra festival where massive chariots carry the deities through the streets. The temple stands at 214 feet and is visible from far away, dominating the Puri skyline.',
      history: 'Built in the 12th century by King Anantavarman Chodaganga Deva. The temple is known for its unique traditions including the Mahaprasad which is considered as the largest kitchen in the world serving over 10,000 people daily.',
      address: { line: 'Grand Road', district: 'Puri', state: 'Odisha', pincode: '752001', coordinates: { lat: 19.8048, lng: 85.8181 } },
      googleMapsUrl: 'https://maps.google.com/?q=Jagannath+Temple+Puri',
      timings: { openTime: '05:00', closeTime: '22:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '1-2 hours', description: 'Regular darshan' },
        { name: 'Special Entry', price: 200, duration: '30 mins', description: 'Quick darshan' },
      ],
      dressCode: 'Traditional attire. Only Hindus allowed inside.',
      facilities: ['Ananda Bazaar', 'Mahaprasad', 'Rest Rooms', 'Shoe Stand', 'Information Center'],
      parking: { available: true, details: 'Parking near Grand Road' },
      nearbyHotels: [
        { name: 'Mayfair Heritage', distance: '2 km', rating: 4.4 },
      ],
      nearbyRestaurants: [
        { name: 'Wildgrass Restaurant', distance: '1 km', cuisine: 'Odia Cuisine' },
      ],
      prasadamDetails: 'The famous Mahaprasad (56 dishes) cooked without onion and garlic in the world\'s largest kitchen.',
      rules: ['Non-Hindus not allowed inside', 'No leather items', 'No cameras/phones inside', 'Follow temple traditions'],
      faqs: [
        { question: 'When is Rath Yatra?', answer: 'Rath Yatra falls in June-July on the second day of Shukla Paksha of Ashadha month.' },
        { question: 'Can non-Hindus visit?', answer: 'Non-Hindus are not permitted inside the main temple but can view the temple from outside and visit the surrounding areas.' },
      ],
      festivals: [
        { name: 'Rath Yatra', month: 'June-July', description: 'Grand chariot festival' },
        { name: 'Snana Yatra', month: 'June', description: 'Bathing ceremony of the deities' },
      ],
      heroBanner: 'jaganath.jpg',
      gallery: [
        'jaganath.jpg'
      ],
      averageRating: 4.5, totalRatings: 520, totalBookings: 22000, isFeatured: false,
    },
    'temp_amritsar_005': {
      _id: 'temp_amritsar_005',
      name: 'Golden Temple (Harmandir Sahib)',
      description: 'The holiest Gurdwara and the most important pilgrimage site of Sikhism. Known for its stunning gold-plated architecture and the world\'s largest free kitchen (Langar) that serves over 100,000 meals daily to visitors of all backgrounds. The temple stands in the middle of the sacred Amrit Sarovar.',
      history: 'Construction began in 1581 under Guru Arjan Dev Ji. The temple was rebuilt in marble and copper overlaid with gold foil in the early 19th century by Maharaja Ranjit Singh. The Akal Takht within the complex is the highest seat of Sikh authority.',
      address: { line: 'Golden Temple Road', district: 'Amritsar', state: 'Punjab', pincode: '143006', coordinates: { lat: 31.6200, lng: 74.8765 } },
      googleMapsUrl: 'https://maps.google.com/?q=Golden+Temple+Amritsar',
      timings: { openTime: '02:00', closeTime: '22:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '1-2 hours', description: 'Open to all, no ticket required' },
        { name: 'Seva Darshan', price: 0, duration: '3 hours', description: 'Participate in community service (Seva)' },
      ],
      dressCode: 'Head covering mandatory for all. Remove footwear. Modest attire.',
      facilities: ['Langar (Free Kitchen)', 'Sarovar', 'Museum', 'Accommodation', 'Shoe Stand', 'Information Center'],
      parking: { available: true, details: 'Free parking available nearby' },
      nearbyHotels: [
        { name: 'Taj Swarna', distance: '3 km', rating: 4.6 },
        { name: 'Hyatt Amritsar', distance: '4 km', rating: 4.5 },
      ],
      nearbyRestaurants: [
        { name: 'Bharawan Da Dhaba', distance: '1 km', cuisine: 'Punjabi' },
        { name: 'Kesar Da Dhaba', distance: '1.5 km', cuisine: 'North Indian' },
      ],
      prasadamDetails: 'Karah Prasad (sacred pudding) distributed to all visitors. Free Langar serves over 100,000 meals daily.',
      rules: ['Cover your head', 'Wash feet before entering', 'No smoking or alcohol', 'Photography allowed in outer areas only'],
      faqs: [
        { question: 'Is entry free?', answer: 'Yes, the Golden Temple is open to everyone regardless of religion, caste, or gender. Entry is completely free.' },
        { question: 'What is Langar?', answer: 'Langar is the community kitchen that serves free meals to all visitors, serving vegetarian food 24/7.' },
      ],
      festivals: [
        { name: 'Guru Nanak Jayanti', month: 'November', description: 'Birth anniversary of Guru Nanak Dev Ji' },
        { name: 'Baisakhi', month: 'April', description: 'Sikh New Year celebration' },
      ],
      heroBanner: 'golden_temple.jpg',
      gallery: [
        'golden_temple.jpg'
      ],
      averageRating: 4.9, totalRatings: 2100, totalBookings: 60000, isFeatured: true,
    },
    'temp_somnath_006': {
      _id: 'temp_somnath_006',
      name: 'Somnath Temple',
      description: 'The first among the twelve Aadi Jyotirlingas of Lord Shiva, located at the shore of the Arabian Sea. The temple has been destroyed and rebuilt several times throughout history, symbolizing the resilience of Indian culture and spirituality.',
      history: 'The first temple was believed to have been built in gold by the Moon God. The current temple was reconstructed in 1951 under the initiative of Sardar Vallabhbhai Patel. The temple has witnessed destruction by multiple invaders and each time was rebuilt with greater grandeur.',
      address: { line: 'Somnath Mandir Road', district: 'Gir Somnath', state: 'Gujarat', pincode: '362268', coordinates: { lat: 20.8880, lng: 70.4014 } },
      googleMapsUrl: 'https://maps.google.com/?q=Somnath+Temple',
      timings: { openTime: '06:00', closeTime: '21:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '30 mins', description: 'Free darshan for all' },
        { name: 'Aarti Darshan', price: 100, duration: '45 mins', description: 'Attend the beach-side evening aarti' },
      ],
      dressCode: 'Traditional/Modest attire',
      facilities: ['Light & Sound Show', 'Museum', 'Beach Promenade', 'Prasadam', 'Rest Rooms', 'Souvenir Shop'],
      parking: { available: true, details: 'Spacious parking available' },
      nearbyHotels: [
        { name: 'Lords Inn Somnath', distance: '1 km', rating: 4.0 },
        { name: 'Hotel Somnath Sagar', distance: '0.5 km', rating: 3.8 },
      ],
      nearbyRestaurants: [
        { name: 'Shreeji Restaurant', distance: '0.5 km', cuisine: 'Gujarati' },
        { name: 'Hotel Ajanta', distance: '1 km', cuisine: 'Gujarati Thali' },
      ],
      prasadamDetails: 'Vibhuti and Bilva Patra prasadam.',
      rules: ['No photography inside sanctum', 'Deposit bags and shoes', 'Maintain silence', 'Follow queue discipline'],
      faqs: [
        { question: 'What is the Light & Sound show timing?', answer: 'The show runs every evening from 8:00 PM to 9:00 PM. Entry fee: ₹25.' },
        { question: 'Is the temple near the sea?', answer: 'Yes, the temple is located right at the seashore of the Arabian Sea, offering a magnificent view.' },
      ],
      festivals: [
        { name: 'Mahashivratri', month: 'February-March', description: 'Grand festival with night-long worship' },
        { name: 'Kartik Purnima', month: 'November', description: 'Full moon celebration at the seashore temple' },
      ],
      heroBanner: 'somnath.jpg',
      gallery: [
        'somnath.jpg'
      ],
      averageRating: 4.4, totalRatings: 380, totalBookings: 15000, isFeatured: false,
    },
  };

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        /* Check if this is a fallback temple ID */
        if (id.startsWith('temp_') && fallbackTemplesMap[id]) {
          setTemple(fallbackTemplesMap[id]);
          setLoading(false);
          return;
        }
        const res = await templeAPI.getById(id);
        setTemple(res.data.data);
      } catch {
        /* If API fails, try fallback data */
        if (fallbackTemplesMap[id]) {
          setTemple(fallbackTemplesMap[id]);
        } else {
          showError('Failed to load temple details');
        }
      }
      finally { setLoading(false); }
    };
    fetchTemple();
  }, [id]);

  const handleWishlist = async () => {
    if (!isAuthenticated) { showError('Please login to add to wishlist'); return; }
    try {
      const res = await wishlistAPI.toggle(id);
      setWishlisted(res.data.data.wishlisted);
      success(res.data.data.wishlisted ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { showError('Failed to update wishlist'); }
  };

  if (loading) return <Loader fullPage text="Loading temple details..." />;
  if (!temple) return <div className="container-custom" style={{ padding: 'var(--space-9) 0', textAlign: 'center' }}><h3>Temple not found</h3></div>;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'gallery', label: 'Gallery', icon: Building },
    { id: 'facilities', label: 'Facilities', icon: Building },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{
        backgroundImage: temple.heroBanner ? `linear-gradient(135deg, rgba(var(--dark-brown-rgb),0.85), rgba(var(--deep-maroon-rgb),0.8)), url(${getImageUrl(temple.heroBanner)})` : `linear-gradient(135deg, rgba(var(--dark-brown-rgb),0.9), rgba(var(--deep-maroon-rgb),0.85))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 320, display: 'flex', alignItems: 'flex-end', padding: 'var(--space-7) 0 var(--space-5)',
      }}>
        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
            <div className="animate-fade-in-up">
              {temple.isFeatured && <span className="badge-spiritual badge-saffron mb-2">⭐ Featured Temple</span>}
              <h1 style={{ color: '#fff', fontSize: 'var(--fs-4xl)', marginBottom: 'var(--space-2)' }}>{temple.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-sm)' }}>
                  <MapPin size={14} /> {temple.address?.line}, {temple.address?.district}, {temple.address?.state}
                </span>
                <span style={{ color: 'var(--saffron)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-sm)' }}>
                  <Star size={14} fill="var(--saffron)" /> {temple.averageRating} ({temple.totalRatings} reviews)
                </span>
                <span style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--fs-sm)' }}>
                  <Clock size={14} /> {formatTime(temple.timings?.openTime)} - {formatTime(temple.timings?.closeTime)}
                </span>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-ghost" onClick={handleWishlist} style={{ color: wishlisted ? 'var(--temple-red)' : '#fff', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)' }}>
                <Heart size={18} fill={wishlisted ? 'var(--temple-red)' : 'none'} />
              </button>
              <button className="btn btn-ghost" style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)' }}>
                <Share2 size={18} />
              </button>
              <Link to={isAuthenticated ? `/booking/${temple._id}` : '/login'} className="btn btn-primary">
                <Ticket size={16} /> Book Darshan
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom" style={{ padding: 'var(--space-5) 0 var(--space-9)' }}>
        <div className="row g-4">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Tabs */}
            <nav className="nav nav-pills mb-4">
              {tabs.map((tab) => (
                <button key={tab.id} className={`nav-link ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </nav>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                <div className="card p-4 mb-4">
                  <h5>About This Temple</h5>
                  <p style={{ lineHeight: 1.8 }}>{temple.description}</p>
                  {temple.history && (
                    <>
                      <h6 className="mt-4">History</h6>
                      <p style={{ lineHeight: 1.8 }}>{temple.history}</p>
                    </>
                  )}
                </div>

                {/* Darshan Types */}
                <div className="card p-4 mb-4">
                  <h5 className="mb-3">Darshan Types & Pricing</h5>
                  <div className="row g-3">
                    {temple.darshanTypes?.map((dt, i) => (
                      <div className="col-md-4" key={i}>
                        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                          <h6 style={{ color: 'var(--deep-maroon)', marginBottom: 'var(--space-1)' }}>{dt.name}</h6>
                          <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-bold)', color: 'var(--saffron)', marginBottom: 'var(--space-1)' }}>
                            {dt.price > 0 ? `₹${dt.price}` : 'Free'}
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)' }}>{dt.duration}</div>
                          {dt.description && <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', margin: 'var(--space-2) 0 0' }}>{dt.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rules */}
                {temple.rules?.length > 0 && (
                  <div className="card p-4 mb-4">
                    <h5 className="mb-3">Rules & Guidelines</h5>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {temple.rules.map((rule, i) => (
                        <li key={i} style={{ padding: 'var(--space-2) 0', borderBottom: i < temple.rules.length - 1 ? '1px solid var(--border-light)' : 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)' }}>
                          <ChevronRight size={14} color="var(--saffron)" /> {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Festivals */}
                {temple.festivals?.length > 0 && (
                  <div className="card p-4 mb-4">
                    <h5 className="mb-3">Festivals</h5>
                    <div className="row g-3">
                      {temple.festivals.map((f, i) => (
                        <div className="col-md-6" key={i}>
                          <div style={{ padding: 'var(--space-3)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--saffron)' }}>
                            <h6 style={{ marginBottom: 2 }}>{f.name}</h6>
                            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--saffron)' }}>{f.month}</span>
                            {f.description && <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', margin: 'var(--space-1) 0 0' }}>{f.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="animate-fade-in card p-4">
                <h5 className="mb-3">Temple Gallery</h5>
                {temple.gallery?.length > 0 ? (
                  <div className="row g-3">
                    {temple.gallery.map((img, i) => (
                      <div className="col-md-4" key={i}>
                        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: 200 }}>
                          <img src={getImageUrl(img)} alt={`Gallery ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No gallery images available yet.</p>
                )}
              </div>
            )}

            {/* Facilities Tab */}
            {activeTab === 'facilities' && (
              <div className="animate-fade-in">
                <div className="card p-4 mb-4">
                  <h5 className="mb-3">Facilities</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {temple.facilities?.map((f, i) => (
                      <span key={i} className="badge-spiritual badge-saffron" style={{ padding: '6px 14px', fontSize: 'var(--fs-sm)' }}>✓ {f}</span>
                    ))}
                  </div>
                </div>
                {temple.dressCode && (
                  <div className="card p-4 mb-4">
                    <h5 className="mb-2">Dress Code</h5>
                    <p style={{ margin: 0 }}>{temple.dressCode}</p>
                  </div>
                )}
                {temple.prasadamDetails && (
                  <div className="card p-4 mb-4">
                    <h5 className="mb-2">Prasadam Details</h5>
                    <p style={{ margin: 0 }}>{temple.prasadamDetails}</p>
                  </div>
                )}
                {temple.parking && (
                  <div className="card p-4 mb-4">
                    <h5 className="mb-2">Parking</h5>
                    <p style={{ margin: 0 }}>{temple.parking.available ? `Available — ${temple.parking.details || ''}` : 'Not available'}</p>
                  </div>
                )}
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
              <div className="animate-fade-in card p-4">
                <h5 className="mb-3">Frequently Asked Questions</h5>
                {temple.faqs?.length > 0 ? (
                  <div className="accordion" id="faqAccordion">
                    {temple.faqs.map((faq, i) => (
                      <div className="accordion-item" key={i} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-2)', overflow: 'hidden' }}>
                        <h6 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#faq${i}`} style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>
                            {faq.question}
                          </button>
                        </h6>
                        <div id={`faq${i}`} className="accordion-collapse collapse">
                          <div className="accordion-body" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
                            {faq.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No FAQs available.</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Book Now Card */}
            <div className="card p-4 mb-4" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + var(--space-4))' }}>
              <h5 className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={18} color="var(--saffron)" /> Book Darshan
              </h5>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                {temple.darshanTypes?.map((dt, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-light)', fontSize: 'var(--fs-sm)' }}>
                    <span>{dt.name}</span>
                    <span style={{ fontWeight: 'var(--fw-bold)', color: 'var(--deep-maroon)' }}>{dt.price > 0 ? `₹${dt.price}` : 'Free'}</span>
                  </div>
                ))}
              </div>
              <Link to={isAuthenticated ? `/booking/${temple._id}` : '/login'} className="btn btn-primary w-100" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Ticket size={18} /> Book Now
              </Link>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textAlign: 'center', margin: 'var(--space-2) 0 0' }}>
                Instant confirmation • QR Ticket
              </p>
            </div>

            {/* Quick Info */}
            <div className="card p-4 mb-4">
              <h6 className="mb-3">Quick Info</h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)' }}>
                  <Clock size={16} color="var(--saffron)" />
                  <div><strong>Timings:</strong> {formatTime(temple.timings?.openTime)} - {formatTime(temple.timings?.closeTime)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)' }}>
                  <Users size={16} color="var(--saffron)" />
                  <div><strong>Total Bookings:</strong> {temple.totalBookings?.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)' }}>
                  <MapPin size={16} color="var(--saffron)" />
                  <div>{temple.address?.district}, {temple.address?.state} {temple.address?.pincode}</div>
                </div>
              </div>
              {temple.googleMapsUrl && (
                <a href={temple.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary-custom btn-sm w-100 mt-3" style={{ fontSize: 'var(--fs-sm)' }}>
                  View on Google Maps
                </a>
              )}
            </div>

            {/* Nearby */}
            {(temple.nearbyHotels?.length > 0 || temple.nearbyRestaurants?.length > 0) && (
              <div className="card p-4">
                <h6 className="mb-3">Nearby</h6>
                {temple.nearbyHotels?.map((h, i) => (
                  <div key={i} style={{ padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-light)', fontSize: 'var(--fs-sm)' }}>
                    🏨 {h.name} — {h.distance} {h.rating && `(${h.rating}★)`}
                  </div>
                ))}
                {temple.nearbyRestaurants?.map((r, i) => (
                  <div key={i} style={{ padding: 'var(--space-2) 0', fontSize: 'var(--fs-sm)' }}>
                    🍽️ {r.name} — {r.distance} {r.cuisine && `(${r.cuisine})`}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TempleDetailsPage;
