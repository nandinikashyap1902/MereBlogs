import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, info) =>
          console.error('ErrorBoundary caught:', error, info.componentStack)
        }
      >
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
