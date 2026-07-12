import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, Eye } from 'lucide-react';
import { bookingAPI } from '../../services/api';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate } from '../../utils/helpers';

const BookingSuccessPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (bookingId?.startsWith('local_')) {
          const localBookings = JSON.parse(localStorage.getItem('fallbackBookings') || '[]');
          const found = localBookings.find((b) => b._id === bookingId);
          if (found) {
            setBooking(found);
            setLoading(false);
            return;
          }
        }
        const res = await bookingAPI.getById(bookingId);
        setBooking(res.data.data);
      } catch { /* handle */ }
      finally { setLoading(false); }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <Loader fullPage text="Loading..." />;

  return (
    <div className="container-custom" style={{ padding: 'var(--space-7) 0 var(--space-9)' }}>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-5 text-center animate-scale-in">
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
              <CheckCircle size={40} color="var(--success)" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-2)' }}>Booking Confirmed! 🎉</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-5)' }}>
              Your darshan booking has been confirmed. May your visit be blessed!
            </p>

            {booking && (
              <div style={{ padding: 'var(--space-4)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', textAlign: 'left', marginBottom: 'var(--space-5)' }}>
                <div className="row g-2" style={{ fontSize: 'var(--fs-sm)' }}>
                  <div className="col-6"><strong>Booking ID:</strong></div><div className="col-6">{booking.bookingId}</div>
                  <div className="col-6"><strong>Temple:</strong></div><div className="col-6">{booking.temple?.name}</div>
                  <div className="col-6"><strong>Date:</strong></div><div className="col-6">{formatDate(booking.visitDate)}</div>
                  <div className="col-6"><strong>Time:</strong></div><div className="col-6">{booking.timeSlot}</div>
                  <div className="col-6"><strong>Devotees:</strong></div><div className="col-6">{booking.devotees?.length}</div>
                  <div className="col-6"><strong>Amount:</strong></div><div className="col-6">{formatCurrency(booking.totalAmount)}</div>
                  <div className="col-6"><strong>Status:</strong></div>
                  <div className="col-6"><span className="badge-spiritual badge-saffron">{booking.status?.toUpperCase()}</span></div>
                </div>

                {booking.qrCode && (
                  <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>Your QR Ticket</p>
                    <img src={booking.qrCode} alt="QR Code" style={{ width: 160, height: 160, borderRadius: 'var(--radius-md)' }} />
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to={`/ticket/${bookingId}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Eye size={16} /> View Ticket
              </Link>
              {bookingId?.startsWith('local_') ? (
                <button onClick={() => window.print()} className="btn btn-secondary-custom" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Download size={16} /> Print Ticket
                </button>
              ) : (
                <a href={`/api/bookings/${bookingId}/pdf`} className="btn btn-secondary-custom" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Download size={16} /> Download PDF
                </a>
              )}
              <Link to="/bookings" className="btn btn-ghost">My Bookings</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
