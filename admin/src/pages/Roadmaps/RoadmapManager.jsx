/**
 * admin/src/pages/Roadmaps/RoadmapManager.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Milestone,
  Clock,
  Eye,
  Loader2,
} from 'lucide-react';
import { getRoadmaps } from '../../services/api';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import '../../styles/roadmaps.css';

const RoadmapManager = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalRoadmap, setActiveModalRoadmap] = useState(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    setIsLoading(true);
    try {
      const res = await getRoadmaps();
      if (res?.success) {
        setRoadmaps(res.roadmaps || []);
      }
    } catch (err) {
      console.error('Failed to load roadmaps', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
        <Loader2 size={36} className="spin" color="var(--primary)" />
        <p style={{ color: 'var(--text-muted)' }}>Loading career roadmaps...</p>
      </div>
    );
  }

  return (
    <div className="roadmaps-page">
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 6px 0' }}>
            Student Career Roadmaps
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            Structured learning roadmaps tailored to student diagnostic assessments and career targets
          </p>
        </div>
      </div>

      {roadmaps.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
          <Compass size={44} style={{ margin: '0 auto 14px auto', opacity: 0.5 }} />
          <h3>No roadmaps active</h3>
          <p>Roadmaps will automatically appear once students complete diagnostic evaluations.</p>
        </div>
      ) : (
        <div className="roadmaps-grid">
          {roadmaps.map((r) => {
            const currentPhase = r.currentPhase || 1;
            const totalPhases = r.totalPhases || r.phases?.length || 4;
            const progressPct = Math.round((currentPhase / totalPhases) * 100);

            return (
              <div key={r.id} className="glass-card roadmap-card">
                <div>
                  <div className="roadmap-header">
                    <div>
                      <h3>{r.targetRole || r.title}</h3>
                      <p>
                        Student: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{r.studentName}</span>
                      </p>
                    </div>
                    <Badge variant={r.status === 'completed' ? 'success' : 'primary'} size="sm">
                      {r.status?.toUpperCase() || 'ACTIVE'}
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', color: 'var(--text-muted)', margin: '10px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} color="var(--info)" />
                      <span>{r.estimatedWeeks || 8} Weeks</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Milestone size={14} color="var(--secondary)" />
                      <span>{totalPhases} Milestone Phases</span>
                    </div>
                  </div>

                  <div className="roadmap-progress-bar-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Trajectory Progress</span>
                      <span style={{ fontWeight: 600, color: '#fff' }}>Phase {currentPhase} of {totalPhases}</span>
                    </div>
                    <div style={{ height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${progressPct}%`,
                          background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
                          borderRadius: '999px',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Generated {formatDate(r.createdAt)}
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setActiveModalRoadmap(r)}
                  >
                    <Eye size={14} />
                    <span>View Curriculum Phases</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Roadmap Detail Modal */}
      {activeModalRoadmap && (
        <Modal
          isOpen={!!activeModalRoadmap}
          onClose={() => setActiveModalRoadmap(null)}
          title={`Learning Path: ${activeModalRoadmap.targetRole || activeModalRoadmap.title}`}
          subtitle={`Student: ${activeModalRoadmap.studentName} (${activeModalRoadmap.email})`}
          maxWidth="700px"
        >
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Estimated Duration: <strong>{activeModalRoadmap.estimatedWeeks || 8} Weeks</strong> • Status: <strong>{activeModalRoadmap.status?.toUpperCase()}</strong>
            </span>
          </div>

          <div className="phases-timeline-list">
            {activeModalRoadmap.phases?.map((p, idx) => (
              <div key={idx} className="phase-item-box">
                <div className="phase-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                      {p.name || p.phase_name || `Phase ${idx + 1}`}
                    </span>
                  </div>
                  <Badge variant={idx === 0 ? 'primary' : 'neutral'} size="sm">
                    {p.duration || '2-3 Weeks'}
                  </Badge>
                </div>

                <p style={{ margin: '8px 0 0 32px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {p.description || p.focus_areas?.join(', ') || 'Core skill milestones and foundational coursework.'}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setActiveModalRoadmap(null)}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RoadmapManager;

