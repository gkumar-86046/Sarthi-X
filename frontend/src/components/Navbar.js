import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = ({ onNavigate, currentView = 'home' }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sarathi_theme') || document.documentElement.getAttribute('data-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sarathi_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (view, hash) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(view, hash);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'glass navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        <div className="navbar-logo" onClick={() => handleNav('home')} style={{ cursor: 'pointer' }}>
          <BookOpen className="logo-icon" size={32} color="var(--primary)" />
          <span className="logo-text gradient-text">Sarathi-X</span>
        </div>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#features" onClick={() => handleNav('home', '#features')}>Features</a>
          <a href="#courses" onClick={() => handleNav('home', '#courses')}>Courses</a>
          <a href="#how-it-works" onClick={() => handleNav('home', '#how-it-works')}>How it Works</a>
          <a href="#pricing" onClick={() => handleNav('home', '#pricing')}>Pricing</a>
          
          {/* Theme Toggle Button */}
          <button 
            type="button"
            className="theme-toggle-nav-btn" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="var(--primary)" />}
          </button>

          <button 
            className="btn btn-outline nav-btn" 
            onClick={() => handleNav('login')}
            style={{ padding: '8px 20px', fontSize: '0.9rem' }}
          >
            Sign In
          </button>
          
          <button 
            className="btn btn-primary nav-btn" 
            onClick={() => handleNav('register')}
            style={{ padding: '8px 20px', fontSize: '0.9rem' }}
          >
            Get Started
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button"
            className="theme-toggle-mobile-btn" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="var(--primary)" />}
          </button>

          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
