import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, LogIn, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { loginUser } from '../services/api';

const Login = ({ onNavigate, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // ── Call real backend API ──────────────────────────────────────────────
      const data = await loginUser({
        email:    formData.email,
        password: formData.password,
      });

      setNotification({ type: 'success', message: 'Welcome back! Logging you in...' });

      // Map backend user object → frontend session shape
      const userSession = {
        fullName:       data.user.full_name,
        email:          data.user.email,
        mobile:         data.user.mobile,
        educationLevel: data.user.education_level,
        academicDetail: data.user.academic_detail,
        stream:         data.user.stream,
        nurseryClass:   data.user.nursery_class,
        highschoolClass:data.user.highschool_class,
        intermediateYear:data.user.intermediate_year,
        graduationCourse:data.user.graduation_course,
        graduationYear: data.user.graduation_year,
        avatarUrl:      data.user.avatar_url,
        bio:            data.user.bio,
      };

      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(userSession);
        else if (onNavigate) onNavigate('home');
      }, 900);

    } catch (err) {
      // Show server error message to user
      setNotification({
        type: 'error',
        message: err.message || 'Login failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Top Header / Back Button */}
        <div className="auth-top">
          <button className="auth-back-btn" onClick={() => onNavigate && onNavigate('home')}>
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Auth Glass Card */}
        <div className="auth-card glass">
          <div className="auth-header">
            <div className="auth-badge">
              <Sparkles size={16} />
              <span>Welcome Back</span>
            </div>
            <h2>Sign in to Sarathi-X</h2>
            <p>Access your personalized learning path & courses</p>
          </div>

          {notification && (
            <div className={`auth-alert auth-alert-${notification.type}`}>
              {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{notification.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password">Password</label>
                <a href="#forgot" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('Password reset instructions sent to your email.'); }}>
                  Forgot password?
                </a>
              </div>
              <div className={`input-wrapper ${errors.password ? 'input-error' : ''}`}>
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
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
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Remember Me */}
            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span>Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary auth-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Quick Demo Credentials Autofill */}
            <div style={{ marginTop: '14px', textAlign: 'center' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '20px', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                onClick={() => {
                  setFormData({
                    email: 'student@sarathix.com',
                    password: 'Student@123',
                    rememberMe: true
                  });
                  setErrors({});
                }}
              >
                <Sparkles size={14} />
                <span>Fill Demo Student (student@sarathix.com)</span>
              </button>
            </div>
          </form>

          {/* Social Logins */}
          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="social-buttons">
            <button className="social-btn" type="button" onClick={() => alert('Google authentication simulated')}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
              </svg>
              <span>Google</span>
            </button>
            <button className="social-btn" type="button" onClick={() => alert('GitHub authentication simulated')}>
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

export default Login;
