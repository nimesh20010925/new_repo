import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Onboarding from './components/Onboarding';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );
  const [view, setView] = useState('login'); // 'login' | 'register' | 'home'
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Sync view with auth status
  useEffect(() => {
    if (token) {
      setView('home');
    } else {
      setView('login');
    }
  }, [token]);

  const handleAuth = (newToken, userData, isRegister = false) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    // Show onboarding only for first-time register
    if (isRegister && !localStorage.getItem('onboarded')) {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setView('login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(to bottom, #ecfdf5, #f0fdfa 30%, #f0fdf4 70%, #ecfdf5)`,
        }}
      />
      
      {/* Subtle decorative blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-40 translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Navbar - Only show when logged in or on auth pages */}
      {token && <Navbar user={user} onLogout={handleLogout} />}

      {/* Onboarding overlay (only for first-time register) */}
      {showOnboarding && (
        <Onboarding onDone={() => setShowOnboarding(false)} />
      )}

      {/* Main Content */}
      {!showOnboarding && (
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          {/* Auth Screens - Full-width beautiful layout */}
          {!token && view === 'login' && (
            <Login
              onAuth={handleAuth}
              switchToRegister={() => setView('register')}
            />
          )}

          {!token && view === 'register' && (
            <Register
              onAuth={handleAuth}
              switchToLogin={() => setView('login')}
            />
          )}

          {/* Home Dashboard */}
          {token && view === 'home' && (
            <div className="w-full max-w-7xl mx-auto">
              <Home token={token} user={user} />
            </div>
          )}
        </main>
      )}

      {/* Footer - Always at bottom */}
     {/* <Footer />*/}
    </div>
  );
}

export default App;