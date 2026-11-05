/**
 * admin/src/pages/Students/StudentDirectory.jsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
} from 'lucide-react';
import { getStudents, toggleStudentStatus } from '../../services/api';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';
import { formatDate, getEducationLevelLabel, formatScore } from '../../utils/formatters';
import '../../styles/students.css';

const StudentDirectory = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [notification, setNotification] = useState(null);
  const [activeStudentModal, setActiveStudentModal] = useState(null);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getStudents(search, selectedLevel);
      if (res?.success) {
        setStudents(res.students || []);
      }
    } catch (err) {
      notify(err.message || 'Failed to load student directory', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedLevel]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleToggleStatus = async (student) => {
    try {
      const res = await toggleStudentStatus(student.id);
      if (res?.success) {
        notify(res.message);
        setStudents(
          students.map((s) => (s.id === student.id ? { ...s, isActive: res.isActive } : s))
        );
      }
    } catch (err) {
      notify(err.message || 'Failed to update student status', 'error');
    }
  };

  return (
    <div className="student-directory-page">
      <Notification notification={notification} onClose={() => setNotification(null)} />

      {/* Header controls */}
      <div className="students-header-controls">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search students by name, email, or mobile..."
            width="340px"
          />

          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'graduation', 'intermediate', 'highschool', 'nursery'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`btn btn-sm ${selectedLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
              >
                {getEducationLevelLabel(lvl)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Total Registered: <strong style={{ color: '#fff' }}>{students.length}</strong>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="glass-card section-card">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
            <Loader2 size={32} className="spin" color="var(--primary)" />
            <p style={{ marginTop: '12px' }}>Querying student registry...</p>
          </div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-dim)' }}>
            <Users size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
            <h3>No student records found</h3>
            <p>Try modifying your search query or level filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Academic Stream</th>
                  <th>Status</th>
                  <th>Enrollments</th>
                  <th>Diagnostic Score</th>
                  <th>Archetype</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
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
                          {s.fullName?.[0] || 'S'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.fullName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', gap: '8px' }}>
                            <span>{s.email}</span>
                            {s.mobile && <span>• {s.mobile}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant="neutral" size="sm">
                        {s.academicDetail || getEducationLevelLabel(s.educationLevel)}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className={`student-status-toggle ${s.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleStatus(s)}
                        title="Click to toggle account activation"
                      >
                        {s.isActive ? (
                          <>
                            <CheckCircle size={13} />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={13} />
                            <span>Suspended</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                        {s.enrolledCourses} Courses
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: s.diagnosticScore ? (s.diagnosticScore >= 70 ? '#34d399' : '#facc15') : 'var(--text-dim)' }}>
                        {formatScore(s.diagnosticScore)}
                      </span>
                    </td>
                    <td>
                      <Badge variant="primary" size="sm">
                        {s.archetype}
                      </Badge>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {formatDate(s.createdAt)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveStudentModal(s)}
                        title="View Full Profile Details"
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

      {/* Student View Modal */}
      {activeStudentModal && (
        <Modal
          isOpen={!!activeStudentModal}
          onClose={() => setActiveStudentModal(null)}
          title={`Student: ${activeStudentModal.fullName}`}
          subtitle={`Account Registered: ${formatDate(activeStudentModal.createdAt)}`}
          maxWidth="520px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Email Address</span>
              <strong style={{ color: 'var(--text-main)' }}>{activeStudentModal.email}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mobile Number</span>
              <strong style={{ color: 'var(--text-main)' }}>{activeStudentModal.mobile || 'Not provided'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Academic Standing</span>
              <strong style={{ color: 'var(--text-main)' }}>{activeStudentModal.academicDetail}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Diagnostic Score</span>
              <strong style={{ color: '#34d399' }}>{formatScore(activeStudentModal.diagnosticScore)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Archetype</span>
              <strong style={{ color: 'var(--primary)' }}>{activeStudentModal.archetype}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Account Status</span>
              <Badge variant={activeStudentModal.isActive ? 'success' : 'danger'} size="sm">
                {activeStudentModal.isActive ? 'Active Learner' : 'Deactivated'}
              </Badge>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setActiveStudentModal(null)}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentDirectory;

