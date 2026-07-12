import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { bookingAPI } from '../../services/api';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';
import Loader from '../../components/common/Loader';

const TicketViewerPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
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
      } catch { /* */ }
      setLoading(false);
    };
    fetch();
  }, [bookingId]);

  const handleDownload = async () => {
    try {
      if (bookingId?.startsWith('local_')) {
        window.print();
        return;
      }
      const res = await bookingAPI.downloadPDF(bookingId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch { /* */ }
  };

  if (loading) return <Loader fullPage text="Loading ticket..." />;

  if (!booking) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎫</div>
        <h4>Ticket Not Found</h4>
        <p>The booking ticket could not be found.</p>
        <Link to="/bookings" className="btn btn-primary">Back to Bookings</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 'var(--space-5) 0' }}>
      {/* Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
        <Link to="/bookings" className="btn btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <button onClick={handleDownload} className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '10px 24px' }}
        >
          <Download size={16} /> {bookingId?.startsWith('local_') ? 'Print Ticket' : 'Download PDF'}
        </button>
      </div>

      {/* Ticket Card */}
      <div className="ticket-card">
        {/* Header */}
        <div className="ticket-header">
          <div style={{ fontSize: 28, marginBottom: 'var(--space-2)' }}>🛕</div>
          <h4>{booking.temple?.name || 'Temple Darshan'}</h4>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--fs-sm)', margin: 0 }}>
            {booking.temple?.address?.district}, {booking.temple?.address?.state}
          </p>
        </div>

        <div className="ticket-body">
          {/* Booking Info */}
          <div className="ticket-info-row">
            <span className="ticket-info-label">Booking ID</span>
            <span className="ticket-info-value" style={{ fontFamily: 'var(--font-mono)' }}>
              {booking.bookingId || booking._id?.slice(-8).toUpperCase()}
            </span>
          </div>
          <div className="ticket-info-row">
            <span className="ticket-info-label">Date</span>
            <span className="ticket-info-value">{formatDate(booking.visitDate)}</span>
          </div>
          <div className="ticket-info-row">
            <span className="ticket-info-label">Time Slot</span>
            <span className="ticket-info-value">
              {booking.slot?.startTime && formatTime(booking.slot.startTime)} – {booking.slot?.endTime && formatTime(booking.slot.endTime)}
            </span>
          </div>
          <div className="ticket-info-row">
            <span className="ticket-info-label">Darshan Type</span>
            <span className="ticket-info-value">{booking.darshanType || 'Regular'}</span>
          </div>
          <div className="ticket-info-row">
            <span className="ticket-info-label">Devotees</span>
            <span className="ticket-info-value">{booking.devotees?.length || 0}</span>
          </div>

          <div className="ticket-divider" />

          {/* Devotee List */}
          {booking.devotees?.length > 0 && (
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{
                fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)',
                textTransform: 'uppercase', letterSpacing: '0.5px',
                color: 'var(--text-muted)', marginBottom: 'var(--space-2)',
              }}>
                Devotee Details
              </div>
              {booking.devotees.map((d, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '6px 0', fontSize: 'var(--fs-sm)',
                  borderBottom: i < booking.devotees.length - 1 ? '1px dashed var(--border-light)' : 'none',
                }}>
                  <span>{d.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Age: {d.age} • {d.gender}</span>
                </div>
              ))}
            </div>
          )}

          <div className="ticket-divider" />

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: 'var(--space-2) 0',
          }}>
            <span style={{ fontWeight: 'var(--fw-semibold)' }}>Total Amount</span>
            <span style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-2xl)', color: 'var(--deep-maroon)' }}>
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>

          <div className="ticket-divider" />

          {/* QR Code */}
          <div className="ticket-qr">
            <QRCodeSVG
              value={`DARSHAN-${booking.bookingId || booking._id}`}
              size={160}
              level="H"
              includeMargin={true}
              fgColor="var(--dark-brown)"
            />
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
              Show this QR code at the temple entrance
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="ticket-footer">
          <p style={{ margin: 0 }}>
            Booked on DarshanEase • {formatDate(booking.createdAt)} • Status: <strong style={{ textTransform: 'capitalize' }}>{booking.status}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketViewerPage;
