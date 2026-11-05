import React, { useState, useEffect } from 'react';
import './GameDashboardWindow.css';
import MagicNumberArena from './MagicNumberArena';
import {
  LEVELS_METADATA,
  MASTER_METHODS_AND_TRICKS,
  getGameRoadmap,
  getGameMethodsAndTricks
} from './allLevelsData';
import { getGameLeaderboard } from '../../services/api';
import {
  Gamepad2,
  ArrowLeft,
  Map,
  BookOpen,
  Brain,
  Trophy,
  Zap,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
  Star,
  Target,
  Maximize2,
  Minimize2,
  RefreshCw,
  Loader2,
  Award
} from 'lucide-react';

const FALLBACK_LEADERBOARD = [
  { rank: 1, player_name: "Mohammad Ayan Husain", score: 1250, level_reached: 10, accuracy: "95%", aptitude_level: "Grandmaster Prodigy", badge: "🌌", date: "22 Oct 2026" },
  { rank: 2, player_name: "AYAN", score: 1120, level_reached: 9, accuracy: "91.5%", aptitude_level: "Elite Problem Solver", badge: "⚡", date: "22 Oct 2026" },
  { rank: 3, player_name: "Devansh Sharma", score: 980, level_reached: 8, accuracy: "88%", aptitude_level: "Tactical Calculator", badge: "🎯", date: "Yesterday" },
  { rank: 4, player_name: "Aanya Patel", score: 850, level_reached: 7, accuracy: "85%", aptitude_level: "Tactical Calculator", badge: "🎯", date: "2 days ago" },
  { rank: 5, player_name: "Vikram Aditya", score: 720, level_reached: 6, accuracy: "80%", aptitude_level: "Pattern Analyst", badge: "🧩", date: "3 days ago" },
];

const GameDashboardWindow = ({ game, user, onExit }) => {
  const gameId = game?.id || 'magic-number';
  const gameName = game?.name || 'Magic Number Aptitude Arena';
  const gameCategory = game?.category || 'Quantitative Aptitude';
  const gameSkill = game?.assignedSkill || '10-Level Cognitive Challenge & Shortcuts Engine';

  const [activeTab, setActiveTab] = useState('play'); // 'play' | 'roadmap' | 'methods' | 'aptitude' | 'leaderboard'
  const [currentLevel, setCurrentLevel] = useState(game?.level || 1);
  const [academyFilterLevel, setAcademyFilterLevel] = useState(1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [leaderboard, setLeaderboard] = useState(FALLBACK_LEADERBOARD);
  const [loadingLb, setLoadingLb] = useState(false);

  // Dynamic roadmap and methods for this specific game
  const roadmap = getGameRoadmap(gameId);
  const methodsAndTricks = getGameMethodsAndTricks(gameId);

  // Jump to specific level and play
  const handleLaunchLevel = (lvlNum) => {
    setCurrentLevel(lvlNum);
    setActiveTab('play');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadLeaderboard = async () => {
    setLoadingLb(true);
    try {
      const res = await getGameLeaderboard({ gameId, limit: 15 });
      if (res && res.success && Array.isArray(res.leaderboard) && res.leaderboard.length > 0) {
        setLeaderboard(res.leaderboard);
      }
    } catch {
      // Keep fallback
    } finally {
      setLoadingLb(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      loadLeaderboard();
    }
  }, [activeTab, gameId]);

  return (
    <div className={`gdw-viewport ${isMaximized ? 'gdw-maximized-fullscreen' : ''}`}>
      {/* ── Top Game Dashboard Navigation Bar ───────────────────────────────── */}
      <div className="gdw-navbar">
        <div className="gdw-nav-left">
          <button className="gdw-back-btn" onClick={onExit} title="Return to Academic Game Zone">
            <ArrowLeft size={16} />
            <span>Game Zone</span>
          </button>

          <div className="gdw-title-block">
            <div className="gdw-logo-icon">
              <Zap size={22} />
            </div>
            <div className="gdw-title-text">
              <h1>{gameName}</h1>
              <span>{gameSkill}</span>
            </div>
          </div>
        </div>

        {/* ── Tabs Navigation ────────────────────────────────────────────────── */}
        <div className="gdw-tabs-row">
          <button
            className={`gdw-tab-btn gold ${activeTab === 'play' ? 'active' : ''}`}
            onClick={() => setActiveTab('play')}
          >
            <Gamepad2 size={16} />
            <span>Play Arena (Lvl {currentLevel})</span>
          </button>

          <button
            className={`gdw-tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('roadmap')}
          >
            <Map size={16} />
            <span>All 10 Levels</span>
          </button>

          <button
            className={`gdw-tab-btn ${activeTab === 'methods' ? 'active' : ''}`}
            onClick={() => setActiveTab('methods')}
          >
            <BookOpen size={16} />
            <span>Methods & Tricks</span>
          </button>

          <button
            className={`gdw-tab-btn ${activeTab === 'aptitude' ? 'active' : ''}`}
            onClick={() => setActiveTab('aptitude')}
          >
            <Brain size={16} />
            <span>Aptitude & IQ</span>
          </button>

          <button
            className={`gdw-tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <Trophy size={16} />
            <span>Leaderboard</span>
          </button>
        </div>

        {/* ── Right Window Controls ─────────────────────────────────────────── */}
        <div className="gdw-nav-right">
          <button
            className="gdw-maximize-btn"
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? "Restore Window View" : "Dedicated Full Window View"}
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isMaximized ? "Windowed" : "Maximize Window"}</span>
          </button>
        </div>
      </div>

      {/* ── Dashboard Window Content ────────────────────────────────────────── */}
      <div className="gdw-content-area">
        {/* TAB 1: PLAY ARENA */}
        {activeTab === 'play' && (
          <div className="gdw-play-wrapper">
            <MagicNumberArena
              key={`${gameId}_${currentLevel}`}
              game={game}
              initialLevel={currentLevel}
              user={user}
              onClose={onExit}
              onFinish={() => {}}
            />
          </div>
        )}

        {/* TAB 2: ALL 10 LEVELS ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="gdw-roadmap-wrapper">
            <div className="gdw-academy-header">
              <div className="gdw-academy-title">
                <h2>{gameName} — 10 Challenge Levels Roadmap</h2>
                <p>Select any level to enter its dedicated gaming arena and test your cognitive mastery.</p>
              </div>
              <button className="gdw-lvl-btn" style={{ width: 'auto' }} onClick={() => handleLaunchLevel(currentLevel)}>
                <Gamepad2 size={16} />
                <span>Resume Current Level {currentLevel}</span>
              </button>
            </div>

            <div className="gdw-roadmap-grid">
              {roadmap.map((lvl) => {
                const isSelected = lvl.level === currentLevel;
                return (
                  <div key={lvl.level} className={`gdw-level-card ${isSelected ? 'active-card' : ''}`}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="gdw-lvl-badge">{lvl.badge}</div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>
                          +{lvl.pointsPerQ} pts / Q
                        </span>
                      </div>

                      <h3 className="gdw-lvl-title">{lvl.title}</h3>
                      <p className="gdw-lvl-desc">{lvl.description}</p>

                      <div className="gdw-lvl-skills">
                        {lvl.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="gdw-skill-pill">{skill}</span>
                        ))}
                      </div>

                      <div className="gdw-lvl-sample-trick">
                        <strong>⚡ Key Concept / Trick:</strong> {lvl.sampleTrick}
                      </div>
                    </div>

                    <button
                      className="gdw-lvl-btn"
                      onClick={() => handleLaunchLevel(lvl.level)}
                    >
                      <span>Play Level {lvl.level}</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ALL METHODS & TRICKS ACADEMY */}
        {activeTab === 'methods' && (
          <div className="gdw-methods-wrapper">
            <div className="gdw-academy-header">
              <div className="gdw-academy-title">
                <h2>{gameName} — Methods & Concepts Academy</h2>
                <p>Master the exact reasoning, facts, and speed shortcuts for every tier of {gameName}.</p>
              </div>

              {/* Level Selector Pills */}
              <div className="gdw-lvl-filter-row">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`gdw-lvl-filter-btn ${academyFilterLevel === num ? 'active' : ''}`}
                    onClick={() => setAcademyFilterLevel(num)}
                  >
                    Level {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions with Step-by-Step Method & Magic Trick */}
            <div className="gdw-methods-list">
              {(methodsAndTricks[academyFilterLevel] || []).map((item, idx) => (
                <div key={item.id || idx} className="gdw-method-card">
                  <div className="gdw-method-card-header">
                    <span className="gdw-method-topic-pill">
                      <Target size={14} />
                      <span>{item.topic} • Question #{idx + 1}</span>
                    </span>
                    <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>
                      Correct Answer: {item.answer} ({item.answer_text})
                    </span>
                  </div>

                  <h3 className="gdw-method-prompt">{item.prompt}</h3>

                  {/* ⚡ The Magic Trick / Insight */}
                  <div className="gdw-trick-box">
                    <div className="gdw-trick-tag">
                      <Zap size={15} />
                      <span>Instant Shortcut / Key Insight</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#fef08a', lineHeight: 1.5 }}>
                      {item.trick}
                    </p>
                  </div>

                  {/* 📖 Step-by-Step Method */}
                  <div className="gdw-standard-method-box">
                    <div className="gdw-standard-tag">
                      <BookOpen size={14} />
                      <span>Step-by-Step Method & Reasoning</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                      {item.method}
                    </p>
                  </div>
                </div>
              ))}

              {(!methodsAndTricks[academyFilterLevel] || methodsAndTricks[academyFilterLevel].length === 0) && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  <p>Comprehensive methods and flash-tips available during live Level {academyFilterLevel} gameplay.</p>
                  <button className="btn btn-primary" onClick={() => handleLaunchLevel(academyFilterLevel)}>
                    <Gamepad2 size={16} /> Play Level {academyFilterLevel} Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: APTITUDE & COGNITIVE IQ REPORT */}
        {activeTab === 'aptitude' && (
          <div className="gdw-aptitude-wrapper">
            <div className="gdw-academy-header">
              <div className="gdw-academy-title">
                <h2>{gameName} — Performance & Cognitive Mastery Report</h2>
                <p>Psychometric evaluation of calculation speed, accuracy, conceptual rigor, and shortcut adoption.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '42px', marginBottom: '8px' }}>⚡</div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#ffffff' }}>Elite Problem Solver</h3>
                <span style={{ display: 'inline-block', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
                  Top 5% Global Percentile
                </span>
                <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.4 }}>
                  Demonstrates advanced decomposition, rapid recall, high accuracy, and strong conceptual agility.
                </p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={16} />
                  <span>Cognitive Performance Metrics</span>
                </h4>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>Recall & Speed</span>
                    <span style={{ fontWeight: 700 }}>92%</span>
                  </div>
                  <div style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}></div>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>Conceptual Rigor</span>
                    <span style={{ fontWeight: 700 }}>88%</span>
                  </div>
                  <div style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '88%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #818cf8)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>Shortcut & Trick Mastery</span>
                    <span style={{ fontWeight: 700 }}>85%</span>
                  </div>
                  <div style={{ height: '7px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="gdw-lb-wrapper">
            <div className="gdw-academy-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="gdw-academy-title">
                <h2>{gameName} Champion Leaderboard</h2>
                <p>Top global performers for {gameName} across all 10 challenge tiers.</p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={loadLeaderboard}
                disabled={loadingLb}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <RefreshCw size={14} className={loadingLb ? 'spin-loader' : ''} />
                <span>{loadingLb ? 'Refreshing...' : 'Refresh Rankings'}</span>
              </button>
            </div>

            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              {loadingLb && (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                  <Loader2 size={32} className="spin-loader" color="var(--primary)" />
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '10px' }}>Syncing rankings...</p>
                </div>
              )}

              {!loadingLb && leaderboard.map((entry) => {
                const rankNum = entry.rank || 1;
                const playerName = entry.player_name || entry.name || "Challenger";
                const lvlReached = entry.level_reached || entry.level || 1;
                const tierTitle = entry.aptitude_level || "Novice Reckoner";
                const badgeIcon = entry.badge || (rankNum === 1 ? "🌌" : "🎯");
                const accuracy = entry.accuracy || entry.acc || "85%";
                const score = entry.score || 0;
                const dateStr = entry.date || "Recent";

                return (
                  <div
                    key={entry.id || `${rankNum}_${playerName}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      background: rankNum <= 3 ? 'rgba(30, 27, 75, 0.75)' : 'rgba(15, 23, 42, 0.65)',
                      border: rankNum === 1 ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      marginBottom: '10px',
                      boxShadow: rankNum === 1 ? '0 0 20px rgba(251, 191, 36, 0.15)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: rankNum === 1 ? '#fbbf24' : rankNum === 2 ? '#94a3b8' : rankNum === 3 ? '#b45309' : '#64748b', minWidth: '32px' }}>
                        {rankNum === 1 ? '🥇' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : `#${rankNum}`}
                      </span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#ffffff', fontWeight: 700 }}>{playerName}</h4>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                          Level {lvlReached} • {badgeIcon} {tierTitle} • <span style={{ color: '#64748b' }}>{dateStr}</span>
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '17px', fontWeight: 800, color: '#38bdf8' }}>{score} pts</span>
                      <div style={{ fontSize: '12px', color: '#34d399' }}>{accuracy} accuracy</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDashboardWindow;
