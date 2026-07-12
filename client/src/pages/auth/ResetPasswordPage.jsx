import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { showError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, { password: formData.password });
      success('Password reset successful! Please login.');
      navigate('/login');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', padding: 'var(--space-7) 0' }}>
      <div className="container-custom">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="animate-fade-in-up" style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-7) var(--space-6)', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-light)' }}>
              <div className="text-center mb-4">
                <div style={{ fontSize: 40, marginBottom: 'var(--space-2)' }}>🔐</div>
                <h3 style={{ fontFamily: 'var(--font-heading)' }}>Reset Password</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>Create a new password for your account</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="reset-pass">New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input id="reset-pass" type="password" className="form-control" value={formData.password} onChange={(e) => setFormData(p => ({...p, password: e.target.value}))} placeholder="Min 6 characters" required style={{ paddingLeft: 40 }} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="reset-confirm">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input id="reset-confirm" type="password" className="form-control" value={formData.confirmPassword} onChange={(e) => setFormData(p => ({...p, confirmPassword: e.target.value}))} placeholder="Re-enter password" required style={{ paddingLeft: 40 }} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading} style={{ padding: '12px' }}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
