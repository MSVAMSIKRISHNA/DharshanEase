import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TicketCheck, Calendar, CheckCircle, IndianRupee, ArrowRight, Clock, Building2 } from 'lucide-react';
import { bookingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatCurrency, getStatusBadge } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

const UserDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, totalSpent: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let serverBookings = [];
        try {
          const res = await bookingAPI.getAll({ limit: 50 });
          const resData = res.data.data;
          serverBookings = resData?.bookings || (Array.isArray(resData) ? resData : []);
        } catch (err) {
          console.error("Failed to fetch server bookings:", err);
        }

        // Fetch fallback bookings from localStorage and filter strictly by current user
        const rawLocalBookings = JSON.parse(localStorage.getItem('fallbackBookings') || '[]');
        const localBookings = rawLocalBookings.filter((b) => {
          if (!user) return !b.user || b.user === 'guest';
          return b.user === user?._id || b.user === user?.id || b.user === user?.email;
        });

        // Combine bookings
        const combined = [...localBookings, ...serverBookings];

        // Sort chronologically (newest first)
        combined.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.visitDate || a.date);
          const dateB = new Date(b.createdAt || b.visitDate || b.date);
          return dateB - dateA;
        });

        setBookings(combined);

        const now = new Date();
        setStats({
          total: combined.length,
          upcoming: combined.filter((b) => b.status === 'confirmed' && new Date(b.visitDate || b.date) >= now).length,
          completed: combined.filter((b) => b.status === 'completed').length,
          totalSpent: combined.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        });
      } catch (err) {
        console.error("Failed to load user dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const statCards = [
    { label: 'Total Bookings', value: stats.total, icon: TicketCheck, variant: 'saffron' },
    { label: 'Upcoming', value: stats.upcoming, icon: Calendar, variant: 'maroon' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, variant: 'success' },
    { label: 'Total Spent', value: formatCurrency(stats.totalSpent), icon: IndianRupee, variant: 'gold' },
  ];

  const recentBookings = bookings.slice(0, 5);

  if (loading) return <Loader fullPage text="Loading dashboard..." />;

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Devotee'}</span> 🙏
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Here&apos;s an overview of your spiritual journey</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-5">
        {statCards.map((s, i) => (
          <div className="col-6 col-lg-3" key={i}>
            <div className={`stats-card stats-card-${s.variant}`}>
              <div className={`stats-card-icon ${s.variant}`}>
                <s.icon size={24} />
              </div>
              <div className="stats-card-value">{s.value}</div>
              <div className="stats-card-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap',
      }}>
        <Link to="/temples" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Building2 size={16} /> Book Darshan
        </Link>
        <Link to="/bookings" className="btn btn-secondary-custom" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <TicketCheck size={16} /> My Bookings
        </Link>
      </div>

      {/* Recent Bookings */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-light)', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-light)',
        }}>
          <h5 style={{ margin: 0 }}>Recent Bookings</h5>
          <Link to="/bookings" style={{ fontSize: 'var(--fs-sm)', color: 'var(--saffron)', display: 'flex', alignItems: 'center', gap: 4 }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div style={{ padding: 'var(--space-7)', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 'var(--space-3)', opacity: 0.3 }}>🎫</div>
            <p>No bookings yet. Start your spiritual journey!</p>
            <Link to="/temples" className="btn btn-primary" style={{ marginTop: 'var(--space-2)' }}>Browse Temples</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  {['Temple', 'Date', 'Time', 'Amount', 'Status', ''].map((h) => (
                    <th key={h} style={{
                      padding: 'var(--space-3) var(--space-4)', textAlign: 'left',
                      fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)',
                      textTransform: 'uppercase', color: 'var(--text-muted)',
                      letterSpacing: '0.5px',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--fw-medium)' }}>
                      {b.temple?.name || 'Temple'}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                      {formatDate(b.date)}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {b.slot?.startTime || '–'}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--fw-semibold)', color: 'var(--deep-maroon)' }}>
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <span className={`badge-spiritual ${getStatusBadge(b.status)}`} style={{ fontSize: 'var(--fs-xs)', textTransform: 'capitalize' }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <Link to={`/ticket/${b._id}`} className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: 'var(--fs-xs)' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
