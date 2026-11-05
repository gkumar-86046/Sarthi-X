import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, User, LogOut, BookOpen, TrendingUp, Settings, Sparkles, Gamepad2, Sun, Moon, ShieldAlert } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHome from '../components/dashboard/DashboardHome';
import ProfilePage from '../components/dashboard/ProfilePage';
import AIMentorPage from '../components/dashboard/AIMentorPage';
import GameZonePage from '../pages/GameZonePage';
import CoursesPage from './CoursesPage';
import PerformancePage from './PerformancePage';
import SettingsPage from './SettingsPage';
import HealthAnalysisPage from './HealthAnalysisPage';
import StartupHubPage from './StartupHubPage';
import DiagnosticTestPage from './DiagnosticTestPage';

const DashboardLayout = ({ user, onLogout, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // default to 'dashboard' as first priority
  const [selectedGameForGameZone, setSelectedGameForGameZone] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="dashboard-layout">
      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onLogout={onLogout}
        user={user}
      />

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Top Navbar Header */}
        <header className="dashboard-header glass">
          <div className="header-left">
            <button className="mobile-hamburger-btn" onClick={() => setIsMobileOpen(true)}>
              <Menu size={24} />
            </button>

            <div className="search-bar-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search courses, AI topics, games..."
                className="search-input"
              />
            </div>
          </div>

          <div className="header-right">
            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button className="icon-badge-btn theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
              {theme === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="var(--primary)" />}
            </button>

            {/* Notifications */}
            <button className="icon-badge-btn" title="Notifications">
              <Bell size={20} />
              <span className="badge-dot"></span>
            </button>

            {/* Profile Pill & Dropdown */}
            <div className="user-dropdown-container">
              <button
                className="user-profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="header-avatar">
                  {(user?.fullName || user?.full_name || 'G').charAt(0).toUpperCase()}
                </div>
                <span className="header-user-name">{user?.fullName || user?.full_name || 'Govind Sharma'}</span>
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown-menu glass">
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{user?.fullName || user?.full_name || 'Govind Sharma'}</p>
                    <p className="dropdown-email">{user?.email || 'student@sarathix.com'}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item"
                    onClick={() => { setActiveTab('courses'); setShowProfileMenu(false); }}
                  >
                    <BookOpen size={16} />
                    <span>My Courses (View Access)</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { setActiveTab('performance'); setShowProfileMenu(false); }}
                  >
                    <TrendingUp size={16} />
                    <span>Performance</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { setActiveTab('courses'); setShowProfileMenu(false); }}
                  >
                    <BookOpen size={16} />
                    <span>My Courses</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { setActiveTab('aimentor'); setShowProfileMenu(false); }}
                  >
                    <Sparkles size={16} />
                    <span>AI Mentor</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { setActiveTab('gamezone'); setShowProfileMenu(false); }}
                  >
                    <Gamepad2 size={16} />
                    <span>Game Zone</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { setActiveTab('health'); setShowProfileMenu(false); }}
                  >
                    <TrendingUp size={16} />
                    <span>Health Analysis</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { setActiveTab('startuphub'); setShowProfileMenu(false); }}
                  >
                    <BookOpen size={16} />
                    <span>Startup Hub</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { setActiveTab('dashboard'); setShowProfileMenu(false); }}
                  >
                    <BookOpen size={16} />
                    <span>Dashboard</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-item" onClick={onLogout}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className={`dashboard-viewport ${activeTab === 'aimentor' ? 'aimentor-viewport' : ''}`}>
          {activeTab === 'settings' && (
            <SettingsPage user={user} />
          )}

          {activeTab === 'skilltest' && (
            <DiagnosticTestPage
              user={user}
              onNavigateToRoadmap={() => setActiveTab('performance')}
              onNavigateToGame={(game) => {
                setSelectedGameForGameZone(game);
                setActiveTab('gamezone');
              }}
              onBackToDashboard={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'performance' && (
            <PerformancePage
              user={user}
              onStartTest={() => setActiveTab('skilltest')}
              onLaunchGame={(game) => {
                setSelectedGameForGameZone(game);
                setActiveTab('gamezone');
              }}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesPage user={user} />
          )}

          {activeTab === 'aimentor' && (
            <AIMentorPage user={user} />
          )}

          {activeTab === 'gamezone' && (
            <GameZonePage
              user={user}
              initialGame={selectedGameForGameZone}
              onNavigateBack={() => {
                setSelectedGameForGameZone(null);
                setActiveTab('dashboard');
              }}
              onNavigateToAi={() => setActiveTab('aimentor')}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardHome
              user={user}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onStartTest={() => setActiveTab('skilltest')}
            />
          )}

          {activeTab === 'health' && (
            <HealthAnalysisPage user={user} />
          )}

          {activeTab === 'startuphub' && (
            <StartupHubPage user={user} />
          )}

          {activeTab === 'profile' && (
            <ProfilePage user={user} onUpdateProfile={onUpdateProfile} />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
