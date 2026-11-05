import React from 'react';
import { Sparkles, Brain, ArrowRight, Star, Zap } from 'lucide-react';

const RecommendedGames = ({ recommendations, onSelectModule, onStartGame }) => {
  if (!recommendations || recommendations.length === 0) return null;

  const getTagClass = (type = '') => {
    if (type.includes('Best')) return 'rec-tag-best';
    if (type.includes('Weak')) return 'rec-tag-weak';
    return 'rec-tag-logic';
  };

  return (
    <div className="recommended-section glass">
      <div className="recommended-header">
        <div className="rec-title-group">
          <div className="rec-icon-glow">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="rec-section-title">AI Recommended For You</h3>
            <p className="rec-notice-text">
              Sarathi-X AI selected these games from your academic profile and recent performance.
            </p>
          </div>
        </div>
      </div>

      <div className="recommended-grid">
        {recommendations.map((item, idx) => (
          <div
            key={idx}
            className="rec-card glass-card"
            onClick={() => onStartGame ? onStartGame(item) : onSelectModule(item.id)}
          >
            <div className="rec-card-top">
              <div className={`rec-card-tag ${getTagClass(item.recommendationType)}`}>
                <Zap size={13} />
                <span>{item.recommendationType}</span>
              </div>

              <h4 className="rec-game-name">{item.gameName}</h4>
              <p className="rec-skill">{item.skill}</p>
            </div>

            <div className="rec-reason-box glass-inner">
              <Brain size={14} color="#06b6d4" style={{ flexShrink: 0 }} />
              <span>{item.reason}</span>
            </div>

            <div className="rec-card-footer">
              <div className="rec-xp">
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                <span>+{item.xpReward} XP</span>
              </div>
              <span className="rec-play-link">
                Launch <ArrowRight size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedGames;
