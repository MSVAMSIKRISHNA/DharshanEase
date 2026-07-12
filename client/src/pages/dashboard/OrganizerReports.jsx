import { useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { analyticsAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const OrganizerReports = () => {
  const { addNotification } = useNotification();
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({
    type: 'bookings', startDate: '', endDate: '', format: 'pdf',
  });

  const reportTypes = [
    { id: 'bookings', label: 'Bookings Report', desc: 'Detailed list of all bookings with devotee information', icon: '📊' },
    { id: 'revenue', label: 'Revenue Report', desc: 'Financial summary with payment breakdowns', icon: '💰' },
    { id: 'slots', label: 'Slot Utilization', desc: 'Slot capacity vs actual bookings analysis', icon: '📅' },
    { id: 'devotees', label: 'Devotee Report', desc: 'Devotee demographics and visit frequency', icon: '👥' },
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await analyticsAPI.generateReport(form);
      addNotification('Report generated successfully!', 'success');
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
        <p style={{ color: 'var(--text-muted)' }}>Generate and download detailed reports</p>
      </div>

      {/* Report Types */}
      <div className="row g-3 mb-5">
        {reportTypes.map((rt) => (
          <div className="col-md-6 col-lg-3" key={rt.id}>
            <button
              onClick={() => setForm({ ...form, type: rt.id })}
              style={{
                width: '100%', textAlign: 'left', padding: 'var(--space-5)',
                borderRadius: 'var(--radius-xl)', border: form.type === rt.id ? '2px solid var(--saffron)' : '1px solid var(--border-light)',
                background: form.type === rt.id ? 'rgba(var(--saffron-rgb),0.04)' : 'var(--bg-card)',
                cursor: 'pointer', transition: 'all var(--transition-base)',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 'var(--space-2)' }}>{rt.icon}</div>
              <h6 style={{ marginBottom: 'var(--space-1)' }}>{rt.label}</h6>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-xs)', margin: 0 }}>{rt.desc}</p>
            </button>
          </div>
        ))}
      </div>

      {/* Generate Form */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)', border: '1px solid var(--border-light)',
      }}>
        <h5 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <FileText size={18} color="var(--saffron)" /> Configure Report
        </h5>
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
              <select className="form-control" value={form.format}
                onChange={(e) => setForm({ ...form, format: e.target.value })}
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary" disabled={generating}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '12px 32px' }}
              >
                <Download size={16} /> {generating ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizerReports;
