import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building2, MapPin, Eye } from 'lucide-react';
import { templeAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const OrganizerTemples = () => {
  const { addNotification } = useNotification();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: '', description: '', address: { street: '', district: '', state: '', pincode: '' },
    timings: { opening: '06:00', closing: '20:00' },
  });

  const fetchTemples = async () => {
    try {
      const res = await templeAPI.getAll({ limit: 100 });
      setTemples(res.data.data?.temples || res.data.data || []);
    } catch { setTemples([]); }
    setLoading(false);
  };

  useEffect(() => { fetchTemples(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm({ ...form, [parent]: { ...form[parent], [child]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await templeAPI.update(editing, form);
        addNotification('Temple updated!', 'success');
      } else {
        await templeAPI.create(form);
        addNotification('Temple created!', 'success');
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', address: { street: '', district: '', state: '', pincode: '' }, timings: { opening: '06:00', closing: '20:00' } });
      fetchTemples();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleEdit = (temple) => {
    setForm({
      name: temple.name || '',
      description: temple.description || '',
      address: temple.address || { street: '', district: '', state: '', pincode: '' },
      timings: temple.timings || { opening: '06:00', closing: '20:00' },
    });
    setEditing(temple._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await templeAPI.delete(deleteId);
      addNotification('Temple deleted', 'success');
      setDeleteId(null);
      fetchTemples();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  if (loading) return <Loader fullPage text="Loading temples..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
            My <span className="gradient-text">Temples</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>{temples.length} temple(s) managed</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); }}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <Plus size={16} /> {showForm ? 'Cancel' : 'Add Temple'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)', border: '1px solid var(--border-light)',
          marginBottom: 'var(--space-5)',
        }}>
          <h5 style={{ marginBottom: 'var(--space-4)' }}>{editing ? 'Edit Temple' : 'Add New Temple'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Temple Name</label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Opening Time</label>
                <input type="time" name="timings.opening" className="form-control" value={form.timings.opening} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Closing Time</label>
                <input type="time" name="timings.closing" className="form-control" value={form.timings.closing} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" rows={3} value={form.description} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">District</label>
                <input type="text" name="address.district" className="form-control" value={form.address.district} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">State</label>
                <input type="text" name="address.state" className="form-control" value={form.address.state} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Pincode</label>
                <input type="text" name="address.pincode" className="form-control" value={form.address.pincode} onChange={handleChange} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px' }}>
                  {editing ? 'Update Temple' : 'Create Temple'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Temple List */}
      {temples.length === 0 && !showForm ? (
        <EmptyState icon="🛕" title="No temples yet" message="Create your first temple to start managing darshan slots." />
      ) : (
        <div className="row g-4">
          {temples.map((temple) => (
            <div className="col-md-6 col-lg-4" key={temple._id}>
              <div style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-light)', overflow: 'hidden',
                transition: 'all var(--transition-base)',
              }}>
                <div style={{
                  height: 140, background: 'linear-gradient(135deg, hsl(25,60%,40%), hsl(45,50%,30%))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 48, opacity: 0.4 }}>🛕</span>
                </div>
                <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
                  <h6 style={{ marginBottom: 'var(--space-1)' }}>{temple.name}</h6>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-3)' }}>
                    <MapPin size={13} /> {temple.address?.district}, {temple.address?.state}
                  </div>
                  <div style={{
                    display: 'flex', gap: 'var(--space-2)', paddingTop: 'var(--space-3)',
                    borderTop: '1px solid var(--border-light)',
                  }}>
                    <button onClick={() => handleEdit(temple)} className="btn btn-ghost"
                      style={{ flex: 1, fontSize: 'var(--fs-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => setDeleteId(temple._id)} className="btn btn-ghost"
                      style={{ flex: 1, fontSize: 'var(--fs-sm)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Temple?"
        message="This will permanently delete this temple and all associated data."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default OrganizerTemples;
