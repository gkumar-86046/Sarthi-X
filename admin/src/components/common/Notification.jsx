/**
 * admin/src/components/common/Notification.jsx
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const { type = 'success', message } = notification;

  const typesConfig = {
    success: {
      icon: CheckCircle2,
      border: 'rgba(16, 185, 129, 0.4)',
      bg: 'rgba(6, 78, 59, 0.85)',
      color: '#6ee7b7',
    },
    error: {
      icon: AlertCircle,
      border: 'rgba(239, 68, 68, 0.4)',
      bg: 'rgba(127, 29, 29, 0.85)',
      color: '#fca5a5',
    },
    warning: {
      icon: AlertTriangle,
      border: 'rgba(245, 158, 11, 0.4)',
      bg: 'rgba(120, 53, 15, 0.85)',
      color: '#fcd34d',
    },
    info: {
      icon: Info,
      border: 'rgba(6, 182, 212, 0.4)',
      bg: 'rgba(22, 78, 99, 0.85)',
      color: '#67e8f9',
    },
  };
  const config = typesConfig[type] || typesConfig.info;

  const Icon = config.icon;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '14px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        color: config.color,
        maxWidth: '450px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <Icon size={20} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#fff', flex: 1 }}>
        {message}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Notification;

