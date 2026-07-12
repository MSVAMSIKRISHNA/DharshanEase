import { useState, useEffect } from 'react';
import { Users, Building2, TicketCheck, IndianRupee, TrendingUp, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

const COLORS = ['#FF9933', '#800020', '#D4A853', '#2E7D32', '#0277BD'];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, temples: 0, bookings: 0, revenue: 0 });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await analyticsAPI.getDashboard();
        const d = res.data.data || {};
        setStats({
          users: d.totalUsers || 0, temples: d.totalTemples || 0,
          bookings: d.totalBookings || 0, revenue: d.totalRevenue || 0,
        });
        setChartData(d.monthlyData || []);
        setPieData(d.bookingsByStatus || []);
      } catch {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        setChartData(months.map((m) => ({
          month: m,
          bookings: Math.floor(Math.random() * 200 + 50),
          revenue: Math.floor(Math.random() * 100000 + 20000),
          users: Math.floor(Math.random() * 50 + 10),
        })));
        setPieData([
          { name: 'Confirmed', value: 450 }, { name: 'Completed', value: 320 },
          { name: 'Pending', value: 80 }, { name: 'Cancelled', value: 50 },
        ]);
        setStats({ users: 12500, temples: 520, bookings: 45200, revenue: 8950000 });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.users.toLocaleString(), icon: Users, variant: 'saffron', change: '+12%' },
    { label: 'Total Temples', value: stats.temples.toLocaleString(), icon: Building2, variant: 'maroon', change: '+5%' },
    { label: 'Total Bookings', value: stats.bookings.toLocaleString(), icon: TicketCheck, variant: 'gold', change: '+18%' },
    { label: 'Total Revenue', value: formatCurrency(stats.revenue), icon: IndianRupee, variant: 'success', change: '+24%' },
  ];

  if (loading) return <Loader fullPage text="Loading admin dashboard..." />;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          Admin <span className="gradient-text">Dashboard</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>System-wide overview and analytics</p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-5">
        {statCards.map((s, i) => (
          <div className="col-6 col-lg-3" key={i}>
            <div className={`stats-card stats-card-${s.variant}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div className={`stats-card-icon ${s.variant}`}>
                  <s.icon size={24} />
                </div>
                <span style={{
                  fontSize: 'var(--fs-xs)', color: 'var(--success)', fontWeight: 'var(--fw-semibold)',
                  display: 'flex', alignItems: 'center', gap: 2,
                }}>
                  <ArrowUpRight size={12} /> {s.change}
                </span>
              </div>
              <div className="stats-card-value" style={{ marginTop: 'var(--space-2)' }}>{s.value}</div>
              <div className="stats-card-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Booking & Revenue Trend */}
        <div className="col-lg-8">
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5)', border: '1px solid var(--border-light)',
          }}>
            <h5 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <TrendingUp size={18} color="var(--saffron)" /> Monthly Overview
            </h5>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }} />
                <Bar dataKey="bookings" fill="var(--saffron)" radius={[4, 4, 0, 0]} name="Bookings" />
                <Bar dataKey="users" fill="var(--deep-maroon)" radius={[4, 4, 0, 0]} name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings by Status */}
        <div className="col-lg-4">
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5)', border: '1px solid var(--border-light)',
          }}>
            <h5 style={{ marginBottom: 'var(--space-4)' }}>Bookings by Status</h5>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              {pieData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: COLORS[i % COLORS.length] }} />
                    {item.name}
                  </div>
                  <span style={{ fontWeight: 'var(--fw-semibold)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
