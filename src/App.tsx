import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { ToasterProvider } from './components/ui/Toaster';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
          <ToasterProvider>
            <AppRoutes />
          </ToasterProvider>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;