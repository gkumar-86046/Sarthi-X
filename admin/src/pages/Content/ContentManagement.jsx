/**
 * admin/src/pages/Content/ContentManagement.jsx
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Plus,
  Layers,
  Video,
  FileText,
  HelpCircle,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import {
  getCourses,
  getCourseDetail,
  createCourse,
  updateCourse,
  deleteCourse,
  addModule,
  deleteModule,
  addLesson,
  deleteLesson,
} from '../../services/api';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';
import { getEducationLevelLabel } from '../../utils/formatters';
import '../../styles/content.css';

const GRADIENT_PRESETS = [
  { name: 'Emerald Forest', value: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' },
  { name: 'Cyber Purple', value: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
  { name: 'Ocean Cyan', value: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)' },
  { name: 'Sunset Amber', value: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  { name: 'Crimson Rose', value: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)' },
  { name: 'Deep Space', value: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' },
];

const ContentManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [notification, setNotification] = useState(null);

  // Course Modal state
  const [courseModalMode, setCourseModalMode] = useState(null); // 'create' | 'edit' | null
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    courseCode: '',
    educationLevel: 'graduation',
    targetField: 'B.Tech / B.E (Engineering)',
    category: 'Computer Science & AI',
    subject: 'Artificial Intelligence',
    instructor: 'System Administrator',
    rating: 4.85,
    thumbnailBg: GRADIENT_PRESETS[0].value,
    description: '',
  });

  // Curriculum Builder modal state
  const [activeCurriculumCourse, setActiveCurriculumCourse] = useState(null);
  const [curriculumData, setCurriculumData] = useState(null);
  const [isCurriculumLoading, setIsCurriculumLoading] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState(null);

  // New Module form
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');

  // New Lesson form
  const [lessonModalModuleId, setLessonModalModuleId] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    lessonType: 'video', // 'video' | 'pdf' | 'quiz'
    duration: '20 mins',
    fileSize: '3.5 MB',
    questionsCount: 10,
    contentUrl: '',
    isPreview: false,
  });

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getCourses(search, selectedLevel);
      if (res?.success) {
        setCourses(res.courses || []);
      }
    } catch (err) {
      notify(err.message || 'Failed to fetch courses', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedLevel]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Handle Create / Edit course save
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (courseModalMode === 'create') {
        await createCourse(courseForm);
        notify(`Course '${courseForm.title}' created successfully.`);
      } else {
        await updateCourse(editingCourseId, courseForm);
        notify(`Course '${courseForm.title}' updated successfully.`);
      }
      setCourseModalMode(null);
      loadCourses();
    } catch (err) {
      notify(err.message || 'Operation failed', 'error');
    }
  };

  // Handle Delete course
  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete '${title}' and its syllabus?`)) return;
    try {
      await deleteCourse(courseId);
      notify(`Course '${title}' removed.`);
      loadCourses();
    } catch (err) {
      notify(err.message || 'Failed to delete course', 'error');
    }
  };

  // Open Curriculum Studio
  const handleOpenCurriculum = async (course) => {
    setActiveCurriculumCourse(course);
    setIsCurriculumLoading(true);
    try {
      const res = await getCourseDetail(course.id);
      if (res?.success) {
        setCurriculumData(res.course);
        if (res.course.modules?.length > 0) {
          setExpandedModuleId(res.course.modules[0].id);
        }
      }
    } catch (err) {
      notify(err.message || 'Failed to load curriculum', 'error');
    } finally {
      setIsCurriculumLoading(false);
    }
  };

  // Add module
  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    try {
      await addModule(activeCurriculumCourse.id, {
        title: newModuleTitle,
        description: newModuleDesc,
      });
      setNewModuleTitle('');
      setNewModuleDesc('');
      notify('New module added to syllabus.');
      // Refresh curriculum
      handleOpenCurriculum(activeCurriculumCourse);
      loadCourses();
    } catch (err) {
      notify(err.message || 'Failed to add module', 'error');
    }
  };

  // Delete module
  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Delete this module and all its lessons?')) return;
    try {
      await deleteModule(moduleId);
      notify('Module removed.');
      handleOpenCurriculum(activeCurriculumCourse);
      loadCourses();
    } catch (err) {
      notify(err.message || 'Failed to delete module', 'error');
    }
  };

  // Add lesson (Video, PDF notes, Quiz)
  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) return;
    try {
      await addLesson(lessonModalModuleId, lessonForm);
      notify(`Lesson '${lessonForm.title}' added.`);
      setLessonModalModuleId(null);
      setLessonForm({
        title: '',
        lessonType: 'video',
        duration: '20 mins',
        fileSize: '3.5 MB',
        questionsCount: 10,
        contentUrl: '',
        isPreview: false,
      });
      handleOpenCurriculum(activeCurriculumCourse);
      loadCourses();
    } catch (err) {
      notify(err.message || 'Failed to add lesson', 'error');
    }
  };

  // Delete lesson
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lecture item?')) return;
    try {
      await deleteLesson(lessonId);
      notify('Lesson removed.');
      handleOpenCurriculum(activeCurriculumCourse);
      loadCourses();
    } catch (err) {
      notify(err.message || 'Failed to delete lesson', 'error');
    }
  };

  return (
    <div className="content-management-page">
      <Notification notification={notification} onClose={() => setNotification(null)} />

      {/* Top Filter and Action Bar */}
      <div className="courses-header-bar">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search courses, instructors, subjects..."
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

        <button
          className="btn btn-primary"
          onClick={() => {
            setCourseForm({
              title: '',
              courseCode: '',
              educationLevel: 'graduation',
              targetField: 'B.Tech / B.E (Engineering)',
              category: 'Engineering & Technology',
              subject: '',
              instructor: 'Faculty Lead',
              rating: 4.85,
              thumbnailBg: GRADIENT_PRESETS[0].value,
              description: '',
            });
            setCourseModalMode('create');
          }}
        >
          <Plus size={16} />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Course Cards Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <Loader2 size={32} className="spin" color="var(--primary)" />
          <p style={{ marginTop: '12px' }}>Loading curriculum database...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
          <BookOpen size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h3>No courses found</h3>
          <p>Try modifying your search or tier filter.</p>
        </div>
      ) : (
        <div className="course-cards-grid">
          {courses.map((c) => (
            <div key={c.id} className="course-card-item">
              {/* Banner with gradient */}
              <div className="course-card-banner" style={{ background: c.thumbnailBg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge variant="neutral" size="sm" style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                    {c.courseCode}
                  </Badge>
                  <span style={{ fontSize: '0.85rem', color: '#fef08a', fontWeight: 700 }}>
                    ★ {c.rating}
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  {c.targetField || getEducationLevelLabel(c.educationLevel)}
                </div>
              </div>

              {/* Body */}
              <div className="course-card-body">
                <div>
                  <h4>{c.title}</h4>
                  <p>{c.description || 'Comprehensive curriculum with targeted practice modules and lecture notes.'}</p>
                </div>

                <div>
                  <div className="course-card-meta">
                    <span>{c.subject}</span>
                    <span>{c.totalModules} Modules • {c.totalLessons} Lessons</span>
                  </div>

                  <div className="course-card-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleOpenCurriculum(c)}
                    >
                      <Layers size={14} />
                      <span>Curriculum Studio</span>
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEditingCourseId(c.id);
                        setCourseForm({
                          title: c.title,
                          courseCode: c.courseCode,
                          educationLevel: c.educationLevel,
                          targetField: c.targetField || '',
                          category: c.category,
                          subject: c.subject,
                          instructor: c.instructor,
                          rating: c.rating,
                          thumbnailBg: c.thumbnailBg || GRADIENT_PRESETS[0].value,
                          description: c.description || '',
                        });
                        setCourseModalMode('edit');
                      }}
                      title="Edit Course Details"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCourse(c.id, c.title)}
                      title="Delete Course"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── CREATE / EDIT COURSE MODAL ─────────────────────────────────────── */}
      <Modal
        isOpen={!!courseModalMode}
        onClose={() => setCourseModalMode(null)}
        title={courseModalMode === 'create' ? 'Create New Course' : 'Edit Course Details'}
        subtitle="Configure title, branch targeting, instructor, and visual branding"
        maxWidth="680px"
      >
        <form onSubmit={handleSaveCourse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Course Title</label>
              <input
                type="text"
                className="input-field"
                required
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="e.g. Advanced Distributed Systems"
              />
            </div>
            <div>
              <label className="form-label">Course Code (Optional)</label>
              <input
                type="text"
                className="input-field"
                value={courseForm.courseCode}
                onChange={(e) => setCourseForm({ ...courseForm, courseCode: e.target.value })}
                placeholder="e.g. CS-DIST-101"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Educational Level</label>
              <select
                className="input-field"
                value={courseForm.educationLevel}
                onChange={(e) => setCourseForm({ ...courseForm, educationLevel: e.target.value })}
              >
                <option value="graduation">Graduation / College</option>
                <option value="intermediate">Intermediate (11th & 12th)</option>
                <option value="highschool">High School (9th & 10th)</option>
                <option value="nursery">Primary & Nursery</option>
              </select>
            </div>
            <div>
              <label className="form-label">Target Stream / Degree</label>
              <input
                type="text"
                className="input-field"
                value={courseForm.targetField}
                onChange={(e) => setCourseForm({ ...courseForm, targetField: e.target.value })}
                placeholder="e.g. B.Tech / B.E (Engineering)"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="input-field"
                required
                value={courseForm.subject}
                onChange={(e) => setCourseForm({ ...courseForm, subject: e.target.value })}
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <label className="form-label">Lead Instructor</label>
              <input
                type="text"
                className="input-field"
                required
                value={courseForm.instructor}
                onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                placeholder="e.g. Dr. Govind Sharma"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              className="input-field"
              rows={3}
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              placeholder="Provide a comprehensive summary of learning goals and syllabus scope..."
            />
          </div>

          <div>
            <label className="form-label">Cover Gradient Preset</label>
            <div className="gradient-preset-picker">
              {GRADIENT_PRESETS.map((p) => (
                <div
                  key={p.name}
                  className={`gradient-preset-btn ${courseForm.thumbnailBg === p.value ? 'selected' : ''}`}
                  style={{ background: p.value }}
                  onClick={() => setCourseForm({ ...courseForm, thumbnailBg: p.value })}
                  title={p.name}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setCourseModalMode(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Course
            </button>
          </div>
        </form>
      </Modal>

      {/* ─── CURRICULUM STUDIO MODAL (MODULES & LESSONS / NOTES / VIDEOS) ───── */}
      <Modal
        isOpen={!!activeCurriculumCourse}
        onClose={() => setActiveCurriculumCourse(null)}
        title={`Curriculum Studio: ${activeCurriculumCourse?.title}`}
        subtitle={`${activeCurriculumCourse?.courseCode} • Add & update lecture videos, PDF notes, and module chapters`}
        maxWidth="850px"
      >
        {isCurriculumLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <Loader2 size={30} className="spin" color="var(--primary)" />
            <p style={{ marginTop: '10px' }}>Loading syllabus structure...</p>
          </div>
        ) : (
          <div>
            {/* Add new module form */}
            <form
              onSubmit={handleAddModule}
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '24px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <input
                type="text"
                className="input-field"
                placeholder="New Module Chapter Title (e.g. Module 3: Microservices & Docker)"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                style={{ flex: 2 }}
                required
              />
              <input
                type="text"
                className="input-field"
                placeholder="Brief summary or description"
                value={newModuleDesc}
                onChange={(e) => setNewModuleDesc(e.target.value)}
                style={{ flex: 2 }}
              />
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Plus size={16} />
                <span>Add Module</span>
              </button>
            </form>

            {/* Modules List Accordion */}
            {curriculumData?.modules?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-dim)' }}>
                No modules created yet. Add your first syllabus module above.
              </div>
            ) : (
              curriculumData?.modules?.map((m) => {
                const isExpanded = expandedModuleId === m.id;
                return (
                  <div key={m.id} className="module-accordion">
                    <div
                      className="module-header"
                      onClick={() => setExpandedModuleId(isExpanded ? null : m.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.94rem' }}>
                          {m.title}
                        </span>
                        <Badge variant="neutral" size="sm">
                          {m.lessons?.length || 0} Lessons / Notes
                        </Badge>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setLessonModalModuleId(m.id)}
                        >
                          <Plus size={14} />
                          <span>Add Content</span>
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteModule(m.id)}
                          title="Delete Module"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="module-content">
                        {m.description && (
                          <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {m.description}
                          </p>
                        )}

                        {m.lessons?.length === 0 ? (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', padding: '10px 0' }}>
                            No lectures or notes added to this module yet. Click "+ Add Content".
                          </div>
                        ) : (
                          m.lessons?.map((l) => (
                            <div key={l.id} className="lesson-row-item">
                              <div className="lesson-left">
                                <div
                                  className="lesson-type-badge"
                                  style={{
                                    background:
                                      l.lessonType === 'video'
                                        ? 'rgba(99, 102, 241, 0.15)'
                                        : l.lessonType === 'pdf'
                                        ? 'rgba(236, 72, 153, 0.15)'
                                        : 'rgba(16, 185, 129, 0.15)',
                                    color:
                                      l.lessonType === 'video'
                                        ? '#a5b4fc'
                                        : l.lessonType === 'pdf'
                                        ? '#f472b6'
                                        : '#6ee7b7',
                                  }}
                                >
                                  {l.lessonType === 'video' && <Video size={16} />}
                                  {l.lessonType === 'pdf' && <FileText size={16} />}
                                  {l.lessonType === 'quiz' && <HelpCircle size={16} />}
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                    {l.title}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    {l.lessonType === 'video' && `Video Duration: ${l.duration || '20m'}`}
                                    {l.lessonType === 'pdf' && `PDF Notes: ${l.fileSize || '3.5 MB'}`}
                                    {l.lessonType === 'quiz' && `Interactive Quiz: ${l.questionsCount || 10} Questions`}
                                    {l.contentUrl && ` • URL: ${l.contentUrl.substring(0, 32)}...`}
                                  </div>
                                </div>
                              </div>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteLesson(l.id)}
                                title="Delete Lesson"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </Modal>

      {/* ─── ADD LESSON / NOTE / VIDEO MODAL ─────────────────────────────────── */}
      <Modal
        isOpen={!!lessonModalModuleId}
        onClose={() => setLessonModalModuleId(null)}
        title="Upload & Add Module Content"
        subtitle="Add a lecture video link, downloadable PDF notes, or interactive quiz"
        maxWidth="540px"
      >
        <form onSubmit={handleAddLesson} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Content Title</label>
            <input
              type="text"
              className="input-field"
              required
              placeholder="e.g. Lecture 1: Core Neural Architecture Foundations"
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Content Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { type: 'video', label: 'Video Lecture', icon: Video },
                { type: 'pdf', label: 'PDF Notes', icon: FileText },
                { type: 'quiz', label: 'Quiz Test', icon: HelpCircle },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSel = lessonForm.lessonType === opt.type;
                return (
                  <div
                    key={opt.type}
                    onClick={() => setLessonForm({ ...lessonForm, lessonType: opt.type })}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: isSel ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSel ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      color: isSel ? '#fff' : 'var(--text-muted)',
                    }}
                  >
                    <Icon size={20} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {lessonForm.lessonType === 'video' && (
            <div>
              <label className="form-label">Video Lecture Duration</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 24 mins"
                value={lessonForm.duration}
                onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
              />
            </div>
          )}

          {lessonForm.lessonType === 'pdf' && (
            <div>
              <label className="form-label">PDF Notes File Size</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 4.2 MB"
                value={lessonForm.fileSize}
                onChange={(e) => setLessonForm({ ...lessonForm, fileSize: e.target.value })}
              />
            </div>
          )}

          {lessonForm.lessonType === 'quiz' && (
            <div>
              <label className="form-label">Question Count</label>
              <input
                type="number"
                className="input-field"
                min={1}
                max={50}
                value={lessonForm.questionsCount}
                onChange={(e) => setLessonForm({ ...lessonForm, questionsCount: parseInt(e.target.value) || 10 })}
              />
            </div>
          )}

          <div>
            <label className="form-label">Content Resource / Download URL</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. https://storage.sarathix.com/lectures/ai-m1-lec1.mp4"
              value={lessonForm.contentUrl}
              onChange={(e) => setLessonForm({ ...lessonForm, contentUrl: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setLessonModalModuleId(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Attach Content
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContentManagement;

