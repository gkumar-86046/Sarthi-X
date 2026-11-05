/**
 * admin/src/pages/Profile/AdminProfile.jsx
 */

import React, { useState } from 'react';
import {
  Shield,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateAdminProfile } from '../../services/api';
import Badge from '../../components/common/Badge';
import Notification from '../../components/common/Notification';

const AdminProfile = () => {
  const { user, updateProfileState } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || user?.full_name || 'System Administrator');
  const [mobile, setMobile] = useState(user?.mobile || '9999999999');
  const [bio, setBio] = useState(user?.bio || 'Chief Academic Officer & Platform Administrator');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateAdminProfile({
        full_name: fullName,
        fullName: fullName,
        mobile,
        bio,
      });
      if (res?.success) {
        updateProfileState({ fullName, full_name: fullName, mobile, bio });
        notify('Admin profile updated successfully.');
      } else {
        notify(res?.message || 'Update failed', 'error');
      }
    } catch (err) {
      notify(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-profile-page">
      <Notification notification={notification} onClose={() => setNotification(null)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left Column: Admin Identity Badge Card */}
        <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              margin: '0 auto 16px auto',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 700,
              boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
            }}
          >
            {fullName ? fullName[0] : 'A'}
          </div>

          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {fullName}
          </h3>
          <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {user?.email || 'admin@sarathix.com'}
          </p>

          <Badge variant="primary" size="md">
            {user?.role ? user.role.toUpperCase() : 'ENTERPRISE ADMIN'}
          </Badge>

          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'left',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Security Tier:</span>
              <strong style={{ color: '#34d399' }}>Level 5 (Superuser)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Multi-Factor Auth:</span>
              <strong style={{ color: '#fff' }}>Enforced (JWT)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Database Access:</span>
              <strong style={{ color: '#fff' }}>MySQL (Root Read/Write)</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Update Credentials & Permissions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Edit Form */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 700 }}>
              Edit Administrative Details
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Update your public faculty identity and contact information.
            </p>

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="input-field"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  className="input-field"
                  value={user?.email || 'admin@sarathix.com'}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label className="form-label">Administrative Bio / Role Summary</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  <Save size={16} />
                  <span>{isSubmitting ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* System Privileges Overview */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--primary)" />
              <span>Assigned Administrative Capabilities</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {[
                'Full Course & Curriculum Authoring',
                'Upload & Delete Lecture Videos/PDFs',
                'Student Account Moderation & Suspension',
                'Diagnostic Question Bank Management',
                'Student Performance Telemetry Inspection',
                'Automated Career Roadmap Configuration',
              ].map((priv, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <CheckCircle2 size={15} color="#10b981" />
                  <span>{priv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;

