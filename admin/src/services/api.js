/**
 * admin/src/services/api.js
 * Central API Client for Sarathi-X Admin Console
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'sarathi_admin_token';
const REFRESH_KEY = 'sarathi_admin_refresh_token';
const USER_KEY = 'sarathi_admin_user';

// Storage helpers
export const getAdminToken = () => localStorage.getItem(TOKEN_KEY);
export const getAdminUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAdminSession = (token, refresh, user) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAdminSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
};

// Generic request wrapper
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = getAdminToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Invalid JSON response from server');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // If unauthorized, notify
      console.warn('Admin unauthorized/forbidden:', data?.message);
    }
    const err = new Error(data?.message || `Request failed with status ${response.status}`);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ─── AUTHENTICATION ──────────────────────────────────────────────────────────
export const adminLogin = async (email, password) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.success && data?.access_token) {
    // Check role
    const userRole = data?.user?.role || 'student';
    if (userRole !== 'admin' && userRole !== 'faculty') {
      throw new Error(`Unauthorized. Account has role '${userRole}', but 'admin' or 'faculty' is required.`);
    }
    setAdminSession(data.access_token, data.refresh_token, data.user);
  }
  return data;
};

export const adminLogout = async () => {
  clearAdminSession();
  return { success: true };
};

// ─── DASHBOARD & ANALYTICS ───────────────────────────────────────────────────
export const getDashboardStats = () => request('/admin/dashboard');
export const getPerformanceAnalytics = () => request('/admin/analytics/performance');

// ─── COURSES & CURRICULUM MANAGEMENT ─────────────────────────────────────────
export const getCourses = (search = '', educationLevel = 'all') => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (educationLevel && educationLevel !== 'all') params.append('education_level', educationLevel);
  return request(`/admin/courses?${params.toString()}`);
};

export const getCourseDetail = (courseId) => request(`/admin/courses/${courseId}`);

export const createCourse = (courseData) =>
  request('/admin/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });

export const updateCourse = (courseId, courseData) =>
  request(`/admin/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });

export const deleteCourse = (courseId) =>
  request(`/admin/courses/${courseId}`, {
    method: 'DELETE',
  });

// Modules & Lessons (Lectures, PDF notes, Quizzes)
export const addModule = (courseId, moduleData) =>
  request(`/admin/courses/${courseId}/modules`, {
    method: 'POST',
    body: JSON.stringify(moduleData),
  });

export const deleteModule = (moduleId) =>
  request(`/admin/modules/${moduleId}`, {
    method: 'DELETE',
  });

export const addLesson = (moduleId, lessonData) =>
  request(`/admin/modules/${moduleId}/lessons`, {
    method: 'POST',
    body: JSON.stringify(lessonData),
  });

export const deleteLesson = (lessonId) =>
  request(`/admin/lessons/${lessonId}`, {
    method: 'DELETE',
  });

// ─── ROADMAPS & QUESTIONS ────────────────────────────────────────────────────
export const getRoadmaps = () => request('/admin/roadmaps');
export const getQuestionBank = () => request('/admin/questions');

// ─── STUDENTS DIRECTORY ──────────────────────────────────────────────────────
export const getStudents = (search = '', educationLevel = 'all') => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (educationLevel && educationLevel !== 'all') params.append('education_level', educationLevel);
  return request(`/admin/students?${params.toString()}`);
};

export const toggleStudentStatus = (studentId) =>
  request(`/admin/students/${studentId}/status`, {
    method: 'PATCH',
  });

// ─── PROFILE ─────────────────────────────────────────────────────────────────
export const updateAdminProfile = (profileData) =>
  request('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });

