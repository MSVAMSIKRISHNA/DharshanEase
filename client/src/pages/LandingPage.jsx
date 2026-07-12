import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, Shield, Clock, CreditCard, Smartphone } from 'lucide-react';
import { templeAPI, eventAPI } from '../services/api';
import { getImageUrl } from '../utils/helpers';

const LandingPage = () => {
  const [temples, setTemples] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templesRes, eventsRes] = await Promise.all([
          templeAPI.getPopular().catch(() => ({ data: { data: [] } })),
          eventAPI.getAll({ upcoming: 'true' }).catch(() => ({ data: { data: [] } })),
        ]);
        setTemples(templesRes.data.data || []);
        setEvents(eventsRes.data.data || []);
      } catch { /* silently handle if API not running */ }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/temples?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const features = [
    { icon: Shield, title: 'Secure Booking', desc: 'End-to-end encrypted transactions with instant confirmation' },
    { icon: Clock, title: 'Live Availability', desc: 'Real-time slot updates so you never miss your darshan' },
    { icon: CreditCard, title: 'Easy Payments', desc: 'Multiple payment options including UPI, cards, and wallets' },
    { icon: Smartphone, title: 'Digital Tickets', desc: 'QR-coded tickets with PDF download — no printouts needed' },
  ];

  const steps = [
    { num: '01', title: 'Choose Temple', desc: 'Browse from hundreds of sacred temples across India' },
    { num: '02', title: 'Select Date & Slot', desc: 'Pick your preferred date and darshan time slot' },
    { num: '03', title: 'Add Devotee Details', desc: 'Enter details for all devotees visiting the temple' },
    { num: '04', title: 'Pay & Get Ticket', desc: 'Make secure payment and receive your QR ticket instantly' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="hero-content animate-fade-in-up">
                <span className="badge-spiritual badge-saffron" style={{ marginBottom: 'var(--space-4)', padding: '6px 16px', fontSize: 'var(--fs-xs)' }}>
                  🙏 India&apos;s Most Trusted Temple Booking Platform
                </span>
                <h1>
                  Your Divine Journey <br />
                  <span className="gradient-text-gold">Starts Here</span>
                </h1>
                <p>
                  Book hassle-free darshan tickets at India&apos;s most sacred temples.
                  Skip the queues, choose your preferred time, and experience divinity at your convenience.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{ maxWidth: 500 }}>
                  <div className="search-bar-spiritual">
                    <Search className="search-icon" size={18} />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search temples by name, city, or state..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingRight: 120 }}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        position: 'absolute',
                        right: 4,
                        top: 4,
                        bottom: 4,
                        borderRadius: 'var(--radius-full)',
                        padding: '0 24px',
                      }}
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Stats */}
                <div className="hero-stats animate-fade-in-up delay-3">
                  <div>
                    <span className="hero-stat-value">500+</span>
                    <span className="hero-stat-label">Temples</span>
                  </div>
                  <div>
                    <span className="hero-stat-value">1M+</span>
                    <span className="hero-stat-label">Bookings</span>
                  </div>
                  <div>
                    <span className="hero-stat-value">4.8</span>
                    <span className="hero-stat-label">Rating</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div className="animate-fade-in-right delay-2" style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '160px',
                  opacity: 0.15,
                  lineHeight: 1,
                  marginTop: '-20px',
                }}>
                  🛕
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ background: 'var(--bg-card)' }}>
        <div className="container-custom">
          <div className="text-center mb-5 animate-fade-in-up">
            <h2 className="section-title">Why Choose <span className="gradient-text">DarshanEase</span></h2>
            <div className="section-divider" style={{ margin: 'var(--space-3) auto var(--space-4)' }} />
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Experience seamless temple darshan booking with modern convenience
            </p>
          </div>

          <div className="row g-4">
            {features.map((feature, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className={`animate-fade-in-up delay-${i + 1}`} style={{
                  padding: 'var(--space-6) var(--space-5)',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  height: '100%',
                  transition: 'all var(--transition-base)',
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.1), rgba(var(--deep-maroon-rgb),0.08))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-4)',
                  }}>
                    <feature.icon size={28} color="var(--saffron)" />
                  </div>
                  <h5 style={{ fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-2)' }}>{feature.title}</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Temples */}
      <section className="section">
        <div className="container-custom">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="section-title">Popular <span className="gradient-text">Temples</span></h2>
              <div className="section-divider" />
              <p className="section-subtitle">Book darshan at India&apos;s most visited temples</p>
            </div>
            <Link to="/temples" className="btn btn-secondary-custom d-none d-md-inline-flex" style={{ gap: 'var(--space-2)', display: 'inline-flex', alignItems: 'center' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {(temples.length > 0 ? temples : [
              { _id: 'temp_tirupati_001', name: 'Sri Tirumala Tirupati Devasthanam', address: { district: 'Tirupati', state: 'Andhra Pradesh' }, averageRating: 4.8, totalRatings: 1250, darshanTypes: [{ price: 300 }], isFeatured: true, heroBanner: 'tirumala.jpg' },
              { _id: 'temp_varanasi_002', name: 'Varanasi Kashi Vishwanath Temple', address: { district: 'Varanasi', state: 'Uttar Pradesh' }, averageRating: 4.6, totalRatings: 890, darshanTypes: [{ price: 0 }], isFeatured: true, heroBanner: 'kashi.jpg' },
              { _id: 'temp_madurai_003', name: 'Meenakshi Amman Temple', address: { district: 'Madurai', state: 'Tamil Nadu' }, averageRating: 4.7, totalRatings: 670, darshanTypes: [{ price: 0 }], isFeatured: true, heroBanner: 'meenakshi_temple.jpg' },
              { _id: 'temp_amritsar_005', name: 'Golden Temple (Harmandir Sahib)', address: { district: 'Amritsar', state: 'Punjab' }, averageRating: 4.9, totalRatings: 2100, darshanTypes: [{ price: 0 }], isFeatured: true, heroBanner: 'golden_temple.jpg' },
            ]).slice(0, 4).map((temple, i) => (
              <div className="col-md-6 col-lg-3" key={temple._id}>
                <Link to={`/temples/${temple._id}`} style={{ textDecoration: 'none' }}>
                  <div className={`temple-card animate-fade-in-up delay-${i + 1}`}>
                    <div className="temple-card-img-wrapper" style={{
                      background: `linear-gradient(135deg, hsl(${20 + i * 30}, 60%, 40%), hsl(${40 + i * 30}, 50%, 30%))`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {temple.heroBanner ? (
                        <img src={getImageUrl(temple.heroBanner)} alt={temple.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 64, opacity: 0.4 }}>🛕</span>
                      )}
                    </div>
                    <div className="temple-card-body">
                      <h6 className="temple-card-title" style={{ fontSize: 'var(--fs-md)' }}>{temple.name}</h6>
                      <div className="temple-card-location">
                        <MapPin size={13} />
                        <span>{temple.address?.district}, {temple.address?.state}</span>
                      </div>
                      <div className="temple-card-meta">
                        <span className="temple-card-price">
                          {temple.darshanTypes?.[0]?.price > 0 ? `₹${temple.darshanTypes[0].price}` : 'Free'}
                          <small> /person</small>
                        </span>
                        <span className="temple-card-rating">
                          <Star size={14} fill="var(--soft-gold)" stroke="var(--soft-gold)" />
                          {temple.averageRating} ({temple.totalRatings})
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center d-md-none mt-4">
            <Link to="/temples" className="btn btn-secondary-custom">
              View All Temples <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'var(--bg-card)' }}>
        <div className="container-custom">
          <div className="text-center mb-5">
            <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
            <div className="section-divider" style={{ margin: 'var(--space-3) auto var(--space-4)' }} />
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Book your darshan in 4 simple steps</p>
          </div>

          <div className="row g-4">
            {steps.map((step, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className={`animate-fade-in-up delay-${i + 1}`} style={{
                  textAlign: 'center',
                  padding: 'var(--space-5)',
                  position: 'relative',
                }}>
                  <div style={{
                    fontSize: 'var(--fs-5xl)',
                    fontWeight: 'var(--fw-bold)',
                    fontFamily: 'var(--font-heading)',
                    background: 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.15), rgba(var(--deep-maroon-rgb),0.08))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: 'var(--space-3)',
                  }}>
                    {step.num}
                  </div>
                  <h5 style={{ marginBottom: 'var(--space-2)' }}>{step.title}</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--deep-maroon), var(--dark-brown))',
        padding: 'var(--space-9) 0',
        textAlign: 'center',
      }}>
        <div className="container-custom animate-fade-in-up">
          <h2 style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-3)' }}>
            Ready to Begin Your <span style={{ color: 'var(--saffron)' }}>Spiritual Journey</span>?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-6)', maxWidth: 500, margin: '0 auto var(--space-6)' }}>
            Join millions of devotees who trust DarshanEase for their temple darshan bookings.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: 'var(--fs-md)' }}>
              Create Free Account
            </Link>
            <Link to="/temples" className="btn btn-secondary-custom" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--white)', padding: '14px 36px', fontSize: 'var(--fs-md)' }}>
              Browse Temples
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
