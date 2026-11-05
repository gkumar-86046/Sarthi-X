import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Courses from './components/Courses';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/DashboardLayout';
import { getStoredUser, isLoggedIn, logoutUser, getProfile, clearSession } from './services/api';

function App() {
  // ── Restore session from localStorage on first mount ────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    if (isLoggedIn()) return getStoredUser();
    return null;
  });

  const [currentView, setCurrentView] = useState(() => {
    // If a valid session exists, go straight to dashboard
    if (isLoggedIn() && getStoredUser()) return 'dashboard';
    return 'home';
  });

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

    const handleSessionExpired = () => {
      clearSession();
      setCurrentUser(null);
      setCurrentView('login');
    };
    window.addEventListener('sarathi:session_expired', handleSessionExpired);

    // Automatically sync freshest profile data directly from MySQL
    if (isLoggedIn()) {
      getProfile().then(res => {
        if (res && res.success && res.user) {
          setCurrentUser(res.user);
          localStorage.setItem('sarathi_user', JSON.stringify(res.user));
        }
      }).catch(err => {
        console.warn('Profile sync notice:', err.message);
        if (err.status === 401 || (err.message && err.message.toLowerCase().includes('session expired'))) {
          handleSessionExpired();
        }
      });
    }

    return () => {
      window.removeEventListener('sarathi:session_expired', handleSessionExpired);
    };
  }, []);

  const handleNavigate = (view, hash = null) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'home' && hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    // Revoke refresh token on backend, clear localStorage
    await logoutUser();
    setCurrentUser(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProfile = (updatedProfile) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedProfile
    }));
  };

  // Render Dashboard Fullscreen Mode when logged in
  if (currentView === 'dashboard') {
    return (
      <DashboardLayout
        user={currentUser}
        onLogout={handleLogout}
        onUpdateProfile={handleUpdateProfile}
      />
    );
  }

  return (
    <div className="App">
      {/* Animated Background Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <Navbar onNavigate={handleNavigate} currentView={currentView} />

      {currentView === 'login' && (
        <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
      )}

      {currentView === 'register' && (
        <Register onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
      )}

      {currentView === 'home' && (
        <>
          <Hero onNavigate={handleNavigate} />
          <Features />
          <Courses />
          <WhyChooseUs />
          <HowItWorks />
          <Testimonials />
          <Pricing />
        </>
      )}

      {currentView !== 'login' && currentView !== 'register' && <Footer />}
    </div>
  );
}

export default App;
