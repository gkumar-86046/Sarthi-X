import React from 'react';
import {
  Sparkles, Atom, Compass, Activity, Brain, TrendingUp, BarChart3, Grid,
  Box, Code2, Lock, Play, Star, Clock, Target, ShieldAlert
} from 'lucide-react';

const iconMap = {
  Sparkles, Atom, Compass, Activity, Brain, TrendingUp, BarChart3, Grid, Box, Code2, Lock, ShieldAlert
};

const GameModuleCard = ({ module, onSelectModule, onStartGame }) => {
  const IconComponent = iconMap[module.icon] || Sparkles;
  const isLocked = module.status === 'Locked';

  if (isLocked) {
    return (
      <div className="module-card glass-card locked-card">
        <div className="locked-header">
          <div className="locked-icon-badge">
            <Lock size={20} color="#94a3b8" />
          </div>
          <span className="status-badge status-locked">Locked</span>
        </div>

        <h3 className="module-name">{module.name}</h3>
        <p className="module-desc">{module.description}</p>

        <div className="locked-condition-box glass-inner">
          <ShieldAlert size={16} color="#f59e0b" />
          <div>
            <span className="condition-title">Unlock Condition</span>
            <p className="condition-text">{module.unlockCondition || module.prerequisite}</p>
          </div>
        </div>

        <div className="module-footer">
          <span className="current-mastery-text">Current Mastery: {module.mastery}%</span>
          <button className="btn btn-outline btn-sm locked-btn" disabled>
            <Lock size={14} /> Locked
          </button>
        </div>
      </div>
    );
  }

  // Get Status Badge Color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Recommended': return 'status-recommended';
      case 'Continue': return 'status-continue';
      case 'New': return 'status-new';
      case 'Practice': return 'status-practice';
      case 'Revision': return 'status-revision';
      default: return 'status-default';
    }
  };

  return (
    <div
      className={`module-card glass-card ${module.status === 'Continue' ? 'active-continue-border' : ''}`}
      onClick={() => onSelectModule(module.id)}
    >
      {/* Top Header */}
      <div className="card-top-row">
        <div className="module-planet-icon" style={{ borderColor: module.colorTheme }}>
          <IconComponent size={22} color={module.colorTheme} />
        </div>
        <span className={`status-badge ${getStatusBadgeClass(module.status)}`}>
          {module.status}
        </span>
      </div>

      {/* Module Title & Description */}
      <h3 className="module-name">{module.name}</h3>
      <p className="module-desc">{module.description}</p>

      {/* Assigned Skill */}
      <div className="skill-chip">
        <Target size={14} color="var(--primary)" />
        <span>Skill: {module.assignedSkill}</span>
      </div>

      {/* Mastery Progress Bar */}
      <div className="mastery-progress-box">
        <div className="mastery-label-row">
          <span>Mastery Progress</span>
          <span className="mastery-percent">{module.mastery}%</span>
        </div>
        <div className="mastery-bar-bg">
          <div
            className="mastery-bar-fill"
            style={{
              width: `${module.mastery}%`,
              backgroundColor: module.colorTheme || 'var(--primary)'
            }}
          ></div>
        </div>
      </div>

      {/* Challenge Modes Allowed */}
      <div className="modes-row">
        {module.allowedModes.map((mode, i) => (
          <span key={i} className="mode-pill">
            {mode}
          </span>
        ))}
      </div>

      {/* Footer Specs & Action */}
      <div className="module-footer">
        <div className="specs-col">
          <span className="spec-item"><Star size={14} color="#f59e0b" /> +{module.xpReward} XP</span>
          <span className="spec-item"><Clock size={14} color="#06b6d4" /> {module.estimatedMinutes} mins</span>
        </div>

        <button
          className="play-module-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (onStartGame) {
              onStartGame(module);
            } else {
              onSelectModule(module.id);
            }
          }}
        >
          <span>Play</span>
          <Play size={14} />
        </button>
      </div>
    </div>
  );
};

export default GameModuleCard;
