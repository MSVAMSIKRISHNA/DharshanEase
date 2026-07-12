import { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsAPI } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

const COLORS = ['#FF9933', '#800020', '#D4A853', '#2E7D32', '#0277BD', '#C62828'];

const OrganizerRevenue = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ total: 0, monthly: [], byTemple: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await analyticsAPI.getRevenue();
        setData(res.data.data || {});
      } catch {
        // Mock data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        setData({
          total: 245000,
          monthly: months.map((m) => ({ month: m, revenue: Math.floor(Math.random() * 60000 + 15000) })),
          byTemple: [
            { name: 'Tirupati', value: 95000 },
            { name: 'Kashi Vishwanath', value: 62000 },
            { name: 'Meenakshi Amman', value: 48000 },
            { name: 'Others', value: 40000 },
          ],
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Loader fullPage text="Loading revenue data..." />;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          Revenue <span className="gradient-text">Overview</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Track your temple revenue and financial performance</p>
      </div>

      {/* Total Revenue Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--deep-maroon), var(--dark-brown))',
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)',
        color: 'var(--white)', marginBottom: 'var(--space-5)',
      }}>
        <div style={{ fontSize: 'var(--fs-sm)', opacity: 0.7, marginBottom: 'var(--space-1)' }}>Total Revenue</div>
        <div style={{ fontSize: 'var(--fs-5xl)', fontWeight: 'var(--fw-bold)', fontFamily: 'var(--font-heading)' }}>
          {formatCurrency(data.total)}
        </div>
      </div>

      <div className="row g-4">
        {/* Revenue Trend */}
        <div className="col-lg-7">
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5)', border: '1px solid var(--border-light)',
          }}>
            <h5 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <TrendingUp size={18} color="var(--saffron)" /> Monthly Revenue
            </h5>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis fontSize={12} tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--saffron)" fill="rgba(var(--saffron-rgb),0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Temple */}
        <div className="col-lg-5">
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-5)', border: '1px solid var(--border-light)',
          }}>
            <h5 style={{ marginBottom: 'var(--space-4)' }}>Revenue by Temple</h5>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.byTemple} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85} paddingAngle={4}
                >
                  {data.byTemple?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => formatCurrency(val)} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              {data.byTemple?.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--fs-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: COLORS[i % COLORS.length] }} />
                    {item.name}
                  </div>
                  <span style={{ fontWeight: 'var(--fw-semibold)' }}>{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerRevenue;
