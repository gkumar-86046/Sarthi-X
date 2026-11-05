import React from 'react';
import { X, Play, Sparkles, Clock, Star, Target, Compass, Lock, CheckCircle } from 'lucide-react';

const GameDetailModal = ({ module, onClose, onStartGame, onAskAi }) => {
  if (!module) return null;

  const isLocked = module.status === 'Locked';

  return (
    <div className="modal-backdrop-gz" onClick={onClose}>
      <div className="modal-content-gz glass" onClick={(e) => e.stopPropagation()}>
        {/* Modal Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header-gz">
          <div className="modal-title-row">
            <h2 className="modal-title">{module.name}</h2>
            <span className={`status-badge status-${module.status.toLowerCase()}`}>
              {module.status}
            </span>
          </div>
          <p className="modal-desc">{module.description}</p>
        </div>

        {/* Modal Body */}
        <div className="modal-body-gz">
          {/* Key Specs Row */}
          <div className="modal-specs-grid">
            <div className="spec-card glass-inner">
              <Target size={18} color="var(--primary)" />
              <div>
                <span className="spec-label">Assigned Skill</span>
                <p className="spec-val">{module.assignedSkill}</p>
              </div>
            </div>

            <div className="spec-card glass-inner">
              <Compass size={18} color="#06b6d4" />
              <div>
                <span className="spec-label">Assigned Difficulty</span>
                <p className="spec-val text-cyan">Adaptive Level 3 (Read-only)</p>
              </div>
            </div>

            <div className="spec-card glass-inner">
              <Star size={18} color="#f59e0b" />
              <div>
                <span className="spec-label">Total Reward</span>
                <p className="spec-val text-gold">+{module.xpReward} XP</p>
              </div>
            </div>

            <div className="spec-card glass-inner">
              <Clock size={18} color="var(--accent)" />
              <div>
                <span className="spec-label">Estimated Time</span>
                <p className="spec-val">{module.estimatedMinutes} mins</p>
              </div>
            </div>
          </div>

          {/* Mastery Progress Bar */}
          <div className="modal-mastery-section glass-inner">
            <div className="mastery-header-row">
              <span>Current Mastery Level</span>
              <span className="mastery-val-bold">{module.mastery}%</span>
            </div>
            <div className="mastery-bar-bg">
              <div
                className="mastery-bar-fill"
                style={{ width: `${module.mastery}%`, backgroundColor: module.colorTheme || 'var(--primary)' }}
              ></div>
            </div>
          </div>

          {/* Mission List */}
          {module.missions && module.missions.length > 0 && (
            <div className="modal-missions-box">
              <h3>Available Sub-Missions</h3>
              <div className="missions-list">
                {module.missions.map((m) => (
                  <div key={m.id} className="mission-item-row glass-inner">
                    <div className="mission-item-left">
                      {m.status === 'completed' && <CheckCircle size={16} color="#4ade80" />}
                      {m.status === 'active' && <Play size={16} color="#06b6d4" />}
                      {m.status === 'locked' && <Lock size={16} color="#94a3b8" />}
                      <span className="mission-item-title">{m.title}</span>
                    </div>
                    <span className="mission-item-xp">+{m.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If Locked, show prerequisite box */}
          {isLocked && (
            <div className="locked-prereq-alert glass-inner">
              <Lock size={20} color="#f59e0b" />
              <div>
                <h4>Prerequisite Required</h4>
                <p>{module.unlockCondition || module.prerequisite}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="modal-actions-gz">
          <button className="btn btn-outline" onClick={() => onAskAi(module)}>
            <Sparkles size={18} color="var(--accent)" />
            <span>Ask AI Mentor</span>
          </button>

          <button
            className="btn btn-primary start-game-modal-btn"
            disabled={isLocked}
            onClick={() => onStartGame(module)}
          >
            {isLocked ? (
              <>
                <Lock size={18} />
                <span>Module Locked</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span>Start Game</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameDetailModal;
