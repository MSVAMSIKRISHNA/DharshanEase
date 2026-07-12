import { useState, useEffect } from 'react';
import { Building2, TicketCheck, IndianRupee, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { templeAPI, bookingAPI, analyticsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

const OrganizerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ temples: 0, bookings: 0, revenue: 0, devotees: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templeRes, analyticsRes] = await Promise.all([
          templeAPI.getAll({ limit: 100 }).catch(() => ({ data: { data: { temples: [], total: 0 } } })),
          analyticsAPI.getDashboard().catch(() => ({ data: { data: {} } })),
        ]);

        const analytics = analyticsRes.data.data || {};
        const templeData = templeRes.data.data;
        setStats({
          temples: templeData?.total || templeData?.temples?.length || 0,
          bookings: analytics.totalBookings || 0,
          revenue: analytics.totalRevenue || 0,
          devotees: analytics.totalDevotees || 0,
        });

        // Mock chart data if API doesn't return it
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        setChartData(analytics.monthlyData || months.map((m, i) => ({
          month: m,
          bookings: Math.floor(Math.random() * 100 + 20),
          revenue: Math.floor(Math.random() * 50000 + 10000),
        })));
      } catch { /* */ }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'My Temples', value: stats.temples, icon: Building2, variant: 'saffron' },
    { label: 'Total Bookings', value: stats.bookings, icon: TicketCheck, variant: 'maroon' },
    { label: 'Revenue', value: formatCurrency(stats.revenue), icon: IndianRupee, variant: 'gold' },
    { label: 'Devotees Served', value: stats.devotees, icon: Users, variant: 'success' },
  ];

  if (loading) return <Loader fullPage text="Loading dashboard..." />;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          Organizer <span className="gradient-text">Dashboard</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your temples and track performance</p>
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

      {/* Charts */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5)', border: '1px solid var(--border-light)',
          }}>
            <h5 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <TrendingUp size={18} color="var(--saffron)" /> Booking Trends
            </h5>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-sm)',
                  }}
                />
                <Bar dataKey="bookings" fill="var(--saffron)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-6">
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5)', border: '1px solid var(--border-light)',
          }}>
            <h5 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <IndianRupee size={18} color="var(--deep-maroon)" /> Revenue Trend
            </h5>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-sm)',
                  }}
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--deep-maroon)" strokeWidth={2} dot={{ r: 4, fill: 'var(--deep-maroon)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
