import React from 'react';
import { Gamepad2, Flame, Star, Heart, Sparkles, BookOpen, ShieldCheck, Cpu } from 'lucide-react';

const GameZoneHeader = ({ profile, user, onPlayMagicNumber }) => {
  const studentName = user?.fullName || profile?.studentName || 'Student';
  const academicLevel = user?.academicDetail || profile?.classLevel || 'B.Tech - 2nd Year';
  const boardInfo = user?.institution || profile?.board || 'Engineering / CBSE';

  return (
    <div className="gz-hero-banner glass">
      {/* Top Row: Title + Stats Cluster */}
      <div className="gz-hero-top-row">
        <div className="gz-title-group">
          <div className="gz-icon-badge">
            <Gamepad2 size={24} color="var(--primary)" />
          </div>
          <div>
            <div className="gz-tag-pill">
              <Sparkles size={13} color="var(--accent)" />
              <span>AI Adaptive Engine v3.2 Active</span>
            </div>
            <h1 className="gz-main-title">
              Welcome to <span className="gradient-text">Game Zone</span>
            </h1>
          </div>
        </div>

        {/* Live Game Stats Cluster */}
        <div className="gz-stats-cluster">
          {/* Energy / Lives */}
          <div className="gz-stat-pill energy" title="Energy Lives">
            <div className="hearts-row">
              {Array.from({ length: profile?.maxLives || 5 }).map((_, i) => (
                <Heart
                  key={i}
                  size={14}
                  fill={i < (profile?.energyLives || 5) ? '#ef4444' : 'none'}
                  color="#ef4444"
                />
              ))}
            </div>
            <span className="stat-text">{profile?.energyLives || 5}/{profile?.maxLives || 5}</span>
          </div>

          {/* Current Streak */}
          <div className="gz-stat-pill streak" title="Current Learning Streak">
            <Flame size={16} color="#f97316" />
            <span className="stat-text">{profile?.streakDays || 7} Days</span>
          </div>

          {/* XP Points */}
          <div className="gz-stat-pill xp" title="Total XP Earned">
            <Star size={16} color="#f59e0b" />
            <span className="stat-text">{(profile?.xpPoints || 3450).toLocaleString()} XP</span>
          </div>

          {onPlayMagicNumber && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
                fontWeight: 700,
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
              onClick={onPlayMagicNumber}
            >
              <Gamepad2 size={16} />
              <span>Play Magic Number</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtitle & Curricular Badges Row */}
      <div className="gz-hero-sub-row">
        <p className="gz-hero-desc">
          Games, speed quizzes, and logic arenas personalized for <strong className="user-highlight">{studentName}</strong> according to syllabus milestones.
        </p>

        <div className="gz-info-badges">
          <div className="info-badge">
            <BookOpen size={13} />
            <span>{academicLevel}</span>
          </div>
          <div className="info-badge">
            <ShieldCheck size={13} />
            <span>{boardInfo}</span>
          </div>
          <div className="info-badge">
            <Cpu size={13} />
            <span>Mathematics & Reasoning</span>
          </div>
          <div className="info-badge active-level-badge">
            <Sparkles size={13} color="#06b6d4" />
            <span>{profile?.adaptiveLevel || 'Adaptive Level 3'}</span>
          </div>
          {profile?.aptitudeLevel && (
            <div className="info-badge" style={{ borderColor: 'rgba(250, 204, 21, 0.4)', color: '#fde047', background: 'rgba(250, 204, 21, 0.1)' }}>
              <span>{profile?.aptitudeBadge || '⚡'} {profile.aptitudeLevel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameZoneHeader;
