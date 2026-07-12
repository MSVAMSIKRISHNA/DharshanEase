import { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { templeAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminTemples = () => {
  const { addNotification } = useNotification();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchTemples = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      const res = await templeAPI.getAll(params);
      const data = res.data.data;
      setTemples(data?.temples || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch { setTemples([]); }
    setLoading(false);
  };

  useEffect(() => { fetchTemples(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchTemples(); };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await templeAPI.update(id, { status: currentStatus === 'active' ? 'inactive' : 'active' });
      addNotification('Temple status updated', 'success');
      fetchTemples();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to update', 'error');
    }
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

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          Temple <span className="gradient-text">Management</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Review, approve, and manage all temples</p>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: 'var(--space-5)', maxWidth: 400 }}>
        <div className="search-bar-spiritual">
          <Search className="search-icon" size={18} />
          <input type="text" className="form-control" placeholder="Search temples..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </form>

      {loading ? <Loader text="Loading temples..." /> : (
        <>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)', overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['Temple', 'Location', 'Organizer', 'Rating', 'Status', 'Actions'].map((h) => (
                      <th key={h} style={{
                        padding: 'var(--space-3) var(--space-4)', textAlign: 'left',
                        fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)',
                        textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {temples.map((t) => (
                    <tr key={t._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <Building2 size={16} color="var(--saffron)" />
                          <span style={{ fontWeight: 'var(--fw-medium)' }}>{t.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} /> {t.address?.district}, {t.address?.state}
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)' }}>
                        {t.organizer?.name || '–'}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--fw-semibold)', color: 'var(--soft-gold)' }}>
                        ⭐ {t.averageRating || 0}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <span className={`badge-spiritual ${t.status === 'active' ? 'badge-success' : 'badge-danger'}`}
                          style={{ fontSize: 'var(--fs-xs)', textTransform: 'capitalize' }}
                        >
                          {t.status || 'active'}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                          <button onClick={() => handleToggleStatus(t._id, t.status)} className="btn btn-ghost" style={{ padding: '4px 8px' }}
                            title={t.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {t.status === 'active' ? <XCircle size={14} color="var(--warning)" /> : <CheckCircle size={14} color="var(--success)" />}
                          </button>
                          <button onClick={() => setDeleteId(t._id)} className="btn btn-ghost" style={{ padding: '4px 8px', color: 'var(--danger)' }}>
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
          {totalPages > 1 && (
            <div style={{ marginTop: 'var(--space-5)' }}>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}

      <ConfirmDialog isOpen={!!deleteId} title="Delete Temple?" message="This will permanently delete the temple and all associated data."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} confirmText="Delete" variant="danger" />
    </div>
  );
};

export default AdminTemples;
