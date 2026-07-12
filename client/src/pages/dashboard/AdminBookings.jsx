import { useState, useEffect } from 'react';
import { Search, Calendar, TicketCheck } from 'lucide-react';
import { bookingAPI } from '../../services/api';
import { formatDate, formatCurrency, getStatusBadge } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await bookingAPI.getAll(params);
      const data = res.data.data;
      setBookings(data?.bookings || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch { setBookings([]); }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [page, statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchBookings(); };

  const statuses = ['', 'confirmed', 'pending', 'completed', 'cancelled'];

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          All <span className="gradient-text">Bookings</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>View and manage all platform bookings</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 240, maxWidth: 400 }}>
          <div className="search-bar-spiritual">
            <Search className="search-icon" size={18} />
            <input type="text" className="form-control" placeholder="Search bookings..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </form>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {statuses.map((s) => (
            <button key={s || 'all'} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={statusFilter === s ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: 'var(--fs-sm)', textTransform: 'capitalize' }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loader text="Loading..." /> : (
        <>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['ID', 'User', 'Temple', 'Date', 'Devotees', 'Amount', 'Status'].map((h) => (
                      <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)' }}>
                        {b.bookingId || b._id?.slice(-8).toUpperCase()}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--fw-medium)' }}>{b.user?.name || '–'}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)' }}>{b.temple?.name || '–'}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {formatDate(b.date)}</div>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{b.devotees?.length || 0}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--fw-semibold)', color: 'var(--deep-maroon)' }}>{formatCurrency(b.totalAmount)}</td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <span className={`badge-spiritual ${getStatusBadge(b.status)}`} style={{ fontSize: 'var(--fs-xs)', textTransform: 'capitalize' }}>{b.status}</span>
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

export default AdminBookings;
