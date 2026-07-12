import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { success, error: showError } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password, phone: formData.phone });
      success('Account created successfully! 🙏');
      navigate('/');
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Enter your full name', required: true },
    { name: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'your@email.com', required: true },
    { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '10-digit mobile number', required: false },
  ];

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
              <div className="text-center" style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ fontSize: 40, marginBottom: 'var(--space-2)' }}>🙏</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>Create Account</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>Begin your spiritual journey with DarshanEase</p>
              </div>

              <form onSubmit={handleSubmit}>
                {fields.map((field) => (
                  <div className="mb-3" key={field.name}>
                    <label className="form-label" htmlFor={`reg-${field.name}`}>{field.label}</label>
                    <div style={{ position: 'relative' }}>
                      <field.icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        id={`reg-${field.name}`}
                        type={field.type}
                        className="form-control"
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        style={{ paddingLeft: 40 }}
                      />
                    </div>
                  </div>
                ))}

                <div className="mb-3">
                  <label className="form-label" htmlFor="reg-password">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input id="reg-password" type={showPassword ? 'text' : 'password'} className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters with a number" required style={{ paddingLeft: 40, paddingRight: 40 }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input id="reg-confirm" type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required style={{ paddingLeft: 40 }} />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading} style={{ padding: '12px', fontSize: 'var(--fs-md)' }}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="divider-ornament" style={{ margin: 'var(--space-5) 0' }}>or</div>

              <p className="text-center" style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-muted)', margin: 0 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--saffron)', fontWeight: 'var(--fw-semibold)' }}>Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
