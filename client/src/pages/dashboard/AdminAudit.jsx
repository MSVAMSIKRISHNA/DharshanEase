import { useState, useEffect } from 'react';
import { Shield, Search, Calendar, User, Activity } from 'lucide-react';
import { formatDate, getRelativeTime } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const AdminAudit = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate loading audit logs (would come from API in real app)
    setTimeout(() => {
      setLogs([
        { _id: '1', action: 'User Login', user: 'admin@darshanease.com', type: 'auth', details: 'Admin logged in successfully', ip: '192.168.1.1', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { _id: '2', action: 'Temple Created', user: 'organizer@temple.com', type: 'temple', details: 'Created temple "Sri Venkateswara Temple"', ip: '10.0.0.5', createdAt: new Date(Date.now() - 7200000).toISOString() },
        { _id: '3', action: 'Booking Cancelled', user: 'user@gmail.com', type: 'booking', details: 'Booking #BK12345 cancelled by user', ip: '172.16.0.1', createdAt: new Date(Date.now() - 14400000).toISOString() },
        { _id: '4', action: 'Role Updated', user: 'admin@darshanease.com', type: 'admin', details: 'Changed user role from "user" to "organizer"', ip: '192.168.1.1', createdAt: new Date(Date.now() - 28800000).toISOString() },
        { _id: '5', action: 'Payment Processed', user: 'devotee@email.com', type: 'payment', details: 'Payment of ₹500 processed for booking #BK12346', ip: '203.0.113.1', createdAt: new Date(Date.now() - 43200000).toISOString() },
        { _id: '6', action: 'Temple Deactivated', user: 'admin@darshanease.com', type: 'admin', details: 'Temple "Old Temple" deactivated by admin', ip: '192.168.1.1', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: '7', action: 'Slot Created', user: 'organizer@temple.com', type: 'temple', details: 'New darshan slot added for 15 Jul 2026, 6:00 AM', ip: '10.0.0.5', createdAt: new Date(Date.now() - 172800000).toISOString() },
        { _id: '8', action: 'User Registered', user: 'newuser@gmail.com', type: 'auth', details: 'New user registration completed', ip: '198.51.100.1', createdAt: new Date(Date.now() - 259200000).toISOString() },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const typeColors = {
    auth: { bg: 'var(--info-light)', color: 'var(--info)' },
    temple: { bg: 'rgba(var(--saffron-rgb),0.1)', color: 'var(--saffron)' },
    booking: { bg: 'var(--success-light)', color: 'var(--success)' },
    payment: { bg: 'rgba(var(--saffron-light-rgb, 59, 130, 246),0.12)', color: 'var(--soft-gold)' }, // soft-gold or light saffron/blue
    admin: { bg: 'rgba(var(--deep-maroon-rgb),0.08)', color: 'var(--deep-maroon)' },
  };

  const types = ['all', 'auth', 'temple', 'booking', 'payment', 'admin'];
  const filteredLogs = filter === 'all' ? logs : logs.filter((l) => l.type === filter);

  if (loading) return <Loader fullPage text="Loading audit logs..." />;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          Audit <span className="gradient-text">Logs</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>System activity and security logs</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        {types.map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={filter === t ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: 'var(--fs-sm)', textTransform: 'capitalize' }}
          >
            {t}
          </button>
        ))}
      </div>

      {filteredLogs.length === 0 ? (
        <EmptyState icon="🔍" title="No logs found" message="No audit logs match the selected filter." />
      ) : (
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)', overflow: 'hidden',
        }}>
          {filteredLogs.map((log, i) => (
            <div key={log._id} style={{
              padding: 'var(--space-4) var(--space-5)',
              borderBottom: i < filteredLogs.length - 1 ? '1px solid var(--border-light)' : 'none',
              display: 'flex', gap: 'var(--space-4)', alignItems: 'start',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-md)', flexShrink: 0,
                background: typeColors[log.type]?.bg || 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Activity size={18} color={typeColors[log.type]?.color || 'var(--text-muted)'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 'var(--space-2)' }}>
                  <div>
                    <span style={{ fontWeight: 'var(--fw-semibold)' }}>{log.action}</span>
                    <span className={`badge-spiritual`} style={{
                      marginLeft: 'var(--space-2)', fontSize: 'var(--fs-xs)',
                      textTransform: 'capitalize', padding: '2px 8px',
                      background: typeColors[log.type]?.bg, color: typeColors[log.type]?.color,
                    }}>
                      {log.type}
                    </span>
                  </div>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', flexShrink: 0 }}>
                    {getRelativeTime(log.createdAt)}
                  </span>
                </div>
                <p style={{ margin: '4px 0', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>{log.details}</p>
                <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <User size={11} /> {log.user}
                  </span>
                  <span>IP: {log.ip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAudit;
