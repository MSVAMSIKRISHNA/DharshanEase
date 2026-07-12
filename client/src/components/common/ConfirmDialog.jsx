import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ show, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger', onConfirm, onCancel, loading = false }) => {
  if (!show) return null;

  const variantColors = {
    danger: 'var(--danger)',
    warning: 'var(--warning)',
    saffron: 'var(--saffron)',
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 'var(--z-modal)' }} onClick={onCancel}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content animate-scale-in">
          <div className="modal-body text-center" style={{ padding: 'var(--space-6) var(--space-5)' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-full)',
                background: variant === 'danger' ? 'var(--danger-light)' : 'var(--warning-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
              }}
            >
              <AlertTriangle size={28} color={variantColors[variant]} />
            </div>
            <h5 style={{ marginBottom: 'var(--space-2)' }}>{title}</h5>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-5)' }}>
              {message}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
                {cancelText}
              </button>
              <button
                className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                onClick={onConfirm}
                disabled={loading}
                style={variant === 'danger' ? { background: 'var(--danger)', border: 'none', color: '#fff', borderRadius: 'var(--radius-md)', padding: '10px 24px', fontWeight: 600 } : {}}
              >
                {loading ? 'Processing...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
