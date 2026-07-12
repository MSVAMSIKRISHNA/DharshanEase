import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { success, error: showError } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      success('Reset link sent to your email');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', padding: 'var(--space-7) 0' }}>
      <div className="container-custom">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="animate-fade-in-up" style={{
              background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-7) var(--space-6)',
              boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-light)',
            }}>
              {sent ? (
                <div className="text-center">
                  <div style={{ fontSize: 48, marginBottom: 'var(--space-3)' }}>📧</div>
                  <h4>Check Your Email</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>
                    We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                  </p>
                  <Link to="/login" className="btn btn-primary mt-3">Back to Login</Link>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div style={{ fontSize: 40, marginBottom: 'var(--space-2)' }}>🔒</div>
                    <h3 style={{ fontFamily: 'var(--font-heading)' }}>Forgot Password?</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>
                      Enter your email and we&apos;ll send you a reset link
                    </p>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label" htmlFor="forgot-email">Email Address</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input id="forgot-email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required style={{ paddingLeft: 40 }} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading} style={{ padding: '12px' }}>
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                  <div className="text-center mt-4">
                    <Link to="/login" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <ArrowLeft size={14} /> Back to Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
