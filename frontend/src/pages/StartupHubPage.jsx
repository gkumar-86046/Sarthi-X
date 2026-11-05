import React from 'react';
import {
  Rocket, Lightbulb, Users, Presentation, ExternalLink, PlayCircle,
  Briefcase, Plus, CheckCircle2, TrendingUp, Sparkles, Clock, Target
} from 'lucide-react';

const StartupHubPage = ({ user }) => {
  const incubatorPrograms = [
    {
      name: 'Sarathi-X Seed Fund',
      tags: ['Fintech', 'EdTech'],
      status: 'Open',
      funding: 'Up to $10k',
      deadline: '15 Days Left'
    },
    {
      name: 'Y-Combinator Student Track',
      tags: ['Global', 'AI & SaaS'],
      status: 'Closing Soon',
      funding: 'Mentorship & $500k',
      deadline: '4 Days Left'
    },
    {
      name: 'GreenTech Innovators Accelerator',
      tags: ['CleanTech', 'Hardware'],
      status: 'Reviewing',
      funding: 'Up to $50k',
      deadline: 'In Review'
    }
  ];

  const milestones = [
    { title: 'Market Research & Validation', status: 'completed', desc: '120 student surveys collected' },
    { title: 'Problem / Solution Fit', status: 'completed', desc: 'Value proposition benchmarked' },
    { title: 'MVP Development', status: 'active', desc: 'React + Node prototype in progress (65%)' },
    { title: 'Beta Launch & First 100 Users', status: 'pending', desc: 'Campus alpha testing cohort' }
  ];

  return (
    <div className="startup-page-container">
      {/* Header Banner */}
      <div className="startup-header-banner glass">
        <div className="banner-title-group">
          <div className="startup-icon-box">
            <Rocket size={26} color="#f59e0b" />
          </div>
          <div>
            <div className="startup-badge-row">
              <span className="startup-live-tag">
                <Sparkles size={12} color="#f59e0b" /> SARATHI-X STUDENT VENTURE HUB
              </span>
            </div>
            <h2>Student Startup & Incubation Hub</h2>
            <p>Validate your early-stage venture, access micro-grants, and connect with premier student accelerators.</p>
          </div>
        </div>

        <button className="new-pitch-btn">
          <Plus size={18} />
          <span>New Pitch Deck</span>
        </button>
      </div>

      <div className="startup-main-grid">
        {/* Left Column: My Startup Idea */}
        <div className="startup-left-col">
          <div className="idea-card glass">
            <div className="card-header">
              <div className="card-title-group">
                <Lightbulb size={20} color="#f59e0b" />
                <h3>Active Venture Project</h3>
              </div>
              <span className="idea-status-tag">Validation Phase</span>
            </div>

            <div className="idea-content glass-inner">
              <div className="idea-header-row">
                <div>
                  <h4 className="idea-title">EduSync — AI Cognitive Study Planner</h4>
                  <p className="idea-tagline">Target Domain: B2C EdTech & Adaptive Productivity</p>
                </div>
                <div className="readiness-pill">
                  <span className="readiness-label">Venture Readiness</span>
                  <span className="readiness-val">65%</span>
                </div>
              </div>

              <p className="idea-desc">
                An intelligent scheduling engine that maps semester syllabi into micro-learning sprints, dynamically balancing study blocks with real-time biometric fatigue indicators.
              </p>

              {/* Startup Vitals Mini Strip */}
              <div className="startup-vitals-row">
                <div className="s-vital-box">
                  <Target size={14} color="#06b6d4" />
                  <div>
                    <span className="s-vital-label">Target Market</span>
                    <span className="s-vital-val">Higher Ed & STEM</span>
                  </div>
                </div>
                <div className="s-vital-box">
                  <Users size={14} color="#a855f7" />
                  <div>
                    <span className="s-vital-label">Team Members</span>
                    <span className="s-vital-val">2 Founders</span>
                  </div>
                </div>
                <div className="s-vital-box">
                  <Clock size={14} color="#10b981" />
                  <div>
                    <span className="s-vital-label">Target Launch</span>
                    <span className="s-vital-val">Q4 2026</span>
                  </div>
                </div>
              </div>

              {/* Validation Roadmap Stepper */}
              <div className="startup-roadmap">
                <div className="roadmap-title-row">
                  <span className="roadmap-title">Incubation Roadmap (Stage 3 of 4)</span>
                  <span className="roadmap-progress">2/4 Milestones Achieved</span>
                </div>

                <div className="roadmap-timeline">
                  {milestones.map((m, idx) => (
                    <div key={idx} className={`roadmap-step ${m.status}`}>
                      <div className="step-icon-col">
                        {m.status === 'completed' && <CheckCircle2 size={18} className="icon-completed" />}
                        {m.status === 'active' && <PlayCircle size={18} className="icon-active" />}
                        {m.status === 'pending' && <div className="icon-pending"></div>}
                        {idx < milestones.length - 1 && <div className="step-line"></div>}
                      </div>
                      <div className="step-content">
                        <div className="step-title-row">
                          <span className="step-title">{m.title}</span>
                          <span className={`step-badge ${m.status}`}>{m.status}</span>
                        </div>
                        <p className="step-desc">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="idea-actions">
                <button className="action-btn-glass">
                  <Presentation size={16} /> Edit Pitch Deck
                </button>
                <button className="action-btn-glass primary">
                  <Users size={16} /> Find Student Co-founder
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Incubators & Mentorship */}
        <div className="startup-right-col">
          <div className="incubator-card glass">
            <div className="card-header">
              <div className="card-title-group">
                <Briefcase size={20} color="#06b6d4" />
                <h3>Active Incubator Programs</h3>
              </div>
              <span className="programs-count-badge">3 Opportunities</span>
            </div>

            <p className="incubator-sub">
              Curated acceleration cohorts and micro-grants available for authorized student founders.
            </p>

            <div className="programs-list">
              {incubatorPrograms.map((program, idx) => (
                <div key={idx} className="program-item glass-inner">
                  <div className="prog-header">
                    <div>
                      <h4 className="prog-name">{program.name}</h4>
                      <span className="prog-deadline">{program.deadline}</span>
                    </div>
                    <span className={`status-tag ${program.status === 'Open' ? 'open' : program.status === 'Closing Soon' ? 'closing' : 'reviewing'}`}>
                      {program.status}
                    </span>
                  </div>

                  <div className="prog-tags">
                    {program.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="prog-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="prog-footer">
                    <div className="funding-group">
                      <span className="funding-label">Funding / Support</span>
                      <span className="funding-text">{program.funding}</span>
                    </div>
                    <button className="apply-link-btn">
                      <span>Apply</span>
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupHubPage;
