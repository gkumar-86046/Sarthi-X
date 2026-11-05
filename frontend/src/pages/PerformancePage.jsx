import React, { useState, useEffect } from 'react';
import './PerformanceRoadmap.css';
import {
  TrendingUp, Target, Clock, Sparkles, AlertCircle, CheckCircle2,
  ArrowUpRight, Flame, BarChart2, Map, Gamepad2, Brain, Award,
  RotateCcw, BookOpen, Code2, Calculator, Play, ChevronRight, Lock, Check
} from 'lucide-react';
import { getDashboardPerformance, getStudentLatestAssessment } from '../services/api';

const defaultPerformanceData = {
  overallGrade: 'A+',
  overallPercentage: 94.2,
  classRank: 'Top 5% (Class Academic Track)',
  quizAccuracy: 88.5,
  totalStudyHours: 64.2,
  weeklyStreak: '14 Days Active',
  subjects: [
    {
      name: 'Computer Science',
      score: 98,
      grade: 'A+',
      color: '#10b981',
      strongTopics: ['Python File I/O & Pickle', 'Stack & Queue Data Structures'],
      weakTopics: ['SQL Multi-Table Joins'],
      testsTaken: 8
    },
    {
      name: 'Mathematics',
      score: 96,
      grade: 'A+',
      color: '#6366f1',
      strongTopics: ['Integral & Differential Calculus', 'Relations & Inverse Trig'],
      weakTopics: ['3D Geometry Vector Equations'],
      testsTaken: 12
    },
    {
      name: 'Physics',
      score: 92,
      grade: 'A',
      color: '#06b6d4',
      strongTopics: ['Electrostatics & Gauss Theorem', 'Current Electricity'],
      weakTopics: ['Wave Optics Interference Patterns'],
      testsTaken: 10
    },
    {
      name: 'Chemistry',
      score: 89,
      grade: 'A',
      color: '#ec4899',
      strongTopics: ['Electrochemistry & Nernst Equation'],
      weakTopics: ['Organic Reaction Mechanisms & Aldehydes'],
      testsTaken: 9
    }
  ],
  testHistory: [
    { id: 1, title: 'Electrostatics Unit Test', date: 'Yesterday', score: '48 / 50', percent: 96, status: 'Passed', subject: 'Physics' },
    { id: 2, title: 'Calculus Mock Assessment', date: '2 days ago', score: '92 / 100', percent: 92, status: 'Passed', subject: 'Mathematics' },
    { id: 3, title: 'Python Stacks Quiz', date: '4 days ago', score: '20 / 20', percent: 100, status: 'Passed', subject: 'Computer Science' },
    { id: 4, title: 'Electrochemistry Mid-Term', date: '1 week ago', score: '42 / 50', percent: 84, status: 'Passed', subject: 'Chemistry' }
  ]
};

const PerformancePage = ({ user, onStartTest, onLaunchGame, onNavigateTab }) => {
  const [activeMainTab, setActiveMainTab] = useState('roadmap'); // 'roadmap' | 'academic'
  const [performanceData, setPerformanceData] = useState(defaultPerformanceData);
  const [activeSubjectTab, setActiveSubjectTab] = useState('All');
  const [assessmentData, setAssessmentData] = useState(null);
  const [loadingAssessment, setLoadingAssessment] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch dashboard performance
    const fetchRealPerformance = async () => {
      try {
        const data = await getDashboardPerformance();
        if (isMounted && data.success && data.performance) {
          setPerformanceData(prev => ({
            ...prev,
            ...data.performance,
            classRank: data.performance.classRank || user?.academicDetail || prev.classRank,
          }));
        }
      } catch (err) {
        console.warn('Performance API notice:', err.message);
      }
    };

    // 2. Fetch student's latest assessment & ML roadmap
    const fetchAssessment = async () => {
      try {
        const res = await getStudentLatestAssessment();
        if (isMounted && res && res.success) {
          setAssessmentData(res);
        }
      } catch (err) {
        console.warn('Assessment API notice:', err.message);
      } finally {
        if (isMounted) setLoadingAssessment(false);
      }
    };

    fetchRealPerformance();
    fetchAssessment();

    return () => { isMounted = false; };
  }, [user]);

  const filteredSubjects = activeSubjectTab === 'All'
    ? (performanceData.subjects || [])
    : (performanceData.subjects || []).filter(s => s.name === activeSubjectTab);

  const hasTakenTest = assessmentData?.hasTakenTest && assessmentData?.assessment;
  const assessment = assessmentData?.assessment;
  const roadmap = assessmentData?.roadmap;
  const scores = assessment?.domainScores || { aptitude: 85, logic: 90, technical: 95, verbal: 75, problem_solving: 90 };

  return (
    <div className="performance-page-container">
      {/* ── Sub-Navigation Pill Tabs ─────────────────────────────────────────── */}
      <div className="perf-nav-tabs-bar glass">
        <button
          className={`perf-tab-btn ${activeMainTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('roadmap')}
        >
          <Map size={18} />
          <span>Skill Roadmap & Practice Drills</span>
          <span className="perf-tab-badge ml">Path</span>
        </button>

        <button
          className={`perf-tab-btn ${activeMainTab === 'academic' ? 'active' : ''}`}
          onClick={() => setActiveMainTab('academic')}
        >
          <BarChart2 size={18} />
          <span>Academic Grades & Subject Mastery</span>
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════════
          TAB 1: AI SKILL ROADMAP & MATCHED GAMES
          ═════════════════════════════════════════════════════════════════════════ */}
      {activeMainTab === 'roadmap' && (
        <div className="roadmap-subview-wrapper">
          {/* UNASSESSED STATE: INVITATION HERO BANNER */}
          {!hasTakenTest && (
            <div className="roadmap-invitation-card glass">
              <div className="invitation-badge">
                <Sparkles size={16} />
                <span>DIAGNOSTIC SKILL TEST REQUIRED</span>
              </div>

              <h2>Unlock Your Personalized Roadmap & Practice Drills</h2>
              <p>
                Take a 10-minute diagnostic test to assess your competencies across
                <strong> Quantitative Aptitude</strong>, <strong>Logical Reasoning</strong>,
                <strong> Technical Knowledge</strong>, and <strong>Problem Solving</strong>.
                Get an 8-week structured learning roadmap and targeted practice drills.
              </p>

              <div className="invitation-features-row">
                <div className="inv-feature-item glass-inner">
                  <Brain size={18} color="#6366f1" />
                  <span>Competency Breakdown</span>
                </div>
                <div className="inv-feature-item glass-inner">
                  <Gamepad2 size={18} color="#f59e0b" />
                  <span>Targeted Practice Drills</span>
                </div>
                <div className="inv-feature-item glass-inner">
                  <Map size={18} color="#06b6d4" />
                  <span>4-Phase Milestone Path</span>
                </div>
                <div className="inv-feature-item glass-inner">
                  <Target size={18} color="#10b981" />
                  <span>Verified Milestones</span>
                </div>
              </div>

              <button
                className="btn btn-primary start-diagnostic-btn"
                onClick={onStartTest}
              >
                <Brain size={20} />
                <span>Start Diagnostic Skill Test Now</span>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ASSESSED STATE: FULL ML ROADMAP & PERFORMANCE REPORT */}
          {hasTakenTest && (
            <>
              {/* Profile & ML Archetype Header Banner */}
              <div className="roadmap-profile-banner glass">
                <div className="rpb-left">
                  <div className="rpb-badge-row">
                    <span className="rpb-tag">
                      <Sparkles size={14} />
                      <span>Learner Profile</span>
                    </span>
                    <span className="rpb-date">Evaluated on {assessment.createdAt || 'Recent'}</span>
                  </div>

                  <h1 className="rpb-title gradient-text">{assessment.archetype?.name || "Algorithmic Specialist"}</h1>
                  <p className="rpb-target-role">
                    Target Track: <strong>{roadmap?.targetRole || "Software Engineer"}</strong>
                  </p>
                </div>

                <div className="rpb-right">
                  <div className="rpb-metrics-box glass-inner">
                    <div className="rpb-score-block">
                      <span className="rpb-score-num">{assessment.overallScore}%</span>
                      <span className="rpb-score-label">Competency</span>
                    </div>
                    <div className="rpb-divider"></div>
                    <span className="rpb-match-badge">{assessment.archetype?.matchScore || 94.6}% Match</span>
                  </div>

                  <button className="btn btn-outline retake-test-btn" onClick={onStartTest}>
                    <RotateCcw size={14} />
                    <span>Retake Assessment</span>
                  </button>
                </div>
              </div>

              {/* 5-Dimensional Competency Matrix */}
              <div className="skills-matrix-section glass">
                <div className="section-title-row">
                  <div>
                    <h2>Core Skill Competencies</h2>
                    <p>Performance assessment across key academic and problem-solving areas</p>
                  </div>
                  <span className="calibrated-pill">Evaluated</span>
                </div>

                <div className="skills-matrix-grid">
                  {[
                    { id: 'aptitude', label: 'Quantitative Aptitude', val: scores.aptitude, icon: Calculator, color: '#f59e0b' },
                    { id: 'logic', label: 'Logical & Deductive', val: scores.logic, icon: Brain, color: '#6366f1' },
                    { id: 'technical', label: 'Technical Specialization', val: scores.technical, icon: Code2, color: '#06b6d4' },
                    { id: 'verbal', label: 'Verbal & Comprehension', val: scores.verbal, icon: BookOpen, color: '#ec4899' },
                    { id: 'problem_solving', label: 'Applied Problem Solving', val: scores.problem_solving, icon: Target, color: '#10b981' },
                  ].map(item => {
                    const Icon = item.icon;
                    const tier = item.val >= 85 ? 'Mastery' : (item.val >= 70 ? 'Proficient' : 'Growth Focus');
                    return (
                      <div key={item.id} className="skill-matrix-card glass-inner">
                        <div className="smc-top">
                          <div className="smc-icon" style={{ color: item.color, borderColor: item.color }}>
                            <Icon size={18} />
                          </div>
                          <span className="smc-score" style={{ color: item.color }}>{item.val}%</span>
                        </div>
                        <h4 className="smc-name">{item.label}</h4>
                        <div className="smc-bar-bg">
                          <div className="smc-bar-fill" style={{ width: `${item.val}%`, backgroundColor: item.color }}></div>
                        </div>
                        <span className="smc-tier-badge" style={{ color: item.color }}>{tier}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Superpowers & Critical Growth Gaps */}
              <div className="dt-insights-grid">
                <div className="dt-insight-card glass positive">
                  <div className="insight-card-header">
                    <CheckCircle2 size={20} color="#4ade80" />
                    <h3>Identified Superpowers ({assessment.superpowers?.length || 1})</h3>
                  </div>
                  <div className="insight-items-list">
                    {(assessment.superpowers || []).map((sp, i) => (
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
                    <h3>Critical Growth Focus Areas ({assessment.growthAreas?.length || 1})</h3>
                  </div>
                  <div className="insight-items-list">
                    {(assessment.growthAreas || []).map((ga, i) => (
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

              {/* Matched Content Games Section */}
              <div className="matched-games-section glass">
                <div className="section-title-row">
                  <div>
                    <h2>Content Games Matched to Your Skills</h2>
                    <p>These game modules have been automatically filtered and prioritized to address your diagnosed skill gaps.</p>
                  </div>
                  <div className="games-count-badge">
                    <Gamepad2 size={16} />
                    <span>{roadmap?.recommendedGames?.length || 3} Games Matched</span>
                  </div>
                </div>

                <div className="matched-games-grid">
                  {(roadmap?.recommendedGames || []).map((game) => (
                    <div key={game.id} className="matched-game-card glass-card">
                      <div className="mgc-header">
                        <span className={`mgc-priority ${game.priority === 'Urgent Focus' ? 'urgent' : (game.priority === 'Mastery Challenge' ? 'mastery' : 'recommended')}`}>
                          {game.priority}
                        </span>
                        <span className="mgc-category">{game.category}</span>
                      </div>

                      <h3 className="mgc-title">{game.name}</h3>
                      <p className="mgc-reason">{game.reason}</p>

                      <div className="mgc-footer">
                        <span className="mgc-rec-level">Recommended: Level {game.recommendedLevel || 1}</span>
                        <button
                          className="btn btn-primary btn-sm play-game-btn"
                          onClick={() => {
                            if (onLaunchGame) {
                              onLaunchGame(game);
                            } else if (onNavigateTab) {
                              onNavigateTab('gamezone');
                            }
                          }}
                        >
                          <Gamepad2 size={15} />
                          <span>Play Game</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic 4-Phase Roadmap Timeline */}
              <div className="roadmap-timeline-section glass">
                <div className="roadmap-timeline-header">
                  <div>
                    <h2>Dynamic 4-Phase Learning Roadmap Under Performance</h2>
                    <p>Milestone schedule calibrated to bridge skill gaps and achieve {roadmap?.targetRole || 'Mastery'}.</p>
                  </div>
                  <div className="roadmap-duration-chip">
                    <Clock size={16} />
                    <span>Estimated: {roadmap?.estimatedWeeks || 8} Weeks Acceleration</span>
                  </div>
                </div>

                <div className="phases-timeline-list">
                  {(roadmap?.phases || []).map((phase) => {
                    const isInProgress = phase.status === 'In Progress';
                    const isNext = phase.status === 'Next Up';
                    const isLocked = phase.status === 'Locked';

                    return (
                      <div
                        key={phase.phaseNumber}
                        className={`phase-card glass-card ${isInProgress ? 'in-progress' : (isLocked ? 'locked' : '')}`}
                      >
                        <div className="phase-card-top">
                          <div className="phase-badge-left">
                            <div className="phase-num-circle">{phase.phaseNumber}</div>
                            <h3 className="phase-title-text">{phase.title}</h3>
                          </div>
                          <span className={`phase-status-pill ${isInProgress ? 'in-progress' : (isNext ? 'next-up' : 'locked')}`}>
                            {isInProgress && <Check size={14} />}
                            {isLocked && <Lock size={14} />}
                            <span>{phase.status}</span>
                          </span>
                        </div>

                        <div className="phase-focus-row">
                          <Target size={16} />
                          <span>Focus Competency: {phase.focusArea} ({phase.weeks})</span>
                        </div>

                        <ul className="phase-goals-list">
                          {(phase.goals || []).map((goal, gIdx) => (
                            <li key={gIdx}>{goal}</li>
                          ))}
                        </ul>

                        <div className="phase-deliverables-grid">
                          <div className="deliverable-box glass-inner">
                            <span className="del-label"><BookOpen size={13} /> Recommended Course</span>
                            <span className="del-value">{phase.recommendedCourse}</span>
                          </div>

                          <div className="deliverable-box glass-inner">
                            <span className="del-label"><Gamepad2 size={13} /> Matched Game Drill</span>
                            <span className="del-value">{phase.matchedGame}</span>
                          </div>

                          <div className="deliverable-box glass-inner">
                            <span className="del-label"><Award size={13} /> Success Criteria</span>
                            <span className="del-value text-green-400">{phase.successMetric}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════
          TAB 2: ACADEMIC GRADES & SUBJECT MASTERY (TRADITIONAL VIEW)
          ═════════════════════════════════════════════════════════════════════════ */}
      {activeMainTab === 'academic' && (
        <div className="academic-subview-wrapper">
          {/* Top Banner Header */}
          <div className="performance-header-banner glass">
            <div className="banner-top-row">
              <div className="analytics-badge">
                <TrendingUp size={16} color="#4ade80" />
                <span>Academic Grade Standing</span>
              </div>
              <span className="class-standing-tag">{user?.academicDetail || 'Class 12th Science (CBSE)'}</span>
            </div>

            <div className="banner-main-grid">
              <div className="main-grade-box glass-inner">
                <span className="grade-title font-semibold">Overall Academic Grade</span>
                <div className="grade-value-row">
                  <h1 className="grade-letter gradient-text">{performanceData.overallGrade}</h1>
                  <div className="grade-details">
                    <span className="percent-val">{performanceData.overallPercentage}% Score</span>
                    <span className="rank-text">{performanceData.classRank}</span>
                  </div>
                </div>
              </div>

              <div className="metrics-cards-grid">
                <div className="metric-mini-card glass-inner">
                  <Target size={22} color="#06b6d4" />
                  <div>
                    <span className="metric-label">Quiz Accuracy</span>
                    <p className="metric-val">{performanceData.quizAccuracy}%</p>
                  </div>
                </div>

                <div className="metric-mini-card glass-inner">
                  <Clock size={22} color="var(--primary)" />
                  <div>
                    <span className="metric-label">Total Study Time</span>
                    <p className="metric-val">{performanceData.totalStudyHours} Hours</p>
                  </div>
                </div>

                <div className="metric-mini-card glass-inner">
                  <Flame size={22} color="#f97316" />
                  <div>
                    <span className="metric-label">Weekly Streak</span>
                    <p className="metric-val">{performanceData.weeklyStreak}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Performance Coach Insights Box */}
          <div className="ai-coach-card glass">
            <div className="coach-header">
              <div className="coach-sparkle-icon">
                <Sparkles size={20} color="var(--primary)" />
              </div>
              <div>
                <h3>Performance Insights</h3>
                <p>Analysis based on your completed tests and quiz accuracy.</p>
              </div>
            </div>

            <div className="coach-insights-grid">
              <div className="insight-item glass-inner positive">
                <CheckCircle2 size={18} color="#4ade80" />
                <div>
                  <strong>Top Subject Strength: Computer Science (98%)</strong>
                  <p>You are in the top 1% of students for Python Data Structures and File I/O.</p>
                </div>
              </div>

              <div className="insight-item glass-inner recommendation">
                <AlertCircle size={18} color="#f59e0b" />
                <div>
                  <strong>Action Item: Practice 3D Vectors & Wave Optics</strong>
                  <p>Spending 25 minutes on 3D Geometry Vectors can boost your Overall Grade to 96%.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subject-Wise Performance Breakdown */}
          <div className="subject-performance-section glass">
            <div className="section-header-row">
              <div>
                <h2>Subject Mastery Breakdown</h2>
                <p className="sub-desc">Detailed analytics across your subjects</p>
              </div>

              <div className="subject-filter-pills">
                {['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry'].map(subj => (
                  <button
                    key={subj}
                    className={`subject-pill ${activeSubjectTab === subj ? 'active' : ''}`}
                    onClick={() => setActiveSubjectTab(subj)}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            <div className="subjects-grid">
              {filteredSubjects.map((subject, idx) => (
                <div key={idx} className="subject-card glass-card">
                  <div className="subj-card-header">
                    <h3 className="subj-name">{subject.name}</h3>
                    <span className="subj-grade-badge" style={{ backgroundColor: `${subject.color}25`, color: subject.color }}>
                      Grade {subject.grade} ({subject.score}%)
                    </span>
                  </div>

                  <div className="subj-progress-bg">
                    <div
                      className="subj-progress-fill"
                      style={{ width: `${subject.score}%`, backgroundColor: subject.color }}
                    ></div>
                  </div>

                  <div className="subj-topics-container">
                    <div className="topic-block strong">
                      <span className="topic-block-title text-green-400">
                        <CheckCircle2 size={14} color="#4ade80" /> Strongest Mastery
                      </span>
                      <ul>
                        {subject.strongTopics.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="topic-block weak">
                      <span className="topic-block-title text-amber-400">
                        <AlertCircle size={14} color="#f59e0b" /> Focus Improvement Area
                      </span>
                      <ul>
                        {subject.weakTopics.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="subj-card-footer">
                    <span className="tests-count-text">{subject.testsTaken} Quizzes & Unit Tests Completed</span>
                    <button
                      className="btn-practice-topic"
                      onClick={() => alert(`Launching practice session for ${subject.name}`)}
                    >
                      Practice Weak Topics <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Test History Log */}
          <div className="test-history-section glass">
            <div className="history-header-row">
              <div className="history-title">
                <BarChart2 size={20} color="var(--primary)" />
                <h3>Recent Test & Assessment History</h3>
              </div>
              <span className="total-tests-badge">39 Tests Evaluated</span>
            </div>

            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Test / Quiz Title</th>
                    <th>Subject</th>
                    <th>Date Taken</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.testHistory.map(test => (
                    <tr key={test.id}>
                      <td className="font-semibold text-main">{test.title}</td>
                      <td><span className="subject-tag">{test.subject}</span></td>
                      <td className="text-muted">{test.date}</td>
                      <td className="font-bold text-main">{test.score}</td>
                      <td>
                        <span className={`percent-badge ${test.percent >= 90 ? 'high' : 'medium'}`}>
                          {test.percent}%
                        </span>
                      </td>
                      <td><span className="status-passed-badge">{test.status}</span></td>
                      <td>
                        <button
                          className="btn-review-test"
                          onClick={() => alert(`Reviewing test results for: ${test.title}`)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformancePage;
