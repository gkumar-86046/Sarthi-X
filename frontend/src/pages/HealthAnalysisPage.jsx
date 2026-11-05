import React from 'react';
import {
  Activity, Brain, Target, AlertTriangle, CheckCircle2, TrendingDown,
  TrendingUp, BatteryCharging, HeartPulse, Clock, Sparkles, Zap, ShieldCheck
} from 'lucide-react';

const HealthAnalysisPage = ({ user }) => {
  const skillGaps = [
    { skill: 'Python Data Structures', currentLevel: 45, targetLevel: 80, color: '#f59e0b', category: 'Algorithms & Coding' },
    { skill: 'Calculus & Integration', currentLevel: 85, targetLevel: 90, color: '#4ade80', category: 'Applied Mathematics' },
    { skill: 'Physics (Optics & Electromagnetism)', currentLevel: 35, targetLevel: 75, color: '#f87171', category: 'Engineering Physics' },
    { skill: 'System Design & Logic Puzzles', currentLevel: 62, targetLevel: 85, color: '#06b6d4', category: 'Logical Architecture' }
  ];

  const weeklyLoad = [
    { day: 'Mon', load: 55 },
    { day: 'Tue', load: 70 },
    { day: 'Wed', load: 85 },
    { day: 'Thu', load: 65, active: true },
    { day: 'Fri', load: 60 },
    { day: 'Sat', load: 45 },
    { day: 'Sun', load: 30 }
  ];

  return (
    <div className="health-page-container">
      {/* Header Banner */}
      <div className="health-header-banner glass">
        <div className="banner-title-group">
          <div className="health-icon-box">
            <Activity size={26} color="#ef4444" />
          </div>
          <div className="banner-text-block">
            <div className="health-badge-row">
              <span className="health-live-tag">
                <span className="pulse-dot-red"></span> LIVE STATUS ESTIMATE
              </span>
            </div>
            <h2>Health & Cognitive Workload Analysis</h2>
            <p>Real-time analytics tracking your study fatigue, burnout resistance, and syllabus skill gaps.</p>
          </div>
        </div>

        {/* Quick Vitals Summary on Right Side of Banner */}
        <div className="health-vitals-strip glass-inner">
          <div className="vital-item">
            <span className="vital-label">Cognitive Load</span>
            <span className="vital-value text-amber">65% Moderate</span>
          </div>
          <div className="vital-item">
            <span className="vital-label">Burnout Risk</span>
            <span className="vital-value text-emerald">Low / Stable</span>
          </div>
          <div className="vital-item">
            <span className="vital-label">Academic Profile</span>
            <span className="vital-value text-cyan">{user?.academicDetail || 'B.Tech - 2nd Year'}</span>
          </div>
        </div>
      </div>

      <div className="health-main-grid">
        {/* Left Column: Stress & Burnout Monitor */}
        <div className="stress-monitor-card glass">
          <div className="card-header">
            <div className="card-title-group">
              <HeartPulse size={20} color="#ef4444" />
              <h3>Burnout Risk Monitor</h3>
            </div>
            <span className="status-pill status-moderate">Moderate Risk</span>
          </div>

          <div className="stress-gauge-container">
            <div className="stress-level-indicator">
              <span className="stress-value">Moderate</span>
              <span className="stress-desc">Cognitive Fatigue Index: 65 / 100</span>
            </div>
            <div className="stress-bar-bg">
              <div className="stress-bar-fill moderate-fill" style={{ width: '65%' }}></div>
            </div>
            <div className="gauge-markers">
              <span>Rest (0%)</span>
              <span>Optimal (40%)</span>
              <span className="active-marker">Current (65%)</span>
              <span>Fatigue (100%)</span>
            </div>
          </div>

          <div className="health-metrics-grid">
            <div className="h-metric glass-inner">
              <Brain size={18} color="#06b6d4" />
              <div className="h-metric-text">
                <span className="h-label">Study Hours (Week)</span>
                <span className="h-val">34.5 hrs</span>
              </div>
            </div>

            <div className="h-metric glass-inner">
              <BatteryCharging size={18} color="#f59e0b" />
              <div className="h-metric-text">
                <span className="h-label">Rest Quality</span>
                <span className="h-val">Suboptimal</span>
              </div>
            </div>

            <div className="h-metric glass-inner">
              <Zap size={18} color="#a855f7" />
              <div className="h-metric-text">
                <span className="h-label">Intense Sessions</span>
                <span className="h-val">4 Today</span>
              </div>
            </div>

            <div className="h-metric glass-inner">
              <Clock size={18} color="#10b981" />
              <div className="h-metric-text">
                <span className="h-label">Screen Time</span>
                <span className="h-val">5h 20m</span>
              </div>
            </div>
          </div>

          {/* Weekly Workload Rhythm Chart */}
          <div className="weekly-rhythm-box glass-inner">
            <div className="rhythm-header">
              <span className="rhythm-title">Weekly Cognitive Workload Rhythm</span>
              <span className="rhythm-avg">7-Day Avg: 58%</span>
            </div>
            <div className="rhythm-bars-row">
              {weeklyLoad.map((w, idx) => (
                <div key={idx} className="rhythm-col">
                  <div className="rhythm-bar-track">
                    <div
                      className={`rhythm-bar-fill ${w.active ? 'active-day-fill' : ''}`}
                      style={{ height: `${w.load}%` }}
                    ></div>
                  </div>
                  <span className={`rhythm-day-label ${w.active ? 'active-day-text' : ''}`}>
                    {w.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation Alert Box */}
          <div className="health-recommendation glass-inner warning">
            <div className="rec-icon-wrapper">
              <Sparkles size={18} color="#f59e0b" />
            </div>
            <div className="rec-body">
              <span className="rec-sender">Sarathi-X Health Advisory</span>
              <p>
                You've engaged in 4 intensive problem-solving sessions without adequate pauses.
                Taking a 15-minute screen-free break now increases information retention by up to 28%.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Skill Gap Analyzer */}
        <div className="skill-gap-card glass">
          <div className="card-header">
            <div className="card-title-group">
              <Target size={20} color="var(--primary)" />
              <h3>Skill Gap Analyzer</h3>
            </div>
            <span className="benchmark-tag">Synced: {user?.academicDetail || 'B.Tech Standard'}</span>
          </div>

          <p className="card-subtitle">
            Evaluating your verified mastery against semester benchmark requirements.
          </p>

          <div className="skills-list">
            {skillGaps.map((skill, index) => {
              const gap = skill.targetLevel - skill.currentLevel;
              return (
                <div key={index} className="skill-gap-item glass-inner">
                  <div className="skill-header">
                    <div>
                      <span className="skill-cat-tag">{skill.category}</span>
                      <h4>{skill.skill}</h4>
                    </div>
                    {gap <= 5 ? (
                      <span className="gap-badge good">
                        <CheckCircle2 size={13} /> On Target
                      </span>
                    ) : gap > 30 ? (
                      <span className="gap-badge critical">
                        <TrendingDown size={13} /> High Gap ({gap}%)
                      </span>
                    ) : (
                      <span className="gap-badge moderate-badge">
                        <TrendingUp size={13} /> Needs Work ({gap}%)
                      </span>
                    )}
                  </div>

                  <div className="skill-bars">
                    <div className="bar-row">
                      <div className="bar-labels">
                        <span className="bar-label">Current Mastery</span>
                        <span className="bar-val" style={{ color: skill.color }}>{skill.currentLevel}%</span>
                      </div>
                      <div className="bar-bg">
                        <div
                          className="bar-fill"
                          style={{ width: `${skill.currentLevel}%`, backgroundColor: skill.color }}
                        ></div>
                      </div>
                    </div>

                    <div className="bar-row target">
                      <div className="bar-labels">
                        <span className="bar-label">Target Milestone</span>
                        <span className="bar-val text-muted">{skill.targetLevel}%</span>
                      </div>
                      <div className="bar-bg">
                        <div
                          className="bar-fill target-fill"
                          style={{ width: `${skill.targetLevel}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalysisPage;
