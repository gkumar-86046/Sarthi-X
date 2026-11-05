/**
 * admin/src/App.js
 * Central Application Entry & Tab Router
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import StudentPerformance from './pages/Performance/StudentPerformance';
import ContentManagement from './pages/Content/ContentManagement';
import RoadmapManager from './pages/Roadmaps/RoadmapManager';
import QuestionBank from './pages/Questions/QuestionBank';
import StudentDirectory from './pages/Students/StudentDirectory';
import AdminProfile from './pages/Profile/AdminProfile';
import SystemSettings from './pages/Settings/SystemSettings';
import { Loader2 } from 'lucide-react';
import './App.css';

const AdminApp = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-darker)',
          gap: '16px',
        }}
      >
        <Loader2 size={40} className="spin" color="var(--primary)" />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Verifying security privileges...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'performance':
        return <StudentPerformance />;
      case 'content':
        return <ContentManagement />;
      case 'roadmaps':
        return <RoadmapManager />;
      case 'questions':
        return <QuestionBank />;
      case 'students':
        return <StudentDirectory />;
      case 'profile':
        return <AdminProfile />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {renderActiveTab()}
    </AdminLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AdminApp />
    </AuthProvider>
  );
}
