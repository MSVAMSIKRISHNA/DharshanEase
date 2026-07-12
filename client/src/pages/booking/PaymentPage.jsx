import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, Wallet } from 'lucide-react';
import { bookingAPI, paymentAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate, formatTime } from '../../utils/helpers';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [method, setMethod] = useState('UPI');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await bookingAPI.getById(bookingId);
        setBooking(res.data.data);
        if (res.data.data.status === 'confirmed') navigate(`/booking-success/${bookingId}`);
      } catch { showError('Booking not found'); }
      finally { setLoading(false); }
    };
    fetchBooking();
  }, [bookingId]);

  const paymentMethods = [
    { value: 'UPI', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
    { value: 'Credit Card', label: 'Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
    { value: 'Debit Card', label: 'Debit Card', icon: CreditCard, desc: 'All bank debit cards' },
    { value: 'Net Banking', label: 'Net Banking', icon: Building2, desc: 'SBI, HDFC, ICICI, etc.' },
    { value: 'Wallet', label: 'Wallet', icon: Wallet, desc: 'Paytm, Amazon Pay' },
  ];

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 2000));
    try {
      await paymentAPI.process({ bookingId, method });
      success('Payment successful! 🎉');
      navigate(`/booking-success/${bookingId}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Payment failed');
    } finally { setProcessing(false); }
  };

  if (loading) return <Loader fullPage text="Loading payment..." />;
  if (!booking) return <div className="container-custom py-5 text-center"><h3>Booking not found</h3></div>;

  return (
    <div className="container-custom" style={{ padding: 'var(--space-6) 0 var(--space-9)' }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="row g-4">
            {/* Payment Methods */}
            <div className="col-md-7">
              <div className="card p-4 animate-fade-in-up">
                <h5 className="mb-4">Select Payment Method</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.value}
                      onClick={() => setMethod(pm.value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)',
                        borderRadius: 'var(--radius-lg)', textAlign: 'left', cursor: 'pointer', width: '100%',
                        border: method === pm.value ? '2px solid var(--saffron)' : '1px solid var(--border-color)',
                        background: method === pm.value ? 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.05), rgba(var(--deep-maroon-rgb),0.03))' : 'var(--bg-primary)',
                      }}
                    >
                      <pm.icon size={24} color={method === pm.value ? 'var(--saffron)' : 'var(--text-muted)'} />
                      <div>
                        <div style={{ fontWeight: 'var(--fw-semibold)', fontSize: 'var(--fs-sm)' }}>{pm.label}</div>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{pm.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-3)', background: 'rgba(255,193,7,0.1)', borderRadius: 'var(--radius-md)', fontSize: 'var(--fs-xs)', color: 'var(--text-muted)', textAlign: 'center' }}>
                  ⚠️ This is a <strong>simulated payment</strong> for demo purposes. No real money will be charged.
                </div>

                <button
                  className="btn btn-primary w-100 mt-4"
                  onClick={handlePayment}
                  disabled={processing}
                  style={{ padding: '14px', fontSize: 'var(--fs-md)' }}
                >
                  {processing ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Processing Payment...
                    </span>
                  ) : (
                    `Pay ${formatCurrency(booking.totalAmount)}`
                  )}
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="col-md-5">
              <div className="card p-4 animate-fade-in-up delay-2">
                <h6 className="mb-3">Booking Summary</h6>
                <div style={{ fontSize: 'var(--fs-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <div style={{ fontWeight: 'var(--fw-semibold)' }}>{booking.temple?.name || 'Temple'}</div>
                  <div className="d-flex justify-content-between"><span>Booking ID</span><span>{booking.bookingId}</span></div>
                  <div className="d-flex justify-content-between"><span>Date</span><span>{formatDate(booking.visitDate)}</span></div>
                  <div className="d-flex justify-content-between"><span>Time</span><span>{booking.timeSlot}</span></div>
                  <div className="d-flex justify-content-between"><span>Darshan</span><span>{booking.darshanType}</span></div>
                  <div className="d-flex justify-content-between"><span>Devotees</span><span>{booking.devotees?.length}</span></div>
                  <hr style={{ margin: 'var(--space-2) 0' }} />
                  <div className="d-flex justify-content-between" style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-lg)', color: 'var(--deep-maroon)' }}>
                    <span>Total</span>
                    <span>{formatCurrency(booking.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
