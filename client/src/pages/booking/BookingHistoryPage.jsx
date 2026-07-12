import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, TicketCheck, Eye, XCircle, Download } from 'lucide-react';
import { bookingAPI } from '../../services/api';
import { formatDate, formatCurrency, getStatusBadge } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';

const BookingHistoryPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = ['', 'confirmed', 'pending', 'completed', 'cancelled'];

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Clear any stale localStorage fallback bookings from other sessions
      localStorage.removeItem('fallbackBookings');

      // Fetch bookings from server - already filtered by authenticated user on backend
      let serverBookings = [];
      try {
        const res = await bookingAPI.getAll({ page: 1, limit: 100 });
        const resData = res.data.data;
        serverBookings = resData?.bookings || (Array.isArray(resData) ? resData : []);
      } catch (err) {
        console.error("Failed to fetch server bookings:", err);
      }

      // Only use server bookings — never merge localStorage to avoid cross-user data leaks
      let combined = [...serverBookings];

      // Apply status filter
      if (statusFilter) {
        combined = combined.filter((b) => b.status === statusFilter);
      }

      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        combined = combined.filter((b) => 
          (b.bookingId && b.bookingId.toLowerCase().includes(query)) ||
          (b.temple?.name && b.temple.name.toLowerCase().includes(query)) ||
          (b._id && b._id.toLowerCase().includes(query))
        );
      }

      // Sort combined bookings chronologically (newest first)
      combined.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.visitDate);
        const dateB = new Date(b.createdAt || b.visitDate);
        return dateB - dateA;
      });

      // Paginate combined list locally
      const limit = 10;
      const total = combined.length;
      const pages = Math.ceil(total / limit) || 1;
      
      const startIndex = (page - 1) * limit;
      const paginated = combined.slice(startIndex, startIndex + limit);

      setBookings(paginated);
      setTotalPages(pages);
    } catch {
      setBookings([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [page, statusFilter, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          Booking <span className="gradient-text">History</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>View and manage all your darshan bookings</p>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)',
        flexWrap: 'wrap', alignItems: 'center',
      }}>
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 240 }}>
          <div className="search-bar-spiritual">
            <Search className="search-icon" size={18} />
            <input
              type="text" className="form-control"
              placeholder="Search by booking ID or temple..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {statuses.map((s) => (
            <button
              key={s || 'all'}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={statusFilter === s ? 'btn btn-primary' : 'btn btn-ghost'}
              style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: 'var(--fs-sm)', textTransform: 'capitalize' }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings */}
      {loading ? (
        <Loader text="Loading bookings..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon="🎫"
          title="No bookings found"
          message={statusFilter ? `No ${statusFilter} bookings found.` : 'You haven\'t made any bookings yet.'}
          actionText="Book Darshan"
          actionLink="/temples"
        />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {bookings.map((booking) => (
              <div key={booking._id} style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-5)', border: '1px solid var(--border-light)',
                transition: 'all var(--transition-base)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <TicketCheck size={16} color="var(--saffron)" />
                      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {booking.bookingId || booking._id?.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <h5 style={{ marginBottom: 'var(--space-1)' }}>
                      {booking.temple?.name || 'Temple Darshan'}
                    </h5>
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={13} /> {formatDate(booking.visitDate)}
                      </span>
                      <span>
                        {booking.timeSlot || (booking.slot ? `${booking.slot.startTime} – ${booking.slot.endTime}` : '')}
                      </span>
                      <span>
                        {booking.devotees?.length || 0} devotee{(booking.devotees?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-xl)', color: 'var(--deep-maroon)', marginBottom: 'var(--space-2)' }}>
                      {formatCurrency(booking.totalAmount)}
                    </div>
                    <span className={`badge-spiritual ${getStatusBadge(booking.status)}`} style={{ fontSize: 'var(--fs-xs)', textTransform: 'capitalize' }}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)',
                  paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-light)',
                }}>
                  <Link to={`/ticket/${booking._id}`} className="btn btn-ghost"
                    style={{ fontSize: 'var(--fs-sm)', display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px' }}
                  >
                    <Eye size={14} /> View Ticket
                  </Link>
                  {booking.status === 'confirmed' && (
                    <Link to={`/ticket/${booking._id}`} className="btn btn-ghost"
                      style={{ fontSize: 'var(--fs-sm)', display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px' }}
                    >
                      <Download size={14} /> Download
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: 'var(--space-6)' }}>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingHistoryPage;
