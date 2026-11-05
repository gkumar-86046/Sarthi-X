/**
 * admin/src/pages/Performance/StudentPerformance.jsx
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Award,
  Eye,
  Loader2,
  BrainCircuit,
  BarChart2,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import { getPerformanceAnalytics } from '../../services/api';
import { formatDate, formatScore } from '../../utils/formatters';
import '../../styles/performance.css';

const StudentPerformance = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedScoreTier, setSelectedScoreTier] = useState('all');
  const [activeStudentModal, setActiveStudentModal] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await getPerformanceAnalytics();
      if (res?.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load performance analytics', err);
    } finally {
      setIsLoading(false);
    }
  };

  const competencies = data?.competencies || [];
  const archetypes = data?.archetypes || [];
  const overall = data?.overall || {};

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    const list = data?.submissions || [];
    return list.filter((sub) => {
      const matchSearch =
        sub.studentName.toLowerCase().includes(search.toLowerCase()) ||
        sub.email.toLowerCase().includes(search.toLowerCase()) ||
        sub.archetype.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (selectedScoreTier === 'high') return sub.scorePercent >= 80;
      if (selectedScoreTier === 'mid') return sub.scorePercent >= 60 && sub.scorePercent < 80;
      if (selectedScoreTier === 'low') return sub.scorePercent < 60;
      return true;
    });
  }, [data?.submissions, search, selectedScoreTier]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
        <Loader2 size={36} className="spin" color="var(--primary)" />
        <p style={{ color: 'var(--text-muted)' }}>Loading performance analytics...</p>
      </div>
    );
  }

  return (
    <div className="performance-page">
      {/* Top Aggregates */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Overall Diagnostic Average"
          value={formatScore(overall.avgScore)}
          icon={TrendingUp}
          color="#6366f1"
          subtitle="Across all evaluated students"
        />
        <StatCard
          title="Peak Student Score"
          value={formatScore(overall.maxScore)}
          icon={Award}
          color="#10b981"
          subtitle="Highest achieved assessment percentage"
        />
        <StatCard
          title="Total Evaluated Tests"
          value={overall.totalSubmissions || 0}
          icon={BrainCircuit}
          color="#8b5cf6"
          subtitle="Completed student assessments"
        />
      </div>

      {/* 5-Domain Core Competencies Analysis */}
      <div className="glass-card section-card" style={{ marginBottom: '24px' }}>
        <div className="section-header">
          <div>
            <h3>5-Competency Domain Benchmarking</h3>
            <p>Average student proficiency scores compared against industry qualification standards</p>
          </div>
          <BarChart2 size={20} color="var(--secondary)" />
        </div>

        <div className="competency-grid">
          {competencies.map((c) => {
            const isExceeding = c.score >= c.benchmark;
            const fillColor = isExceeding ? '#10b981' : c.score >= 50 ? '#6366f1' : '#f59e0b';
            return (
              <div key={c.domain} className="competency-card">
                <div className="competency-header">
                  <span className="competency-name">{c.domain}</span>
                  <Badge variant={isExceeding ? 'success' : 'neutral'} size="sm">
                    {isExceeding ? 'Above Benchmark' : 'Developing'}
                  </Badge>
                </div>
                <div className="competency-score">{c.score}%</div>
                <div className="competency-progress-track">
                  <div
                    className="competency-progress-fill"
                    style={{ width: `${Math.min(c.score, 100)}%`, background: fillColor }}
                  />
                </div>
                <div className="competency-benchmark">
                  <span>Industry Std: {c.benchmark}%</span>
                  <span>{c.score >= c.benchmark ? `+${(c.score - c.benchmark).toFixed(1)}%` : `${(c.score - c.benchmark).toFixed(1)}%`}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Archetype Clustering */}
        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            Learner Profile Distribution
          </h4>
          <div className="archetypes-pill-grid">
            {archetypes.map((arch) => (
              <div key={arch.archetype} className="archetype-box">
                <span className="archetype-title">{arch.archetype}</span>
                <span className="archetype-count">{arch.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions Roster */}
      <div className="glass-card section-card">
        <div className="section-header">
          <div>
            <h3>Student Diagnostic Submissions</h3>
            <p>Individual student breakdown across all 5 cognitive & technical competencies</p>
          </div>
        </div>

        {/* Search & Filter row */}
        <div className="filter-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search student by name, email, or archetype..."
            width="360px"
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'high', 'mid', 'low'].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedScoreTier(tier)}
                className={`btn btn-sm ${selectedScoreTier === tier ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tier === 'all' && 'All Tiers'}
                {tier === 'high' && 'High (>80%)'}
                {tier === 'mid' && 'Medium (60-80%)'}
                {tier === 'low' && 'Needs Growth (<60%)'}
              </button>
            ))}
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
            No student assessment records match your criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course / Stream</th>
                  <th>Overall Score</th>
                  <th>Archetype</th>
                  <th>Domain Breakdown</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: '#818cf8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            flexShrink: 0,
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                          }}
                        >
                          {sub.studentName?.[0] || 'S'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sub.studentName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{sub.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {sub.course}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: sub.scorePercent >= 80 ? '#34d399' : sub.scorePercent >= 60 ? '#facc15' : '#f87171',
                        }}
                      >
                        {sub.scorePercent}%
                      </span>
                    </td>
                    <td>
                      <Badge variant="primary" size="sm">
                        {sub.archetype}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', fontSize: '0.74rem' }}>
                        <span title="Aptitude" style={{ color: '#a5b4fc' }}>Apt: {sub.scores.aptitude}%</span>
                        <span style={{ color: 'var(--border-subtle)' }}>|</span>
                        <span title="Logic" style={{ color: '#c4b5fd' }}>Log: {sub.scores.logic}%</span>
                        <span style={{ color: 'var(--border-subtle)' }}>|</span>
                        <span title="Technical" style={{ color: '#67e8f9' }}>Tech: {sub.scores.technical}%</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {formatDate(sub.date)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveStudentModal(sub)}
                        title="View Detailed Skill Profile"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeStudentModal && (
        <Modal
          isOpen={!!activeStudentModal}
          onClose={() => setActiveStudentModal(null)}
          title={`Diagnostic Profile: ${activeStudentModal.studentName}`}
          subtitle={`${activeStudentModal.email} • ${activeStudentModal.course}`}
          maxWidth="600px"
        >
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Archetype</span>
              <h3 style={{ margin: '4px 0 0 0', color: 'var(--primary)', fontSize: '1.25rem' }}>
                {activeStudentModal.archetype}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Score</span>
              <h2 style={{ margin: '4px 0 0 0', color: '#34d399', fontSize: '1.7rem' }}>
                {activeStudentModal.scorePercent}%
              </h2>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Competency Radar Scores
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(activeStudentModal.scores).map(([key, val]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span style={{ fontWeight: 600 }}>{val}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${val}%`,
                      background: val >= 75 ? '#10b981' : val >= 50 ? '#6366f1' : '#f59e0b',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setActiveStudentModal(null)}>
              Close Window
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentPerformance;

