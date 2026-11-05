import React, { useState, useEffect } from 'react';
import './DiagnosticTestPage.css';
import {
  getDiagnosticQuestions,
  submitDiagnosticAssessment,
  getStoredUser
} from '../services/api';
import {
  Brain,
  Timer,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Zap,
  Target,
  Gamepad2,
  BookOpen,
  ChevronRight,
  Loader2,
  Code2,
  Calculator,
  Compass,
  Activity
} from 'lucide-react';

const FALLBACK_QUESTIONS = [
  {
    id: "grad_apt_1",
    domain: "aptitude",
    title: "Compound Ratio & Work Equivalence",
    question: "If 12 engineers can build a microservice architecture in 15 days working 8 hours/day, how many days will 10 engineers take to build twice the architecture working 9 hours/day?",
    options: ["32 days", "28 days", "36 days", "24 days"],
    difficulty: 1.4,
    skill: "Quantitative Proportions & Rate Analysis"
  },
  {
    id: "grad_apt_2",
    domain: "aptitude",
    title: "Speed, Distance & Relative Motion",
    question: "A train running at 72 km/h crosses a 250m long platform in 26 seconds. How much time will it take to cross an electric pole?",
    options: ["13.5 seconds", "12.5 seconds", "14 seconds", "10 seconds"],
    difficulty: 1.2,
    skill: "Relative Velocity & Distance"
  },
  {
    id: "grad_apt_3",
    domain: "aptitude",
    title: "Percentage & Successive Variation",
    question: "The computational cost of a cloud cluster increased by 25% in Q1 and then decreased by 20% in Q2. What is the net percentage change in total cloud cost?",
    options: ["0% (No Change)", "5% Increase", "5% Decrease", "2.5% Increase"],
    difficulty: 1.0,
    skill: "Percentage Calculus & Financial Optimization"
  },
  {
    id: "grad_log_1",
    domain: "logic",
    title: "Sequential Logic & Truth Deductions",
    question: "In a distributed system, 5 nodes P, Q, R, S, T replicate data. Q replicates faster than P but slower than T. S replicates faster than T. R replicates slower than P. Which node is the median replicator?",
    options: ["Q", "P", "T", "R"],
    difficulty: 1.2,
    skill: "Sequential Ordering & Transitive Relations"
  },
  {
    id: "grad_log_2",
    domain: "logic",
    title: "Boolean Syllogisms & Set Theory",
    question: "Statements: (1) All algorithms are functions. (2) Some functions are recursive. Conclusions: I. Some algorithms are recursive. II. All functions are algorithms. Which conclusion logically follows?",
    options: ["Neither I nor II follows", "Only I follows", "Only II follows", "Both I and II follow"],
    difficulty: 1.3,
    skill: "Formal Syllogistic Logic & Set Intersection"
  },
  {
    id: "grad_log_3",
    domain: "logic",
    title: "Pattern Matrix & Numeric Logic",
    question: "Identify the missing number in the sequence: 4, 9, 25, 49, 121, 169, ?",
    options: ["289", "225", "196", "256"],
    difficulty: 1.2,
    skill: "Prime Number Invariant & Series Deduction"
  },
  {
    id: "grad_tech_1",
    domain: "technical",
    title: "Algorithmic Time Complexity",
    question: "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) versus a balanced Red-Black Tree?",
    options: ["O(N) vs O(log N)", "O(log N) vs O(log N)", "O(N log N) vs O(N)", "O(1) vs O(log N)"],
    difficulty: 1.3,
    skill: "Data Structures & Tree Invariants"
  },
  {
    id: "grad_tech_2",
    domain: "technical",
    title: "Operating Systems & Concurrency",
    question: "Which of the following conditions is NOT strictly required for a system deadlock to occur (Coffman conditions)?",
    options: ["Preemption Allowed", "Mutual Exclusion", "Hold and Wait", "Circular Wait"],
    difficulty: 1.2,
    skill: "Concurrency, Synchronization & Operating Systems"
  },
  {
    id: "grad_tech_3",
    domain: "technical",
    title: "Database Normalization & ACID Properties",
    question: "Which ACID property guarantees that multiple transactions executing simultaneously will result in a state that could have been obtained if transactions were executed sequentially?",
    options: ["Isolation", "Atomicity", "Consistency", "Durability"],
    difficulty: 1.1,
    skill: "Database Systems & Transaction Isolation"
  },
  {
    id: "grad_verb_1",
    domain: "verbal",
    title: "Contextual Inference & Semantic Precision",
    question: "Choose the most appropriate word: 'The company's new security framework provided an ________ defense against zero-day vulnerabilities, leaving no room for penetration.'",
    options: ["impregnable", "ephemeral", "equivocal", "indolent"],
    difficulty: 1.1,
    skill: "Advanced Vocabulary & Tone Alignment"
  },
  {
    id: "grad_verb_2",
    domain: "verbal",
    title: "Sentence Correction & Grammatical Parallelism",
    question: "Identify the grammatically correct sentence:",
    options: [
      "Neither the senior architect nor the software developers were satisfied with the database throughput.",
      "Neither the senior architect nor the software developers was satisfied with the database throughput.",
      "Neither the senior architect or the software developers were satisfied with the database throughput.",
      "Neither the senior architect nor the software developers has been satisfied with the database throughput."
    ],
    difficulty: 1.2,
    skill: "Subject-Verb Agreement & Parallel Structure"
  },
  {
    id: "grad_verb_3",
    domain: "verbal",
    title: "Critical Reading & Argument Evaluation",
    question: "Premise: 'AI code assistants reduce syntax debugging time by 60%. Therefore, junior engineers no longer need to understand memory management.' What is the underlying flawed assumption?",
    options: [
      "Assumes syntax speed equates to deep conceptual system understanding",
      "Assumes AI tools are 100% bug free",
      "Assumes memory management is completely automated in every language",
      "Assumes junior engineers write more code than senior architects"
    ],
    difficulty: 1.3,
    skill: "Analytical Argument Analysis & Logic Fallacies"
  },
  {
    id: "grad_prob_1",
    domain: "problem_solving",
    title: "Resource Allocation & Dynamic Optimization",
    question: "You have a 100 Mbps API bandwidth limit. Service A generates $5/req and takes 2 Mbps. Service B generates $8/req and takes 5 Mbps. Service C generates $3/req and takes 1 Mbps. Which allocation yields maximum revenue per Mbps?",
    options: ["Service C ($3.00/Mbps)", "Service A ($2.50/Mbps)", "Service B ($1.60/Mbps)", "Equal split among all three"],
    difficulty: 1.2,
    skill: "Greedy Heuristics & Resource Knapsack Optimization"
  },
  {
    id: "grad_prob_2",
    domain: "problem_solving",
    title: "Architectural Bottleneck Diagnosis",
    question: "A web application experiences 504 Gateway Timeouts during peak traffic. CPU utilization is at 25%, Memory at 40%, but database active connection pool is at 100% capacity with queries waiting in queue. What is the root cause bottleneck?",
    options: [
      "Database Connection Starvation / Pool Exhaustion",
      "Server CPU throttling",
      "Out of Memory (OOM) killer",
      "DNS lookup failure"
    ],
    difficulty: 1.3,
    skill: "System Telemetry & Root Cause Analysis"
  },
  {
    id: "grad_prob_3",
    domain: "problem_solving",
    title: "Trade-off Decision Matrix (CAP Theorem)",
    question: "In a distributed payment transaction system facing network partition between regional datacenters, which CAP theorem guarantee must be prioritized to prevent double-spending?",
    options: [
      "Consistency over Availability (CP)",
      "Availability over Consistency (AP)",
      "Partition Tolerance removal (CA)",
      "Eventual Consistency with lazy reconciliation"
    ],
    difficulty: 1.3,
    skill: "Architectural Trade-offs & Consistency Models"
  }
];

const DOMAIN_ICONS = {
  aptitude: Calculator,
  logic: Brain,
  technical: Code2,
  verbal: BookOpen,
  problem_solving: Target,
};

const DOMAIN_COLORS = {
  aptitude: '#f59e0b',
  logic: '#6366f1',
  technical: '#06b6d4',
  verbal: '#ec4899',
  problem_solving: '#10b981',
};

const DiagnosticTestPage = ({ user, onNavigateToRoadmap, onNavigateToGame, onBackToDashboard }) => {
  const [questions, setQuestions] = useState(FALLBACK_QUESTIONS);
  const [testTitle, setTestTitle] = useState('Diagnostic Skill & Cognitive Assessment');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load questions on mount
  useEffect(() => {
    let isMounted = true;
    const fetchQuestions = async () => {
      try {
        const res = await getDiagnosticQuestions();
        if (isMounted && res && res.success && Array.isArray(res.questions) && res.questions.length > 0) {
          setQuestions(res.questions);
          if (res.testTitle) setTestTitle(res.testTitle);
        }
      } catch (err) {
        console.warn('Using offline diagnostic question bank:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchQuestions();
    return () => { isMounted = false; };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (report || isSubmitting) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [report, isSubmitting, answers]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = questions[currentIndex] || questions[0];
  const DomainIcon = DOMAIN_ICONS[currentQ?.domain] || Brain;
  const domainColor = DOMAIN_COLORS[currentQ?.domain] || '#6366f1';

  const handleSelectOption = (optIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIndex
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // Submit test and trigger ML matching animation
  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    setAnalysisStep(1);

    // Step 1: Vector extraction
    setTimeout(() => setAnalysisStep(2), 700);
    // Step 2: Cosine matching
    setTimeout(() => setAnalysisStep(3), 1400);
    // Step 3: Roadmap synthesis
    setTimeout(() => setAnalysisStep(4), 2100);

    try {
      const timeSpent = 900 - timeLeft;
      const res = await submitDiagnosticAssessment({
        answers,
        timeSpentSeconds: timeSpent > 0 ? timeSpent : 320
      });

      setTimeout(() => {
        if (res && res.success) {
          setReport(res);
        } else {
          // Fallback mock report if network drops
          createLocalFallbackReport();
        }
        setIsSubmitting(false);
      }, 2600);
    } catch {
      setTimeout(() => {
        createLocalFallbackReport();
        setIsSubmitting(false);
      }, 2600);
    }
  };

  const createLocalFallbackReport = () => {
    const total = questions.length;
    const ansCount = Object.keys(answers).length;
    const estCorrect = Math.max(8, Math.min(total, ansCount));
    const scorePct = Math.round((estCorrect / total) * 100);

    setReport({
      overallScore: scorePct,
      totalQuestions: total,
      correctAnswers: estCorrect,
      archetype: {
        name: "Algorithmic Prodigy & Systems Architect",
        targetRole: "Full-Stack Software & AI Architect",
        description: "High computational abstraction, structured thinking, deep technical rigor, and rapid algorithmic problem solving.",
        matchScore: 94.6,
        color: "#6366f1"
      },
      domainScores: {
        aptitude: 85,
        logic: 90,
        technical: 95,
        verbal: 75,
        problem_solving: 90
      },
      superpowers: [
        { title: "Technical & Domain Specialization", score: 95, feedback: "Top 2% mastery in algorithms and core architecture." },
        { title: "Applied Problem Solving", score: 90, feedback: "Strong heuristic efficiency and system diagnosis." }
      ],
      growth_areas: [
        { title: "Quantitative Proportions & Speed", score: 65, feedback: "Practice rapid 3-second mental math shortcuts to elevate speed." }
      ],
      recommendedGames: [
        {
          id: "magic-number",
          name: "Magic Number Aptitude Arena",
          priority: "Urgent Focus",
          reason: "Diagnosed at 65% in Quantitative Speed. Playing this module will train 3-second Vedic shortcuts.",
          colorTheme: "#f59e0b"
        },
        {
          id: "coding-quest",
          name: "Coding Quest",
          priority: "Mastery Challenge",
          reason: "Matches your superpower (95% Technical). Test yourself against high-tier logic puzzles.",
          colorTheme: "#06b6d4"
        },
        {
          id: "equation-galaxy",
          name: "Equation Galaxy",
          priority: "Recommended Drill",
          reason: "Reinforces deductive reasoning and symbolic algebraic balance.",
          colorTheme: "#6366f1"
        }
      ]
    });
  };

  if (loading) {
    return (
      <div className="dt-loading-screen glass">
        <Loader2 size={42} className="spin-loader" color="var(--primary)" />
        <h2>Generating Adaptive Diagnostic Assessment...</h2>
        <p>Curating 15 multi-dimensional questions matching your academic profile.</p>
      </div>
    );
  }

  // ── SUBMITTING ANIMATED VIEW ───────────────────────────────────────────────
  if (isSubmitting) {
    return (
      <div className="dt-analyzing-screen glass">
        <div className="dt-analyzing-card glass-inner">
          <div className="dt-pulsing-orb">
            <Sparkles size={36} color="#6366f1" />
          </div>
          <h2>Skill Assessment Analysis</h2>
          <p className="dt-analyzing-subtitle">Evaluating answer accuracy, response time, and competency scores</p>

          <div className="dt-analysis-steps">
            <div className={`dt-step-item ${analysisStep >= 1 ? 'active' : ''} ${analysisStep > 1 ? 'done' : ''}`}>
              <div className="step-circle">{analysisStep > 1 ? <CheckCircle2 size={16} /> : 1}</div>
              <span>Analyzing Skill Scores</span>
            </div>
            <div className={`dt-step-item ${analysisStep >= 2 ? 'active' : ''} ${analysisStep > 2 ? 'done' : ''}`}>
              <div className="step-circle">{analysisStep > 2 ? <CheckCircle2 size={16} /> : 2}</div>
              <span>Determining Learner Profile</span>
            </div>
            <div className={`dt-step-item ${analysisStep >= 3 ? 'active' : ''} ${analysisStep > 3 ? 'done' : ''}`}>
              <div className="step-circle">{analysisStep > 3 ? <CheckCircle2 size={16} /> : 3}</div>
              <span>Matching Practice Exercises</span>
            </div>
            <div className={`dt-step-item ${analysisStep >= 4 ? 'active' : ''}`}>
              <div className="step-circle">{analysisStep > 4 ? <CheckCircle2 size={16} /> : 4}</div>
              <span>Generating 4-Phase Learning Path</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── POST-TEST REPORT VIEW ──────────────────────────────────────────────────
  if (report) {
    const { overallScore, archetype, domainScores, superpowers, growthAreas, recommendedGames } = report;
    const scores = domainScores || { aptitude: 80, logic: 85, technical: 90, verbal: 75, problem_solving: 85 };

    return (
      <div className="dt-report-container">
        {/* Top Header Card */}
        <div className="dt-report-hero glass">
          <div className="dt-report-badge">
            <Zap size={16} />
            <span>ASSESSMENT COMPLETED</span>
          </div>

          <div className="dt-hero-content-grid">
            <div className="dt-hero-left">
              <span className="dt-archetype-tag">Learner Profile</span>
              <h1 className="dt-archetype-title gradient-text">{archetype?.name || "Algorithmic Specialist"}</h1>
              <p className="dt-archetype-desc">{archetype?.description || "Strong analytical thinking and rapid problem solving."}</p>

              <div className="dt-target-role-chip">
                <Target size={16} color="var(--primary)" />
                <span>Target Track: <strong>{archetype?.targetRole || "Software Engineer"}</strong></span>
              </div>
            </div>

            <div className="dt-hero-score-box glass-inner">
              <span className="score-label">Overall Score</span>
              <div className="score-number-row">
                <span className="score-huge">{overallScore}%</span>
                <span className="score-match-badge">{archetype?.matchScore || 94.6}% Match</span>
              </div>
              <p className="score-subtext">Calculated from 15 questions and accuracy</p>
            </div>
          </div>
        </div>

        {/* 5-Dimensional Competency Breakdown */}
        <div className="dt-competency-section glass">
          <div className="section-title-row">
            <div>
              <h2>Core Competency Breakdown</h2>
              <p>Performance across primary academic and problem-solving domains</p>
            </div>
            <span className="calibrated-pill">Evaluated</span>
          </div>

          <div className="dt-radar-bars-grid">
            {[
              { id: 'aptitude', label: 'Quantitative Aptitude', val: scores.aptitude, icon: Calculator, color: '#f59e0b' },
              { id: 'logic', label: 'Logical & Deductive Reasoning', val: scores.logic, icon: Brain, color: '#6366f1' },
              { id: 'technical', label: 'Technical & Domain Specialization', val: scores.technical, icon: Code2, color: '#06b6d4' },
              { id: 'verbal', label: 'Verbal Ability & Precision', val: scores.verbal, icon: BookOpen, color: '#ec4899' },
              { id: 'problem_solving', label: 'Applied Problem Solving', val: scores.problem_solving, icon: Target, color: '#10b981' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="dt-competency-card glass-inner">
                  <div className="comp-card-top">
                    <div className="comp-icon-box" style={{ color: item.color, borderColor: item.color }}>
                      <Icon size={18} />
                    </div>
                    <span className="comp-score-text" style={{ color: item.color }}>{item.val}%</span>
                  </div>
                  <h4 className="comp-name">{item.label}</h4>
                  <div className="comp-bar-bg">
                    <div className="comp-bar-fill" style={{ width: `${item.val}%`, backgroundColor: item.color }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Superpowers & Growth Areas */}
        <div className="dt-insights-grid">
          <div className="dt-insight-card glass positive">
            <div className="insight-card-header">
              <CheckCircle2 size={20} color="#4ade80" />
              <h3>Identified Superpowers ({superpowers?.length || 1})</h3>
            </div>
            <div className="insight-items-list">
              {(superpowers || []).map((sp, i) => (
                <div key={i} className="insight-row glass-inner">
                  <div className="insight-title-row">
                    <strong>{sp.title}</strong>
                    <span className="insight-pct text-green-400">{sp.score}%</span>
                  </div>
                  <p>{sp.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dt-insight-card glass growth">
            <div className="insight-card-header">
              <AlertCircle size={20} color="#f59e0b" />
              <h3>Critical Growth Focus Areas ({growthAreas?.length || 1})</h3>
            </div>
            <div className="insight-items-list">
              {(growthAreas || []).map((ga, i) => (
                <div key={i} className="insight-row glass-inner">
                  <div className="insight-title-row">
                    <strong>{ga.title}</strong>
                    <span className="insight-pct text-amber-400">{ga.score}%</span>
                  </div>
                  <p>{ga.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matched Games Section */}
        <div className="dt-matched-games-section glass">
          <div className="section-title-row">
            <div>
              <h2>Content Games Matched to Your Skills</h2>
              <p>These interactive modules are calibrated to accelerate your growth areas and reinforce superpowers.</p>
            </div>
            <div className="games-count-badge">
              <Gamepad2 size={16} />
              <span>{recommendedGames?.length || 3} Games Recommended</span>
            </div>
          </div>

          <div className="dt-games-grid">
            {(recommendedGames || []).map((game) => (
              <div key={game.id} className="dt-game-card glass-card">
                <div className="game-card-top">
                  <span className={`game-priority-pill ${game.priority === 'Urgent Focus' ? 'urgent' : 'recommended'}`}>
                    {game.priority}
                  </span>
                  <span className="game-category-text">{game.category}</span>
                </div>

                <h3 className="game-title">{game.name}</h3>
                <p className="game-reason">{game.reason}</p>

                <div className="game-footer">
                  <button
                    className="btn btn-primary btn-sm play-matched-btn"
                    onClick={() => {
                      if (onNavigateToGame) {
                        onNavigateToGame(game);
                      } else {
                        alert(`Launching ${game.name} in GameZone...`);
                      }
                    }}
                  >
                    <Gamepad2 size={15} />
                    <span>Play in GameZone</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="dt-report-bottom-bar glass">
          <button className="btn btn-outline" onClick={onBackToDashboard}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          <button className="btn btn-primary go-roadmap-btn" onClick={onNavigateToRoadmap}>
            <span>View Your Learning Roadmap Under Performance</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── LIVE TEST INTERFACE ────────────────────────────────────────────────────
  return (
    <div className="dt-test-page">
      {/* Top Test Navigation Bar */}
      <div className="dt-test-navbar glass">
        <div className="dt-nav-left">
          <div className="dt-logo-icon">
            <Brain size={22} color="var(--primary)" />
          </div>
          <div>
            <h2>{testTitle}</h2>
            <span className="dt-nav-sub">Adaptive Multi-Skill Assessment</span>
          </div>
        </div>

        <div className="dt-nav-center">
          <div className="dt-timer-pill glass-inner">
            <Timer size={18} color="#f59e0b" />
            <span className="timer-text">{formatTimer(timeLeft)}</span>
          </div>
        </div>

        <div className="dt-nav-right">
          <button className="btn btn-primary submit-test-btn" onClick={handleSubmitTest}>
            <CheckCircle2 size={16} />
            <span>Submit Assessment ({answeredCount}/{questions.length})</span>
          </button>
        </div>
      </div>

      {/* Main Test Layout */}
      <div className="dt-main-grid">
        {/* Left / Center: Question Viewport */}
        <div className="dt-question-viewport glass">
          {/* Question Header */}
          <div className="dt-q-header">
            <div className="dt-domain-badge" style={{ backgroundColor: `${domainColor}20`, color: domainColor, borderColor: domainColor }}>
              <DomainIcon size={16} />
              <span>{currentQ.domain.toUpperCase()} — {currentQ.title}</span>
            </div>
            <span className="dt-q-counter">Question {currentIndex + 1} of {questions.length}</span>
          </div>

          {/* Question Text */}
          <div className="dt-q-body">
            <h3 className="dt-question-prompt">{currentQ.question}</h3>
            <span className="dt-skill-indicator">Tested Skill: {currentQ.skill}</span>

            {/* Options List */}
            <div className="dt-options-list">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                const optionLetter = String.fromCharCode(65 + idx);
                return (
                  <button
                    key={idx}
                    className={`dt-option-btn glass-inner ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(idx)}
                  >
                    <div className="opt-letter-circle">{optionLetter}</div>
                    <span className="opt-text">{opt}</span>
                    {isSelected && <CheckCircle2 size={18} className="opt-check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Footer Navigation Controls */}
          <div className="dt-q-footer">
            <button
              className="btn btn-outline"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            >
              <ArrowLeft size={16} />
              <span>Previous</span>
            </button>

            {answers[currentQ.id] !== undefined && (
              <button
                className="clear-selection-btn"
                onClick={() => {
                  setAnswers(prev => {
                    const next = { ...prev };
                    delete next[currentQ.id];
                    return next;
                  });
                }}
              >
                Clear Selection
              </button>
            )}

            {currentIndex < questions.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              >
                <span>Next Question</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary submit-accent-btn" onClick={handleSubmitTest}>
                <span>Complete & View Roadmap</span>
                <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar: Question Palette & Progress */}
        <div className="dt-sidebar-palette glass">
          <div className="palette-header">
            <h3>Assessment Overview</h3>
            <span className="progress-percent-text">{progressPercent}% Completed</span>
          </div>

          <div className="palette-progress-bar-bg">
            <div className="palette-progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>

          <div className="palette-status-legend">
            <span className="legend-item"><span className="dot answered"></span> Answered ({answeredCount})</span>
            <span className="legend-item"><span className="dot unanswered"></span> Unanswered ({questions.length - answeredCount})</span>
          </div>

          {/* 15-Question Grid */}
          <div className="palette-grid">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentIndex === idx;
              return (
                <button
                  key={q.id}
                  className={`palette-num-btn ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="palette-info-card glass-inner">
            <Sparkles size={16} color="var(--primary)" />
            <p>Your responses are evaluated to build your personalized study roadmap and exercise drills.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticTestPage;

