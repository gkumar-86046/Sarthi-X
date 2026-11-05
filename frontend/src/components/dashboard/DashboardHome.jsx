import React, { useState, useEffect } from 'react';
import '../../pages/PerformanceRoadmap.css';
import {
  BookOpen, Clock, Award, TrendingUp, Play, Calendar,
  Sparkles, ArrowRight, CheckCircle2, Loader2, Brain, Zap, Target
} from 'lucide-react';
import { getDashboardSummary } from '../../services/api';

const ICON_MAP = {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
};

const DashboardHome = ({ user, onNavigateTab, onStartTest }) => {
  const [stats, setStats] = useState([]);
  const [courses, setCourses] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const studentName = user?.fullName || user?.full_name || 'Govind Sharma';
  const studentTrack = user?.academicDetail || user?.academic_detail || 'Sarathi-X Curriculum';

  useEffect(() => {
    let isMounted = true;

    const fetchRealDashboard = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardSummary();
        if (isMounted && data.success) {
          if (data.stats) {
            setStats(data.stats.map(s => ({
              ...s,
              icon: ICON_MAP[s.icon] || BookOpen,
            })));
          }
          if (data.courses) {
            setCourses(data.courses);
          }
          if (data.upcomingClasses) {
            setUpcomingClasses(data.upcomingClasses);
          }
          if (data.aiRecommendation) {
            setAiRecommendation(data.aiRecommendation);
          }
        }
      } catch (err) {
        console.warn('Dashboard real-time API error:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRealDashboard();
    return () => { isMounted = false; };
  }, [user]);

  return (
    <div className="dashboard-home">
      {/* Welcome Banner */}
      <div className="welcome-banner glass">
        <div className="banner-content">
          <div className="banner-badge">
            <Sparkles size={16} />
            <span>Learning Guide Active</span>
          </div>
          <h2>Welcome back, <span className="gradient-text">{studentName}</span>!</h2>
          <p>
            You are enrolled in <strong>{studentTrack}</strong>.
            Real-time track progress synchronized with MySQL backend.
          </p>
          <div className="banner-actions">
            <button className="btn btn-primary" onClick={() => onNavigateTab('courses')}>
              <span>View My Courses</span>
              <Play size={18} />
            </button>
            <button className="btn btn-outline" onClick={() => onNavigateTab('profile')}>
              <span>View Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* ML Diagnostic Test Hero Callout */}
      <div className="dashboard-skill-banner glass">
        <div className="dsb-left">
          <div className="dsb-badge">
            <Brain size={14} />
            <span>SKILL ASSESSMENT & STUDY ROADMAP</span>
          </div>
          <h3>Assess Your Skills & Get Your Personalized Learning Path</h3>
          <p>
            Take our 10-minute diagnostic test across Quantitative Aptitude, Logic, Technical, and Problem Solving.
            Get a tailored 8-week structured roadmap with practice exercises and milestones.
          </p>
        </div>
        <div className="dsb-right">
          <button className="btn btn-primary dsb-btn" onClick={() => onStartTest ? onStartTest() : onNavigateTab('skilltest')}>
            <Brain size={18} />
            <span>Take Diagnostic Test</span>
            <ArrowRight size={16} />
          </button>
          <button className="btn btn-outline dsb-sub-btn" onClick={() => onNavigateTab('performance')}>
            <Target size={16} />
            <span>View My Roadmap</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="courses-loading-state glass" style={{ padding: '40px', textAlign: 'center' }}>
          <Loader2 size={36} className="spin-loader" />
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading live database metrics...</p>
        </div>
      ) : (
        <>
          {/* Quick Stats Grid */}
          <div className="stats-grid">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="stat-card glass-card">
                  <div className="stat-header">
                    <span className="stat-title">{s.title}</span>
                    <div className="stat-icon-wrapper" style={{ color: s.color, background: `${s.color}18` }}>
                      <Icon size={22} />
                    </div>
                  </div>
                  <h3 className="stat-value">{s.value}</h3>
                </div>
              );
            })}
          </div>

          {/* Main Grid: Enrolled Courses & Sidebar Widgets */}
          <div className="dashboard-content-grid">
            {/* Left Column: Enrolled Courses */}
            <div className="courses-section">
              <div className="section-header">
                <h3>My Active Courses ({courses.length})</h3>
                <button className="view-all-btn" onClick={() => onNavigateTab('courses')}>
                  View All <ArrowRight size={16} />
                </button>
              </div>

              {courses.length === 0 ? (
                <div className="courses-empty-card glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                  <BookOpen size={36} color="var(--primary)" />
                  <h4 style={{ margin: '10px 0 6px 0' }}>No Enrolled Courses Yet</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Explore faculty-uploaded modules and enroll in your first course.</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '12px' }} onClick={() => onNavigateTab('courses')}>
                    Browse All Courses
                  </button>
                </div>
              ) : (
                <div className="courses-list">
                  {courses.map(course => (
                    <div key={course.id} className="course-progress-card glass">
                      <div className="course-card-top">
                        <div>
                          <span className="course-tag">{course.category || course.subject}</span>
                          <h4 className="course-title">{course.title}</h4>
                          <p className="course-instructor">Instructor: {course.instructor}</p>
                        </div>
                        <div className="progress-badge">{course.progress}%</div>
                      </div>

                      <div className="course-progress-bar-bg">
                        <div className="course-progress-bar-fill" style={{ width: `${course.progress}%` }}></div>
                      </div>

                      <div className="course-card-bottom">
                        <span className="next-lesson">
                          <CheckCircle2 size={16} color="var(--primary)" />
                          Next: {course.nextTopic || 'Continue Next Lesson'}
                        </span>
                        <button className="btn-resume" onClick={() => onNavigateTab('courses')}>
                          Continue <Play size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Upcoming & Recommendations */}
            <div className="dashboard-widgets">
              {/* Upcoming Live Classes */}
              <div className="widget-card glass">
                <div className="widget-header">
                  <Calendar size={20} color="var(--accent)" />
                  <h4>Upcoming Live Sessions ({upcomingClasses.length})</h4>
                </div>

                <div className="live-classes-list">
                  {upcomingClasses.map(cls => (
                    <div key={cls.id} className="live-class-item glass-inner">
                      <div>
                        <h5>{cls.title}</h5>
                        <p className="live-time">{cls.time}</p>
                      </div>
                      <button className="join-btn">Join</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendation Widget */}
              {aiRecommendation && (
                <div className="widget-card glass ai-recommend-card">
                  <div className="widget-header">
                    <Sparkles size={20} color="var(--primary)" />
                    <h4>Recommended Study Tip</h4>
                  </div>
                  <p className="ai-tip-text">
                    {aiRecommendation.text}
                  </p>
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '10px' }} onClick={() => onNavigateTab('aimentor')}>
                    {aiRecommendation.action}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
