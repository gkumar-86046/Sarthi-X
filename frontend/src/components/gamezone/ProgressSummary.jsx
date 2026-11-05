import React from 'react';
import { Gamepad2, CheckCircle2, Target, TrendingUp, AlertTriangle, Star, Trophy } from 'lucide-react';

const ProgressSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="progress-summary-card glass">
      <div className="summary-title-row">
        <Trophy size={20} color="#f59e0b" />
        <h3>Your Learning & Gaming Analytics Summary</h3>
      </div>

      <div className="summary-metrics-grid">
        <div className="summary-item glass-inner">
          <Gamepad2 size={20} color="var(--primary)" />
          <div>
            <span className="summary-label">Games Played</span>
            <p className="summary-val">{summary.gamesPlayed}</p>
          </div>
        </div>

        <div className="summary-item glass-inner">
          <CheckCircle2 size={20} color="#22c55e" />
          <div>
            <span className="summary-label">Missions Completed</span>
            <p className="summary-val">{summary.missionsCompleted}</p>
          </div>
        </div>

        <div className="summary-item glass-inner">
          <Target size={20} color="#06b6d4" />
          <div>
            <span className="summary-label">Current Accuracy</span>
            <p className="summary-val">{summary.currentAccuracyPercent}%</p>
          </div>
        </div>

        <div className="summary-item glass-inner">
          <Star size={20} color="#f59e0b" />
          <div>
            <span className="summary-label">Total XP</span>
            <p className="summary-val">{summary.totalXP.toLocaleString()}</p>
          </div>
        </div>

        <div className="summary-item glass-inner">
          <Trophy size={20} color="#a855f7" />
          <div>
            <span className="summary-label">Current Rank</span>
            <p className="summary-val">{summary.currentRank}</p>
          </div>
        </div>

        <div className="summary-item glass-inner highlight-skill-box">
          <TrendingUp size={20} color="#4ade80" />
          <div>
            <span className="summary-label">Strongest Mastery Skill</span>
            <p className="summary-val text-sm">{summary.bestSkill}</p>
          </div>
        </div>

        <div className="summary-item glass-inner highlight-weak-box">
          <AlertTriangle size={20} color="#f87171" />
          <div>
            <span className="summary-label">Focus Area (Weakest)</span>
            <p className="summary-val text-sm">{summary.weakestSkill}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
