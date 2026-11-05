import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, FileText, CheckCircle2, ChevronRight, Clock, Video,
  HelpCircle, X, ShieldCheck, Layers, Star, Loader2, Play, Lock, BookOpen,
  Sparkles, Check, ArrowRight, Eye
} from 'lucide-react';
import {
  getCourses,
  getCourseDetail,
  getPerfectLecture,
  enrollCourse,
  completeLesson
} from '../services/api';

const CoursesPage = ({ user }) => {
  const [coursesData, setCoursesData] = useState([]);
  const [subjectsList, setSubjectsList] = useState(['All Subjects']);
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourseModal, setActiveCourseModal] = useState(null);
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState(null);

  // Perfect Lecture State (O(1) fast lookup)
  const [activeLectureModal, setActiveLectureModal] = useState(null);
  const [isLectureLoading, setIsLectureLoading] = useState(false);
  const [isAdvancingLecture, setIsAdvancingLecture] = useState(false);

  // Student academic standard & isolated branch
  const studentStandard = user?.academicDetail || user?.academic_detail || 'Curriculum Courses';

  // ── 1. Fetch Profile-Targeted Courses ────────────────────────────────────────
  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getCourses({
        subject: selectedSubject,
        search: searchQuery,
      });

      if (res && res.success) {
        setCoursesData(res.courses || []);
        if (res.subjects && res.subjects.length > 0) {
          setSubjectsList(res.subjects);
        }
      }
    } catch (err) {
      console.warn('Real-time Courses API error:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubject, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchCourses]);

  // ── 2. Open Course Syllabus Detail ───────────────────────────────────────────
  const handleOpenCourse = async (course) => {
    try {
      setIsModalLoading(true);
      setActiveCourseModal(course);

      const res = await getCourseDetail(course.id);
      if (res && res.success && res.course) {
        setActiveCourseModal(res.course);
        if (res.course.modules && res.course.modules.length > 0) {
          setExpandedModuleId(res.course.modules[0].id);
        }
      }
    } catch (err) {
      console.warn('Failed to load course detail:', err.message);
    } finally {
      setIsModalLoading(false);
    }
  };

  // ── 3. Launch Perfect Lecture (O(1) Time & Space Algorithm) ───────────────────
  const handleLaunchPerfectLecture = async (courseId = null, subject = null) => {
    try {
      setIsLectureLoading(true);
      const res = await getPerfectLecture({
        course_id: courseId,
        subject: subject || (selectedSubject !== 'All Subjects' ? selectedSubject : null),
      });

      if (res && res.success && res.lecture) {
        setActiveLectureModal(res.lecture);
      } else {
        alert(res?.message || 'No lecture available yet for this subject.');
      }
    } catch (err) {
      alert(err.message || 'Failed to fetch perfect lecture.');
    } finally {
      setIsLectureLoading(false);
    }
  };

  // ── 4. Open Lecture from Syllabus List ───────────────────────────────────────
  const handleOpenSpecificLecture = (lesson, course, module) => {
    setActiveLectureModal({
      ...lesson,
      module: {
        id: String(module?.id || ''),
        moduleNumber: module?.moduleNumber || 1,
        title: module?.title || '',
      },
      course: {
        id: String(course?.id || ''),
        courseCode: course?.courseCode || '',
        title: course?.title || '',
        subject: course?.subject || '',
        instructor: course?.instructor || '',
        thumbnailBg: course?.thumbnailBg,
        isEnrolled: course?.isEnrolled || false,
      }
    });
  };

  // ── 5. Mark Done & Auto-Advance to Next Perfect Lecture ───────────────────────
  const handleAdvanceLecture = async () => {
    if (!activeLectureModal) return;
    const courseId = activeLectureModal.course?.id;
    const lessonId = activeLectureModal.id;

    try {
      setIsAdvancingLecture(true);
      await completeLesson(courseId, lessonId);

      // Fetch the next perfect lecture in O(1) time
      const nextRes = await getPerfectLecture({ course_id: courseId });
      if (nextRes && nextRes.success && nextRes.lecture) {
        setActiveLectureModal(nextRes.lecture);
      } else {
        setActiveLectureModal(prev => ({ ...prev, completed: true }));
      }
      fetchCourses();
    } catch (err) {
      alert(err.message || 'Failed to complete lesson.');
    } finally {
      setIsAdvancingLecture(false);
    }
  };

  // ── 6. Enroll Course ────────────────────────────────────────────────────────
  const handleEnroll = async (courseId) => {
    try {
      const res = await enrollCourse(courseId);
      if (res && res.success) {
        if (activeCourseModal && activeCourseModal.id === courseId) {
          setActiveCourseModal(prev => ({ ...prev, isEnrolled: true }));
        }
        if (activeLectureModal && activeLectureModal.course?.id === String(courseId)) {
          setActiveLectureModal(prev => ({
            ...prev,
            isLocked: false,
            course: { ...prev.course, isEnrolled: true }
          }));
        }
        fetchCourses();
      }
    } catch (err) {
      alert(err.message || 'Enrollment failed');
    }
  };

  // ── 7. Complete lesson from module list ──────────────────────────────────────
  const handleCompleteLessonDirect = async (courseId, lessonId) => {
    try {
      setActiveLessonId(lessonId);
      const res = await completeLesson(courseId, lessonId);
      if (res && res.success) {
        setActiveCourseModal(prev => {
          if (!prev) return null;
          const updatedModules = (prev.modules || []).map(m => ({
            ...m,
            lessons: (m.lessons || []).map(l =>
              l.id === lessonId ? { ...l, completed: true } : l
            )
          }));
          return {
            ...prev,
            progress: res.new_progress,
            modules: updatedModules,
          };
        });

        setCoursesData(prev =>
          prev.map(c =>
            c.id === String(courseId)
              ? { ...c, progress: res.new_progress }
              : c
          )
        );
      }
    } catch (err) {
      console.warn('Failed to mark lesson completed:', err.message);
    } finally {
      setActiveLessonId(null);
    }
  };

  return (
    <div className="courses-page-container">
      {/* Subject Filter Tabs & Perfect Lecture Launcher */}
      <div className="courses-filter-row glass">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search courses, syllabus modules, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="courses-search-input"
          />
        </div>

        <div className="subject-pills-container">
          {subjectsList.map(subj => (
            <button
              key={subj}
              className={`subject-pill ${selectedSubject === subj ? 'active' : ''}`}
              onClick={() => setSelectedSubject(subj)}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Global Perfect Lecture Quick Launcher */}
        <button
          className="btn btn-primary perfect-subject-btn"
          onClick={() => handleLaunchPerfectLecture(null, selectedSubject)}
          disabled={isLectureLoading || coursesData.length === 0}
          title="Play the optimal uncompleted lecture for your selected track"
        >
          {isLectureLoading ? <Loader2 size={16} className="spin-loader" /> : <Play size={16} />}
          <span>{selectedSubject === 'All Subjects' ? 'Play Perfect Lecture' : `Stream ${selectedSubject}`}</span>
        </button>
      </div>

      {/* Real-Time Courses Cards Grid */}
      {isLoading ? (
        <div className="courses-loading-state glass">
          <Loader2 size={36} className="spin-loader" />
          <p>Loading real-time curriculum for your profile from backend...</p>
        </div>
      ) : coursesData.length === 0 ? (
        <div className="courses-empty-state glass">
          <BookOpen size={42} color="var(--primary)" />
          <h3>No courses found for your branch</h3>
          <p>
            You are enrolled in <strong>{studentStandard}</strong>. Admin faculty will publish syllabus for your branch shortly.
          </p>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setSelectedSubject('All Subjects'); setSearchQuery(''); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="courses-grid">
          {coursesData.map(course => (
            <div key={course.id} className="course-card glass-card">
              <div
                className="course-card-banner"
                style={{ background: course.thumbnailBg || 'linear-gradient(135deg, rgba(99, 102, 241, 0.45), rgba(15, 23, 42, 0.95))' }}
              >
                <span className="subject-badge">{course.subject}</span>
                <span className="class-tag">{course.targetField || course.classStandard}</span>
              </div>

              <div className="course-card-body">
                <div>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="instructor-text">Faculty: {course.instructor}</p>
                </div>

                <div className="course-stats-row">
                  <span><Layers size={14} color="var(--primary)" /> {course.totalModules} Modules</span>
                  <span><Clock size={14} color="#06b6d4" /> {course.totalLessons} Lessons</span>
                  <span><Star size={14} color="#f59e0b" /> {course.rating}</span>
                </div>

                {/* Live Progress Bar */}
                <div className="course-progress-box">
                  <div className="progress-text-row">
                    <span>{course.isEnrolled ? 'Curriculum Progress' : 'Enrollment Status'}</span>
                    <span className="progress-percent">
                      {course.isEnrolled ? `${course.progress}%` : 'Available'}
                    </span>
                  </div>
                  <div className="course-bar-bg">
                    <div className="course-bar-fill" style={{ width: `${course.isEnrolled ? course.progress : 0}%` }}></div>
                  </div>
                </div>

                {/* Action Buttons: 1-Click Perfect Lecture + Curriculum Explorer */}
                <div className="course-card-footer-actions" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    className="btn btn-outline"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', padding: '10px 8px' }}
                    onClick={() => handleLaunchPerfectLecture(course.id, course.subject)}
                    title="Launch next uncompleted lecture with O(1) algorithm"
                  >
                    <Play size={14} color="#10b981" />
                    <span>Lecture</span>
                  </button>

                  <button
                    className="btn btn-primary"
                    style={{ flex: 1.3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', padding: '10px 8px' }}
                    onClick={() => handleOpenCourse(course)}
                  >
                    <span>Curriculum ({course.totalModules})</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 1. PERFECT LECTURE PLAYER MODAL (Fast O(1) Interactive Stream) ── */}
      {activeLectureModal && (
        <div className="modal-backdrop-courses" onClick={() => setActiveLectureModal(null)}>
          <div className="modal-content-courses glass" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveLectureModal(null)}>
              <X size={22} />
            </button>

            {/* Lecture Header */}
            <div className="modal-course-header" style={{ marginBottom: '20px' }}>
              <div className="modal-tags">
                <span className="subject-badge">{activeLectureModal.course?.subject}</span>
                <span className="class-tag">{activeLectureModal.module?.title || `Module ${activeLectureModal.module?.moduleNumber}`}</span>
                {activeLectureModal.completed ? (
                  <span className="done-badge" style={{ background: 'rgba(74, 222, 128, 0.15)', padding: '4px 10px', borderRadius: '8px' }}>
                    <CheckCircle2 size={14} color="#4ade80" /> Completed
                  </span>
                ) : (
                  <span className="status-next-up" style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                    🎯 Current Perfect Lecture
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '1.4rem', marginTop: '10px' }}>{activeLectureModal.title}</h2>
              <p className="instructor-sub">
                Course: <strong>{activeLectureModal.course?.title}</strong> • Faculty: {activeLectureModal.course?.instructor}
              </p>
            </div>

            {/* Interactive Player / Viewer */}
            <div className="lecture-player-viewport glass-inner" style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)' }}>
              {activeLectureModal.isLocked ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <Lock size={48} color="#f59e0b" style={{ margin: '0 auto 16px' }} />
                  <h3>Enrollment Required to Watch Full Lecture</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                    Join this branch course to unlock all video masterclasses, admin notes, and quizzes.
                  </p>
                  <button className="btn btn-primary" onClick={() => handleEnroll(activeLectureModal.course?.id)}>
                    Enroll Now (Free)
                  </button>
                </div>
              ) : activeLectureModal.type === 'video' ? (
                <div>
                  <video
                    controls
                    autoPlay
                    style={{ width: '100%', maxHeight: '380px', display: 'block', background: '#000' }}
                    src={activeLectureModal.contentUrl}
                    poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Duration: <strong>{activeLectureModal.duration || '30 mins'}</strong>
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Video size={14} /> HD 1080p Stream Ready
                    </span>
                  </div>
                </div>
              ) : activeLectureModal.type === 'pdf' ? (
                <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                  <FileText size={52} color="#06b6d4" style={{ margin: '0 auto 16px' }} />
                  <h3>Admin Verified Lecture Notes & Guide</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                    Download and study comprehensive handbook notes curated for {activeLectureModal.title}.
                  </p>
                  <a
                    href={activeLectureModal.contentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <FileText size={16} /> Open PDF Notes ({activeLectureModal.fileSize || '2.8 MB'})
                  </a>
                </div>
              ) : (
                <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                  <HelpCircle size={52} color="#f59e0b" style={{ margin: '0 auto 16px' }} />
                  <h3>Interactive Concept Assessment Quiz</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                    Test your understanding with {activeLectureModal.questionsCount || 15} practice questions.
                  </p>
                  <a
                    href={activeLectureModal.contentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <HelpCircle size={16} /> Start Quiz Assessment
                  </a>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setActiveLectureModal(null)}>
                Close Player
              </button>

              {!activeLectureModal.isLocked && (
                <button
                  className="btn btn-primary"
                  onClick={handleAdvanceLecture}
                  disabled={isAdvancingLecture}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
                >
                  {isAdvancingLecture ? (
                    <Loader2 size={16} className="spin-loader" />
                  ) : (
                    <Check size={16} />
                  )}
                  <span>{activeLectureModal.completed ? 'Continue Next Lecture' : 'Mark Done & Next Lecture'}</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. FULL CURRICULUM SYLLABUS MODAL ── */}
      {activeCourseModal && (
        <div className="modal-backdrop-courses" onClick={() => setActiveCourseModal(null)}>
          <div className="modal-content-courses glass" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveCourseModal(null)}>
              <X size={22} />
            </button>

            {/* Modal Header */}
            <div className="modal-course-header">
              <div className="modal-tags">
                <span className="subject-badge">{activeCourseModal.subject}</span>
                <span className="class-tag">{activeCourseModal.targetField || activeCourseModal.classStandard}</span>
                {activeCourseModal.isEnrolled ? (
                  <span className="enrolled-status-badge">Enrolled Student</span>
                ) : (
                  <button className="btn-enroll-action" onClick={() => handleEnroll(activeCourseModal.id)}>
                    Enroll Now (Free)
                  </button>
                )}
              </div>
              <h2>{activeCourseModal.title}</h2>
              <p className="instructor-sub">Uploaded by Faculty: {activeCourseModal.instructor}</p>

              {/* Modal Progress Bar */}
              <div className="modal-progress-strip">
                <div className="progress-text-row">
                  <span>Curriculum Completion</span>
                  <span className="progress-percent">{activeCourseModal.progress}%</span>
                </div>
                <div className="course-bar-bg">
                  <div className="course-bar-fill" style={{ width: `${activeCourseModal.progress}%` }}></div>
                </div>
              </div>

              {/* Direct Next Lecture Quick Banner */}
              {activeCourseModal.perfectLecture && (
                <div
                  className="glass-inner"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    marginTop: '8px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                      🎯 Suggested Next Lecture
                    </span>
                    <p style={{ margin: '2px 0 0', fontWeight: 600, fontSize: '0.95rem' }}>
                      {activeCourseModal.perfectLecture.title}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    onClick={() => {
                      setActiveLectureModal({
                        ...activeCourseModal.perfectLecture,
                        course: activeCourseModal,
                      });
                    }}
                  >
                    <Play size={14} /> Stream Now
                  </button>
                </div>
              )}
            </div>

            {/* Admin Uploaded Modules List */}
            <div className="admin-modules-container">
              <h3>
                Curriculum Modules ({(activeCourseModal.modules || []).length})
                {isModalLoading && <Loader2 size={16} className="spin-loader ml-2" />}
              </h3>

              <div className="modules-accordion-list">
                {(activeCourseModal.modules || []).map(module => {
                  const isExpanded = expandedModuleId === module.id;
                  const lessons = module.lessons || [];

                  return (
                    <div key={module.id} className="module-accordion-card glass-inner">
                      <div
                        className="module-header-row"
                        onClick={() => setExpandedModuleId(isExpanded ? null : module.id)}
                      >
                        <div className="module-title-group">
                          <span className={`mod-status-tag status-${(module.status || 'next-up').toLowerCase().replace(/\s+/g, '-')}`}>
                            {module.status}
                          </span>
                          <h4>{module.title}</h4>
                        </div>
                        <div className="module-right-info">
                          <span className="lesson-count-tag">{lessons.length} Learning Items</span>
                          <ChevronRight size={18} className={`chevron-icon ${isExpanded ? 'rotated' : ''}`} />
                        </div>
                      </div>

                      {/* Module Lessons Content */}
                      {isExpanded && (
                        <div className="module-lessons-body">
                          {module.description && <p className="module-description">{module.description}</p>}
                          <div className="lessons-list">
                            {lessons.map((lesson) => (
                              <div key={lesson.id} className="lesson-row glass-card">
                                <div className="lesson-left" style={{ cursor: 'pointer' }} onClick={() => handleOpenSpecificLecture(lesson, activeCourseModal, module)}>
                                  {lesson.type === 'video' && <Video size={16} color="var(--primary)" />}
                                  {lesson.type === 'pdf' && <FileText size={16} color="#06b6d4" />}
                                  {lesson.type === 'quiz' && <HelpCircle size={16} color="#f59e0b" />}
                                  <span className="lesson-title">{lesson.title}</span>
                                </div>

                                <div className="lesson-right">
                                  {lesson.duration && <span className="lesson-detail">{lesson.duration}</span>}
                                  {lesson.fileSize && <span className="lesson-detail">{lesson.fileSize}</span>}
                                  {lesson.questionsCount && <span className="lesson-detail">{lesson.questionsCount} Qs</span>}

                                  {lesson.completed ? (
                                    <span className="done-badge">
                                      <CheckCircle2 size={16} color="#4ade80" /> Done
                                    </span>
                                  ) : lesson.isLocked ? (
                                    <button
                                      className="action-btn-sm btn-locked"
                                      onClick={() => handleEnroll(activeCourseModal.id)}
                                      title="Enroll to unlock"
                                    >
                                      <Lock size={13} /> Unlock
                                    </button>
                                  ) : (
                                    <button
                                      className="action-btn-sm"
                                      disabled={activeLessonId === lesson.id}
                                      onClick={() => handleOpenSpecificLecture(lesson, activeCourseModal, module)}
                                    >
                                      {lesson.type === 'video' ? 'Watch' : lesson.type === 'pdf' ? 'Read' : 'Start'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
