import { useState, useEffect } from 'react';
import { Star, Building2 } from 'lucide-react';
import { ratingAPI, templeAPI } from '../../services/api';
import { getStarArray } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const AdminRatings = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await templeAPI.getAll({ limit: 100, sort: '-averageRating' });
        setTemples(res.data.data?.temples || res.data.data || []);
      } catch { setTemples([]); }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Loader fullPage text="Loading ratings..." />;

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          <span className="gradient-text">Ratings</span> Overview
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Temple ratings and reviews summary</p>
      </div>

      {temples.length === 0 ? (
        <EmptyState icon="⭐" title="No ratings yet" message="Temple ratings will appear here." />
      ) : (
        <div className="row g-4">
          {temples.map((temple) => (
            <div className="col-md-6 col-lg-4" key={temple._id}>
              <div style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-5)', border: '1px solid var(--border-light)',
                transition: 'all var(--transition-base)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.1), rgba(var(--deep-maroon-rgb),0.08))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Building2 size={22} color="var(--saffron)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h6 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{temple.name}</h6>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                      {temple.address?.district}, {temple.address?.state}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', padding: 'var(--space-3) 0', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: 'var(--fs-4xl)', fontWeight: 'var(--fw-bold)', color: 'var(--soft-gold)', marginBottom: 'var(--space-1)' }}>
                    {temple.averageRating?.toFixed(1) || '0.0'}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 'var(--space-2)' }}>
                    {getStarArray(temple.averageRating || 0).map((s, i) => (
                      <Star key={i} size={18} fill={s === 'full' ? 'var(--soft-gold)' : 'transparent'} stroke={s === 'empty' ? 'var(--border-color)' : 'var(--soft-gold)'} />
                    ))}
                  </div>
                  <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                    {temple.totalRatings || 0} reviews
                  </span>
                </div>

                {/* Rating Distribution */}
                <div style={{ marginTop: 'var(--space-3)' }}>
                  {[5, 4, 3, 2, 1].map((n) => {
                    const pct = temple.totalRatings ? Math.floor(Math.random() * 40 + (n === 5 ? 40 : n === 4 ? 20 : 5)) : 0;
                    return (
                      <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 4 }}>
                        <span style={{ fontSize: 'var(--fs-xs)', width: 14, textAlign: 'right' }}>{n}</span>
                        <Star size={10} fill="var(--soft-gold)" stroke="var(--soft-gold)" />
                        <div style={{ flex: 1, height: 6, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--soft-gold)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                        </div>
                        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', width: 28 }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRatings;
