import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MagicNumberArena.css';
import {
  startGameSession,
  submitGameAnswer,
  finishGameSession,
  getGameLeaderboard,
  getGameAcademy,
  getMagicNumberTricks
} from '../../services/api';
import {
  FALLBACK_QUESTIONS,
  FALLBACK_TRICKS,
  evaluateLocalAptitude
} from './magicBankFallback';
import {
  getGameMethodsAndTricks
} from './allLevelsData';
import {
  Sparkles,
  Zap,
  Trophy,
  Flame,
  Clock,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  X,
  CheckCircle2,
  XCircle,
  Brain,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Loader2
} from 'lucide-react';

// Web Audio synthesized chimes for instant responsive feedback
const playTone = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'wrong') {
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(164.81, now + 0.15); // E3
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'tick') {
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch {
    // Audio context safely ignored if blocked by autoplay policies
  }
};

const MagicNumberArena = ({ game, initialLevel = 1, user, onClose, onFinish }) => {
  const gameId = game?.id || 'magic-number';
  const gameName = game?.name || 'Magic Number Aptitude Arena';

  // Session & Level state
  const [level, setLevel] = useState(initialLevel);
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [loading, setLoading] = useState(true);

  // Per question interaction
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const timerRef = useRef(null);
  const questionStartTimeRef = useRef(Date.now());
  const totalSessionStartRef = useRef(Date.now());

  // Modals & End Assessment
  const [isFinished, setIsFinished] = useState(false);
  const [assessmentReport, setAssessmentReport] = useState(null);
  const [showTricksVault, setShowTricksVault] = useState(false);
  const [tricksList, setTricksList] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Initialize new game session
  const initGame = useCallback(async (targetLevel) => {
    setLoading(true);
    setIsFinished(false);
    setAssessmentReport(null);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLives(3);
    setSelectedOption(null);
    setFeedback(null);
    totalSessionStartRef.current = Date.now();

    try {
      const res = await startGameSession({
        gameId,
        level: targetLevel,
        playerName: user?.fullName || 'Challenger'
      });
      if (res && res.success && res.questions && res.questions.length > 0) {
        setSessionId(res.sessionId);
        setQuestions(res.questions);
        setTimeLeft(res.timePerQuestionSeconds || 25);
        questionStartTimeRef.current = Date.now();
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend game start warning, using built-in arena bank:', err);
    }

    // Guaranteed instant playability fallback
    const gameSpecificBank = getGameMethodsAndTricks(gameId);
    const fallbackPool = (gameSpecificBank && gameSpecificBank[targetLevel]) || FALLBACK_QUESTIONS[targetLevel] || FALLBACK_QUESTIONS[1];
    setSessionId(`local_${Date.now()}`);
    setQuestions(fallbackPool);
    setTimeLeft(25);
    questionStartTimeRef.current = Date.now();
    setLoading(false);
  }, [user, gameId]);

  useEffect(() => {
    initGame(level);
  }, [level, initGame]);

  // Scroll into view on mount
  useEffect(() => {
    document.getElementById('magic-arena-viewport')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Handle Level Finish & Aptitude Evaluation
  const handleCompleteSession = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const timeSpent = Math.max(5, Math.round((Date.now() - totalSessionStartRef.current) / 1000));
    const avgTime = Math.round(timeSpent / Math.max(1, currentIndex + 1));
    const accuracy = Math.min(100, Math.round((score / Math.max(1, (currentIndex + 1) * 15)) * 100));

    if (!sessionId || String(sessionId).startsWith('local_')) {
      const localReport = evaluateLocalAptitude(score, accuracy, avgTime);
      setAssessmentReport(localReport);
      setIsFinished(true);
      if (onFinish) onFinish(localReport);
      return;
    }

    try {
      const res = await finishGameSession({
        gameId,
        sessionId,
        timeSpentSeconds: timeSpent,
        maxStreak
      });
      if (res && res.success) {
        setAssessmentReport(res.summary);
        setIsFinished(true);
        if (onFinish) onFinish(res.summary);
        return;
      }
    } catch (err) {
      console.error('Failed to finalize session on backend:', err);
    }

    const localReport = evaluateLocalAptitude(score, accuracy, avgTime);
    setAssessmentReport(localReport);
    setIsFinished(true);
    if (onFinish) onFinish(localReport);
  }, [sessionId, maxStreak, score, currentIndex, onFinish, gameId]);

  // Handle Option Submission
  const handleSelectAnswer = useCallback(async (optionLetter) => {
    if (selectedOption || submitting || !questions[currentIndex]) return;

    setSelectedOption(optionLetter);
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeTaken = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    const currentQ = questions[currentIndex];

    // Local / Offline Evaluation
    if (!sessionId || String(sessionId).startsWith('local_')) {
      const isCorrect = (optionLetter.toUpperCase() === (currentQ.answer || 'B').toUpperCase());
      const points = isCorrect ? (currentQ.points || 10) + (timeTaken <= 5 ? 5 : 0) : 0;
      const feedbackObj = {
        isCorrect,
        correctOption: currentQ.answer || 'B',
        answerText: currentQ.answer_text || 'Correct Option',
        pointsEarned: points,
        speedBonus: timeTaken <= 5 && isCorrect ? 5 : 0,
        currentScore: score + points,
        method: currentQ.method || "Step-by-step mathematical reasoning.",
        trick: currentQ.trick || "⚡ Magic Trick: Rapid mental calculation shortcut."
      };
      setFeedback(feedbackObj);
      if (isCorrect) {
        playTone('correct');
        setScore(prev => prev + points);
        setStreak(prev => {
          const next = prev + 1;
          setMaxStreak(m => Math.max(m, next));
          return next;
        });
      } else {
        playTone('wrong');
        setStreak(0);
        setLives(prev => {
          const nextLives = prev - 1;
          if (nextLives <= 0) {
            setTimeout(() => handleCompleteSession(), 2500);
          }
          return nextLives;
        });
      }
      setSubmitting(false);
      return;
    }

    // Backend Submission
    try {
      const res = await submitGameAnswer({
        gameId,
        sessionId,
        questionId: currentQ.id,
        selectedOption: optionLetter,
        timeTakenSeconds: timeTaken
      });

      if (res && res.success) {
        setFeedback(res);
        if (res.isCorrect) {
          playTone('correct');
          setScore(res.currentScore);
          setStreak(prev => {
            const next = prev + 1;
            setMaxStreak(m => Math.max(m, next));
            return next;
          });
        } else {
          playTone('wrong');
          setStreak(0);
          setLives(prev => {
            const nextLives = prev - 1;
            if (nextLives <= 0) {
              setTimeout(() => handleCompleteSession(), 2500);
            }
            return nextLives;
          });
        }
      }
    } catch (err) {
      console.warn('Submit answer warning, using local evaluation:', err);
      const isCorrect = (optionLetter.toUpperCase() === (currentQ.answer || 'B').toUpperCase());
      const points = isCorrect ? 15 : 0;
      setFeedback({
        isCorrect,
        correctOption: currentQ.answer || 'B',
        answerText: currentQ.answer_text || 'Option',
        pointsEarned: points,
        speedBonus: 0,
        currentScore: score + points,
        method: currentQ.method || "Standard formula application.",
        trick: currentQ.trick || "⚡ Magic Trick: Mental math shortcut."
      });
      if (isCorrect) {
        playTone('correct');
        setScore(s => s + points);
      } else {
        playTone('wrong');
        setLives(l => l - 1);
      }
    } finally {
      setSubmitting(false);
    }
  }, [selectedOption, submitting, questions, currentIndex, sessionId, score, handleCompleteSession]);

  // Countdown Timer Hook
  useEffect(() => {
    if (loading || isFinished || selectedOption || !questions.length) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSelectAnswer('TIMEOUT');
          return 0;
        }
        if (prev <= 5) {
          playTone('tick');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, isFinished, selectedOption, currentIndex, questions.length, handleSelectAnswer]);

  // Keyboard hotkey support (A, B, C, D, and Enter to advance)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished || loading) return;
      const key = e.key.toUpperCase();
      if (!selectedOption && ['A', 'B', 'C', 'D'].includes(key)) {
        handleSelectAnswer(key);
      } else if (feedback && e.key === 'Enter') {
        handleNextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Next Question trigger
  const handleNextQuestion = () => {
    if (lives <= 0) {
      handleCompleteSession();
      return;
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
      setTimeLeft(25);
      questionStartTimeRef.current = Date.now();
    } else {
      handleCompleteSession();
    }
  };

  // Open Tricks Vault
  const handleOpenTricks = async () => {
    try {
      const res = await getMagicNumberTricks();
      if (res && res.success && res.tricks && res.tricks.length > 0) {
        setTricksList(res.tricks);
        setShowTricksVault(true);
        return;
      }
    } catch (e) {
      console.warn('Tricks network warning, using vault fallback');
    }
    setTricksList(FALLBACK_TRICKS);
    setShowTricksVault(true);
  };

  // Open Leaderboard
  const handleOpenLeaderboard = async () => {
    try {
      const res = await getGameLeaderboard({ gameId, limit: 10 });
      if (res && res.success && res.leaderboard?.length > 0) {
        setLeaderboardData(res.leaderboard);
        setShowLeaderboard(true);
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setLeaderboardData([
      { id: 1, rank: 1, player_name: "Devansh Sharma", score: 1250, level_reached: 10, accuracy: 95.0, aptitude_level: "Grandmaster Prodigy" },
      { id: 2, rank: 2, player_name: "Aanya Patel", score: 1120, level_reached: 9, accuracy: 91.5, aptitude_level: "Elite Problem Solver" },
      { id: 3, rank: 3, player_name: "Vikram Aditya", score: 980, level_reached: 8, accuracy: 88.0, aptitude_level: "Tactical Calculator" },
    ]);
    setShowLeaderboard(true);
  };

  if (loading) {
    return (
      <div id="magic-arena-viewport" className="mna-container glass" style={{ minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={40} className="spin-loader" color="#818cf8" />
          <h3 style={{ marginTop: '14px', color: '#ffffff' }}>Launching {gameName}...</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading Level {level} challenges & insights</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || questions[0];
  const timerPercent = (timeLeft / 25) * 100;
  const timerColor = timeLeft > 12 ? '#10b981' : timeLeft > 6 ? '#f59e0b' : '#ef4444';

  return (
    <div id="magic-arena-viewport" className="mna-container">
      {/* ── Top Gaming HUD Bar ──────────────────────────────────────────────── */}
      <div className="mna-hud-bar">
        <div className="mna-hud-left">
          <div className="mna-level-chip">
            <Sparkles size={14} />
            <span>LEVEL {level} / 10</span>
          </div>

          <div className="mna-hud-stats">
            <div className="mna-stat-badge">
              <span>Score:</span>
              <span className="mna-score-val">{score} pts</span>
            </div>

            {streak >= 2 && (
              <div className="mna-streak-badge">
                <Flame size={14} />
                <span>{streak}x ON FIRE</span>
              </div>
            )}

            <div className="mna-lives" title={`${lives} Lives Remaining`}>
              {[1, 2, 3].map(h => (
                <span key={h} className={`mna-heart ${h > lives ? 'lost' : ''}`}>
                  ❤️
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mna-hud-actions">
          <button className="mna-hud-btn gold" onClick={handleOpenTricks}>
            <Zap size={14} />
            <span>Tricks Vault</span>
          </button>
          <button className="mna-hud-btn" onClick={handleOpenLeaderboard}>
            <Trophy size={14} />
            <span>Leaderboard</span>
          </button>
          <button className="mna-hud-btn" onClick={onClose} title="Exit to Game Zone">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Dynamic Timer Bar ─────────────────────────────────────────────── */}
      {!isFinished && (
        <div className="mna-timer-track">
          <div
            className="mna-timer-fill"
            style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
          ></div>
        </div>
      )}

      {/* ── Question & Play Area ──────────────────────────────────────────── */}
      {!isFinished && currentQ ? (
        <div className="mna-body">
          <div className="mna-question-header">
            <div className="mna-topic-pill">
              <Brain size={14} />
              <span>{currentQ.topic}</span>
            </div>

            <div className="mna-progress-count">
              Question {currentIndex + 1} of {questions.length} • {currentQ.points} pts
            </div>
          </div>

          {/* Question Prompt */}
          <div className="mna-prompt-box">
            <p className="mna-prompt-text">{currentQ.prompt}</p>
          </div>

          {/* 4-Option Grid */}
          <div className="mna-options-grid">
            {currentQ.options.map((opt, idx) => {
              const letter = 'ABCD'[idx];
              const isSelected = selectedOption === letter;
              let btnClass = 'mna-option-btn';

              if (feedback) {
                if (feedback.correctOption === letter) {
                  btnClass += ' correct';
                } else if (isSelected && !feedback.isCorrect) {
                  btnClass += ' wrong';
                }
              }

              return (
                <button
                  key={letter}
                  type="button"
                  className={btnClass}
                  disabled={!!selectedOption}
                  onClick={() => handleSelectAnswer(letter)}
                >
                  <span className="mna-option-key">{letter}</span>
                  <span className="mna-option-text">{typeof opt === 'string' ? opt.replace(/^[A-D]\.\s*/, '') : opt}</span>
                  {feedback && feedback.correctOption === letter && (
                    <CheckCircle2 size={18} color="#10b981" />
                  )}
                  {feedback && isSelected && !feedback.isCorrect && (
                    <XCircle size={18} color="#ef4444" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Feedback & Reveal of Method and Magic Trick ────────────────── */}
          {feedback && (
            <div className="mna-feedback-box">
              <div className="mna-feedback-header">
                <div className={`mna-feedback-title ${feedback.isCorrect ? 'correct' : 'wrong'}`}>
                  {feedback.isCorrect ? (
                    <>
                      <CheckCircle2 size={20} />
                      <span>Brilliant! Correct Answer ({feedback.answerText})</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={20} />
                      <span>Incorrect! Correct was: {feedback.correctOption} ({feedback.answerText})</span>
                    </>
                  )}
                </div>

                {feedback.pointsEarned > 0 && (
                  <span className="mna-bonus-tag">
                    +{feedback.pointsEarned} pts {feedback.speedBonus > 0 && `(⚡ +${feedback.speedBonus} Speed Bonus)`}
                  </span>
                )}
              </div>

              {/* ⚡ The 3-Second Magic Trick */}
              <div className="mna-trick-card">
                <div className="mna-trick-label">
                  <Zap size={14} />
                  <span>3-Second Magic Trick & Shortcut</span>
                </div>
                <p className="mna-trick-content">{feedback.trick}</p>
              </div>

              {/* 📐 The Classical Step-by-Step Method */}
              <div className="mna-method-card">
                <div className="mna-method-label">
                  <BookOpen size={14} />
                  <span>Standard Mathematical Method</span>
                </div>
                <p className="mna-method-content">{feedback.method}</p>
              </div>
            </div>
          )}

          {/* Bottom Footer Action */}
          <div className="mna-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px' }}>
              <Clock size={15} color={timerColor} />
              <span>Time: <strong>{timeLeft}s</strong></span>
            </div>

            {feedback && (
              <button className="mna-next-btn" onClick={handleNextQuestion}>
                <span>{currentIndex + 1 < questions.length && lives > 0 ? 'Next Question' : 'View Assessment'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      ) : null}

      {/* ── Summary & Comprehensive Aptitude Assessment Report ──────────────── */}
      {isFinished && assessmentReport && (
        <div className="mna-summary-view">
          <div className="mna-badge-circle">
            <span>{assessmentReport.badge || '🏆'}</span>
          </div>

          <h2 className="mna-summary-title">Aptitude Challenge Assessment</h2>
          <div className="mna-aptitude-tag">
            {assessmentReport.aptitudeLevel} • {assessmentReport.percentile}
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '14px', maxWidth: '580px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
            {assessmentReport.description}
          </p>

          {/* Key Metrics Grid */}
          <div className="mna-metrics-grid">
            <div className="mna-metric-card">
              <span className="mna-metric-label">Total Score</span>
              <p className="mna-metric-val" style={{ color: '#fbbf24' }}>{assessmentReport.score} pts</p>
            </div>

            <div className="mna-metric-card">
              <span className="mna-metric-label">Accuracy Rate</span>
              <p className="mna-metric-val" style={{ color: '#34d399' }}>{assessmentReport.accuracy}%</p>
            </div>

            <div className="mna-metric-card">
              <span className="mna-metric-label">Estimated IQ</span>
              <p className="mna-metric-val" style={{ color: '#38bdf8' }}>{assessmentReport.estimatedIq}</p>
            </div>

            <div className="mna-metric-card">
              <span className="mna-metric-label">Avg Speed / Q</span>
              <p className="mna-metric-val" style={{ color: '#a78bfa' }}>{assessmentReport.avgTimePerQuestion}s</p>
            </div>
          </div>

          {/* Cognitive Radar Skill Bars */}
          {assessmentReport.radar && (
            <div className="mna-radar-box">
              <h4 style={{ margin: '0 0 14px 0', fontSize: '14px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} color="#06b6d4" />
                <span>Cognitive Performance Breakdown</span>
              </h4>

              <div className="mna-radar-item">
                <div className="mna-radar-label-row">
                  <span>Numerical Agility</span>
                  <span>{assessmentReport.radar.numerical_agility}%</span>
                </div>
                <div className="mna-radar-bar-bg">
                  <div className="mna-radar-bar-fill" style={{ width: `${assessmentReport.radar.numerical_agility}%` }}></div>
                </div>
              </div>

              <div className="mna-radar-item">
                <div className="mna-radar-label-row">
                  <span>Calculation Speed</span>
                  <span>{assessmentReport.radar.calculation_speed}%</span>
                </div>
                <div className="mna-radar-bar-bg">
                  <div className="mna-radar-bar-fill" style={{ width: `${assessmentReport.radar.calculation_speed}%`, background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}></div>
                </div>
              </div>

              <div className="mna-radar-item">
                <div className="mna-radar-label-row">
                  <span>Logical Rigor</span>
                  <span>{assessmentReport.radar.logical_rigor}%</span>
                </div>
                <div className="mna-radar-bar-bg">
                  <div className="mna-radar-bar-fill" style={{ width: `${assessmentReport.radar.logical_rigor}%`, background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }}></div>
                </div>
              </div>

              <div className="mna-radar-item">
                <div className="mna-radar-label-row">
                  <span>Trick & Shortcut Mastery</span>
                  <span>{assessmentReport.radar.trick_mastery}%</span>
                </div>
                <div className="mna-radar-bar-bg">
                  <div className="mna-radar-bar-fill" style={{ width: `${assessmentReport.radar.trick_mastery}%`, background: 'linear-gradient(90deg, #f59e0b, #eab308)' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button className="mna-hud-btn gold" style={{ padding: '10px 20px', fontSize: '14px' }} onClick={handleOpenTricks}>
              <Zap size={16} />
              <span>Study Tricks Vault</span>
            </button>
            <button className="mna-hud-btn" style={{ padding: '10px 20px', fontSize: '14px' }} onClick={() => initGame(level)}>
              <RotateCcw size={16} />
              <span>Play Again</span>
            </button>
            {level < 10 && (
              <button
                className="mna-next-btn"
                style={{ padding: '10px 24px', fontSize: '14px' }}
                onClick={() => setLevel(prev => prev + 1)}
              >
                <span>Advance to Level {level + 1}</span>
                <ChevronRight size={16} />
              </button>
            )}
            <button className="mna-hud-btn" style={{ padding: '10px 20px', fontSize: '14px' }} onClick={onClose}>
              <span>Back to Game Zone</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Modal 1: Tricks Vault ──────────────────────────────────────────── */}
      {showTricksVault && (
        <div className="mna-modal-overlay" onClick={() => setShowTricksVault(false)}>
          <div className="mna-modal-content" onClick={e => e.stopPropagation()}>
            <div className="mna-modal-header">
              <h3>
                <Zap size={18} color="#fde047" />
                <span>Magic Aptitude Tricks & Shortcuts Vault</span>
              </h3>
              <button className="mna-modal-close" onClick={() => setShowTricksVault(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="mna-modal-body">
              {tricksList.map(t => (
                <div key={t.id} className="mna-vault-item">
                  <h4 className="mna-vault-title">{t.title}</h4>
                  <span className="mna-vault-formula">{t.formula}</span>
                  <p className="mna-vault-desc">{t.description}</p>
                  <div className="mna-vault-example">
                    <strong>Worked Example:</strong> {t.example}
                  </div>
                  {t.carryExample && (
                    <div className="mna-vault-example" style={{ marginTop: '6px', background: 'rgba(250, 204, 21, 0.08)', borderColor: '#eab308', color: '#fef08a' }}>
                      <strong>Bonus Application:</strong> {t.carryExample}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal 2: Leaderboard ──────────────────────────────────────────── */}
      {showLeaderboard && (
        <div className="mna-modal-overlay" onClick={() => setShowLeaderboard(false)}>
          <div className="mna-modal-content" onClick={e => e.stopPropagation()}>
            <div className="mna-modal-header">
              <h3>
                <Trophy size={18} color="#fbbf24" />
                <span>Magic Number Aptitude Leaderboard</span>
              </h3>
              <button className="mna-modal-close" onClick={() => setShowLeaderboard(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="mna-modal-body">
              {leaderboardData.map(entry => (
                <div key={entry.id} className="mna-lb-row">
                  <div className="mna-lb-rank">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </div>
                  <div className="mna-lb-user">
                    <div className="mna-lb-name">{entry.player_name}</div>
                    <div className="mna-lb-level">
                      Level {entry.level_reached} • {entry.aptitude_level} ({entry.accuracy}% acc)
                    </div>
                  </div>
                  <div className="mna-lb-score">{entry.score} pts</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicNumberArena;

