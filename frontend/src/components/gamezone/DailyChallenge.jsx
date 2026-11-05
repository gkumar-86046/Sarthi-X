import React from 'react';
import { Flame, Clock, Star, Users, Play } from 'lucide-react';

const DailyChallenge = ({ challenge, onStart }) => {
  if (!challenge) return null;

  return (
    <div className="daily-challenge-card glass">
      <div className="daily-left">
        <div className="daily-badge">
          <Flame size={15} color="#f59e0b" />
          <span>DAILY QUEST CHALLENGE</span>
        </div>

        <h2 className="daily-title">{challenge.title}</h2>
        <p className="daily-skill">
          <span className="skill-label">Target Skill:</span>{' '}
          <span className="skill-name">{challenge.skill}</span>
        </p>

        <div className="daily-specs">
          <div className="spec-pill">
            <Clock size={14} color="#06b6d4" />
            <span>{challenge.timeLimitMinutes} Mins ({challenge.questionCount} Qs)</span>
          </div>

          <div className="spec-pill">
            <Star size={14} color="#f59e0b" fill="#f59e0b" />
            <span>+{challenge.xpReward} XP Reward</span>
          </div>

          <div className="spec-pill">
            <Users size={14} color="#818cf8" />
            <span>{challenge.participantsCount} Students Active</span>
          </div>
        </div>
      </div>

      <div className="daily-right">
        <button className="daily-start-btn" onClick={() => onStart(challenge)}>
          <Play size={18} fill="currentColor" />
          <span>Start Challenge</span>
        </button>
      </div>
    </div>
  );
};

export default DailyChallenge;
