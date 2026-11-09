import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LumosProvider } from './contexts/LumosContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LumosProvider>
          <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#ffffff',
                  color: '#0f172a',
                  fontSize: '13px',
                  fontWeight: 500,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </LumosProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
