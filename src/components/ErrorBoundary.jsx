import React from 'react';

// Catches render errors and shows fallback UI
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Update state when an error is thrown
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Log error details
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  // Render fallback or children
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: () => this.setState({ hasError: false, error: null }),
        });
      }

      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">Please refresh the page and try again.</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
