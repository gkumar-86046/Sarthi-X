import React from 'react';
import { Play, Sparkles, Clock, Star, Target, Compass } from 'lucide-react';

const ContinueMission = ({ mission, onPlay }) => {
  if (!mission) return null;

  return (
    <div className="continue-mission-card glass">
      {/* Left Column: Mission Content */}
      <div className="mission-content-left">
        <div className="mission-assigned-tag">
          <Sparkles size={14} color="#06b6d4" />
          <span>CURRENTLY ASSIGNED MISSION</span>
        </div>

        <div className="mission-title-group">
          <span className="game-name-label">{mission.gameName}</span>
          <h2 className="mission-headline">{mission.missionTitle}</h2>
        </div>

        <div className="mission-meta-grid">
          <div className="meta-item">
            <Target size={16} color="var(--primary)" />
            <div>
              <span className="meta-label">Target Skill</span>
              <p className="meta-val">{mission.skill}</p>
            </div>
          </div>

          <div className="meta-item">
            <Compass size={16} color="#06b6d4" />
            <div>
              <span className="meta-label">Difficulty</span>
              <p className="meta-val highlight-cyan">{mission.difficulty}</p>
            </div>
          </div>

          <div className="meta-item">
            <Star size={16} color="#f59e0b" />
            <div>
              <span className="meta-label">Reward</span>
              <p className="meta-val highlight-gold">+{mission.rewardXP} XP</p>
            </div>
          </div>

          <div className="meta-item">
            <Clock size={16} color="var(--accent)" />
            <div>
              <span className="meta-label">Estimated Time</span>
              <p className="meta-val">{mission.estimatedMinutes} mins</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mission-progress-container">
          <div className="progress-label-row">
            <span>Mission Mastery Progress</span>
            <span className="progress-percent">{mission.progress}%</span>
          </div>
          <div className="mission-progress-bar-bg">
            <div
              className="mission-progress-bar-fill"
              style={{ width: `${mission.progress}%` }}
            ></div>
          </div>
        </div>

        <button className="btn btn-primary continue-btn" onClick={() => onPlay(mission)}>
          <Play size={18} />
          <span>Continue Mission</span>
        </button>
      </div>

      {/* Right Column: Glowing Animated Planetary Visualizer */}
      <div className="mission-orb-stage">
        <div className="glowing-planet-container">
          <div className="planet-ring ring-outer"></div>
          <div className="planet-ring ring-inner"></div>
          <div className="planet-core-orb">
            <div className="orb-light-specular"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueMission;
