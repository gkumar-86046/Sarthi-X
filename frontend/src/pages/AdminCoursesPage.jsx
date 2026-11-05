import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Plus, Layers, Edit3, Trash2, Video, FileText, HelpCircle,
  X, CheckCircle2, AlertCircle, ShieldAlert, BookOpen, Users,
  Sparkles, Loader2, ChevronDown, ChevronUp, ExternalLink, Eye
} from 'lucide-react';
import {
  adminGetCourses,
  adminGetCourseDetail,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  adminAddModule,
  adminDeleteModule,
  adminAddLesson,
  adminDeleteLesson,
} from '../services/api';

const GRADIENT_PRESETS = [
  { name: 'Emerald Forest', value: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' },
  { name: 'Cyber Purple', value: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
  { name: 'Ocean Cyan', value: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)' },
  { name: 'Sunset Amber', value: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  { name: 'Crimson Rose', value: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)' },
  { name: 'Deep Space', value: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' },
];

const AdminCoursesPage = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalModules: 0,
    totalLessons: 0,
    totalEnrollments: 0,
  });
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  // Modals state
  const [courseModalMode, setCourseModalMode] = useState(null); // 'create' | 'edit' | null
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    courseCode: '',
    educationLevel: 'graduation',
    targetField: 'B.Tech / B.E (Engineering)',
    category: 'Engineering & Tech',
    subject: '',
    instructor: user?.fullName || user?.full_name || 'Govind Sharma',
    rating: 4.85,
    thumbnailBg: GRADIENT_PRESETS[0].value,
    description: '',
  });

  // Curriculum Builder modal
  const [curriculumCourse, setCurriculumCourse] = useState(null);
  const [isCurriculumLoading, setIsCurriculumLoading] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState(null);

  // Add Module form
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');

  // Add Lesson modal
  const [activeLessonModuleId, setActiveLessonModuleId] = useState(null);
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    lessonType: 'video',
    duration: '20 mins',
    fileSize: '3.2 MB',
    questionsCount: 15,
    contentUrl: '',
    isPreview: false,
  });

  const showNotification = (text, type = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // ── Fetch Courses ─────────────────────────────────────────────────────────
  const fetchAdminCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await adminGetCourses({
        search,
        education_level: selectedLevel,
      });
      if (res && res.success) {
        setCourses(res.courses || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.warn('Admin fetch courses failed:', err.message);
      showNotification(err.message || 'Failed to load courses.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedLevel]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdminCourses();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchAdminCourses]);

  // ── Create / Edit Course Submit ───────────────────────────────────────────
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (courseModalMode === 'create') {
        const res = await adminCreateCourse(courseFormData);
        if (res && res.success) {
          showNotification(res.message || 'Course created successfully!');
          setCourseModalMode(null);
          fetchAdminCourses();
        }
      } else if (courseModalMode === 'edit' && editingCourse) {
        const res = await adminUpdateCourse(editingCourse.id, courseFormData);
        if (res && res.success) {
          showNotification(res.message || 'Course updated successfully!');
          setCourseModalMode(null);
          setEditingCourse(null);
          fetchAdminCourses();
        }
      }
    } catch (err) {
      showNotification(err.message || 'Operation failed', 'error');
    }
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setCourseFormData({
      title: course.title,
      courseCode: course.courseCode,
      educationLevel: course.educationLevel,
      targetField: course.targetField || 'B.Tech / B.E (Engineering)',
      category: course.category,
      subject: course.subject,
      instructor: course.instructor,
      rating: course.rating,
      thumbnailBg: course.thumbnailBg || GRADIENT_PRESETS[0].value,
      description: course.description || '',
    });
    setCourseModalMode('edit');
  };

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setCourseFormData({
      title: '',
      courseCode: '',
      educationLevel: 'graduation',
      targetField: 'B.Tech / B.E (Engineering)',
      category: 'Computer Science',
      subject: '',
      instructor: user?.fullName || user?.full_name || 'Govind Sharma',
      rating: 4.85,
      thumbnailBg: GRADIENT_PRESETS[0].value,
      description: '',
    });
    setCourseModalMode('create');
  };

  // ── Delete Course ─────────────────────────────────────────────────────────
  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"? All syllabus and student progress will be permanently removed.`)) {
      return;
    }
    try {
      const res = await adminDeleteCourse(courseId);
      if (res && res.success) {
        showNotification(res.message || 'Course deleted.');
        fetchAdminCourses();
      }
    } catch (err) {
      showNotification(err.message || 'Delete failed', 'error');
    }
  };

  // ── Curriculum Builder ────────────────────────────────────────────────────
  const handleOpenCurriculum = async (courseId) => {
    try {
      setIsCurriculumLoading(true);
      const res = await adminGetCourseDetail(courseId);
      if (res && res.success && res.course) {
        setCurriculumCourse(res.course);
        if (res.course.modules && res.course.modules.length > 0) {
          setExpandedModuleId(res.course.modules[0].id);
        }
      }
    } catch (err) {
      showNotification(err.message || 'Failed to fetch syllabus', 'error');
    } finally {
      setIsCurriculumLoading(false);
    }
  };

  const reloadCurriculum = async (courseId) => {
    try {
      const res = await adminGetCourseDetail(courseId);
      if (res && res.success && res.course) {
        setCurriculumCourse(res.course);
      }
      fetchAdminCourses();
    } catch (err) {
      console.warn('Reload curriculum error:', err.message);
    }
  };

  // ── Add Module ────────────────────────────────────────────────────────────
  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    try {
      const res = await adminAddModule(curriculumCourse.id, {
        title: newModuleTitle,
        description: newModuleDesc,
      });
      if (res && res.success) {
        showNotification(res.message || 'Module added.');
        setNewModuleTitle('');
        setNewModuleDesc('');
        reloadCurriculum(curriculumCourse.id);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to add module', 'error');
    }
  };

  // ── Delete Module ─────────────────────────────────────────────────────────
  const handleDeleteModule = async (moduleId, title) => {
    if (!window.confirm(`Delete module "${title}" and all its lessons?`)) return;
    try {
      const res = await adminDeleteModule(moduleId);
      if (res && res.success) {
        showNotification(res.message || 'Module removed.');
        reloadCurriculum(curriculumCourse.id);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to delete module', 'error');
    }
  };

  // ── Add Lesson ────────────────────────────────────────────────────────────
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonFormData.title.trim()) return;
    try {
      const res = await adminAddLesson(activeLessonModuleId, lessonFormData);
      if (res && res.success) {
        showNotification(res.message || 'Lesson uploaded successfully.');
        setActiveLessonModuleId(null);
        setLessonFormData({
          title: '',
          lessonType: 'video',
          duration: '20 mins',
          fileSize: '3.2 MB',
          questionsCount: 15,
          contentUrl: '',
          isPreview: false,
        });
        reloadCurriculum(curriculumCourse.id);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to add lesson', 'error');
    }
  };

  // ── Delete Lesson ─────────────────────────────────────────────────────────
  const handleDeleteLesson = async (lessonId, title) => {
    if (!window.confirm(`Delete lesson "${title}"?`)) return;
    try {
      const res = await adminDeleteLesson(lessonId);
      if (res && res.success) {
        showNotification(res.message || 'Lesson removed.');
        reloadCurriculum(curriculumCourse.id);
      }
    } catch (err) {
      showNotification(err.message || 'Failed to delete lesson', 'error');
    }
  };

  return (
    <div className="admin-courses-container">
      {/* Toast Notification */}
      {actionMessage && (
        <div className={`admin-toast-banner ${actionMessage.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {actionMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="toast-close-btn"><X size={14} /></button>
        </div>
      )}

      {/* Header Banner */}
      <div className="admin-header-card glass">
        <div className="admin-header-info">
          <div className="admin-badge-row">
            <span className="admin-role-badge">
              <ShieldAlert size={14} /> Faculty / Admin Portal
            </span>
            <span className="live-badge-glow">Live Database Sync</span>
          </div>
          <h1 className="admin-title">Course & Syllabus Management</h1>
          <p className="admin-subtitle">
            Upload courses, organize structured curriculum modules, and publish video lectures, PDF notes, and quizzes directly to students.
          </p>
        </div>

        <button className="admin-btn-primary" onClick={handleOpenCreate}>
          <Plus size={20} />
          <span>Create New Course</span>
        </button>
      </div>

      {/* System Metrics Overview */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card glass-inner">
          <div className="stat-icon-circle stat-green">
            <BookOpen size={22} />
          </div>
          <div>
            <span className="stat-label">Total Courses</span>
            <h3 className="stat-val">{stats.totalCourses}</h3>
          </div>
        </div>

        <div className="admin-stat-card glass-inner">
          <div className="stat-icon-circle stat-purple">
            <Layers size={22} />
          </div>
          <div>
            <span className="stat-label">Curriculum Modules</span>
            <h3 className="stat-val">{stats.totalModules}</h3>
          </div>
        </div>

        <div className="admin-stat-card glass-inner">
          <div className="stat-icon-circle stat-cyan">
            <Video size={22} />
          </div>
          <div>
            <span className="stat-label">Uploaded Lessons</span>
            <h3 className="stat-val">{stats.totalLessons}</h3>
          </div>
        </div>

        <div className="admin-stat-card glass-inner">
          <div className="stat-icon-circle stat-amber">
            <Users size={22} />
          </div>
          <div>
            <span className="stat-label">Student Enrollments</span>
            <h3 className="stat-val">{stats.totalEnrollments}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="admin-toolbar glass-inner">
        <div className="admin-search-box">
          <Search size={18} className="search-icon-muted" />
          <input
            type="text"
            placeholder="Search by title, subject, instructor, or course code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="admin-filter-group">
          <label className="filter-label">Level:</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Academic Levels</option>
            <option value="graduation">Graduation</option>
            <option value="intermediate">Intermediate</option>
            <option value="highschool">High School</option>
            <option value="nursery">Nursery / Primary</option>
          </select>
        </div>
      </div>

      {/* Courses List Section */}
      {isLoading ? (
        <div className="admin-loading-state">
          <Loader2 size={36} className="spin-loader" />
          <p>Fetching curriculum from MySQL...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="admin-empty-card glass">
          <BookOpen size={48} className="empty-icon" />
          <h3>No courses found</h3>
          <p>No courses match your filter criteria or none have been published yet.</p>
          <button className="admin-btn-primary" onClick={handleOpenCreate}>
            <Plus size={18} /> Create First Course
          </button>
        </div>
      ) : (
        <div className="admin-courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="admin-course-card glass">
              {/* Card Banner */}
              <div
                className="admin-course-banner"
                style={{ background: course.thumbnailBg || GRADIENT_PRESETS[0].value }}
              >
                <span className="admin-code-chip">{course.courseCode}</span>
                <span className="admin-level-chip">{course.educationLevel}</span>
                {course.targetField && (
                  <span className="admin-target-chip" style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                    {course.targetField}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="admin-card-body">
                <div className="card-category-row">
                  <span className="card-subj-tag">{course.subject}</span>
                  <span className="card-cat-tag">{course.category}</span>
                </div>

                <h3 className="admin-card-title">{course.title}</h3>
                <p className="admin-instructor">
                  Instructor: <strong>{course.instructor}</strong>
                </p>

                {course.description && (
                  <p className="admin-card-desc">{course.description}</p>
                )}

                {/* Metrics Pill Grid */}
                <div className="admin-card-metrics">
                  <div className="metric-pill">
                    <Layers size={14} />
                    <span>{course.totalModules} Modules</span>
                  </div>
                  <div className="metric-pill">
                    <Video size={14} />
                    <span>{course.totalLessons} Lessons</span>
                  </div>
                  <div className="metric-pill">
                    <Users size={14} />
                    <span>{course.enrolledStudents} Enrolled</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="admin-card-actions">
                  <button
                    className="action-btn-builder"
                    onClick={() => handleOpenCurriculum(course.id)}
                    title="Manage modules and lessons"
                  >
                    <Layers size={16} />
                    <span>Curriculum Builder</span>
                  </button>

                  <div className="action-sub-buttons">
                    <button
                      className="action-icon-btn edit-btn"
                      onClick={() => handleOpenEdit(course)}
                      title="Edit Course Details"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="action-icon-btn delete-btn"
                      onClick={() => handleDeleteCourse(course.id, course.title)}
                      title="Delete Course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT COURSE MODAL ─────────────────────────────────────── */}
      {courseModalMode && (
        <div className="admin-modal-overlay" onClick={() => setCourseModalMode(null)}>
          <div className="admin-modal-card glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{courseModalMode === 'create' ? 'Create New Course' : 'Edit Course Details'}</h2>
              <button className="modal-close-btn" onClick={() => setCourseModalMode(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="admin-form">
              <div className="form-group">
                <label>Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Operating Systems & Kernel Design"
                  value={courseFormData.title}
                  onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={courseFormData.subject}
                    onChange={(e) => setCourseFormData({ ...courseFormData, subject: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Systems Programming"
                    value={courseFormData.category}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Education Level *</label>
                  <select
                    value={courseFormData.educationLevel}
                    onChange={(e) => {
                      const newLvl = e.target.value;
                      let defaultTarget = 'all';
                      if (newLvl === 'graduation') defaultTarget = 'B.Tech / B.E (Engineering)';
                      else if (newLvl === 'intermediate') defaultTarget = '12th (2nd Year)';
                      else if (newLvl === 'highschool') defaultTarget = 'Class 10';
                      else if (newLvl === 'nursery') defaultTarget = 'Class 1';
                      setCourseFormData({ ...courseFormData, educationLevel: newLvl, targetField: defaultTarget });
                    }}
                    className="form-input"
                  >
                    <option value="graduation">Graduation</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="highschool">High School</option>
                    <option value="nursery">Nursery / Primary</option>
                    <option value="all">All Standards (Universal)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Branch / Class *</label>
                  {courseFormData.educationLevel === 'graduation' && (
                    <select
                      value={courseFormData.targetField}
                      onChange={(e) => setCourseFormData({ ...courseFormData, targetField: e.target.value })}
                      className="form-input"
                    >
                      <option value="B.Tech / B.E (Engineering)">B.Tech / B.E (Engineering & IT)</option>
                      <option value="BCA (Computer Applications)">BCA (Computer Applications)</option>
                      <option value="B.Sc (Bachelor of Science)">B.Sc (Bachelor of Science)</option>
                      <option value="B.Com (Bachelor of Commerce)">B.Com (Bachelor of Commerce)</option>
                      <option value="BBA (Business Administration)">BBA (Business Administration)</option>
                      <option value="MBBS (Medical)">MBBS (Medical)</option>
                      <option value="B.A (Bachelor of Arts)">B.A (Bachelor of Arts)</option>
                      <option value="all">All Graduation Branches</option>
                    </select>
                  )}
                  {courseFormData.educationLevel === 'intermediate' && (
                    <select
                      value={courseFormData.targetField}
                      onChange={(e) => setCourseFormData({ ...courseFormData, targetField: e.target.value })}
                      className="form-input"
                    >
                      <option value="12th (2nd Year)">Class 12th (2nd Year)</option>
                      <option value="11th (1st Year)">Class 11th (1st Year)</option>
                      <option value="Science">Science Stream</option>
                      <option value="Commerce">Commerce Stream</option>
                      <option value="Arts">Arts Stream</option>
                      <option value="all">All Intermediate Students</option>
                    </select>
                  )}
                  {courseFormData.educationLevel === 'highschool' && (
                    <select
                      value={courseFormData.targetField}
                      onChange={(e) => setCourseFormData({ ...courseFormData, targetField: e.target.value })}
                      className="form-input"
                    >
                      <option value="Class 10">Class 10 (Board Exam)</option>
                      <option value="Class 9">Class 9</option>
                      <option value="all">All High School Classes</option>
                    </select>
                  )}
                  {courseFormData.educationLevel === 'nursery' && (
                    <select
                      value={courseFormData.targetField}
                      onChange={(e) => setCourseFormData({ ...courseFormData, targetField: e.target.value })}
                      className="form-input"
                    >
                      {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="all">All Primary Classes</option>
                    </select>
                  )}
                  {courseFormData.educationLevel === 'all' && (
                    <input
                      type="text"
                      value={courseFormData.targetField}
                      onChange={(e) => setCourseFormData({ ...courseFormData, targetField: e.target.value })}
                      placeholder="e.g. Universal"
                      className="form-input"
                    />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Instructor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Govind Sharma"
                  value={courseFormData.instructor}
                  onChange={(e) => setCourseFormData({ ...courseFormData, instructor: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Course Code (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave blank for auto-generation"
                    value={courseFormData.courseCode}
                    onChange={(e) => setCourseFormData({ ...courseFormData, courseCode: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.0"
                    max="5.0"
                    value={courseFormData.rating}
                    onChange={(e) => setCourseFormData({ ...courseFormData, rating: parseFloat(e.target.value) || 4.8 })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Thumbnail Gradient Style</label>
                <div className="gradient-preset-picker">
                  {GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      className={`preset-swatch ${courseFormData.thumbnailBg === preset.value ? 'selected' : ''}`}
                      style={{ background: preset.value }}
                      onClick={() => setCourseFormData({ ...courseFormData, thumbnailBg: preset.value })}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Course Description</label>
                <textarea
                  rows="3"
                  placeholder="Outline what students will master in this course..."
                  value={courseFormData.description}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setCourseModalMode(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  {courseModalMode === 'create' ? 'Publish Course' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CURRICULUM BUILDER MODAL ────────────────────────────────────────── */}
      {curriculumCourse && (
        <div className="admin-modal-overlay" onClick={() => setCurriculumCourse(null)}>
          <div className="admin-curriculum-modal glass" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <span className="curriculum-tag">{curriculumCourse.courseCode}</span>
                <h2>{curriculumCourse.title}</h2>
                <p className="curriculum-sub">
                  Syllabus Structure: {curriculumCourse.modules?.length || 0} Modules &bull;{' '}
                  {(curriculumCourse.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Total Lessons
                </p>
              </div>
              <button className="modal-close-btn" onClick={() => setCurriculumCourse(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Curriculum Body */}
            <div className="curriculum-content-area">
              {/* Modules Accordion List */}
              <div className="modules-list-wrapper">
                <h3>Curriculum Modules</h3>

                {(!curriculumCourse.modules || curriculumCourse.modules.length === 0) ? (
                  <div className="empty-module-prompt">
                    <p>No modules have been added to this course yet.</p>
                  </div>
                ) : (
                  curriculumCourse.modules.map((module) => {
                    const isExpanded = expandedModuleId === module.id;
                    const lessonsCount = module.lessons?.length || 0;

                    return (
                      <div key={module.id} className="module-accordion-card glass-inner">
                        {/* Module Header Bar */}
                        <div
                          className="module-bar"
                          onClick={() => setExpandedModuleId(isExpanded ? null : module.id)}
                        >
                          <div className="module-title-group">
                            <span className="module-badge">Module {module.moduleNumber}</span>
                            <h4 className="module-name">{module.title}</h4>
                            <span className="module-count-chip">{lessonsCount} lessons</span>
                          </div>

                          <div className="module-actions-group" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="add-lesson-mini-btn"
                              onClick={() => {
                                setActiveLessonModuleId(module.id);
                                setLessonFormData({
                                  title: '',
                                  lessonType: 'video',
                                  duration: '20 mins',
                                  fileSize: '3.2 MB',
                                  questionsCount: 15,
                                  contentUrl: '',
                                  isPreview: false,
                                });
                              }}
                              title="Add lesson to this module"
                            >
                              <Plus size={14} /> Add Lesson
                            </button>

                            <button
                              className="delete-mini-btn"
                              onClick={() => handleDeleteModule(module.id, module.title)}
                              title="Delete module"
                            >
                              <Trash2 size={14} />
                            </button>

                            <button
                              className="toggle-expand-btn"
                              onClick={() => setExpandedModuleId(isExpanded ? null : module.id)}
                            >
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                          </div>
                        </div>

                        {/* Lessons List Inside Module */}
                        {isExpanded && (
                          <div className="module-lessons-container">
                            {module.description && (
                              <p className="module-desc-text">{module.description}</p>
                            )}

                            {(!module.lessons || module.lessons.length === 0) ? (
                              <p className="no-lessons-text">No lessons in this module yet. Click "+ Add Lesson" above.</p>
                            ) : (
                              <div className="lessons-list">
                                {module.lessons.map((lesson) => {
                                  const Icon =
                                    lesson.lessonType === 'video' ? Video :
                                    lesson.lessonType === 'pdf' ? FileText :
                                    HelpCircle;

                                  return (
                                    <div key={lesson.id} className="lesson-item-row">
                                      <div className="lesson-item-left">
                                        <div className={`lesson-type-icon type-${lesson.lessonType}`}>
                                          <Icon size={16} />
                                        </div>
                                        <div>
                                          <h5 className="lesson-title-text">{lesson.title}</h5>
                                          <div className="lesson-meta-chips">
                                            <span className="meta-chip type-chip">{lesson.lessonType.toUpperCase()}</span>
                                            {lesson.duration && <span className="meta-chip">{lesson.duration}</span>}
                                            {lesson.fileSize && <span className="meta-chip">{lesson.fileSize}</span>}
                                            {lesson.questionsCount && (
                                              <span className="meta-chip">{lesson.questionsCount} Questions</span>
                                            )}
                                            {lesson.isPreview && (
                                              <span className="meta-chip preview-chip">Free Preview</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <button
                                        className="lesson-delete-btn"
                                        onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                        title="Delete lesson"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add New Module Section */}
              <div className="add-module-box glass-inner">
                <h4>+ Add New Curriculum Module</h4>
                <form onSubmit={handleAddModule} className="add-module-form">
                  <input
                    type="text"
                    required
                    placeholder="Module Title (e.g. Module 3: Memory Virtualization & Paging)"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Short description of module goals (optional)"
                    value={newModuleDesc}
                    onChange={(e) => setNewModuleDesc(e.target.value)}
                    className="form-input"
                  />
                  <button type="submit" className="admin-btn-primary">
                    <Plus size={16} /> Add Module
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD LESSON POPUP MODAL ────────────────────────────────────────── */}
      {activeLessonModuleId && (
        <div className="admin-modal-overlay" onClick={() => setActiveLessonModuleId(null)}>
          <div className="admin-modal-card glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload / Add Lesson</h2>
              <button className="modal-close-btn" onClick={() => setActiveLessonModuleId(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="admin-form">
              <div className="form-group">
                <label>Lesson Type</label>
                <div className="lesson-type-selector">
                  {[
                    { id: 'video', label: 'Video Lecture', icon: Video },
                    { id: 'pdf', label: 'Admin Notes (PDF)', icon: FileText },
                    { id: 'quiz', label: 'Interactive Quiz', icon: HelpCircle },
                  ].map((t) => {
                    const TIcon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`type-select-btn ${lessonFormData.lessonType === t.id ? 'active' : ''}`}
                        onClick={() => setLessonFormData({ ...lessonFormData, lessonType: t.id })}
                      >
                        <TIcon size={16} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label>Lesson Title *</label>
                <input
                  type="text"
                  required
                  placeholder={
                    lessonFormData.lessonType === 'video' ? 'e.g. Virtual Memory Architecture & Page Fault Handling' :
                    lessonFormData.lessonType === 'pdf' ? 'e.g. Lecture Notes & Cheat Sheet: Memory Models' :
                    'e.g. Mid-Module Assessment: Page Tables & TLB'
                  }
                  value={lessonFormData.title}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                  className="form-input"
                />
              </div>

              {lessonFormData.lessonType === 'video' && (
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 24 mins"
                      value={lessonFormData.duration}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, duration: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Video Stream / Resource URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={lessonFormData.contentUrl}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, contentUrl: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              {lessonFormData.lessonType === 'pdf' && (
                <div className="form-row-2">
                  <div className="form-group">
                    <label>File Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 3.4 MB"
                      value={lessonFormData.fileSize}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, fileSize: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>PDF Notes Download URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={lessonFormData.contentUrl}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, contentUrl: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              {lessonFormData.lessonType === 'quiz' && (
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Number of Questions</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={lessonFormData.questionsCount}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, questionsCount: parseInt(e.target.value) || 10 })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Quiz Test URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={lessonFormData.contentUrl}
                      onChange={(e) => setLessonFormData({ ...lessonFormData, contentUrl: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <div className="form-checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={lessonFormData.isPreview}
                    onChange={(e) => setLessonFormData({ ...lessonFormData, isPreview: e.target.checked })}
                  />
                  <span>Allow Free Preview for Unenrolled Students</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setActiveLessonModuleId(null)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  Save & Publish Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;
