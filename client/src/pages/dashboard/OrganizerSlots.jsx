import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { slotAPI, templeAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const OrganizerSlots = () => {
  const { addNotification } = useNotification();
  const [slots, setSlots] = useState([]);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filterTemple, setFilterTemple] = useState('');

  const [form, setForm] = useState({
    temple: '', date: '', startTime: '', endTime: '',
    capacity: 100, darshanType: 'Regular', price: 0,
  });

  const fetchData = async () => {
    try {
      const templeRes = await templeAPI.getAll({ limit: 100 }).catch(() => ({ data: { data: { temples: [] } } }));
      const ts = templeRes.data.data?.temples || templeRes.data.data || [];
      setTemples(ts);

      if (ts.length > 0) {
        const templeId = filterTemple || ts[0]._id;
        const slotsRes = await templeAPI.getSlots(templeId, { limit: 100 }).catch(() => ({ data: { data: [] } }));
        setSlots(slotsRes.data.data || []);
      }
    } catch { /* */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filterTemple]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await slotAPI.update(editing, form);
        addNotification('Slot updated!', 'success');
      } else {
        await slotAPI.create(form);
        addNotification('Slot created!', 'success');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ temple: '', date: '', startTime: '', endTime: '', capacity: 100, darshanType: 'Regular', price: 0 });
      fetchData();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleEdit = (slot) => {
    setForm({
      temple: slot.temple?._id || slot.temple || '',
      date: slot.date?.slice(0, 10) || '',
      startTime: slot.startTime || '',
      endTime: slot.endTime || '',
      capacity: slot.capacity || 100,
      darshanType: slot.darshanType || 'Regular',
      price: slot.price || 0,
    });
    setEditing(slot._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await slotAPI.delete(deleteId);
      addNotification('Slot deleted', 'success');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  if (loading) return <Loader fullPage text="Loading slots..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
            Slot <span className="gradient-text">Management</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Configure darshan time slots for your temples</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); }}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <Plus size={16} /> {showForm ? 'Cancel' : 'Add Slot'}
        </button>
      </div>

      {/* Temple Filter */}
      {temples.length > 1 && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <select className="form-control" value={filterTemple} onChange={(e) => setFilterTemple(e.target.value)}
            style={{ maxWidth: 320 }}
          >
            {temples.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)', border: '1px solid var(--border-light)',
          marginBottom: 'var(--space-5)',
        }}>
          <h5 style={{ marginBottom: 'var(--space-4)' }}>{editing ? 'Edit Slot' : 'Create New Slot'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Temple</label>
                <select name="temple" className="form-control" value={form.temple} onChange={handleChange} required>
                  <option value="">Select temple...</option>
                  {temples.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Darshan Type</label>
                <select name="darshanType" className="form-control" value={form.darshanType} onChange={handleChange}>
                  {['Regular', 'VIP', 'Special', 'Free'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Start Time</label>
                <input type="time" name="startTime" className="form-control" value={form.startTime} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">End Time</label>
                <input type="time" name="endTime" className="form-control" value={form.endTime} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Capacity</label>
                <input type="number" name="capacity" className="form-control" value={form.capacity} onChange={handleChange} min="1" required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Price (₹)</label>
                <input type="number" name="price" className="form-control" value={form.price} onChange={handleChange} min="0" />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px' }}>
                  {editing ? 'Update Slot' : 'Create Slot'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Slot List */}
      {slots.length === 0 && !showForm ? (
        <EmptyState icon="📅" title="No slots configured" message="Add darshan time slots for devotees to book." />
      ) : (
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)', overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  {['Date', 'Time', 'Type', 'Capacity', 'Booked', 'Price', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: 'var(--space-3) var(--space-4)', textAlign: 'left',
                      fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)',
                      textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={13} color="var(--saffron)" /> {slot.date?.slice(0, 10)}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> {slot.startTime} – {slot.endTime}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <span className="badge-spiritual badge-saffron" style={{ fontSize: 'var(--fs-xs)' }}>{slot.darshanType}</span>
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{slot.capacity}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{slot.bookedCount || 0}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--fw-semibold)' }}>
                      ₹{slot.price || 0}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                        <button onClick={() => handleEdit(slot)} className="btn btn-ghost" style={{ padding: '4px 8px' }}>
                          <Edit size={14} />
                        </button>
                        <button onClick={() => setDeleteId(slot._id)} className="btn btn-ghost" style={{ padding: '4px 8px', color: 'var(--danger)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteId} title="Delete Slot?" message="This will permanently remove this time slot."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} confirmText="Delete" variant="danger" />
    </div>
  );
};

export default OrganizerSlots;
