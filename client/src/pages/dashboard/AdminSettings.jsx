import { useState } from 'react';
import { Settings, Globe, Mail, Bell, Shield, Save } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const AdminSettings = () => {
  const { addNotification } = useNotification();
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'DarshanEase',
    siteEmail: 'admin@darshanease.com',
    supportPhone: '+91 1800-123-4567',
    maxBookingsPerUser: 10,
    bookingWindowDays: 90,
    cancellationHours: 24,
    cancellationFee: 25,
    maintenanceMode: false,
    emailNotifications: true,
    autoApproveTemples: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({ ...settings, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    addNotification('Settings saved successfully!', 'success');
    setSaving(false);
  };

  const sections = [
    {
      title: 'General',
      icon: Globe,
      fields: [
        { name: 'siteName', label: 'Site Name', type: 'text' },
        { name: 'siteEmail', label: 'Admin Email', type: 'email' },
        { name: 'supportPhone', label: 'Support Phone', type: 'text' },
      ],
    },
    {
      title: 'Booking Rules',
      icon: Settings,
      fields: [
        { name: 'maxBookingsPerUser', label: 'Max Bookings Per User', type: 'number' },
        { name: 'bookingWindowDays', label: 'Booking Window (Days)', type: 'number' },
        { name: 'cancellationHours', label: 'Cancellation Window (Hours)', type: 'number' },
        { name: 'cancellationFee', label: 'Cancellation Fee (₹)', type: 'number' },
      ],
    },
  ];

  const toggles = [
    { name: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Temporarily disable bookings for maintenance', icon: Shield },
    { name: 'emailNotifications', label: 'Email Notifications', desc: 'Send booking confirmations and updates via email', icon: Mail },
    { name: 'autoApproveTemples', label: 'Auto-Approve Temples', desc: 'Automatically approve new temple listings', icon: Bell },
  ];

  return (
    <div style={{ maxWidth: 'var(--container-narrow)', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-1)' }}>
          System <span className="gradient-text">Settings</span>
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Configure platform-wide settings and rules</p>
      </div>

      <form onSubmit={handleSave}>
        {sections.map((section) => (
          <div key={section.title} style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)', border: '1px solid var(--border-light)',
            marginBottom: 'var(--space-4)',
          }}>
            <h5 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <section.icon size={18} color="var(--saffron)" /> {section.title}
            </h5>
            <div className="row g-3">
              {section.fields.map((field) => (
                <div className="col-md-6" key={field.name}>
                  <label className="form-label">{field.label}</label>
                  <input type={field.type} name={field.name} className="form-control"
                    value={settings[field.name]} onChange={handleChange} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Toggles */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)', border: '1px solid var(--border-light)',
          marginBottom: 'var(--space-4)',
        }}>
          <h5 style={{ marginBottom: 'var(--space-4)' }}>Feature Toggles</h5>
          {toggles.map((toggle) => (
            <div key={toggle.name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--space-4) 0',
              borderBottom: '1px solid var(--border-light)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(var(--saffron-rgb),0.1), rgba(var(--deep-maroon-rgb),0.06))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <toggle.icon size={18} color="var(--saffron)" />
                </div>
                <div>
                  <div style={{ fontWeight: 'var(--fw-medium)' }}>{toggle.label}</div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{toggle.desc}</div>
                </div>
              </div>
              <label style={{ position: 'relative', width: 48, height: 26, cursor: 'pointer' }}>
                <input type="checkbox" name={toggle.name} checked={settings[toggle.name]}
                  onChange={handleChange} style={{ display: 'none' }} />
                <div style={{
                  width: 48, height: 26, borderRadius: 'var(--radius-full)',
                  background: settings[toggle.name] ? 'var(--saffron)' : 'var(--border-color)',
                  transition: 'background var(--transition-fast)',
                  position: 'relative',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 'var(--radius-full)',
                    background: 'var(--white)', boxShadow: 'var(--shadow-sm)',
                    position: 'absolute', top: 3,
                    left: settings[toggle.name] ? 25 : 3,
                    transition: 'left var(--transition-fast)',
                  }} />
                </div>
              </label>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '12px 32px' }}
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
