import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Ticket, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { templeAPI, bookingAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

const BookingPage = () => {
  const { templeId } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const { user } = useAuth();

  const [temple, setTemple] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    visitDate: '',
    darshanType: '',
    slot: null,
    devotees: [{ name: '', age: '', gender: 'Male', idType: 'Aadhaar', idNumber: '' }],
  });

  /* ── Fallback Temple Data ── */
  const fallbackTemplesMap = {
    'temp_tirupati_001': {
      _id: 'temp_tirupati_001', name: 'Sri Tirumala Tirupati Devasthanam',
      address: { district: 'Tirupati', state: 'Andhra Pradesh' },
      timings: { openTime: '03:00', closeTime: '22:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 300, duration: '2-3 hours', description: 'Free darshan through general queue' },
        { name: 'VIP Darshan', price: 500, duration: '45 mins', description: 'Special entry with priority access' },
        { name: 'Special Entry', price: 300, duration: '1 hour', description: 'Special entry darshan ticket' },
      ],
    },
    'temp_varanasi_002': {
      _id: 'temp_varanasi_002', name: 'Varanasi Kashi Vishwanath Temple',
      address: { district: 'Varanasi', state: 'Uttar Pradesh' },
      timings: { openTime: '03:00', closeTime: '23:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '30 mins', description: 'Regular darshan' },
        { name: 'Special Entry', price: 200, duration: '20 mins', description: 'Priority darshan' },
        { name: 'Aarti Darshan', price: 500, duration: '45 mins', description: 'Attend the divine Ganga Aarti' },
      ],
    },
    'temp_madurai_003': {
      _id: 'temp_madurai_003', name: 'Meenakshi Amman Temple',
      address: { district: 'Madurai', state: 'Tamil Nadu' },
      timings: { openTime: '05:00', closeTime: '21:30' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '1 hour', description: 'Regular entry darshan' },
        { name: 'VIP Darshan', price: 200, duration: '30 mins', description: 'Priority darshan' },
        { name: 'Special Entry', price: 100, duration: '45 mins', description: 'Skip-the-line entry' },
      ],
    },
    'temp_puri_004': {
      _id: 'temp_puri_004', name: 'Jagannath Temple Puri',
      address: { district: 'Puri', state: 'Odisha' },
      timings: { openTime: '05:00', closeTime: '22:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '1-2 hours', description: 'Regular darshan' },
        { name: 'Special Entry', price: 200, duration: '30 mins', description: 'Quick darshan' },
      ],
    },
    'temp_amritsar_005': {
      _id: 'temp_amritsar_005', name: 'Golden Temple (Harmandir Sahib)',
      address: { district: 'Amritsar', state: 'Punjab' },
      timings: { openTime: '02:00', closeTime: '22:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '1-2 hours', description: 'Open to all, no ticket required' },
        { name: 'Seva Darshan', price: 0, duration: '3 hours', description: 'Participate in community service' },
      ],
    },
    'temp_somnath_006': {
      _id: 'temp_somnath_006', name: 'Somnath Temple',
      address: { district: 'Gir Somnath', state: 'Gujarat' },
      timings: { openTime: '06:00', closeTime: '21:00' },
      darshanTypes: [
        { name: 'General Darshan', price: 0, duration: '30 mins', description: 'Free darshan for all' },
        { name: 'Aarti Darshan', price: 100, duration: '45 mins', description: 'Attend the evening aarti' },
      ],
    },
  };

  /* Generate fallback time slots for a given darshan type */
  const generateFallbackSlots = (darshanType) => {
    const dt = temple?.darshanTypes?.find(d => d.name === darshanType);
    if (!dt) return [];
    const timeSlots = [
      { start: '06:00', end: '08:00' },
      { start: '08:00', end: '10:00' },
      { start: '10:00', end: '12:00' },
      { start: '14:00', end: '16:00' },
      { start: '16:00', end: '18:00' },
    ];
    return timeSlots.map((ts, i) => {
      const capacity = darshanType === 'VIP Darshan' ? 50 : darshanType === 'Special Entry' ? 100 : 200;
      const booked = Math.floor(Math.random() * capacity * 0.5);
      return {
        _id: `fallback_slot_${i}_${Date.now()}`,
        startTime: ts.start,
        endTime: ts.end,
        totalCapacity: capacity,
        bookedCount: booked,
        price: dt.price,
        darshanType,
      };
    });
  };

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        /* Check for fallback temple */
        if (templeId.startsWith('temp_') && fallbackTemplesMap[templeId]) {
          setTemple(fallbackTemplesMap[templeId]);
          setLoading(false);
          return;
        }
        const res = await templeAPI.getById(templeId);
        setTemple(res.data.data);
      } catch {
        if (fallbackTemplesMap[templeId]) {
          setTemple(fallbackTemplesMap[templeId]);
        } else {
          showError('Failed to load temple');
        }
      }
      finally { setLoading(false); }
    };
    fetchTemple();
  }, [templeId]);

  useEffect(() => {
    if (formData.visitDate && formData.darshanType) {
      fetchSlots();
    }
  }, [formData.visitDate, formData.darshanType]);

  const fetchSlots = async () => {
    try {
      /* Use fallback slots for temp_ temples */
      if (templeId.startsWith('temp_')) {
        setSlots(generateFallbackSlots(formData.darshanType));
        return;
      }
      const res = await templeAPI.getSlots(templeId, {
        date: formData.visitDate,
        darshanType: formData.darshanType,
      });
      setSlots(res.data.data || []);
    } catch { setSlots([]); }
  };

  const addDevotee = () => {
    if (formData.devotees.length >= 10) { showError('Maximum 10 devotees'); return; }
    setFormData((p) => ({
      ...p,
      devotees: [...p.devotees, { name: '', age: '', gender: 'Male', idType: 'Aadhaar', idNumber: '' }],
    }));
  };

  const removeDevotee = (index) => {
    if (formData.devotees.length <= 1) return;
    setFormData((p) => ({ ...p, devotees: p.devotees.filter((_, i) => i !== index) }));
  };

  const updateDevotee = (index, field, value) => {
    setFormData((p) => ({
      ...p,
      devotees: p.devotees.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
    }));
  };

  const selectedSlot = slots.find((s) => s._id === formData.slot);
  const totalAmount = selectedSlot ? selectedSlot.price * formData.devotees.length : 0;

  const handleSubmit = async () => {
    if (!formData.slot) { showError('Please select a time slot'); return; }
    for (const d of formData.devotees) {
      if (!d.name || !d.age || !d.idNumber) { showError('Please fill all devotee details'); return; }
    }
    setSubmitting(true);
    try {
      /* Handle fallback temple bookings client-side */
      if (templeId.startsWith('temp_')) {
        const bookingId = 'DE' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
        const fallbackBooking = {
          _id: 'local_' + Date.now(),
          bookingId,
          user: user?._id || user?.id || user?.email || 'guest',
          temple: { _id: templeId, name: temple.name, address: temple.address },
          visitDate: formData.visitDate,
          darshanType: formData.darshanType,
          timeSlot: selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : '',
          slot: { startTime: selectedSlot?.startTime, endTime: selectedSlot?.endTime, darshanType: formData.darshanType },
          devotees: formData.devotees.map((d) => ({ ...d, age: Number(d.age) })),
          totalAmount: totalAmount,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          qrCode: null,
        };

        /* Save to localStorage for booking history */
        const existing = JSON.parse(localStorage.getItem('fallbackBookings') || '[]');
        existing.unshift(fallbackBooking);
        localStorage.setItem('fallbackBookings', JSON.stringify(existing));

        success('Booking Confirmed! 🎉');
        navigate(`/booking-success/${fallbackBooking._id}`);
        return;
      }

      const res = await bookingAPI.create({
        temple: templeId,
        slot: formData.slot,
        visitDate: formData.visitDate,
        darshanType: formData.darshanType,
        devotees: formData.devotees.map((d) => ({ ...d, age: Number(d.age) })),
      });
      success('Booking created! Proceed to payment.');
      navigate(`/payment/${res.data.data._id}`);
    } catch (err) {
      showError(err.response?.data?.message || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <Loader fullPage text="Loading booking..." />;
  if (!temple) return <div className="container-custom py-5 text-center"><h3>Temple not found</h3></div>;

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  return (
    <div className="container-custom" style={{ padding: 'var(--space-6) 0 var(--space-9)' }}>
      {/* Header */}
      <div className="mb-4 animate-fade-in-up">
        <h2 style={{ fontFamily: 'var(--font-heading)' }}>Book Darshan</h2>
        <p style={{ color: 'var(--text-muted)' }}>{temple.name}</p>
      </div>

      {/* Progress Steps */}
      <div className="d-flex mb-5 gap-2" style={{ overflowX: 'auto' }}>
        {['Select Date & Slot', 'Devotee Details', 'Review & Confirm'].map((label, i) => (
          <div key={i} className="flex-fill" style={{ textAlign: 'center', cursor: i + 1 <= step ? 'pointer' : 'default' }} onClick={() => i + 1 <= step && setStep(i + 1)}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-1)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-sm)',
              background: step >= i + 1 ? 'linear-gradient(135deg, var(--saffron), var(--temple-red))' : 'var(--bg-card)',
              color: step >= i + 1 ? '#fff' : 'var(--text-muted)',
              border: step >= i + 1 ? 'none' : '2px solid var(--border-color)',
            }}>{i + 1}</div>
            <span style={{ fontSize: 'var(--fs-xs)', color: step >= i + 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Step 1: Date & Slot */}
          {step === 1 && (
            <div className="card p-4 animate-fade-in">
              <h5 className="mb-4"><Calendar size={18} style={{ marginRight: 8 }} />Select Date & Darshan Type</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Visit Date *</label>
                  <input type="date" className="form-control" value={formData.visitDate} min={minDate} max={maxDate} onChange={(e) => setFormData((p) => ({ ...p, visitDate: e.target.value, slot: null }))} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Darshan Type *</label>
                  <select className="form-select" value={formData.darshanType} onChange={(e) => setFormData((p) => ({ ...p, darshanType: e.target.value, slot: null }))}>
                    <option value="">Select type</option>
                    {temple.darshanTypes?.map((dt, i) => (
                      <option key={i} value={dt.name}>{dt.name} — {dt.price > 0 ? `₹${dt.price}` : 'Free'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.visitDate && formData.darshanType && (
                <>
                  <h6 className="mb-3">Available Time Slots</h6>
                  {slots.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No slots available for this date. Try another date.</p>
                  ) : (
                    <div className="row g-2">
                      {slots.map((slot) => {
                        const available = slot.totalCapacity - slot.bookedCount;
                        const isFull = available <= 0;
                        return (
                          <div className="col-6 col-md-4" key={slot._id}>
                            <button
                              type="button"
                              disabled={isFull}
                              onClick={() => setFormData((p) => ({ ...p, slot: slot._id }))}
                              className={`btn w-100 ${formData.slot === slot._id ? 'btn-primary' : 'btn-ghost'}`}
                              style={{
                                padding: 'var(--space-3)',
                                border: formData.slot === slot._id ? 'none' : '1px solid var(--border-color)',
                                opacity: isFull ? 0.4 : 1,
                                textAlign: 'center',
                              }}
                            >
                              <div style={{ fontWeight: 'var(--fw-bold)' }}>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</div>
                              <div style={{ fontSize: 'var(--fs-xs)', color: isFull ? 'var(--danger)' : available <= 10 ? 'var(--warning)' : 'var(--success)' }}>
                                {isFull ? 'Full' : `${available} spots left`}
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-primary" disabled={!formData.slot} onClick={() => setStep(2)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Next: Devotee Details <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Devotee Details */}
          {step === 2 && (
            <div className="card p-4 animate-fade-in">
              <h5 className="mb-4"><Users size={18} style={{ marginRight: 8 }} />Devotee Details</h5>
              {formData.devotees.map((d, i) => (
                <div key={i} style={{ padding: 'var(--space-4)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-3)', border: '1px solid var(--border-light)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 style={{ margin: 0 }}>Devotee {i + 1}</h6>
                    {formData.devotees.length > 1 && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeDevotee(i)} style={{ color: 'var(--danger)' }}>
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <label className="form-label">Full Name *</label>
                      <input type="text" className="form-control" value={d.name} onChange={(e) => updateDevotee(i, 'name', e.target.value)} required />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Age *</label>
                      <input type="number" className="form-control" value={d.age} onChange={(e) => updateDevotee(i, 'age', e.target.value)} min="0" max="150" required />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Gender *</label>
                      <select className="form-select" value={d.gender} onChange={(e) => updateDevotee(i, 'gender', e.target.value)}>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">ID Type *</label>
                      <select className="form-select" value={d.idType} onChange={(e) => updateDevotee(i, 'idType', e.target.value)}>
                        <option>Aadhaar</option><option>PAN</option><option>Voter ID</option><option>Passport</option><option>Driving License</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">ID Number *</label>
                      <input type="text" className="form-control" value={d.idNumber} onChange={(e) => updateDevotee(i, 'idNumber', e.target.value)} required />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" className="btn btn-ghost w-100 mb-4" onClick={addDevotee} style={{ border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Plus size={16} /> Add Devotee ({formData.devotees.length}/10)
              </button>

              <div className="d-flex justify-content-between">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" onClick={() => setStep(3)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Next: Review <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="card p-4 animate-fade-in">
              <h5 className="mb-4"><Ticket size={18} style={{ marginRight: 8 }} />Review Booking</h5>

              <div style={{ padding: 'var(--space-4)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)' }}>
                <div className="row g-3">
                  <div className="col-md-6"><strong>Temple:</strong> {temple.name}</div>
                  <div className="col-md-6"><strong>Visit Date:</strong> {formatDate(formData.visitDate)}</div>
                  <div className="col-md-6"><strong>Darshan Type:</strong> {formData.darshanType}</div>
                  <div className="col-md-6"><strong>Time Slot:</strong> {selectedSlot ? `${formatTime(selectedSlot.startTime)} - ${formatTime(selectedSlot.endTime)}` : ''}</div>
                  <div className="col-md-6"><strong>Devotees:</strong> {formData.devotees.length}</div>
                  <div className="col-md-6"><strong>Price per person:</strong> {selectedSlot ? formatCurrency(selectedSlot.price) : '—'}</div>
                </div>
              </div>

              <h6 className="mb-3">Devotee List</h6>
              <div className="table-responsive mb-4">
                <table className="table" style={{ fontSize: 'var(--fs-sm)' }}>
                  <thead><tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>ID Type</th><th>ID Number</th></tr></thead>
                  <tbody>
                    {formData.devotees.map((d, i) => (
                      <tr key={i}><td>{i + 1}</td><td>{d.name}</td><td>{d.age}</td><td>{d.gender}</td><td>{d.idType}</td><td>{d.idNumber}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ padding: 'var(--space-4)', background: 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.08), rgba(var(--deep-maroon-rgb),0.05))', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>Total Amount</div>
                <div style={{ fontSize: 'var(--fs-4xl)', fontWeight: 'var(--fw-bold)', color: 'var(--deep-maroon)' }}>{formatCurrency(totalAmount)}</div>
              </div>

              <div className="d-flex justify-content-between">
                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting} style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {submitting ? 'Creating Booking...' : 'Confirm & Proceed to Payment'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="col-lg-4">
          <div className="card p-4" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + var(--space-4))' }}>
            <h6 className="mb-3">Booking Summary</h6>
            <div style={{ fontSize: 'var(--fs-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div className="d-flex justify-content-between"><span>Temple</span><span style={{ fontWeight: 'var(--fw-semibold)' }}>{temple.name?.substring(0, 20)}...</span></div>
              {formData.visitDate && <div className="d-flex justify-content-between"><span>Date</span><span>{formatDate(formData.visitDate)}</span></div>}
              {formData.darshanType && <div className="d-flex justify-content-between"><span>Type</span><span>{formData.darshanType}</span></div>}
              {selectedSlot && <div className="d-flex justify-content-between"><span>Time</span><span>{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</span></div>}
              <div className="d-flex justify-content-between"><span>Devotees</span><span>{formData.devotees.length}</span></div>
              <hr style={{ margin: 'var(--space-2) 0' }} />
              <div className="d-flex justify-content-between" style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--deep-maroon)' }}>
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
