import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, IndianRupee } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { analyticsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

const COLORS = ['#FF9933', '#800020', '#D4A853', '#2E7D32', '#0277BD', '#C62828'];

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [data, setData] = useState({ bookings: [], revenue: [], users: [], popular: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, revenueRes] = await Promise.all([
          analyticsAPI.getBookings({ period }).catch(() => ({ data: { data: [] } })),
          analyticsAPI.getRevenue({ period }).catch(() => ({ data: { data: {} } })),
        ]);
        setData({
          bookings: bookingRes.data.data || [],
          revenue: revenueRes.data.data?.monthly || [],
          users: [],
          popular: revenueRes.data.data?.byTemple || [],
        });
      } catch {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        setData({
          bookings: months.map((m) => ({ month: m, confirmed: Math.floor(Math.random() * 150 + 30), cancelled: Math.floor(Math.random() * 20 + 5) })),
          revenue: months.map((m) => ({ month: m, revenue: Math.floor(Math.random() * 80000 + 15000) })),
          users: months.map((m) => ({ month: m, newUsers: Math.floor(Math.random() * 60 + 10), activeUsers: Math.floor(Math.random() * 200 + 50) })),
          popular: [
            { name: 'Tirupati', value: 3200 }, { name: 'Kashi Vishwanath', value: 2100 },
            { name: 'Meenakshi Amman', value: 1800 }, { name: 'Golden Temple', value: 2500 },
            { name: 'Others', value: 1400 },
          ],
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [period]);

  if (loading) return <Loader fullPage text="Loading analytics..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
            <span className="gradient-text">Analytics</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Platform performance insights and trends</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {['weekly', 'monthly', 'yearly'].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={period === p ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: 'var(--fs-sm)', textTransform: 'capitalize' }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {/* Bookings Chart */}
        <div className="col-lg-6">
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid var(--border-light)' }}>
            <h5 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <BarChart3 size={18} color="var(--saffron)" /> Booking Analytics
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.bookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }} />
                <Bar dataKey="confirmed" fill="var(--saffron)" radius={[4, 4, 0, 0]} name="Confirmed" />
                <Bar dataKey="cancelled" fill="var(--danger)" radius={[4, 4, 0, 0]} name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="col-lg-6">
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid var(--border-light)' }}>
            <h5 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <IndianRupee size={18} color="var(--deep-maroon)" /> Revenue Trend
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}
                  formatter={(val) => [formatCurrency(val), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="var(--deep-maroon)" fill="rgba(var(--deep-maroon-rgb),0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="col-lg-7">
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid var(--border-light)' }}>
            <h5 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Users size={18} color="var(--soft-gold)" /> User Growth
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.users}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }} />
                <Line type="monotone" dataKey="newUsers" stroke="var(--saffron)" strokeWidth={2} dot={{ r: 4 }} name="New Users" />
                <Line type="monotone" dataKey="activeUsers" stroke="var(--deep-maroon)" strokeWidth={2} dot={{ r: 4 }} name="Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Temples */}
        <div className="col-lg-5">
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid var(--border-light)' }}>
            <h5 style={{ marginBottom: 'var(--space-4)' }}>Most Popular Temples</h5>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.popular} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {data.popular.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              {data.popular.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: COLORS[i % COLORS.length] }} />
                    {item.name}
                  </div>
                  <span style={{ fontWeight: 'var(--fw-semibold)' }}>{item.value.toLocaleString()} bookings</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
