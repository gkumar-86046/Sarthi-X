import React, { useState } from 'react';
import {
  Shield, Lock, Bell, MapPin, Globe, CheckCircle2, Save, Key,
  Smartphone, Mail, Compass, Sparkles, ShieldCheck, Check, RotateCcw,
  ChevronDown, Volume2, Video, Copy
} from 'lucide-react';

const SettingsPage = ({ user }) => {
  // 2FA Security State
  const [is2faEnabled, setIs2faEnabled] = useState(true);
  const [twoFactorMethod, setTwoFactorMethod] = useState('authenticator'); // 'sms' | 'email' | 'authenticator'
  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    classReminders: true,
    aiMentorTips: true,
    quizNotifications: false,
    soundEffects: true
  });

  // Location Access & Privacy State
  const [allowLocation, setAllowLocation] = useState(true);
  const [locationStatus, setLocationStatus] = useState('New Delhi, India (Detected for CBSE Board)');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    shareLeaderboard: true
  });

  // Language & Regional State
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTogglePrivacy = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const detectLiveLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(2);
          const lon = position.coords.longitude.toFixed(2);
          setLocationStatus(`Live Location Access Granted (Lat: ${lat}, Lon: ${lon})`);
          setIsDetectingLocation(false);
          setAllowLocation(true);
        },
        (error) => {
          setLocationStatus('Location Access Denied by Browser. Using default region.');
          setIsDetectingLocation(false);
        }
      );
    } else {
      setLocationStatus('Geolocation is not supported by your browser.');
      setIsDetectingLocation(false);
    }
  };

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2800);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard?.writeText(
      '8492-1049\n3920-4820\n1048-9204\n5829-3021\n9284-1039\n4829-7492'
    );
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleResetDefaults = () => {
    setIs2faEnabled(true);
    setTwoFactorMethod('authenticator');
    setAllowLocation(true);
    setLocationStatus('New Delhi, India (Detected for CBSE Board)');
    setNotifications({
      emailAlerts: true,
      classReminders: true,
      aiMentorTips: true,
      quizNotifications: false,
      soundEffects: true
    });
    setPrivacy({
      publicProfile: true,
      shareLeaderboard: true
    });
    setPreferredLanguage('English');
  };

  return (
    <div className="settings-page-container">
      {/* Settings Header Banner */}
      <div className="settings-header-banner glass">
        <div className="banner-title-group">
          <div className="settings-icon-box">
            <Shield size={26} color="#818cf8" />
          </div>
          <div>
            <div className="settings-badge-row">
              <span className="settings-live-tag">
                <Sparkles size={12} color="#818cf8" /> SECURE IDENTITY & SYSTEM PREFERENCES
              </span>
            </div>
            <h2>Account & System Settings</h2>
            <p>Manage Two-Factor Authentication (2FA), Notifications, Location Permissions & System Preferences</p>
          </div>
        </div>

        {/* Header Telemetry & Quick Action */}
        <div className="settings-header-telemetry">
          <div className="security-telemetry-pill">
            <div className="telemetry-icon-box">
              <ShieldCheck size={18} color="#4ade80" />
            </div>
            <div>
              <span className="telemetry-label">SECURITY HEALTH</span>
              <div className="telemetry-val-row">
                <span className="telemetry-val">{is2faEnabled ? '96% Strong' : '65% Moderate'}</span>
                <span className={`telemetry-dot ${is2faEnabled ? 'secure' : 'warning'}`}></span>
              </div>
            </div>
          </div>
          <button type="submit" form="settings-form" className="header-save-btn">
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {isSaved && (
        <div className="save-toast glass">
          <CheckCircle2 size={20} color="#4ade80" />
          <span>All settings & 2FA security preferences saved successfully!</span>
        </div>
      )}

      <form id="settings-form" onSubmit={handleSaveSettings} className="settings-form">
        {/* SECTION 1: TWO-FACTOR AUTHENTICATION (2FA) & SECURITY */}
        <div className="settings-section-card glass">
          <div className="section-card-header">
            <div className="header-left">
              <div className="section-icon-box pink">
                <Lock size={20} color="#ec4899" />
              </div>
              <div>
                <div className="title-tag-row">
                  <h3>Two-Factor Authentication (2FA) Security</h3>
                  <span className="badge-pill-pink">Proctor Required</span>
                </div>
                <p className="card-subtitle">Add an extra layer of biometric & OTP authentication to your Sarathi-X account</p>
              </div>
            </div>

            {/* 2FA Master Switch */}
            <div className="toggle-group">
              <span className={`toggle-state-text ${is2faEnabled ? 'active' : ''}`}>
                {is2faEnabled ? 'Active' : 'Disabled'}
              </span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={is2faEnabled}
                  onChange={() => setIs2faEnabled(!is2faEnabled)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          {is2faEnabled && (
            <div className="settings-body-box animated-fade glass-inner">
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-title">2FA Verification Method</span>
                  <span className="setting-desc">Choose how Sarathi-X transmits one-time security codes during login</span>
                </div>

                <div className="method-pills">
                  <button
                    type="button"
                    className={`method-pill ${twoFactorMethod === 'authenticator' ? 'active' : ''}`}
                    onClick={() => setTwoFactorMethod('authenticator')}
                  >
                    <Key size={15} />
                    <span>Authenticator App</span>
                    {twoFactorMethod === 'authenticator' && <Check size={14} className="method-check" />}
                    <span className="method-badge-rec">Recommended</span>
                  </button>
                  <button
                    type="button"
                    className={`method-pill ${twoFactorMethod === 'sms' ? 'active' : ''}`}
                    onClick={() => setTwoFactorMethod('sms')}
                  >
                    <Smartphone size={15} />
                    <span>SMS OTP</span>
                    {twoFactorMethod === 'sms' && <Check size={14} className="method-check" />}
                  </button>
                  <button
                    type="button"
                    className={`method-pill ${twoFactorMethod === 'email' ? 'active' : ''}`}
                    onClick={() => setTwoFactorMethod('email')}
                  >
                    <Mail size={15} />
                    <span>Email OTP</span>
                    {twoFactorMethod === 'email' && <Check size={14} className="method-check" />}
                  </button>
                </div>
              </div>

              <div className="setting-row border-top-line">
                <div className="setting-info">
                  <span className="setting-title">Emergency Recovery Codes</span>
                  <span className="setting-desc">Generate single-use 8-digit backup codes if you lose access to your primary 2FA device</span>
                </div>

                <button
                  type="button"
                  className="backup-codes-btn"
                  onClick={() => setShowBackupCodesModal(true)}
                >
                  <Key size={14} />
                  <span>View Backup Codes</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: LOCATION ACCESS & PRIVACY PERMISSIONS */}
        <div className="settings-section-card glass">
          <div className="section-card-header">
            <div className="header-left">
              <div className="section-icon-box cyan">
                <MapPin size={20} color="#06b6d4" />
              </div>
              <div>
                <div className="title-tag-row">
                  <h3>Location Access & Regional Settings</h3>
                  <span className="badge-pill-cyan">Permissions</span>
                </div>
                <p className="card-subtitle">Allow location telemetry for localized exam board patterns and regional course syllabus recommendations</p>
              </div>
            </div>

            {/* Location Access Toggle Switch */}
            <div className="toggle-group">
              <span className={`toggle-state-text ${allowLocation ? 'active' : ''}`}>
                {allowLocation ? 'Allowed' : 'Blocked'}
              </span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={allowLocation}
                  onChange={() => setAllowLocation(!allowLocation)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-body-box glass-inner">
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-title">Detected Location Status</span>
                <div className="location-status-badge">
                  <span className="loc-dot"></span>
                  <span className="location-status-text">{locationStatus}</span>
                </div>
              </div>

              <button
                type="button"
                className="detect-loc-btn"
                onClick={detectLiveLocation}
                disabled={isDetectingLocation}
              >
                <Compass size={15} className={isDetectingLocation ? 'spin-icon' : ''} />
                <span>{isDetectingLocation ? 'Querying GPS...' : 'Detect Live Location'}</span>
              </button>
            </div>

            <div className="setting-row border-top-line">
              <div className="setting-info">
                <span className="setting-title">Leaderboard & Rank Visibility</span>
                <span className="setting-desc">Display your academic percentile rank on public institute class leaderboards</span>
              </div>

              <div className="toggle-group">
                <span className={`toggle-state-text ${privacy.shareLeaderboard ? 'active' : ''}`}>
                  {privacy.shareLeaderboard ? 'Public' : 'Hidden'}
                </span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={privacy.shareLeaderboard}
                    onChange={() => handleTogglePrivacy('shareLeaderboard')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: NOTIFICATION PREFERENCES */}
        <div className="settings-section-card glass">
          <div className="section-card-header">
            <div className="header-left">
              <div className="section-icon-box amber">
                <Bell size={20} color="#f59e0b" />
              </div>
              <div>
                <div className="title-tag-row">
                  <h3>Notification Preferences</h3>
                  <span className="badge-pill-amber">Real-Time Alerts</span>
                </div>
                <p className="card-subtitle">Control when and how Sarathi-X sends study reminders, live lecture pings & AI alerts</p>
              </div>
            </div>
          </div>

          <div className="settings-body-box glass-inner">
            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-title-with-icon">
                  <Mail size={15} color="#818cf8" />
                  <span className="setting-title">Email Course Updates & Homework Notes</span>
                </div>
                <span className="setting-desc">Receive email alerts when new curriculum modules, test results, or study notes are uploaded</span>
              </div>
              <div className="toggle-group">
                <span className={`toggle-state-text ${notifications.emailAlerts ? 'active' : ''}`}>
                  {notifications.emailAlerts ? 'On' : 'Off'}
                </span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.emailAlerts}
                    onChange={() => handleToggleNotification('emailAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="setting-row border-top-line">
              <div className="setting-info">
                <div className="setting-title-with-icon">
                  <Video size={15} color="#06b6d4" />
                  <span className="setting-title">Live Class & AI Mentor Reminders</span>
                </div>
                <span className="setting-desc">Get push reminders 15 minutes before scheduled live interactive mentoring sessions</span>
              </div>
              <div className="toggle-group">
                <span className={`toggle-state-text ${notifications.classReminders ? 'active' : ''}`}>
                  {notifications.classReminders ? 'On' : 'Off'}
                </span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.classReminders}
                    onChange={() => handleToggleNotification('classReminders')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="setting-row border-top-line">
              <div className="setting-info">
                <div className="setting-title-with-icon">
                  <Volume2 size={15} color="#f59e0b" />
                  <span className="setting-title">Sound FX & Audio Feedback</span>
                </div>
                <span className="setting-desc">Play audio chimes during Game Zone streaks, level-ups, and interactive quiz completions</span>
              </div>
              <div className="toggle-group">
                <span className={`toggle-state-text ${notifications.soundEffects ? 'active' : ''}`}>
                  {notifications.soundEffects ? 'On' : 'Off'}
                </span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.soundEffects}
                    onChange={() => handleToggleNotification('soundEffects')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: LANGUAGE & REGIONAL PREFERENCES */}
        <div className="settings-section-card glass">
          <div className="section-card-header">
            <div className="header-left">
              <div className="section-icon-box indigo">
                <Globe size={20} color="#818cf8" />
              </div>
              <div>
                <div className="title-tag-row">
                  <h3>Language & Regional Preferences</h3>
                  <span className="badge-pill-indigo">Localization</span>
                </div>
                <p className="card-subtitle">Choose your preferred instruction language for AI Mentor voice & conversational captions</p>
              </div>
            </div>
          </div>

          <div className="settings-body-box glass-inner">
            <div className="setting-row">
              <div className="setting-info">
                <span className="setting-title">Preferred Medium Language</span>
                <span className="setting-desc">Used for AI Mentor responses, explanations, and interface subtitles</span>
              </div>

              <div className="settings-select-container">
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="settings-select"
                >
                  <option value="English">English (Global Academic)</option>
                  <option value="Hindi">Hindi (हिंदी - मानक)</option>
                  <option value="Hinglish">Hinglish (Hindi + English Mix)</option>
                </select>
                <ChevronDown size={16} className="settings-select-icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Save Settings Action Bar */}
        <div className="settings-actions-bar">
          <div className="save-status-info">
            <span className="save-status-indicator"></span>
            <span className="save-status-text">Client state synchronized with Sarathi-X Secure Cloud</span>
          </div>

          <div className="actions-btns-group">
            <button
              type="button"
              className="btn-settings-reset"
              onClick={handleResetDefaults}
            >
              <RotateCcw size={15} />
              <span>Reset Defaults</span>
            </button>
            <button type="submit" className="save-settings-btn">
              <Save size={16} />
              <span>Save All Preferences</span>
            </button>
          </div>
        </div>
      </form>

      {/* 2FA Backup Codes Modal */}
      {showBackupCodesModal && (
        <div className="modal-backdrop-settings" onClick={() => setShowBackupCodesModal(false)}>
          <div className="modal-content-settings glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-settings">
              <div className="section-icon-box amber">
                <Key size={20} color="#f59e0b" />
              </div>
              <div>
                <h3>2FA Backup Recovery Codes</h3>
                <p className="card-subtitle">Single-use emergency recovery credentials</p>
              </div>
            </div>

            <p className="modal-desc-text">
              Store these 8-digit single-use backup recovery codes in a secure password manager. You can use them to access your Sarathi-X account if you lose your phone or 2FA authenticator device.
            </p>

            <div className="codes-grid glass-inner">
              <span>8492 - 1049</span>
              <span>3920 - 4820</span>
              <span>1048 - 9204</span>
              <span>5829 - 3021</span>
              <span>9284 - 1039</span>
              <span>4829 - 7492</span>
            </div>

            <div className="modal-actions-settings">
              <button
                type="button"
                className="btn-settings-reset"
                onClick={handleCopyBackupCodes}
              >
                <Copy size={14} />
                <span>{copiedCodes ? 'Copied to Clipboard!' : 'Copy Codes'}</span>
              </button>
              <button
                type="button"
                className="save-settings-btn"
                onClick={() => setShowBackupCodesModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
