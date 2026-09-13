import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: 480,
          width: '100%',
          padding: '48px 32px',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
          404
        </h1>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--color-text-primary)' }}>
          Page Not Found
        </h2>
        <p
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 14.5,
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
          <Link to="/">
            <Button variant="secondary">Landing Page</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
