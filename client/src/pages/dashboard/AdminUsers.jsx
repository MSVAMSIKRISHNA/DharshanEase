import { useState, useEffect } from 'react';
import { Search, Users, Shield, Trash2, Edit } from 'lucide-react';
import { userAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { formatDate, getInitials } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminUsers = () => {
  const { addNotification } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [roleEdit, setRoleEdit] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      const res = await userAPI.getAll(params);
      const data = res.data.data;
      setUsers(data?.users || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch { setUsers([]); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const handleRoleChange = async (id, role) => {
    try {
      await userAPI.updateRole(id, { role });
      addNotification(`Role updated to ${role}`, 'success');
      setRoleEdit(null);
      fetchUsers();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to update role', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await userAPI.deleteUser(deleteId);
      addNotification('User deleted', 'success');
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      addNotification(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const roleBadge = (role) => {
    const colors = { admin: 'badge-danger', organizer: 'badge-saffron', user: 'badge-info' };
    return colors[role] || 'badge-saffron';
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          User <span className="gradient-text">Management</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage all platform users and their roles</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: 'var(--space-5)', maxWidth: 400 }}>
        <div className="search-bar-spiritual">
          <Search className="search-icon" size={18} />
          <input type="text" className="form-control" placeholder="Search users..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </form>

      {loading ? <Loader text="Loading users..." /> : (
        <>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)', overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                      <th key={h} style={{
                        padding: 'var(--space-3) var(--space-4)', textAlign: 'left',
                        fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-semibold)',
                        textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 'var(--radius-full)',
                            background: 'linear-gradient(135deg, var(--saffron), var(--deep-maroon))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--white)', fontSize: 'var(--fs-xs)', fontWeight: 'var(--fw-bold)',
                          }}>
                            {getInitials(u.name)}
                          </div>
                          <span style={{ fontWeight: 'var(--fw-medium)' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                        {u.email}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        {roleEdit === u._id ? (
                          <select className="form-control" defaultValue={u.role}
                            style={{ width: 120, padding: '4px 8px', fontSize: 'var(--fs-sm)' }}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            onBlur={() => setRoleEdit(null)}
                            autoFocus
                          >
                            <option value="user">User</option>
                            <option value="organizer">Organizer</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`badge-spiritual ${roleBadge(u.role)}`}
                            style={{ fontSize: 'var(--fs-xs)', textTransform: 'capitalize', cursor: 'pointer' }}
                            onClick={() => setRoleEdit(u._id)}
                          >
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
                        {formatDate(u.createdAt)}
                      </td>
                      <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                          <button onClick={() => setRoleEdit(u._id)} className="btn btn-ghost" style={{ padding: '4px 8px' }}>
                            <Shield size={14} />
                          </button>
                          <button onClick={() => setDeleteId(u._id)} className="btn btn-ghost" style={{ padding: '4px 8px', color: 'var(--danger)' }}>
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

      <ConfirmDialog isOpen={!!deleteId} title="Delete User?" message="This action cannot be undone."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} confirmText="Delete" variant="danger" />
    </div>
  );
};

export default AdminUsers;
