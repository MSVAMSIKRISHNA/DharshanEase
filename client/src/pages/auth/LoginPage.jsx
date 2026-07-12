import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error: showError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      success('Welcome back! 🙏');
      navigate(from, { replace: true });
    } catch (err) {
      showError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', padding: 'var(--space-7) 0' }}>
      <div className="container-custom">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="animate-fade-in-up" style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-7) var(--space-6)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-light)',
            }}>
              <div className="text-center" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ fontSize: 40, marginBottom: 'var(--space-2)' }}>🙏</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>Welcome Back</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>Sign in to continue your spiritual journey</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="login-email">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      id="login-email"
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      style={{ paddingLeft: 40 }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      style={{ paddingLeft: 40, paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="rememberMe" style={{ fontSize: 'var(--fs-sm)' }}>Remember me</label>
                  </div>
                  <Link to="/forgot-password" style={{ fontSize: 'var(--fs-sm)', color: 'var(--saffron)' }}>
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                  style={{ padding: '12px', fontSize: 'var(--fs-md)' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="divider-ornament" style={{ margin: 'var(--space-5) 0' }}>or</div>

              <p className="text-center" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', margin: 0 }}>
                Don&apos;t have an account?{' '}
                <Link to="/register" style={{ color: 'var(--saffron)', fontWeight: 'var(--fw-semibold)' }}>
                  Create Account
                </Link>
              </p>

              {/* Demo Credentials */}
              <div style={{
                marginTop: 'var(--space-4)',
                padding: 'var(--space-3)',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--fs-xs)',
                color: 'var(--text-muted)',
              }}>
                <strong>Demo Accounts:</strong><br />
                Admin: admin@darshanease.com | Organizer: organizer@darshanease.com<br />
                User: user@darshanease.com | Password: password123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
