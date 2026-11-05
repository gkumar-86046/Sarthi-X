/**
 * admin/src/components/layout/Sidebar.jsx
 */

import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  BookOpen,
  Compass,
  HelpCircle,
  Users,
  Settings,
  UserCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'performance', label: 'Student Performance', icon: TrendingUp },
  { id: 'content', label: 'Content & Lectures', icon: BookOpen },
  { id: 'roadmaps', label: 'Career Roadmaps', icon: Compass },
  { id: 'questions', label: 'Question Bank', icon: HelpCircle },
  { id: 'students', label: 'Student Directory', icon: Users },
];

const secondaryNavItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Admin Profile', icon: UserCheck },
];

const Sidebar = ({ activeTab, onSelectTab }) => {
  const { user, logout } = useAuth();

  const userInitial = user?.fullName?.[0] || user?.full_name?.[0] || user?.email?.[0] || 'A';
  const displayName = user?.fullName || user?.full_name || 'System Admin';

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon-box">
          <Sparkles size={22} />
        </div>
        <div className="brand-text">
          <h2>Sarathi-X</h2>
          <span>Admin Panel</span>
        </div>
      </div>

      {/* Navigation list */}
      <div className="sidebar-nav">
        <span className="nav-section-title">Core Management</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <span className="nav-section-title" style={{ marginTop: '14px' }}>
          Administration
        </span>
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer / Profile */}
      <div className="sidebar-footer">
        <div className="user-profile-card">
          <div className="user-avatar">{userInitial}</div>
          <div className="user-info">
            <div className="name">{displayName}</div>
            <div className="role">
              <Badge variant="primary" size="sm">
                {user?.role ? user.role.toUpperCase() : 'ADMIN'}
              </Badge>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

