import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, BookOpen, GraduationCap, ArrowLeft, UserPlus, CheckCircle, AlertCircle, Sparkles, ChevronDown } from 'lucide-react';
import { registerUser } from '../services/api';

const graduationCourses = [
  { name: 'B.Tech / B.E (Engineering)', duration: 4 },
  { name: 'MBBS (Medical)', duration: 5 },
  { name: 'B.Sc (Bachelor of Science)', duration: 3 },
  { name: 'B.Com (Bachelor of Commerce)', duration: 3 },
  { name: 'B.A (Bachelor of Arts)', duration: 3 },
  { name: 'BCA (Computer Applications)', duration: 3 },
  { name: 'BBA (Business Administration)', duration: 3 },
];

const Register = ({ onNavigate, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    educationLevel: 'nursery', // 'nursery' | 'highschool' | 'intermediate' | 'graduation'
    nurseryClass: 'Class 1',
    stream: 'Science',
    highschoolClass: 'Class 9',
    intermediateYear: '11th (1st Year)',
    graduationCourse: 'B.Tech / B.E (Engineering)',
    graduationYear: '1st Year',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Reset nested selections when changing education level
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

      // Reset graduation year when changing course
      if (name === 'graduationCourse') {
        updated.graduationYear = '1st Year';
      }

      return updated;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Get dynamic graduation years based on course duration
  const getGraduationYears = () => {
    const courseObj = graduationCourses.find(c => c.name === formData.graduationCourse);
    const duration = courseObj ? courseObj.duration : 3;
    const years = [];
    for (let i = 1; i <= duration; i++) {
      let suffix = i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th';
      years.push(`${i}${suffix} Year`);
    }
    return years;
  };

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: '#f87171' };
    if (score === 2 || score === 3) return { score: 65, label: 'Medium', color: '#facc15' };
    return { score: 100, label: 'Strong', color: '#4ade80' };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\s+/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the Terms and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setNotification(null);

    try {
      // ── Call real backend API ────────────────────────────────────────────────
      const data = await registerUser({
        fullName:        formData.fullName,
        email:           formData.email,
        mobile:          formData.mobile,
        password:        formData.password,
        confirmPassword: formData.confirmPassword,
        educationLevel:  formData.educationLevel,
        nurseryClass:    formData.nurseryClass,
        stream:          formData.stream,
        highschoolClass: formData.highschoolClass,
        intermediateYear:formData.intermediateYear,
        graduationCourse:formData.graduationCourse,
        graduationYear:  formData.graduationYear,
        agreeTerms:      formData.agreeTerms,
      });

      setNotification({ type: 'success', message: 'Account created successfully! Logging you in...' });

      // Map backend user → frontend session shape
      const userData = {
        fullName:        data.user.full_name,
        email:           data.user.email,
        mobile:          data.user.mobile,
        educationLevel:  data.user.education_level,
        academicDetail:  data.user.academic_detail,
        stream:          data.user.stream,
        nurseryClass:    data.user.nursery_class,
        highschoolClass: data.user.highschool_class,
        intermediateYear:data.user.intermediate_year,
        graduationCourse:data.user.graduation_course,
        graduationYear:  data.user.graduation_year,
        avatarUrl:       data.user.avatar_url,
        bio:             data.user.bio,
      };

      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(userData);
        else if (onNavigate) onNavigate('login');
      }, 1000);

    } catch (err) {
      // Show validation field errors or server message
      if (err.errors) {
        // Marshmallow field-level errors: { fieldName: ['msg'] }
        const mapped = {};
        Object.entries(err.errors).forEach(([field, msgs]) => {
          mapped[field] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors(mapped);
      }
      setNotification({
        type: 'error',
        message: err.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container register-container">
        {/* Top Header / Back Button */}
        <div className="auth-top">
          <button className="auth-back-btn" onClick={() => onNavigate && onNavigate('home')}>
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Auth Card */}
        <div className="auth-card glass">
          <div className="auth-header">
            <div className="auth-badge">
              <Sparkles size={16} />
              <span>Join Sarathi-X</span>
            </div>
            <h2>Create Your Student Account</h2>
            <p>Select your course level for a personalized learning roadmap</p>
          </div>

          {notification && (
            <div className={`auth-alert auth-alert-${notification.type}`}>
              {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{notification.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <div className={`input-wrapper ${errors.fullName ? 'input-error' : ''}`}>
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            {/* Mobile & Email Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <div className={`input-wrapper ${errors.mobile ? 'input-error' : ''}`}>
                  <Phone className="input-icon" size={20} />
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    placeholder="10-digit mobile no."
                    value={formData.mobile}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.mobile && <span className="error-message">{errors.mobile}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className={`input-wrapper ${errors.email ? 'input-error' : ''}`}>
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            {/* Education Level Selector */}
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
                    className={`education-tab ${formData.educationLevel === level.id ? 'active' : ''}`}
                    onClick={() => handleChange({ target: { name: 'educationLevel', value: level.id } })}
                  >
                    <BookOpen size={16} />
                    <span>{level.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Cascading Options */}
            <div className="cascading-box glass-inner">
              {/* Nursery / Primary Options */}
              {formData.educationLevel === 'nursery' && (
                <div className="form-group">
                  <label htmlFor="nurseryClass">Select Class (1 to 8)</label>
                  <div className="input-wrapper select-wrapper">
                    <GraduationCap className="input-icon" size={20} />
                    <select
                      id="nurseryClass"
                      name="nurseryClass"
                      value={formData.nurseryClass}
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

              {/* High School Options */}
              {formData.educationLevel === 'highschool' && (
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="stream">Stream</label>
                    <div className="input-wrapper select-wrapper">
                      <select
                        id="stream"
                        name="stream"
                        value={formData.stream}
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
                        value={formData.highschoolClass}
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

              {/* Intermediate Options */}
              {formData.educationLevel === 'intermediate' && (
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="stream">Stream</label>
                    <div className="input-wrapper select-wrapper">
                      <select
                        id="stream"
                        name="stream"
                        value={formData.stream}
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
                        value={formData.intermediateYear}
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

              {/* Graduation Options */}
              {formData.educationLevel === 'graduation' && (
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="graduationCourse">Degree / Course</label>
                    <div className="input-wrapper select-wrapper">
                      <select
                        id="graduationCourse"
                        name="graduationCourse"
                        value={formData.graduationCourse}
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
                        value={formData.graduationYear}
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

            {/* Password Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className={`input-wrapper ${errors.password ? 'input-error' : ''}`}>
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Min 8 chars"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className={`input-wrapper ${errors.confirmPassword ? 'input-error' : ''}`}>
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter pass"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Strength meter and errors */}
            {formData.password && (
              <div className="strength-meter">
                <div className="strength-bar-bg">
                  <div
                    className="strength-bar-fill"
                    style={{
                      width: `${passwordStrength.score}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <span className="strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            {errors.password && <span className="error-message">{errors.password}</span>}
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

            {/* Terms & Conditions Checkbox */}
            <div className="form-group" style={{ marginTop: '6px' }}>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span>
                  I agree to the{' '}
                  <a href="#terms" className="forgot-link" onClick={(e) => e.preventDefault()}>
                    Terms of Service
                  </a>{' '}
                  and Privacy Policy
                </span>
              </label>
              {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary auth-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>

          {/* Social Signup */}
          <div className="auth-divider">
            <span>Or register with</span>
          </div>

          <div className="social-buttons">
            <button className="social-btn" type="button" onClick={() => alert('Google registration simulated')}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
              </svg>
              <span>Google</span>
            </button>
            <button className="social-btn" type="button" onClick={() => alert('GitHub registration simulated')}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
