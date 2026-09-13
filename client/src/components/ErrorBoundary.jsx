import React from 'react';
import Button from './Button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
          }}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: 520,
              width: '100%',
              padding: '36px 32px',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
              Something went unexpected
            </h2>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 14.5,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              An unexpected error occurred during your session. Your saved data remains intact.
            </p>

            {this.state.error && (
              <div
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontSize: 12,
                  fontFamily: 'monospace',
                  color: '#f87171',
                  textAlign: 'left',
                  marginBottom: 24,
                  overflowX: 'auto',
                }}
              >
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button
                variant="secondary"
                size="md"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={this.handleReset}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
