import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { analyticsAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const reportTypes = [
  { id: 'bookings', label: 'Bookings Report', desc: 'All bookings with devotee and payment details', icon: '📊' },
  { id: 'revenue', label: 'Revenue Report', desc: 'Financial summary across all temples', icon: '💰' },
  { id: 'users', label: 'User Report', desc: 'User registration and activity metrics', icon: '👥' },
  { id: 'temples', label: 'Temple Report', desc: 'Temple performance and occupancy rates', icon: '🛕' },
  { id: 'donations', label: 'Donation Report', desc: 'Donation summary by temple and purpose', icon: '🎁' },
  { id: 'feedback', label: 'Feedback Report', desc: 'All user feedback and ratings', icon: '💬' },
];

const AdminReports = () => {
  const { addNotification } = useNotification();
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ type: 'bookings', startDate: '', endDate: '', format: 'pdf' });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await analyticsAPI.generateReport(form);
      addNotification('Report generated!', 'success');
    } catch {
      addNotification('Report generation feature coming soon!', 'info');
    }
    setGenerating(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          <span className="gradient-text">Reports</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Generate comprehensive platform reports</p>
      </div>

      <div className="row g-3 mb-5">
        {reportTypes.map((rt) => (
          <div className="col-md-4 col-lg-2" key={rt.id}>
            <button onClick={() => setForm({ ...form, type: rt.id })}
              style={{
                width: '100%', textAlign: 'center', padding: 'var(--space-4)',
                borderRadius: 'var(--radius-xl)',
                border: form.type === rt.id ? '2px solid var(--saffron)' : '1px solid var(--border-light)',
                background: form.type === rt.id ? 'rgba(var(--saffron-rgb),0.04)' : 'var(--bg-card)',
                cursor: 'pointer', transition: 'all var(--transition-base)',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 'var(--space-2)' }}>{rt.icon}</div>
              <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 'var(--fw-semibold)' }}>{rt.label}</div>
            </button>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', border: '1px solid var(--border-light)' }}>
        <h5 style={{ marginBottom: 'var(--space-4)' }}>Generate Report</h5>
        <form onSubmit={handleGenerate}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-control" value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">End Date</label>
              <input type="date" className="form-control" value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Format</label>
              <select className="form-control" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary" disabled={generating}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '12px 32px' }}>
                <Download size={16} /> {generating ? 'Generating...' : 'Generate & Download'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminReports;
