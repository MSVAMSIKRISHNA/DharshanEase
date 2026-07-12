import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-7)' }}>
      <div className="animate-fade-in-up">
        <div style={{ fontSize: 80, marginBottom: 'var(--space-4)', opacity: 0.6 }}>🛕</div>
        <h1 style={{ fontSize: 'var(--fs-6xl)', fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-2)' }}>
          <span className="gradient-text">404</span>
        </h1>
        <h3 style={{ marginBottom: 'var(--space-3)' }}>Path Not Found</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto var(--space-5)', fontSize: 'var(--fs-base)' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us guide you back to the right path.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Home size={16} /> Go Home
          </Link>
          <button className="btn btn-ghost" onClick={() => window.history.back()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
