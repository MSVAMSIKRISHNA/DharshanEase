import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const ContactPage = () => {
  const { addNotification } = useNotification();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1200));
    addNotification('Your message has been sent! We\'ll get back to you soon.', 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email Us', value: 'support@darshanease.com', desc: 'We reply within 24 hours' },
    { icon: Phone, label: 'Call Us', value: '+91 1800-123-4567', desc: 'Toll-free, Mon–Sat' },
    { icon: MapPin, label: 'Visit Us', value: 'Hyderabad, Telangana', desc: 'India' },
    { icon: Clock, label: 'Working Hours', value: 'Mon–Sat: 9 AM – 7 PM', desc: 'IST' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(165deg, var(--deep-maroon) 0%, var(--dark-brown) 60%, #1a0a06 100%)',
        padding: 'var(--space-10) 0 var(--space-9)', textAlign: 'center',
      }}>
        <div className="container-custom">
          <span className="badge-spiritual badge-saffron" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>
            📞 Get in Touch
          </span>
          <h1 style={{ color: 'var(--white)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-3)' }}>
            Contact <span className="gradient-text-gold">Us</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto' }}>
            Have questions or need help? Our team is here to assist you on your spiritual journey.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container-custom">
          <div className="row g-5">
            {/* Contact Form */}
            <div className="col-lg-7">
              <div style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)', border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-card)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.1), rgba(var(--deep-maroon-rgb),0.08))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <MessageSquare size={22} color="var(--saffron)" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>Send us a Message</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>
                      Fill out the form and we&apos;ll respond promptly
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text" name="name" className="form-control"
                        placeholder="Your name" value={form.name} onChange={handleChange} required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email" name="email" className="form-control"
                        placeholder="you@example.com" value={form.email} onChange={handleChange} required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Subject</label>
                      <input
                        type="text" name="subject" className="form-control"
                        placeholder="How can we help?" value={form.subject} onChange={handleChange} required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea
                        name="message" className="form-control" rows={5}
                        placeholder="Tell us more..." value={form.message} onChange={handleChange} required
                      />
                    </div>
                    <div className="col-12">
                      <button
                        type="submit" className="btn btn-primary"
                        disabled={sending}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '12px 32px' }}
                      >
                        <Send size={16} />
                        {sending ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-5">
              <div className="row g-3">
                {contactInfo.map((info, i) => (
                  <div className="col-12" key={i}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                      padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-light)', background: 'var(--bg-card)',
                      transition: 'all var(--transition-base)',
                    }}>
                      <div style={{
                        width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.1), rgba(var(--deep-maroon-rgb),0.08))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <info.icon size={22} color="var(--saffron)" />
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', fontWeight: 'var(--fw-medium)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {info.label}
                        </div>
                        <div style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--text-primary)' }}>{info.value}</div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{info.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
