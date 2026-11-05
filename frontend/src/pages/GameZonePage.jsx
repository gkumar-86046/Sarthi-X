import React, { useState, useEffect } from 'react';
import SpaceBackground from '../components/gamezone/SpaceBackground';
import GameZoneHeader from '../components/gamezone/GameZoneHeader';
import ContinueMission from '../components/gamezone/ContinueMission';
import RecommendedGames from '../components/gamezone/RecommendedGames';
import DailyChallenge from '../components/gamezone/DailyChallenge';
import GameFilterBar from '../components/gamezone/GameFilterBar';
import GameModuleCard from '../components/gamezone/GameModuleCard';
import ProgressSummary from '../components/gamezone/ProgressSummary';
import GameDetailModal from '../components/gamezone/GameDetailModal';
import MagicNumberArena from '../components/gamezone/MagicNumberArena';
import GameDashboardWindow from '../components/gamezone/GameDashboardWindow';

import { mockGameZoneData } from '../components/gamezone/mockData';
import { getGameZoneOverview } from '../services/api';
import { Loader2, AlertTriangle, RefreshCw, Gamepad2, Zap } from 'lucide-react';

const GameZonePage = ({ user, onNavigateBack, onNavigateToAi, initialGame = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Games');
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedModuleForModal, setSelectedModuleForModal] = useState(null);
  const [activePlaySession, setActivePlaySession] = useState(initialGame);

  useEffect(() => {
    if (initialGame) {
      setActivePlaySession(initialGame);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialGame]);

  // Fetch live overview from backend with fallback
  const fetchOverview = async () => {
    try {
      const res = await getGameZoneOverview();
      if (res && res.success) {
        setData(prev => ({
          ...mockGameZoneData,
          ...(prev || {}),
          ...res,
          studentProfile: {
            ...mockGameZoneData.studentProfile,
            ...(prev?.studentProfile || {}),
            ...(res.studentProfile || {})
          },
          authorizedModules: (res.authorizedModules && res.authorizedModules.length > 0)
            ? res.authorizedModules
            : (prev?.authorizedModules || mockGameZoneData.authorizedModules),
          recommendedGames: (res.recommendedGames && res.recommendedGames.length > 0)
            ? res.recommendedGames
            : (prev?.recommendedGames || mockGameZoneData.recommendedGames)
        }));
      } else {
        setData(mockGameZoneData);
      }
    } catch {
      setData(mockGameZoneData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="gz-loading-screen">
        <SpaceBackground />
        <div className="gz-loading-box glass">
          <Loader2 size={42} className="spin-loader" color="var(--primary)" />
          <h3>Loading Academic Game Zone...</h3>
          <p>Fetching authorized modules for your academic profile</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gz-error-screen">
        <SpaceBackground />
        <div className="gz-error-box glass">
          <AlertTriangle size={48} color="#f87171" />
          <h3>Backend Connection Error</h3>
          <p>Failed to sync academic profile games. Please check connection.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <RefreshCw size={16} /> Retry Sync
          </button>
        </div>
      </div>
    );
  }

  // Filter Authorized Modules (Strictly from backend authorizedModules list)
  const filteredModules = (data?.authorizedModules || []).filter((mod) => {
    // Search match
    const matchesSearch =
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.assignedSkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category match
    if (selectedCategory === 'All Games') return matchesSearch;
    if (selectedCategory === 'Recommended') return matchesSearch && mod.status === 'Recommended';
    return matchesSearch && mod.category === selectedCategory;
  }).sort((a, b) => {
    if (sortBy === 'progress') return b.mastery - a.mastery;
    if (sortBy === 'duration') return a.estimatedMinutes - b.estimatedMinutes;
    // Default: Recommended / status priority
    return a.status === 'Recommended' ? -1 : 1;
  });

  const handleSelectModule = (moduleId) => {
    const found = data.authorizedModules.find((m) => m.id === moduleId);
    if (found) {
      setSelectedModuleForModal(found);
    }
  };

  const handleStartGame = (module) => {
    setSelectedModuleForModal(null);
    setActivePlaySession(module || { id: 'magic-number', name: 'Magic Number Aptitude Arena', level: 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAi = (module) => {
    setSelectedModuleForModal(null);
    if (onNavigateToAi) {
      onNavigateToAi(module.name);
    } else {
      alert(`Connecting Sarathi-X AI Mentor for ${module.name}...`);
    }
  };

  // If a game is active, render the dedicated Game Dashboard Window!
  if (activePlaySession) {
    return (
      <div className="game-zone-page">
        <SpaceBackground />
        <div className="gz-page-wrapper">
          <GameDashboardWindow
            game={activePlaySession}
            user={user}
            onExit={() => setActivePlaySession(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="game-zone-page">
      {/* Dynamic Animated Space Background */}
      <SpaceBackground />

      <div className="gz-page-wrapper">
        {/* Compact Unified Game Zone Hero Banner */}
        <GameZoneHeader
          profile={data.studentProfile}
          user={user}
          onPlayMagicNumber={() => handleStartGame({ id: 'magic-number', name: 'Magic Number Aptitude Arena', level: 1 })}
        />

        {/* Flagship Magic Number Aptitude Hero Banner */}
        <div className="gz-magic-banner glass">
          <div className="gz-magic-left">
            <div className="gz-magic-badge">
              <Zap size={14} />
              <span>FLAGSHIP QUANTITATIVE APTITUDE CHALLENGE</span>
            </div>
            <h2 className="gz-magic-title">Magic Number Aptitude Arena</h2>
            <p className="gz-magic-desc">
              Conquer 10 progressive levels across rapid arithmetic, percentages, speed-distance, and algebraic deduction. Learn secret <strong>3-second Vedic & mental math tricks</strong> on every question and benchmark your Cognitive Aptitude Level & estimated IQ!
            </p>
            <div className="gz-magic-feature-tags">
              <span className="gz-m-tag">⚡ 3-Second Magic Tricks</span>
              <span className="gz-m-tag">📐 Step-by-Step Methods</span>
              <span className="gz-m-tag">🧠 Cognitive Radar & IQ Rating</span>
              <span className="gz-m-tag">🏆 Live Global Leaderboard</span>
            </div>
          </div>
          <div className="gz-magic-right">
            <button
              className="btn btn-primary gz-magic-launch-btn"
              onClick={() => handleStartGame({ id: 'magic-number', name: 'Magic Number Aptitude Arena', level: 1 })}
            >
              <Gamepad2 size={20} />
              <span>Enter Game Dashboard & Arena</span>
            </button>
          </div>
        </div>

        {/* Continue Currently Assigned Mission */}
        <ContinueMission
          mission={data.continueMission}
          onPlay={() => handleStartGame(data.continueMission)}
        />

        {/* AI Recommended Games Row */}
        <RecommendedGames
          recommendations={data.recommendedGames}
          onSelectModule={handleSelectModule}
          onStartGame={handleStartGame}
        />

        {/* Daily Quest Challenge */}
        <DailyChallenge
          challenge={data.dailyChallenge}
          onStart={() => handleStartGame({ id: 'magic-number', name: 'Daily Quest Challenge', level: 2 })}
        />

        {/* Skill Filter Bar */}
        <GameFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Authorized Game Submodules Responsive Grid */}
        <div className="modules-section">
          <div className="section-title-bar">
            <h2>Authorized Game Modules ({filteredModules.length})</h2>
            <span className="profile-sync-tag">Profile Synced with {user?.academicDetail || 'B.Tech - 2nd Year'}</span>
          </div>

          {filteredModules.length === 0 ? (
            <div className="empty-modules-box glass">
              <Gamepad2 size={36} color="var(--text-muted)" />
              <h3>No Games Match Search Criteria</h3>
              <p>Try searching for a different skill or clear your category filter.</p>
              <button className="btn btn-outline" onClick={() => { setSearchQuery(''); setSelectedCategory('All Games'); }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="modules-grid">
              {filteredModules.map((mod) => (
                <GameModuleCard
                  key={mod.id}
                  module={mod}
                  onSelectModule={handleSelectModule}
                  onStartGame={handleStartGame}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Student Progress Analytics Summary */}
        <ProgressSummary summary={data.progressSummary} />
      </div>

      {/* Game Detail Modal */}
      {selectedModuleForModal && (
        <GameDetailModal
          module={selectedModuleForModal}
          onClose={() => setSelectedModuleForModal(null)}
          onStartGame={handleStartGame}
          onAskAi={handleAskAi}
        />
      )}
    </div>
  );
};

export default GameZonePage;
