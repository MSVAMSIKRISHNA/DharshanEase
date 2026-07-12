import { useState, useEffect } from 'react';
import { MessageSquare, Star, Send, Building2 } from 'lucide-react';
import { feedbackAPI, bookingAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { formatDate, getStarArray } from '../utils/helpers';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const FeedbackPage = () => {
  const { addNotification } = useNotification();
  const [feedbacks, setFeedbacks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    temple: '', rating: 5, subject: '', message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingRes = await bookingAPI.getAll({ status: 'completed', limit: 50 }).catch(() => ({ data: { data: { bookings: [] } } }));
        setBookings(bookingRes.data.data?.bookings || bookingRes.data.data || []);
      } catch { /* */ }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await feedbackAPI.create({
        temple: form.temple,
        rating: Number(form.rating),
        subject: form.subject,
        message: form.message,
      });
      setFeedbacks([res.data.data, ...feedbacks]);
      addNotification('Feedback submitted successfully! 🙏', 'success');
      setForm({ temple: '', rating: 5, subject: '', message: '' });
      setShowForm(false);
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to submit feedback', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullPage text="Loading..." />;

  const uniqueTemples = [...new Map(bookings.map((b) => [b.temple?._id, b.temple]).filter(([id]) => id)).values()];

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
            My <span className="gradient-text">Feedback</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Share your darshan experience and help others</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '10px 24px' }}
        >
          <MessageSquare size={16} /> {showForm ? 'Cancel' : 'Write Feedback'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)', border: '1px solid var(--border-light)',
          marginBottom: 'var(--space-5)', boxShadow: 'var(--shadow-card)',
        }}>
          <h5 style={{ marginBottom: 'var(--space-4)' }}>Submit Feedback</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Temple</label>
                <select name="temple" className="form-control" value={form.temple} onChange={handleChange} required>
                  <option value="">Select temple...</option>
                  {uniqueTemples.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Rating</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                        transition: 'transform var(--transition-fast)',
                        transform: n <= form.rating ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      <Star size={28}
                        fill={n <= form.rating ? 'var(--soft-gold)' : 'transparent'}
                        stroke={n <= form.rating ? 'var(--soft-gold)' : 'var(--border-color)'}
                      />
                    </button>
                  ))}
                  <span style={{ marginLeft: 'var(--space-2)', fontWeight: 'var(--fw-semibold)' }}>
                    {form.rating}/5
                  </span>
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">Subject</label>
                <input type="text" name="subject" className="form-control"
                  placeholder="Brief summary of your feedback" value={form.subject} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <label className="form-label">Your Experience</label>
                <textarea name="message" className="form-control" rows={4}
                  placeholder="Tell us about your darshan experience..." value={form.message} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={submitting}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '12px 32px' }}
                >
                  <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Feedback List */}
      {feedbacks.length === 0 && !showForm ? (
        <EmptyState
          icon="💬"
          title="No feedback yet"
          message="After completing a darshan, share your experience to help other devotees."
          actionText="Write Feedback"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="row g-4">
          {feedbacks.map((fb) => (
            <div className="col-12" key={fb._id}>
              <div style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-5)', border: '1px solid var(--border-light)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <h6 style={{ margin: 0 }}>{fb.subject}</h6>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 4, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                      <Building2 size={13} /> {fb.temple?.name || 'Temple'}
                      <span>•</span>
                      {formatDate(fb.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {getStarArray(fb.rating).map((s, i) => (
                      <Star key={i} size={16}
                        fill={s === 'full' ? 'var(--soft-gold)' : 'transparent'}
                        stroke={s === 'empty' ? 'var(--border-color)' : 'var(--soft-gold)'}
                      />
                    ))}
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, margin: 0 }}>
                  {fb.message}
                </p>
                {fb.reply && (
                  <div style={{
                    marginTop: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid var(--saffron)',
                  }}>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--saffron)', fontWeight: 'var(--fw-semibold)', marginBottom: 4 }}>
                      Temple Response
                    </div>
                    <p style={{ fontSize: 'var(--fs-sm)', margin: 0, color: 'var(--text-secondary)' }}>{fb.reply}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
