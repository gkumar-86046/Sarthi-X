import React, { useState } from 'react';
import { Gamepad2, Zap, Brain, Code, Sparkles, Trophy, Flame, RotateCcw, CheckCircle, XCircle, Award, Star, ArrowRight, Play } from 'lucide-react';
import './GameZonePage.css';

// Sample quiz questions for Speed Quiz submodule
const quizQuestions = [
  {
    id: 1,
    question: 'Which HTML5 element is used to draw graphics on the fly via scripting?',
    options: ['<canvas>', '<svg>', '<drawing>', '<paint>'],
    answer: '<canvas>'
  },
  {
    id: 2,
    question: 'What does AI stand for in technology?',
    options: ['Automated Logic', 'Artificial Intelligence', 'Advanced Integration', 'Algorithmic Interface'],
    answer: 'Artificial Intelligence'
  },
  {
    id: 3,
    question: 'Which CSS property creates a glassmorphism backdrop blur?',
    options: ['filter: blur()', 'backdrop-filter: blur()', 'background-blur', 'glass-effect'],
    answer: 'backdrop-filter: blur()'
  },
  {
    id: 4,
    question: 'In Python, which keyword defines a function?',
    options: ['func', 'function', 'def', 'define'],
    answer: 'def'
  }
];

// Memory Cards data
const memoryCardsData = [
  { id: 1, name: 'React', icon: '⚛️', matched: false },
  { id: 2, name: 'Python', icon: '🐍', matched: false },
  { id: 3, name: 'AI', icon: '🤖', matched: false },
  { id: 4, name: 'Rocket', icon: '🚀', matched: false },
  { id: 5, name: 'React', icon: '⚛️', matched: false },
  { id: 6, name: 'Python', icon: '🐍', matched: false },
  { id: 7, name: 'AI', icon: '🤖', matched: false },
  { id: 8, name: 'Rocket', icon: '🚀', matched: false }
];

const leaderboards = [
  { rank: 1, name: 'Aarav Sharma', xp: '3,450 XP', streak: '14 Days', badge: '🥇 Grandmaster' },
  { rank: 2, name: 'Priya Patel', xp: '2,980 XP', streak: '10 Days', badge: '🥈 Master' },
  { rank: 3, name: 'Rohan Mehta', xp: '2,420 XP', streak: '8 Days', badge: '🥉 Diamond' },
  { rank: 4, name: 'Alex Vance (You)', xp: '1,280 XP', streak: '5 Days', badge: '⭐ Gold' }
];

const GameZonePage = ({ user }) => {
  const [activeGame, setActiveGame] = useState(null); // null | 'quiz' | 'memory' | 'scramble'

  // Speed Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Memory Game State
  const [cards, setCards] = useState(() => memoryCardsData.sort(() => Math.random() - 0.5));
  const [flippedCards, setFlippedCards] = useState([]);
  const [memoryScore, setMemoryScore] = useState(0);

  // Word Scramble State
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const scrambleWords = [
    { scrambled: 'LRAEINNG', original: 'LEARNING' },
    { scrambled: 'THYOPN', original: 'PYTHON' },
    { scrambled: 'TCERA', original: 'REACT' },
    { scrambled: 'ILNGITEELCNE', original: 'INTELLIGENCE' }
  ];
  const [scrambleInput, setScrambleInput] = useState('');
  const [scrambleScore, setScrambleScore] = useState(0);
  const [scrambleMsg, setScrambleMsg] = useState('');

  // Handle Quiz Option Selection
  const handleQuizOption = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    if (option === quizQuestions[quizIndex].answer) {
      setQuizScore(prev => prev + 100);
    }

    setTimeout(() => {
      if (quizIndex + 1 < quizQuestions.length) {
        setQuizIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedOption(null);
    setQuizCompleted(false);
  };

  // Handle Memory Card Click
  const handleCardClick = (idx) => {
    if (flippedCards.length === 2 || cards[idx].matched || flippedCards.includes(idx)) return;

    const newFlipped = [...flippedCards, idx];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (cards[firstIdx].name === cards[secondIdx].name) {
        setCards(prev => prev.map((card, i) =>
          i === firstIdx || i === secondIdx ? { ...card, matched: true } : card
        ));
        setMemoryScore(prev => prev + 150);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  const restartMemory = () => {
    setCards(memoryCardsData.sort(() => Math.random() - 0.5).map(c => ({ ...c, matched: false })));
    setFlippedCards([]);
    setMemoryScore(0);
  };

  // Handle Scramble Submit
  const handleScrambleSubmit = (e) => {
    e.preventDefault();
    const currentWord = scrambleWords[scrambleIndex];
    if (scrambleInput.trim().toUpperCase() === currentWord.original) {
      setScrambleScore(prev => prev + 120);
      setScrambleMsg('Correct! +120 XP');
      setTimeout(() => {
        setScrambleMsg('');
        setScrambleInput('');
        if (scrambleIndex + 1 < scrambleWords.length) {
          setScrambleIndex(prev => prev + 1);
        } else {
          setScrambleMsg('🎉 All Words Solved!');
        }
      }, 1000);
    } else {
      setScrambleMsg('Incorrect, try again!');
    }
  };

  return (
    <div className="game-zone-container">
      {/* Top Banner Header */}
      <div className="game-header-banner glass">
        <div className="game-banner-content">
          <div className="banner-badge-game">
            <Trophy size={16} color="#f59e0b" />
            <span>Sarathi-X Arcade</span>
          </div>
          <h2>Learning <span className="gradient-text">Game Zone</span></h2>
          <p>Level up your knowledge through interactive challenges, trivia blitzes, and earn XP badges!</p>
        </div>

        <div className="user-xp-card glass-inner">
          <div className="xp-item">
            <Flame size={20} color="#f97316" />
            <div>
              <span className="xp-title">Current Streak</span>
              <p className="xp-val">5 Days 🔥</p>
            </div>
          </div>
          <div className="xp-item">
            <Star size={20} color="#f59e0b" />
            <div>
              <span className="xp-title">Total XP</span>
              <p className="xp-val">1280 XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submodule Launcher Grid (When no game is actively playing) */}
      {!activeGame && (
        <>
          <div className="section-title-row">
            <h3>Choose a Game Submodule</h3>
            <span className="badge-count">4 Games Available</span>
          </div>

          <div className="games-grid">
            {/* Submodule 1: Speed Quiz */}
            <div className="game-card glass-card" onClick={() => setActiveGame('quiz')}>
              <div className="game-card-icon quiz-bg">
                <Zap size={28} color="#f59e0b" />
              </div>
              <div className="game-card-body">
                <span className="game-tag">Trivia Blitz</span>
                <h4>Speed Quiz Challenge</h4>
                <p>Answer 30-second rapid trivia questions to test your knowledge.</p>
                <div className="game-card-footer">
                  <span>+100 XP per answer</span>
                  <button className="play-btn">
                    <span>Play Now</span>
                    <Play size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Submodule 2: Concept Memory Match */}
            <div className="game-card glass-card" onClick={() => setActiveGame('memory')}>
              <div className="game-card-icon memory-bg">
                <Brain size={28} color="#8b5cf6" />
              </div>
              <div className="game-card-body">
                <span className="game-tag">Memory Flip</span>
                <h4>Concept Matcher</h4>
                <p>Flip cards and match corresponding AI, React, and Python concepts.</p>
                <div className="game-card-footer">
                  <span>+150 XP per match</span>
                  <button className="play-btn">
                    <span>Play Now</span>
                    <Play size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Submodule 3: Word Scramble */}
            <div className="game-card glass-card" onClick={() => setActiveGame('scramble')}>
              <div className="game-card-icon scramble-bg">
                <Sparkles size={28} color="#ec4899" />
              </div>
              <div className="game-card-body">
                <span className="game-tag">Word Puzzle</span>
                <h4>Tech Word Scramble</h4>
                <p>Unscramble computer science and programming keywords.</p>
                <div className="game-card-footer">
                  <span>+120 XP per word</span>
                  <button className="play-btn">
                    <span>Play Now</span>
                    <Play size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Submodule 4: Code Debugger Blitz */}
            <div className="game-card glass-card" onClick={() => alert('Code Debugger submodule launching soon!')}>
              <div className="game-card-icon code-bg">
                <Code size={28} color="#22c55e" />
              </div>
              <div className="game-card-body">
                <span className="game-tag">Coding Puzzle</span>
                <h4>Code Debugger Blitz</h4>
                <p>Identify and fix bugs in code snippets against the clock.</p>
                <div className="game-card-footer">
                  <span>+200 XP per fix</span>
                  <button className="play-btn">
                    <span>Play Now</span>
                    <Play size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Playable Submodule 1: Speed Quiz */}
      {activeGame === 'quiz' && (
        <div className="active-game-box glass">
          <div className="game-box-header">
            <button className="back-games-btn" onClick={() => { setActiveGame(null); restartQuiz(); }}>
              ← Back to Games
            </button>
            <div className="score-badge">
              <Zap size={18} color="#f59e0b" />
              <span>Score: {quizScore} XP</span>
            </div>
          </div>

          {!quizCompleted ? (
            <div className="quiz-container">
              <div className="quiz-progress-bar-bg">
                <div
                  className="quiz-progress-bar-fill"
                  style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>

              <div className="quiz-header">
                <span className="quiz-count">Question {quizIndex + 1} of {quizQuestions.length}</span>
                <h3 className="quiz-question">{quizQuestions[quizIndex].question}</h3>
              </div>

              <div className="quiz-options-grid">
                {quizQuestions[quizIndex].options.map((opt, i) => {
                  let statusClass = '';
                  if (selectedOption !== null) {
                    if (opt === quizQuestions[quizIndex].answer) statusClass = 'correct';
                    else if (opt === selectedOption) statusClass = 'wrong';
                  }

                  return (
                    <button
                      key={i}
                      className={`quiz-option-btn ${statusClass}`}
                      onClick={() => handleQuizOption(opt)}
                      disabled={selectedOption !== null}
                    >
                      <span>{opt}</span>
                      {statusClass === 'correct' && <CheckCircle size={18} color="#4ade80" />}
                      {statusClass === 'wrong' && <XCircle size={18} color="#f87171" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="game-results-card">
              <Trophy size={48} color="#f59e0b" />
              <h2>Quiz Completed!</h2>
              <p>You scored <strong>{quizScore} XP</strong></p>
              <div className="results-actions">
                <button className="btn btn-primary" onClick={restartQuiz}>
                  <RotateCcw size={16} />
                  <span>Play Again</span>
                </button>
                <button className="btn btn-outline" onClick={() => setActiveGame(null)}>
                  All Games
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Playable Submodule 2: Concept Memory Match */}
      {activeGame === 'memory' && (
        <div className="active-game-box glass">
          <div className="game-box-header">
            <button className="back-games-btn" onClick={() => { setActiveGame(null); restartMemory(); }}>
              ← Back to Games
            </button>
            <div className="score-badge">
              <Brain size={18} color="#8b5cf6" />
              <span>Score: {memoryScore} XP</span>
            </div>
          </div>

          <div className="memory-game-container">
            <h3>Match the Corresponding Cards</h3>
            <div className="cards-grid">
              {cards.map((card, idx) => {
                const isFlipped = flippedCards.includes(idx) || card.matched;
                return (
                  <div
                    key={idx}
                    className={`memory-card ${isFlipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                    onClick={() => handleCardClick(idx)}
                  >
                    <div className="card-inner">
                      <div className="card-front glass-inner">
                        <Gamepad2 size={24} color="var(--primary)" />
                      </div>
                      <div className="card-back glass-card">
                        <span className="card-emoji">{card.icon}</span>
                        <span className="card-name">{card.name}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="btn btn-outline" onClick={restartMemory} style={{ marginTop: '20px' }}>
              <RotateCcw size={16} /> Reset Cards
            </button>
          </div>
        </div>
      )}

      {/* Playable Submodule 3: Tech Word Scramble */}
      {activeGame === 'scramble' && (
        <div className="active-game-box glass">
          <div className="game-box-header">
            <button className="back-games-btn" onClick={() => setActiveGame(null)}>
              ← Back to Games
            </button>
            <div className="score-badge">
              <Sparkles size={18} color="#ec4899" />
              <span>Score: {scrambleScore} XP</span>
            </div>
          </div>

          <div className="scramble-container">
            <span className="quiz-count">Word {scrambleIndex + 1} of {scrambleWords.length}</span>
            <div className="scrambled-word-box glass-card">
              <h2>{scrambleWords[scrambleIndex].scrambled}</h2>
            </div>

            {scrambleMsg && <p className="scramble-msg">{scrambleMsg}</p>}

            <form onSubmit={handleScrambleSubmit} className="scramble-form">
              <input
                type="text"
                placeholder="Unscramble word..."
                value={scrambleInput}
                onChange={(e) => setScrambleInput(e.target.value)}
                className="scramble-input"
              />
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      <div className="leaderboard-section glass">
        <div className="leaderboard-header">
          <div className="lb-title">
            <Award size={22} color="#f59e0b" />
            <h3>Student Leaderboard</h3>
          </div>
          <span className="lb-period">This Week</span>
        </div>

        <div className="leaderboard-list">
          {leaderboards.map((player) => (
            <div key={player.rank} className={`lb-item glass-inner ${player.rank === 4 ? 'current-user-lb' : ''}`}>
              <span className="lb-rank">#{player.rank}</span>
              <div className="lb-user-info">
                <span className="lb-name">{player.name}</span>
                <span className="lb-badge-text">{player.badge}</span>
              </div>
              <div className="lb-stats">
                <span className="lb-xp">{player.xp}</span>
                <span className="lb-streak">{player.streak}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameZonePage;
