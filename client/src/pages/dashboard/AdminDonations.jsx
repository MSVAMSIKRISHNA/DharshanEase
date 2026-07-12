import { useState, useEffect } from 'react';
import { Search, Gift, Building2, Calendar } from 'lucide-react';
import { donationAPI } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const res = await donationAPI.getAllAdmin({ page, limit: 15 });
        const data = res.data.data;
        setDonations(data?.donations || data || []);
        setTotalPages(data?.totalPages || 1);
      } catch { setDonations([]); }
      setLoading(false);
    };
    fetchDonations();
  }, [page]);

  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
            All <span className="gradient-text">Donations</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Track all donations across the platform</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, var(--saffron), var(--deep-maroon))',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-3) var(--space-5)', color: 'var(--white)',
        }}>
          <div style={{ fontSize: 'var(--fs-xs)', opacity: 0.8 }}>Total Donations</div>
          <div style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-bold)' }}>{formatCurrency(totalAmount)}</div>
        </div>
      </div>

      {loading ? <Loader text="Loading donations..." /> : (
        <>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['Donor', 'Temple', 'Amount', 'Purpose', 'Date', 'Status'].map((h) => (
                      <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--fw-medium)' }}>{d.user?.name || '–'}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Building2 size={13} color="var(--saffron)" /> {d.temple?.name || '–'}
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--fw-bold)', color: 'var(--deep-maroon)' }}>{formatCurrency(d.amount)}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)' }}>{d.purpose || 'General'}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {formatDate(d.createdAt)}</div>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <span className="badge-spiritual badge-success" style={{ fontSize: 'var(--fs-xs)' }}>{d.status || 'Completed'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {totalPages > 1 && <div style={{ marginTop: 'var(--space-5)' }}><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>}
        </>
      )}
    </div>
  );
};

export default AdminDonations;
