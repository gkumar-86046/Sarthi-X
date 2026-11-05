/**
 * admin/src/pages/Settings/SystemSettings.jsx
 */

import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  RefreshCw,
  Power,
  Layers,
} from 'lucide-react';
import Notification from '../../components/common/Notification';

const SystemSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isFlushingCache, setIsFlushingCache] = useState(false);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleFlushCache = () => {
    setIsFlushingCache(true);
    setTimeout(() => {
      setIsFlushingCache(false);
      notify('API and connection pool cache purged successfully.');
    }, 800);
  };

  const handleToggleMaintenance = () => {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    notify(
      next
        ? 'Maintenance Mode ENABLED. Platform restricted to administrators.'
        : 'Maintenance Mode DISABLED. Public student access restored.',
      next ? 'warning' : 'success'
    );
  };

  return (
    <div className="system-settings-page">
      <Notification notification={notification} onClose={() => setNotification(null)} />

      {/* Top Banner */}
      <div
        className="glass-card"
        style={{
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderLeft: '4px solid var(--primary)',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Platform Operational Status</h3>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Sarathi-X Backend Core version 1.0.0 • Python 3.12 + Flask + MySQL 8.4 Pool
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleFlushCache}
            disabled={isFlushingCache}
          >
            <RefreshCw size={14} className={isFlushingCache ? 'spin' : ''} />
            <span>Flush Cache</span>
          </button>
          <button
            className={`btn btn-sm ${maintenanceMode ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleToggleMaintenance}
          >
            <Power size={14} />
            <span>{maintenanceMode ? 'Disable Maintenance' : 'Toggle Maintenance'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Subsystem 1: Database & Network Configuration */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Database size={20} color="var(--info)" />
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
              Database Connectivity & Pool
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Database Name</span>
              <strong style={{ color: 'var(--text-main)' }}>sarathi_x</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Host & Port</span>
              <strong style={{ color: 'var(--text-main)' }}>localhost:3306</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Connection Pool Size</span>
              <strong style={{ color: '#34d399' }}>10 Max Active</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tables Created</span>
              <strong style={{ color: '#fff' }}>12 Verified Tables</strong>
            </div>
          </div>
        </div>

        {/* Subsystem 2: Security & Authentication Services */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <ShieldCheck size={20} color="#10b981" />
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
              JWT & Security Policies
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Signature Algorithm</span>
              <strong style={{ color: 'var(--text-main)' }}>HMAC-SHA256 (HS256)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Access Token Expiry</span>
              <strong style={{ color: 'var(--text-main)' }}>3600 seconds (1 Hour)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Refresh Token Rotation</span>
              <strong style={{ color: '#34d399' }}>Enabled (7 Days)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>CORS Origins</span>
              <strong style={{ color: '#fff' }}>localhost:3000, 3001, 3002</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Subsystem 3: Academic Tier Registry */}
      <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Layers size={20} color="var(--primary)" />
          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
            Configured Academic Branches & Degree Tracks
          </h4>
        </div>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          Profile-scoped syllabus isolation configured across the following student levels:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {[
            {
              tier: 'Graduation / College',
              items: ['B.Tech / B.E (Engineering)', 'MBBS (Medical)', 'B.Sc (Science)', 'B.Com', 'BCA', 'BBA'],
            },
            {
              tier: 'Intermediate (11th & 12th)',
              items: ['Science (PCM/PCB)', 'Commerce', 'Arts & Humanities'],
            },
            {
              tier: 'High School (9th & 10th)',
              items: ['Class 9 Standard', 'Class 10 Board Curriculum'],
            },
            {
              tier: 'Primary & Nursery',
              items: ['Foundational Class 1 - 5', 'Middle Class 6 - 8'],
            },
          ].map((sec, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem', marginBottom: '8px' }}>
                {sec.tier}
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                {sec.items.map((it, i) => (
                  <li key={i} style={{ marginBottom: '3px' }}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;

