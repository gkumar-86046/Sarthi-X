/**
 * admin/src/components/layout/Header.jsx
 * Admin Header with Breadcrumbs, Clock & Notification Center
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Bell,
  Clock,
  Search,
  ChevronRight,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

const tabConfig = {
  dashboard: {
    category: 'Console',
    title: 'Dashboard',
    subtitle: 'Student progress, course engagement, and platform activity overview',
  },
  performance: {
    category: 'Analytics',
    title: 'Student Performance',
    subtitle: 'Skill assessment scores, competency breakdown, and learning progress',
  },
  content: {
    category: 'Curriculum',
    title: 'Content & Lectures',
    subtitle: 'Manage lecture videos, PDF notes, and course modules',
  },
  roadmaps: {
    category: 'Planning',
    title: 'Career Roadmaps',
    subtitle: 'Personalized career paths, milestones, and learning tracks',
  },
  questions: {
    category: 'Evaluation',
    title: 'Question Bank',
    subtitle: 'Assessment questions across aptitude, reasoning, and technical domains',
  },
  students: {
    category: 'Directory',
    title: 'Student Directory',
    subtitle: 'Student records, academic details, and account management',
  },
  settings: {
    category: 'System',
    title: 'Platform Settings',
    subtitle: 'Database, security, and system configuration',
  },
  profile: {
    category: 'Account',
    title: 'Admin Profile',
    subtitle: 'Manage your profile, credentials, and permissions',
  },
};

const sampleNotifications = [
  {
    id: 1,
    title: 'High Score Achieved',
    desc: 'A student scored 92% in Technical & Problem Solving',
    time: '5m ago',
    type: 'success',
  },
  {
    id: 2,
    title: 'New Registration',
    desc: 'Govind Sharma registered for B.Tech / B.E Engineering',
    time: '24m ago',
    type: 'primary',
  },
  {
    id: 3,
    title: 'System Healthy',
    desc: 'All database connections are active and responsive',
    time: '1h ago',
    type: 'info',
  },
];

const Header = ({ activeTab, onSelectTab }) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notifRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sarathi_admin_theme') || document.documentElement.getAttribute('data-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sarathi_admin_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const current = tabConfig[activeTab] || {
    category: 'Console',
    title: 'Administration',
    subtitle: 'Platform Management',
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    setUnreadCount(0);
  };

  const userInitial = user?.fullName?.[0] || user?.full_name?.[0] || user?.email?.[0] || 'A';
  const displayName = user?.fullName || user?.full_name || 'Administrator';

  return (
    <header className="admin-header">
      {/* Left: Breadcrumbs & Page Titles */}
      <div className="header-left">
        <div className="header-breadcrumb">
          <span className="crumb-root">Console</span>
          <ChevronRight size={12} className="crumb-separator" />
          <span className="crumb-category">{current.category}</span>
          <ChevronRight size={12} className="crumb-separator" />
          <span className="crumb-active">{current.title}</span>
        </div>
        <div className="header-title-row">
          <h1>{current.title}</h1>
          <span className="live-status-pill">
            <span className="status-dot pulse-active" />
            Live
          </span>
        </div>
        <p className="header-subtitle">{current.subtitle}</p>
      </div>

      {/* Right: Telemetry & Actions Bar */}
      <div className="header-right">
        {/* Real-time Digital Clock */}
        <div className="header-telemetry-badge">
          <Clock size={14} color="var(--info)" />
          <span className="telemetry-time">{currentTime || '11:00 AM'}</span>
        </div>

        {/* Theme Toggle (Light / Dark Mode) */}
        <button
          className="header-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="var(--primary)" />}
        </button>

        {/* Search Trigger Shortcut */}
        <button
          className="header-search-trigger"
          onClick={() => {
            if (activeTab !== 'content' && activeTab !== 'students') {
              onSelectTab('content');
            }
          }}
          title="Quick Search"
        >
          <Search size={14} />
          <span>Quick Find...</span>
          <kbd className="search-shortcut-key">⌘K</kbd>
        </button>

        {/* Notifications Tray Trigger */}
        <div className="header-notification-container" ref={notifRef}>
          <button
            className={`header-icon-btn ${showNotifications ? 'active' : ''}`}
            onClick={handleOpenNotifications}
            title="Notifications & Activity"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-unread-dot">{unreadCount}</span>}
          </button>

          {/* Notifications Dropdown Flyout */}
          {showNotifications && (
            <div className="notifications-dropdown-menu glass">
              <div className="dropdown-header">
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700 }}>Activity Feed</h4>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Recent notifications</span>
                </div>
                <Badge variant="primary" size="sm">Real-time</Badge>
              </div>

              <div className="dropdown-body">
                {sampleNotifications.map((n) => (
                  <div key={n.id} className="dropdown-notif-item">
                    <div className="notif-item-header">
                      <span className="notif-item-title">{n.title}</span>
                      <span className="notif-item-time">{n.time}</span>
                    </div>
                    <p className="notif-item-desc">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="dropdown-footer">
                <button
                  className="dropdown-footer-btn"
                  onClick={() => {
                    setShowNotifications(false);
                    onSelectTab('performance');
                  }}
                >
                  <span>View All Performance</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Chip */}
        <div className="header-profile-chip" onClick={() => onSelectTab('profile')}>
          <div className="chip-avatar">{userInitial}</div>
          <div className="chip-info">
            <span className="chip-name">{displayName}</span>
            <span className="chip-role">SUPERUSER</span>
          </div>
          <ShieldCheck size={16} className="chip-verified-icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
