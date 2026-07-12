import { useState, useEffect } from 'react';
import { Gift, IndianRupee, Building2, Calendar } from 'lucide-react';
import { donationAPI, templeAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const DonationsPage = () => {
  const { addNotification } = useNotification();
  const [donations, setDonations] = useState([]);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    temple: '', amount: '', purpose: 'General', message: '',
  });

  const purposes = ['General', 'Temple Maintenance', 'Annadanam', 'Festival', 'Education', 'Other'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donRes, templeRes] = await Promise.all([
          donationAPI.getAll().catch(() => ({ data: { data: [] } })),
          templeAPI.getAll({ limit: 100 }).catch(() => ({ data: { data: { temples: [] } } })),
        ]);
        setDonations(donRes.data.data || []);
        setTemples(templeRes.data.data?.temples || templeRes.data.data || []);
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
      const res = await donationAPI.create({
        temple: form.temple,
        amount: Number(form.amount),
        purpose: form.purpose,
        message: form.message,
      });
      setDonations([res.data.data, ...donations]);
      addNotification('Donation recorded successfully! 🙏', 'success');
      setForm({ temple: '', amount: '', purpose: 'General', message: '' });
      setShowForm(false);
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to process donation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  if (loading) return <Loader fullPage text="Loading donations..." />;

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
            My <span className="gradient-text">Donations</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Support temples with your generous contributions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '10px 24px' }}
        >
          <Gift size={16} /> {showForm ? 'Cancel' : 'Make Donation'}
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-5">
        <div className="col-6 col-md-3">
          <div className="stats-card stats-card-saffron" style={{ textAlign: 'center' }}>
            <div className="stats-card-value">{formatCurrency(totalDonated)}</div>
            <div className="stats-card-label">Total Donated</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stats-card stats-card-maroon" style={{ textAlign: 'center' }}>
            <div className="stats-card-value">{donations.length}</div>
            <div className="stats-card-label">Donations Made</div>
          </div>
        </div>
      </div>

      {/* Donation Form */}
      {showForm && (
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)', border: '1px solid var(--border-light)',
          marginBottom: 'var(--space-5)', boxShadow: 'var(--shadow-card)',
        }}>
          <h5 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Gift size={20} color="var(--saffron)" /> New Donation
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Select Temple</label>
                <select name="temple" className="form-control" value={form.temple} onChange={handleChange} required>
                  <option value="">Choose a temple...</option>
                  {temples.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Amount (₹)</label>
                <input type="number" name="amount" className="form-control" placeholder="500"
                  value={form.amount} onChange={handleChange} required min="1" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Purpose</label>
                <select name="purpose" className="form-control" value={form.purpose} onChange={handleChange}>
                  {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Message (Optional)</label>
                <textarea name="message" className="form-control" rows={2}
                  placeholder="A personal note or prayer..." value={form.message} onChange={handleChange} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={submitting}
                  style={{ padding: '12px 32px' }}
                >
                  {submitting ? 'Processing...' : 'Donate Now'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Donation History */}
      {donations.length === 0 ? (
        <EmptyState
          icon="🎁"
          title="No donations yet"
          message="Support your favourite temples with a contribution."
        />
      ) : (
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)', overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)' }}>
                  {['Temple', 'Amount', 'Purpose', 'Date', 'Status'].map((h) => (
                    <th key={h} style={{
                      padding: 'var(--space-3) var(--space-4)', textAlign: 'left',
                      fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)',
                      textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--fw-medium)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Building2 size={14} color="var(--saffron)" />
                        {d.temple?.name || 'Temple'}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--fw-bold)', color: 'var(--deep-maroon)' }}>
                      {formatCurrency(d.amount)}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)' }}>{d.purpose}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Calendar size={12} /> {formatDate(d.createdAt)}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <span className="badge-spiritual badge-saffron" style={{ fontSize: 'var(--fs-xs)' }}>
                        {d.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsPage;
