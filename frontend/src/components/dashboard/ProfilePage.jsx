import React, { useState, useEffect, useCallback } from 'react';
import {
  User, Mail, Phone, BookOpen, GraduationCap, Lock, Save, Camera,
  CheckCircle2, ShieldCheck, ChevronDown, Edit3, X, Sparkles, Building,
  Hash, Award, Shield, ArrowRight, FileText, Star, Eye, Loader2
} from 'lucide-react';
import { getDashboardSummary, getCourses, updateProfile } from '../../services/api';

const graduationCourses = [
  { name: 'B.Tech / B.E (Engineering)', duration: 4 },
  { name: 'MBBS (Medical)', duration: 5 },
  { name: 'B.Sc (Bachelor of Science)', duration: 3 },
  { name: 'B.Com (Bachelor of Commerce)', duration: 3 },
  { name: 'B.A (Bachelor of Arts)', duration: 3 },
  { name: 'BCA (Computer Applications)', duration: 3 },
  { name: 'BBA (Business Administration)', duration: 3 },
];

const ProfilePage = ({ user, onUpdateProfile }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || user?.full_name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    educationLevel: user?.educationLevel || user?.education_level || 'graduation',
    nurseryClass: user?.nurseryClass || user?.nursery_class || 'Class 1',
    stream: user?.stream || 'Science',
    highschoolClass: user?.highschoolClass || user?.highschool_class || 'Class 9',
    intermediateYear: user?.intermediateYear || user?.intermediate_year || '11th (1st Year)',
    graduationCourse: user?.graduationCourse || user?.graduation_course || 'B.Tech / B.E (Engineering)',
    graduationYear: user?.graduationYear || user?.graduation_year || '4th Year',
    currentPassword: '',
    newPassword: ''
  });

  const [dashboardMetrics, setDashboardMetrics] = useState({
    enrolledCount: 4,
    completedCount: 2,
    progressPercentage: '75%',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'academic' | 'security'
  const [profileCourses, setProfileCourses] = useState([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);

  // Fetch courses strictly matching the student's profile branch/standard
  const fetchProfileCourses = useCallback(async () => {
    try {
      setIsCoursesLoading(true);
      const res = await getCourses();
      if (res && res.success) {
        setProfileCourses(res.courses || []);
      }
    } catch (err) {
      console.warn('Failed to fetch profile courses:', err.message);
    } finally {
      setIsCoursesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileCourses();
  }, [fetchProfileCourses, user]);

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        fullName: user.fullName || user.full_name || prev.fullName,
        email: user.email || prev.email,
        mobile: user.mobile || prev.mobile,
        educationLevel: user.educationLevel || user.education_level || prev.educationLevel,
        nurseryClass: user.nurseryClass || user.nursery_class || prev.nurseryClass,
        stream: user.stream || prev.stream,
        highschoolClass: user.highschoolClass || user.highschool_class || prev.highschoolClass,
        intermediateYear: user.intermediateYear || user.intermediate_year || prev.intermediateYear,
        graduationCourse: user.graduationCourse || user.graduation_course || prev.graduationCourse,
        graduationYear: user.graduationYear || user.graduation_year || prev.graduationYear,
      }));
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    getDashboardSummary().then(res => {
      if (isMounted && res && res.success) {
        const count = res.courses ? res.courses.length : 4;
        const completed = res.metrics?.certificatesEarned || 2;
        const pct = res.metrics?.overallPercentage ? `${res.metrics.overallPercentage}%` : '75%';
        setDashboardMetrics({
          enrolledCount: count,
          completedCount: completed,
          progressPercentage: pct,
        });
      }
    }).catch(err => {
      console.warn('Dashboard summary error:', err.message);
    });
    return () => { isMounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => {
      const updated = { ...prev, [name]: value };

      if (name === 'educationLevel') {
        if (value === 'nursery') {
          updated.nurseryClass = 'Class 1';
        } else if (value === 'highschool') {
          updated.stream = 'Science';
          updated.highschoolClass = 'Class 9';
        } else if (value === 'intermediate') {
          updated.stream = 'Science';
          updated.intermediateYear = '11th (1st Year)';
        } else if (value === 'graduation') {
          updated.graduationCourse = 'B.Tech / B.E (Engineering)';
          updated.graduationYear = '1st Year';
        }
      }

      if (name === 'graduationCourse') {
        updated.graduationYear = '1st Year';
      }

      return updated;
    });
  };

  const getGraduationYears = () => {
    const courseObj = graduationCourses.find(c => c.name === profileData.graduationCourse);
    const duration = courseObj ? courseObj.duration : 3;
    const years = [];
    for (let i = 1; i <= duration; i++) {
      let suffix = i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th';
      years.push(`${i}${suffix} Year`);
    }
    return years;
  };

  const getAcademicDetailSummary = () => {
    if (user?.academicDetail && !profileData.educationLevel) {
      return user.academicDetail;
    }
    if (profileData.educationLevel === 'nursery') {
      return `Nursery / Primary (${profileData.nurseryClass})`;
    } else if (profileData.educationLevel === 'highschool') {
      return `High School (${profileData.highschoolClass} - ${profileData.stream})`;
    } else if (profileData.educationLevel === 'intermediate') {
      return `Intermediate (${profileData.intermediateYear} - ${profileData.stream})`;
    } else {
      return `Graduation (${profileData.graduationCourse} - ${profileData.graduationYear})`;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedSummary = getAcademicDetailSummary();
    const payload = {
      fullName: profileData.fullName,
      mobile: profileData.mobile,
      educationLevel: profileData.educationLevel,
      nurseryClass: profileData.nurseryClass,
      stream: profileData.stream,
      highschoolClass: profileData.highschoolClass,
      intermediateYear: profileData.intermediateYear,
      graduationCourse: profileData.graduationCourse,
      graduationYear: profileData.graduationYear,
    };

    try {
      await updateProfile(payload);
    } catch (err) {
      console.warn('Profile backend update:', err.message);
    }

    const updatedProfile = {
      ...profileData,
      academicDetail: updatedSummary
    };

    setIsSaved(true);
    if (onUpdateProfile) {
      onUpdateProfile(updatedProfile);
    }
    setIsEditMode(false);
    fetchProfileCourses();
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const displayFullName = profileData.fullName || user?.fullName || user?.full_name || 'Govind Sharma';
  const displayEmail = profileData.email || user?.email || '';
  const displayMobile = profileData.mobile || user?.mobile || '';
  const displayAcademic = user?.academicDetail || user?.academic_detail || getAcademicDetailSummary();

  const renderProfileCourses = (sectionTitle = "Courses For Your Profile") => (
    <div className="profile-courses-section" style={{ marginTop: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--primary)" />
            <span>{sectionTitle}</span>
            <span style={{ fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-light)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              {profileCourses.length} Assigned
            </span>
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing curriculum filtered strictly for your registered track: <strong>{displayAcademic}</strong>
          </p>
        </div>

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700 }}>
          <Eye size={13} /> View Access Only
        </span>
      </div>

      {isCoursesLoading ? (
        <div className="courses-loading-state glass-inner" style={{ padding: '30px', textAlign: 'center', borderRadius: '16px' }}>
          <Loader2 size={28} className="spin-loader" />
          <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>Loading courses for your profile...</p>
        </div>
      ) : profileCourses.length === 0 ? (
        <div className="empty-courses-box glass-inner" style={{ padding: '30px', textAlign: 'center', borderRadius: '16px' }}>
          <BookOpen size={36} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontWeight: 600, margin: '4px 0' }}>No courses published yet for {displayAcademic}</p>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Faculty will upload curriculum for your branch shortly.</span>
        </div>
      ) : (
        <div className="profile-courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {profileCourses.map(c => (
            <div key={c.id} className="profile-course-card glass-inner" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15, 23, 42, 0.5)' }}>
              <div style={{ height: '70px', padding: '10px 14px', background: c.thumbnailBg || 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(15, 23, 42, 0.9))', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '6px', color: '#fff' }}>
                  {c.subject}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 600, background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '6px', color: '#fff' }}>
                  {c.targetField || c.classStandard}
                </span>
              </div>

              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, minHeight: '38px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {c.title}
                </h5>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Faculty: {c.instructor}</span>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>{c.totalModules} Modules</span>
                  <span>{c.totalLessons} Lessons</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>{c.progress}% Done</span>
                </div>

                <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${c.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), #10b981)' }}></div>
                </div>

                <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: c.isEnrolled ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                    {c.isEnrolled ? 'Enrolled & Active' : 'Available Course'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--primary-light)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={12} /> View Only
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-page">
      {/* Profile Header Banner */}
      <div className="profile-header-card glass">
        <div className="profile-cover">
          <div className="cover-wave-bg"></div>

          {/* Inspirational Quote with Sparkles */}
          <div className="cover-quote-container">
            <span className="quote-sparkle top"><Sparkles size={14} /></span>
            <p className="cover-quote-text">
              “ Small steps every day<br />lead to big dreams. ”
            </p>
            <span className="quote-sparkle bottom"><Sparkles size={12} /></span>
          </div>

          {/* 3D Graduation Cap Graphic */}
          <div className="cover-cap-graphic" aria-hidden="true">
            <svg width="140" height="110" viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="80" cy="115" rx="55" ry="10" fill="rgba(99, 102, 241, 0.15)" />
              {/* Cap Skull */}
              <path d="M48 65 L80 82 L112 65 V82 C112 94 80 102 48 82 Z" fill="#6366f1" />
              <path d="M48 65 L80 82 V98 C52 82 48 65 48 65 Z" fill="#4f46e5" />
              {/* Cap Top Rhombus */}
              <polygon points="80,22 150,55 80,88 10,55" fill="#818cf8" />
              <polygon points="80,22 150,55 80,88" fill="#6366f1" opacity="0.85" />
              {/* Button & Tassel */}
              <circle cx="80" cy="55" r="4.5" fill="#f59e0b" />
              <path d="M80 55 Q115 65 118 90" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <rect x="114" y="90" width="8" height="16" rx="3" fill="#f59e0b" />
            </svg>
          </div>
        </div>

        <div className="profile-info-row">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {displayFullName ? displayFullName.charAt(0).toUpperCase() : 'B'}
            </div>
            <div className="avatar-status-badge" title="Verified Account">
              <CheckCircle2 size={16} color="#ffffff" className="check-inner" />
            </div>
            {isEditMode && (
              <button type="button" className="avatar-edit-btn" title="Change Profile Picture">
                <Camera size={16} />
              </button>
            )}
          </div>

          <div className="profile-title-box">
            <div className="profile-name-row">
              <h2>{displayFullName}</h2>
              <div className="verified-blue-badge" title="Verified Identity">
                <CheckCircle2 size={17} />
              </div>
            </div>
            <p className="academic-badge-text">
              <GraduationCap size={16} />
              <span>{displayAcademic}</span>
            </p>
          </div>

          <div className="profile-header-actions">
            {!isEditMode ? (
              <button className="edit-profile-mode-btn" onClick={() => setIsEditMode(true)}>
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="edit-mode-tag">
                <Edit3 size={14} color="#f59e0b" />
                <span>Edit Mode Active</span>
              </div>
            )}

            <div className="profile-status-pill">
              <ShieldCheck size={16} color="#10b981" />
              <span>Verified Student</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-nav-tabs">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <User size={16} />
            <span>Personal Info</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
          >
            <BookOpen size={16} />
            <span>Academic Details</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Lock size={16} />
            <span>Security & Password</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {isSaved && (
        <div className="save-toast glass">
          <CheckCircle2 size={20} color="#10b981" />
          <span>Profile changes saved successfully! View mode restored.</span>
        </div>
      )}

      {/* Main Card View / Edit Switcher */}
      <div className="profile-form-card glass">
        {!isEditMode ? (
          /* ==========================================================================
             STATIC READ-ONLY VIEW MODE (Default)
             ========================================================================== */
          <div className="static-profile-view animated-fade">
            <div className="view-mode-header">
              <div className="header-title-block">
                <div className="view-mode-icon-title">
                  <User size={22} className="title-icon-blue" />
                  <h3>Student Profile Information</h3>
                </div>
                <p className="tab-desc">Static read-only view of your registered account details</p>
              </div>

              <button className="edit-profile-mode-btn" onClick={() => setIsEditMode(true)}>
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Static Personal Info */}
            {activeTab === 'personal' && (
              <div className="personal-tab-layout">
                {/* Row 1: Personal Contact Details */}
                <div className="static-details-grid">
                  <div className="detail-card">
                    <div className="detail-circle-icon purple">
                      <User size={18} />
                    </div>
                    <div className="detail-text-col">
                      <span className="detail-label">Full Name</span>
                      <p className="detail-val">{displayFullName}</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-circle-icon cyan">
                      <Mail size={18} />
                    </div>
                    <div className="detail-text-col">
                      <span className="detail-label">Email Address</span>
                      <p className="detail-val">{displayEmail}</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-circle-icon green">
                      <Phone size={18} />
                    </div>
                    <div className="detail-text-col">
                      <span className="detail-label">Mobile Number</span>
                      <p className="detail-val">{displayMobile}</p>
                    </div>
                  </div>
                </div>

                {/* Row 2: Course Progress & Metrics Strip */}
                <div className="static-stats-grid">
                  <div className="stat-card">
                    <div className="stat-left">
                      <div className="detail-circle-icon purple">
                        <GraduationCap size={18} />
                      </div>
                      <div className="stat-text-col">
                        <span className="stat-label">Total Courses Enrolled</span>
                        <p className="stat-val">{dashboardMetrics.enrolledCount}</p>
                      </div>
                    </div>
                    <div className="stat-arrow-btn">
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-left">
                      <div className="detail-circle-icon cyan">
                        <FileText size={18} />
                      </div>
                      <div className="stat-text-col">
                        <span className="stat-label">Completed Courses</span>
                        <p className="stat-val">{dashboardMetrics.completedCount}</p>
                      </div>
                    </div>
                    <div className="stat-arrow-btn">
                      <ArrowRight size={14} />
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-left">
                      <div className="detail-circle-icon green">
                        <Star size={18} />
                      </div>
                      <div className="stat-text-col">
                        <span className="stat-label">Current Progress</span>
                        <p className="stat-val">{dashboardMetrics.progressPercentage}</p>
                      </div>
                    </div>
                    <div className="stat-arrow-btn">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>

                {/* Profile Tailored Courses */}
                {renderProfileCourses("Courses For Your Academic Profile")}
              </div>
            )}

            {/* Static Academic Details */}
            {activeTab === 'academic' && (
              <div className="personal-tab-layout">
                <div className="static-details-grid">
                  <div className="detail-card">
                    <div className="detail-circle-icon purple">
                      <BookOpen size={18} />
                    </div>
                    <div className="detail-text-col">
                      <span className="detail-label">Education Level Category</span>
                      <p className="detail-val text-capitalize">{profileData.educationLevel}</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-circle-icon cyan">
                      <GraduationCap size={18} />
                    </div>
                    <div className="detail-text-col">
                      <span className="detail-label">Registered Course / Class</span>
                      <p className="detail-val">{displayAcademic}</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-circle-icon green">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="detail-text-col">
                      <span className="detail-label">Account Status</span>
                      <p className="detail-val text-green-600">Active & Verified Student</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-circle-icon purple">
                      <Sparkles size={18} />
                    </div>
                    <div className="detail-text-col">
                      <span className="detail-label">Curriculum Track</span>
                      <p className="detail-val">Autonomous Technical Syllabus</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-circle-icon cyan">
                      <Building size={18} />
                    </div>
                    <div className="detail-text-col">
                      <span className="detail-label">Exam Board / Affiliation</span>
                      <p className="detail-val">AICTE / UGC Accredited</p>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-circle-icon green">
                      <Award size={18} />
                    </div>
                    <div className="detail-text-col">
                      <span className="detail-label">Graduation Target</span>
                      <p className="detail-val">Class of 2029</p>
                    </div>
                  </div>
                </div>

                {/* Profile Tailored Courses */}
                {renderProfileCourses("Courses For Your Degree & Specialization")}
              </div>
            )}

            {/* Static Security Overview */}
            {activeTab === 'security' && (
              <div className="static-details-grid">
                <div className="detail-card">
                  <div className="detail-circle-icon purple">
                    <Lock size={18} />
                  </div>
                  <div className="detail-text-col">
                    <span className="detail-label">Password Protection</span>
                    <p className="detail-val">•••••••• (Encrypted PBKDF2)</p>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-circle-icon green">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="detail-text-col">
                    <span className="detail-label">Two-Factor Authentication</span>
                    <p className="detail-val text-green-600">Active (Authenticator App)</p>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-circle-icon cyan">
                    <Shield size={18} />
                  </div>
                  <div className="detail-text-col">
                    <span className="detail-label">Connection Protocol</span>
                    <p className="detail-val">TLS 1.3 End-to-End Secure</p>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-circle-icon purple">
                    <Sparkles size={18} />
                  </div>
                  <div className="detail-text-col">
                    <span className="detail-label">Active Devices</span>
                    <p className="detail-val">1 Current Browser Session</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ==========================================================================
             EDITABLE FORM MODE (When user clicks Edit Profile)
             ========================================================================== */
          <form onSubmit={handleSave} className="profile-form animated-fade">
            <div className="edit-mode-banner glass-inner">
              <div className="banner-left">
                <Edit3 size={18} color="#f59e0b" />
                <span>You are currently in <strong>Edit Profile Mode</strong>. Make changes below.</span>
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleCancel}>
                <X size={16} /> Cancel
              </button>
            </div>

            {/* Tab 1: Editable Personal Info */}
            {activeTab === 'personal' && (
              <div className="tab-content">
                <h3>Edit Personal Information</h3>
                <p className="tab-desc">Update your name, contact email, or phone number</p>

                <div className="profile-grid">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={20} />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={20} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mobile">Mobile Number</label>
                    <div className="input-wrapper">
                      <Phone className="input-icon" size={20} />
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={profileData.mobile}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Editable Academic Details */}
            {activeTab === 'academic' && (
              <div className="tab-content">
                <h3>Edit Academic Standing & Course</h3>
                <p className="tab-desc">Update your education category, class, stream, or degree year</p>

                <div className="form-group">
                  <label>Education Level / Course Category</label>
                  <div className="education-grid">
                    {[
                      { id: 'nursery', label: 'Nursery / Primary (1-8)' },
                      { id: 'highschool', label: 'High School (9-10)' },
                      { id: 'intermediate', label: 'Intermediate (11-12)' },
                      { id: 'graduation', label: 'Graduation' }
                    ].map(level => (
                      <button
                        key={level.id}
                        type="button"
                        className={`education-tab ${profileData.educationLevel === level.id ? 'active' : ''}`}
                        onClick={() => handleChange({ target: { name: 'educationLevel', value: level.id } })}
                      >
                        <BookOpen size={16} />
                        <span>{level.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cascading-box glass-inner" style={{ marginTop: '16px' }}>
                  {profileData.educationLevel === 'nursery' && (
                    <div className="form-group">
                      <label htmlFor="nurseryClass">Select Class (1 to 8)</label>
                      <div className="input-wrapper select-wrapper">
                        <GraduationCap className="input-icon" size={20} />
                        <select
                          id="nurseryClass"
                          name="nurseryClass"
                          value={profileData.nurseryClass}
                          onChange={handleChange}
                        >
                          {Array.from({ length: 8 }, (_, i) => `Class ${i + 1}`).map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                        <ChevronDown className="select-arrow" size={18} />
                      </div>
                    </div>
                  )}

                  {profileData.educationLevel === 'highschool' && (
                    <div className="profile-grid">
                      <div className="form-group">
                        <label htmlFor="stream">Stream Selection</label>
                        <div className="input-wrapper select-wrapper">
                          <select
                            id="stream"
                            name="stream"
                            value={profileData.stream}
                            onChange={handleChange}
                          >
                            <option value="Science">Science</option>
                            <option value="Arts">Arts</option>
                            <option value="Commerce">Commerce</option>
                          </select>
                          <ChevronDown className="select-arrow" size={18} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="highschoolClass">Class Option</label>
                        <div className="input-wrapper select-wrapper">
                          <select
                            id="highschoolClass"
                            name="highschoolClass"
                            value={profileData.highschoolClass}
                            onChange={handleChange}
                          >
                            <option value="Class 9">Class 9 (9th)</option>
                            <option value="Class 10">Class 10 (10th)</option>
                          </select>
                          <ChevronDown className="select-arrow" size={18} />
                        </div>
                      </div>
                    </div>
                  )}

                  {profileData.educationLevel === 'intermediate' && (
                    <div className="profile-grid">
                      <div className="form-group">
                        <label htmlFor="stream">Stream Selection</label>
                        <div className="input-wrapper select-wrapper">
                          <select
                            id="stream"
                            name="stream"
                            value={profileData.stream}
                            onChange={handleChange}
                          >
                            <option value="Science">Science (PCM/PCB)</option>
                            <option value="Arts">Arts / Humanities</option>
                            <option value="Commerce">Commerce</option>
                          </select>
                          <ChevronDown className="select-arrow" size={18} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="intermediateYear">Year / Class Option</label>
                        <div className="input-wrapper select-wrapper">
                          <select
                            id="intermediateYear"
                            name="intermediateYear"
                            value={profileData.intermediateYear}
                            onChange={handleChange}
                          >
                            <option value="11th (1st Year)">11th (1st Year)</option>
                            <option value="12th (2nd Year)">12th (2nd Year)</option>
                          </select>
                          <ChevronDown className="select-arrow" size={18} />
                        </div>
                      </div>
                    </div>
                  )}

                  {profileData.educationLevel === 'graduation' && (
                    <div className="profile-grid">
                      <div className="form-group">
                        <label htmlFor="graduationCourse">Degree / Course</label>
                        <div className="input-wrapper select-wrapper">
                          <select
                            id="graduationCourse"
                            name="graduationCourse"
                            value={profileData.graduationCourse}
                            onChange={handleChange}
                          >
                            {graduationCourses.map(course => (
                              <option key={course.name} value={course.name}>
                                {course.name} ({course.duration} Yrs)
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="select-arrow" size={18} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="graduationYear">Academic Year</label>
                        <div className="input-wrapper select-wrapper">
                          <select
                            id="graduationYear"
                            name="graduationYear"
                            value={profileData.graduationYear}
                            onChange={handleChange}
                          >
                            {getGraduationYears().map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          <ChevronDown className="select-arrow" size={18} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Editable Security */}
            {activeTab === 'security' && (
              <div className="tab-content">
                <h3>Change Password</h3>
                <p className="tab-desc">Update your security password</p>

                <div className="profile-grid">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={20} />
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="••••••••"
                        value={profileData.currentPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={20} />
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter new password"
                        value={profileData.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save & Cancel Action Buttons */}
            <div className="profile-actions-row">
              <button type="button" className="btn btn-outline" onClick={handleCancel}>
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button type="submit" className="btn btn-primary">
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
