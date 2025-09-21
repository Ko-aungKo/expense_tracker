import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppProvider from './context/AppProvider';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Suspense fallback UI
const PageLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" text="Loading page..." />
  </div>
);

// Error boundary fallback UI
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message || 'An unexpected error occurred'}</p>
      <div className="space-x-3">
        <button onClick={resetErrorBoundary} className="btn btn-primary">Try again</button>
        <button onClick={() => window.location.reload()} className="btn btn-secondary">Reload page</button>
      </div>
    </div>
  </div>
);

// Lazy routes
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Expenses  = React.lazy(() => import('./pages/Expenses'));
const Categories = React.lazy(() => import('./pages/Categories'));

function App() {
  return (
    // Top-level error handling
    <ErrorBoundary fallback={ErrorFallback}>
      {/* Global state & configuration */}
      <AppProvider>
        {/* Client-side routing */}
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* Shared page chrome */}
            <Layout>
              {/* Code-splitting boundary */}
              <Suspense fallback={<PageLoadingFallback />}>
                {/* Route table */}
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Navigate to="/" replace />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Layout>
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
