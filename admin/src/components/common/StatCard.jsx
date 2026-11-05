/**
 * admin/src/components/common/StatCard.jsx
 */

import React from 'react';

const StatCard = ({ title, value, change, icon: Icon, color = '#6366f1', subtitle }) => {
  return (
    <div className="glass-card stat-card" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: color,
          opacity: 0.12,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: `rgba(${color.startsWith('#') ? hexToRgb(color) : '99,102,241'}, 0.15)`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid rgba(${color.startsWith('#') ? hexToRgb(color) : '99,102,241'}, 0.25)`,
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <h3 style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
          {value}
        </h3>
        {change && (
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: change.startsWith('+') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: change.startsWith('+') ? '#34d399' : '#f87171',
            }}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p style={{ margin: '8px 0 0 0', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Helper
function hexToRgb(hex) {
  let c = hex.substring(1);
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

export default StatCard;

