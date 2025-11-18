/**
 * Main Entry Point (with error handling)
 * Application initialization
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ React Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          maxWidth: '800px',
          margin: '50px auto',
          fontFamily: 'monospace',
          backgroundColor: '#fee',
          border: '2px solid #f00',
          borderRadius: '8px'
        }}>
          <h1 style={{ color: '#c00' }}>⚠️ Errore nell'applicazione</h1>
          <h2>Dettagli:</h2>
          <pre style={{
            padding: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <h3>Stack trace:</h3>
          <pre style={{
            padding: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ricarica pagina
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('❌ Global Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled Promise Rejection:', event.reason);
});

// Log when app starts
console.log('🚀 Library Tracker PWA starting...');

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}

// Check for app updates
let refreshing = false;
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
});

// Render app with error boundary
try {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found! Check index.html');
  }

  console.log('✅ Root element found, rendering app...');

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  console.log('✅ App rendered successfully!');
} catch (error) {
  console.error('❌ Failed to render app:', error);

  // Show error in DOM
  document.body.innerHTML = `
    <div style="padding: 20px; max-width: 800px; margin: 50px auto; font-family: monospace; background: #fee; border: 2px solid #f00; border-radius: 8px;">
      <h1 style="color: #c00;">⚠️ Errore Critico</h1>
      <p>L'applicazione non può essere avviata.</p>
      <h2>Errore:</h2>
      <pre style="padding: 10px; background: #fff; border: 1px solid #ccc; border-radius: 4px; overflow: auto;">${error.message}</pre>
      <p><strong>Possibili soluzioni:</strong></p>
      <ol>
        <li>Apri la Console del browser (F12) per vedere gli errori</li>
        <li>Cancella la cache del browser (Ctrl+Shift+Delete)</li>
        <li>Ricarica la pagina (Ctrl+F5)</li>
        <li>Verifica che tutte le dipendenze siano installate: <code>npm install</code></li>
        <li>Riavvia il dev server: <code>npm run dev</code></li>
      </ol>
      <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #0066cc; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
        Ricarica pagina
      </button>
    </div>
  `;
}
