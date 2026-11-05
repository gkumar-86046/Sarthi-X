import React from 'react';
import {
  LayoutDashboard, Sparkles, Gamepad2, User, BookOpen, TrendingUp,
  Settings, LogOut, X, BookOpenCheck, ShieldCheck, Activity, Rocket, Brain
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, onLogout, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'skilltest', label: 'Skill Test', icon: Brain, badge: 'ML' },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'aimentor', label: 'AI Mentor', icon: Sparkles, badge: 'LIVE' },
    { id: 'gamezone', label: 'Game Zone', icon: Gamepad2, badge: 'HOT' },
    { id: 'health', label: 'Health Analysis', icon: Activity },
    { id: 'startuphub', label: 'Startup Hub', icon: Rocket, badge: 'NEW' },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsMobileOpen(false)}></div>
      )}

      <aside className={`dashboard-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Mobile Close Button */}
        <button className="sidebar-close-btn" onClick={() => setIsMobileOpen(false)}>
          <X size={24} />
        </button>

        {/* Sidebar Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <BookOpenCheck size={28} color="var(--primary)" />
            <span className="gradient-text brand-title">Sarathi-X</span>
          </div>
          <span className="brand-badge">Student Portal</span>
        </div>

        {/* User Mini Card */}
        <div className="sidebar-user-card glass-inner">
          <div className="avatar-circle">
            {(user?.fullName || user?.full_name || 'S').charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h4 className="user-name">{user?.fullName || user?.full_name || 'Govind Sharma'}</h4>
            <p className="user-academic">{user?.academicDetail || user?.academic_detail || 'Graduation - 4th Year'}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <span className="nav-group-label">Main Navigation</span>
          <ul>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-item-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleSelect(item.id)}
                  >
                    <Icon size={20} className="nav-icon" />
                    <span>{item.label}</span>
                    {item.badge && <span className="nav-item-badge">{item.badge}</span>}
                    {isActive && <span className="active-pill"></span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="sidebar-footer">
          <div className="pro-banner glass-inner">
            <ShieldCheck size={20} color="var(--accent)" />
            <div>
              <p className="pro-title">Sarathi-X Pro</p>
              <p className="pro-desc">AI Mentor Active</p>
            </div>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
