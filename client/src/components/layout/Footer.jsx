import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-spiritual">
      <div className="container-custom">
        <div className="row g-4 g-lg-5">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', textDecoration: 'none', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 28 }}>🙏</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)', color: 'var(--soft-gold)' }}>
                  DarshanEase
                </span>
              </Link>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, maxWidth: 300 }}>
                Your trusted companion for hassle-free temple darshan bookings. Experience divine blessings with seamless online booking across India&apos;s sacred temples.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => { e.target.style.background = 'var(--saffron)'; e.target.style.borderColor = 'var(--saffron)'; e.target.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(255,255,255,0.15)'; e.target.style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5>Quick Links</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <Link to="/temples">Temples</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/faq">FAQs</Link>
              <Link to="/donations">Donations</Link>
            </div>
          </div>

          {/* Information */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5>Information</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/bookings">My Bookings</Link>
              <Link to="/feedback">Feedback</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <h5>Contact Us</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--fs-sm)' }}>
                <MapPin size={16} style={{ marginTop: 2, flexShrink: 0, color: 'var(--saffron)' }} />
                <span>DarshanEase Headquarters, Temple Street, Hyderabad, Telangana - 500001</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--fs-sm)' }}>
                <Phone size={16} style={{ flexShrink: 0, color: 'var(--saffron)' }} />
                <span>+91 1800-XXX-XXXX (Toll Free)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--fs-sm)' }}>
                <Mail size={16} style={{ flexShrink: 0, color: 'var(--saffron)' }} />
                <span>support@darshanease.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p style={{ margin: 0 }}>
            © {currentYear} DarshanEase. All rights reserved. Made with 🙏 for devotees across India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
