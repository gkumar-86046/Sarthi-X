/**
 * admin/src/pages/Dashboard/Dashboard.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Video,
  Award,
  TrendingUp,
  Sparkles,
  Plus,
  ArrowRight,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { getDashboardStats } from '../../services/api';
import { formatNumber, formatScore, formatDate, getEducationLevelLabel, getTierColor } from '../../utils/formatters';
import '../../styles/dashboard.css';

const Dashboard = ({ onNavigate }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await getDashboardStats();
      if (res?.success) {
        setData(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
        <Loader2 size={36} className="spin" color="var(--primary)" />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading dashboard...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const tierDist = data?.tierDistribution || {};
  const recentAssessments = data?.recentAssessments || [];
  const recentCourses = data?.recentCourses || [];

  const totalTierCount = Object.values(tierDist).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="dashboard-page">
      {error && (
        <div style={{ padding: '12px 18px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}
      {/* Quick Action Top Banner */}
      <div className="quick-actions-bar">
        <div className="info-side">
          <h4>Learning Administration</h4>
          <p>Manage courses, review student assessments, and update content.</p>
        </div>
        <div className="actions-side">
          <button className="btn btn-primary" onClick={() => onNavigate('content')}>
            <Plus size={16} />
            <span>Upload New Lecture</span>
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('performance')}>
            <TrendingUp size={16} />
            <span>View Performance</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Registered Students"
          value={formatNumber(metrics.totalStudents)}
          change={`+${metrics.activeStudents} Active`}
          icon={Users}
          color="#6366f1"
          subtitle="All enrolled students"
        />
        <StatCard
          title="Published Courses"
          value={formatNumber(metrics.totalCourses)}
          icon={BookOpen}
          color="#8b5cf6"
          subtitle={`${metrics.totalModules || 0} modules active`}
        />
        <StatCard
          title="Content Items & Lectures"
          value={formatNumber(metrics.totalLessons)}
          icon={Video}
          color="#06b6d4"
          subtitle="Videos, notes & quizzes"
        />
        <StatCard
          title="Avg. Diagnostic Score"
          value={formatScore(metrics.averageDiagnosticScore)}
          icon={Award}
          color="#10b981"
          subtitle={`${metrics.totalAssessments || 0} tests completed`}
        />
      </div>

      {/* Split Section: Recent Diagnostic Tests & Demographics */}
      <div className="dashboard-split-layout">
        {/* Left: Recent Student Assessments */}
        <div className="glass-card section-card">
          <div className="section-header">
            <div>
              <h3>Recent Assessments</h3>
              <p>Latest student test submissions and results</p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('performance')}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {recentAssessments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
              No assessment records yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Tier</th>
                    <th>Score</th>
                    <th>Archetype</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssessments.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'rgba(99, 102, 241, 0.15)',
                              color: '#818cf8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              flexShrink: 0,
                              border: '1px solid rgba(99, 102, 241, 0.25)',
                            }}
                          >
                            {a.studentName?.[0] || 'S'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{a.studentName}</div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>{a.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge variant="neutral" size="sm">
                          {getEducationLevelLabel(a.educationLevel)}
                        </Badge>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: a.scorePercent >= 70 ? '#34d399' : '#facc15' }}>
                          {a.scorePercent}%
                        </span>
                      </td>
                      <td>
                        <Badge variant="secondary" size="sm">
                          {a.archetype}
                        </Badge>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {formatDate(a.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Academic Tier Breakdown & Highlights */}
        <div className="glass-card section-card">
          <div className="section-header">
            <div>
              <h3>Student Demographics</h3>
              <p>Enrollment by academic level</p>
            </div>
            <GraduationCap size={20} color="var(--primary)" />
          </div>

          <div style={{ marginTop: '10px' }}>
            {['graduation', 'intermediate', 'highschool', 'nursery'].map((tier) => {
              const count = tierDist[tier] || 0;
              const pct = Math.round((count / totalTierCount) * 100);
              const color = getTierColor(tier);

              return (
                <div key={tier} className="tier-bar-row">
                  <div className="tier-bar-info">
                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>
                      {getEducationLevelLabel(tier)}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="tier-bar-track">
                    <div
                      className="tier-bar-fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: '28px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} color="var(--accent)" />
              <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>System Status</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              All services are running normally. Assessment scoring and roadmap generation are active.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Courses Overview */}
      <div className="glass-card section-card">
        <div className="section-header">
          <div>
            <h3>Courses</h3>
            <p>Active course catalog with modules and lesson counts</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('content')}>
            <span>Manage Content</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {recentCourses.map((c) => (
            <div
              key={c.id}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Badge variant="primary" size="sm">{c.courseCode}</Badge>
                  <span style={{ fontSize: '0.8rem', color: '#facc15', fontWeight: 600 }}>★ {c.rating}</span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {c.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {c.subject} • {c.instructor}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.78rem',
                  color: 'var(--text-dim)',
                }}
              >
                <span>{c.modules} Modules</span>
                <span>{c.lessons} Lessons / Notes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

