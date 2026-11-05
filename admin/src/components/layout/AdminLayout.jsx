/**
 * admin/src/components/layout/AdminLayout.jsx
 */

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../styles/layout.css';

const AdminLayout = ({ activeTab, onSelectTab, children }) => {
  return (
    <div className="admin-app-container">
      <Sidebar activeTab={activeTab} onSelectTab={onSelectTab} />
      <div className="admin-main-canvas">
        <Header activeTab={activeTab} onSelectTab={onSelectTab} />
        <main className="admin-page-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;

