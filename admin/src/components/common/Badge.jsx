/**
 * admin/src/components/common/Badge.jsx
 */

import React from 'react';

const Badge = ({ children, variant = 'primary', size = 'md', style = {} }) => {
  const variantStyles = {
    primary: {
      background: 'rgba(99, 102, 241, 0.15)',
      color: '#a5b4fc',
      border: '1px solid rgba(99, 102, 241, 0.3)',
    },
    success: {
      background: 'rgba(16, 185, 129, 0.15)',
      color: '#6ee7b7',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.15)',
      color: '#fcd34d',
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.15)',
      color: '#fca5a5',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    info: {
      background: 'rgba(6, 182, 212, 0.15)',
      color: '#67e8f9',
      border: '1px solid rgba(6, 182, 212, 0.3)',
    },
    secondary: {
      background: 'rgba(139, 92, 246, 0.15)',
      color: '#c4b5fd',
      border: '1px solid rgba(139, 92, 246, 0.3)',
    },
    neutral: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#cbd5e1',
      border: '1px solid rgba(255, 255, 255, 0.12)',
    },
  };

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '0.72rem', borderRadius: '6px' },
    md: { padding: '4px 10px', fontSize: '0.8rem', borderRadius: '8px' },
    lg: { padding: '6px 14px', fontSize: '0.88rem', borderRadius: '10px' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontWeight: 600,
        fontFamily: 'inherit',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        ...variantStyles[variant] || variantStyles.primary,
        ...sizeStyles[size] || sizeStyles.md,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;

