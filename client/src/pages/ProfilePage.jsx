import { useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Lock, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Loader from '../components/common/Loader';
import { getInitials } from '../utils/helpers';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
  });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwdChange = (e) => setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userAPI.updateProfile(form);
      updateUser(res.data.data);
      addNotification('Profile updated successfully!', 'success');
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      addNotification('Passwords do not match', 'error');
      return;
    }
    setChangingPwd(true);
    try {
      await userAPI.updateProfile({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      addNotification('Password changed successfully!', 'success');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setChangingPwd(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setLoading(true);
    try {
      const res = await userAPI.uploadAvatar(formData);
      updateUser(res.data.data);
      addNotification('Avatar updated!', 'success');
    } catch (err) {
      addNotification(err.response?.data?.message || 'Failed to upload avatar', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loader fullPage text="Loading profile..." />;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div style={{ maxWidth: 'var(--container-narrow)', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          Account <span className="gradient-text">Settings</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your profile and security preferences</p>
      </div>

      {/* Avatar + Info card */}
      <div style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)', border: '1px solid var(--border-light)',
        marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center',
        gap: 'var(--space-5)', flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 96, height: 96, borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--saffron), var(--deep-maroon))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--fs-3xl)', fontWeight: 'var(--fw-bold)',
            color: 'var(--white)', overflow: 'hidden',
          }}>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <label style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 32, height: 32, borderRadius: 'var(--radius-full)',
            background: 'var(--saffron)', color: 'var(--white)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: 'var(--shadow-md)',
          }}>
            <Camera size={14} />
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
          </label>
        </div>
        <div>
          <h4 style={{ margin: 0 }}>{user.name}</h4>
          <p style={{ color: 'var(--text-muted)', margin: '2px 0 4px', fontSize: 'var(--fs-sm)' }}>{user.email}</p>
          <span className="badge-spiritual badge-saffron" style={{ fontSize: 'var(--fs-xs)' }}>
            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              borderRadius: 'var(--radius-full)', padding: '8px 20px',
            }}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)', border: '1px solid var(--border-light)',
        }}>
          <h5 style={{ marginBottom: 'var(--space-5)' }}>Personal Information</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label">
                  <User size={14} style={{ marginRight: 4 }} /> Full Name
                </label>
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <Mail size={14} style={{ marginRight: 4 }} /> Email
                </label>
                <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <Phone size={14} style={{ marginRight: 4 }} /> Phone
                </label>
                <input type="text" name="phone" className="form-control" placeholder="Enter phone number" value={form.phone} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Address</label>
                <input type="text" name="address" className="form-control" placeholder="Enter address" value={form.address} onChange={handleChange} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={saving}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '12px 32px' }}
                >
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)', border: '1px solid var(--border-light)',
        }}>
          <h5 style={{ marginBottom: 'var(--space-5)' }}>Change Password</h5>
          <form onSubmit={handlePasswordChange}>
            <div className="row g-4">
              <div className="col-12">
                <label className="form-label">Current Password</label>
                <input type="password" name="currentPassword" className="form-control"
                  value={pwdForm.currentPassword} onChange={handlePwdChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">New Password</label>
                <input type="password" name="newPassword" className="form-control"
                  value={pwdForm.newPassword} onChange={handlePwdChange} required minLength={6} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Confirm New Password</label>
                <input type="password" name="confirmPassword" className="form-control"
                  value={pwdForm.confirmPassword} onChange={handlePwdChange} required minLength={6} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary" disabled={changingPwd}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '12px 32px' }}
                >
                  <Lock size={16} /> {changingPwd ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
