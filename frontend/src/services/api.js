/**
 * src/services/api.js  –  Sarathi-X API Client
 *
 * Central service layer for all backend communication.
 * Handles:
 *   - Base URL config from environment variable
 *   - JWT access token attachment on every request
 *   - Automatic access token refresh when it expires (401)
 *   - Token persistence in localStorage
 *   - Auth: register, login, logout, refresh
 *   - Profile: get, update
 */

// ─── Base URL ──────────────────────────────────────────────────────────────────
// Set REACT_APP_API_URL in frontend/.env to override (e.g. for production)
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─── localStorage Keys ─────────────────────────────────────────────────────────
const ACCESS_TOKEN_KEY  = 'sarathi_access_token';
const REFRESH_TOKEN_KEY = 'sarathi_refresh_token';
const USER_KEY          = 'sarathi_user';

// ─────────────────────────────────────────────────────────────────────────────
// Token Storage Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Save tokens and user data to localStorage after login / register */
export const saveSession = (accessToken, refreshToken, user) => {
  localStorage.setItem(ACCESS_TOKEN_KEY,  accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY,          JSON.stringify(user));
};

/** Clear all session data (on logout or token failure) */
export const clearSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/** Get the stored access token */
export const getAccessToken  = () => localStorage.getItem(ACCESS_TOKEN_KEY);

/** Get the stored refresh token */
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

/** Get the stored user object (parsed from JSON and normalized) */
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u) return null;
    return {
      ...u,
      fullName: u.fullName || u.full_name,
      academicDetail: u.academicDetail || u.academic_detail,
      graduationYear: u.graduationYear || u.graduation_year,
      graduationCourse: u.graduationCourse || u.graduation_course,
      educationLevel: u.educationLevel || u.education_level,
    };
  } catch {
    return null;
  }
};

/** Returns true if a session (access token) exists in storage */
export const isLoggedIn = () => !!getAccessToken();

// ─────────────────────────────────────────────────────────────────────────────
// Core Request Utility
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Internal fetch wrapper.
 * - Attaches Authorization header if a token exists.
 * - On 401, attempts one token refresh then retries the original request.
 * - Returns the parsed JSON body.
 * - Throws an Error with the server's `message` string on non-2xx responses.
 *
 * @param {string} endpoint   - e.g. '/auth/login'
 * @param {object} options    - fetch options (method, body, headers, etc.)
 * @param {boolean} retry     - internal flag to prevent infinite refresh loops
 */
async function request(endpoint, options = {}, retry = true) {
  const url = `${BASE_URL}${endpoint}`;

  // Build headers
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Attach JWT access token if available
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  // ── Handle 401: try to refresh then retry once (except for auth endpoints) ──
  const isAuthEndpoint = endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register');
  if (response.status === 401 && retry && !isAuthEndpoint) {
    const refreshed = await _tryRefreshToken();
    if (refreshed) {
      // Retry the original request with the new token
      return request(endpoint, options, false);
    } else {
      // Refresh failed → clear session and throw
      clearSession();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sarathi:session_expired'));
      }
      throw new Error('Session expired. Please log in again.');
    }
  }

  // Parse JSON response
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Invalid response from server.');
  }

  // Throw structured error for non-2xx responses
  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    err.errors = data?.errors || null;  // Validation errors from marshmallow
    throw err;
  }

  return data;
}

/**
 * Internal helper: attempt to refresh the access token.
 * Returns true on success (new token saved), false on failure.
 */
async function _tryRefreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (data?.success && data?.access_token) {
      // Save new access token, preserve existing refresh token + user
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      return true;
    }
    return false;

  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Register a new student account.
 *
 * @param {object} formData - Matches Register.jsx formData shape:
 *   { fullName, email, mobile, password, confirmPassword,
 *     educationLevel, nurseryClass, stream, highschoolClass,
 *     intermediateYear, graduationCourse, graduationYear, agreeTerms }
 *
 * @returns {{ success, user, access_token, refresh_token, message }}
 */
export const registerUser = async (formData) => {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  });

  // Persist session on successful registration
  if (data.success) {
    saveSession(data.access_token, data.refresh_token, data.user);
  }

  return data;
};

/**
 * Log in with email + password.
 *
 * @param {{ email, password }} credentials
 * @returns {{ success, user, access_token, refresh_token, message }}
 */
export const loginUser = async (credentials) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // Persist session on successful login
  if (data.success) {
    saveSession(data.access_token, data.refresh_token, data.user);
  }

  return data;
};

/**
 * Log out — revokes the server-side refresh token and clears local storage.
 */
export const logoutUser = async () => {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      // Best-effort: tell the server to revoke the refresh token
      await request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
  } catch {
    // Ignore errors — clear local session regardless
  } finally {
    clearSession();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Profile API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the current user's full profile from the backend.
 * @returns {{ success, user }}
 */
export const getProfile = async () => {
  return request('/profile', { method: 'GET' });
};

/**
 * Update editable profile fields.
 *
 * @param {object} fields - Any subset of:
 *   { full_name, mobile, bio, avatar_url, education_level,
 *     nursery_class, stream, highschool_class, intermediate_year,
 *     graduation_course, graduation_year }
 *
 * @returns {{ success, user, message }}
 */
export const updateProfile = async (fields) => {
  const data = await request('/profile', {
    method: 'PATCH',
    body: JSON.stringify(fields),
  });

  // Keep localStorage user in sync with updates
  if (data.success && data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard & Performance API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch real dashboard summary: stats cards, active enrolled courses,
 * upcoming live sessions, and tailored AI recommendations.
 * @returns {Promise<{ success, stats, metrics, courses, upcomingClasses, aiRecommendation }>}
 */
export const getDashboardSummary = async () => {
  return request('/dashboard/summary', { method: 'GET' });
};

/**
 * Fetch real academic performance analytics: overall grade/rank,
 * subject-wise breakdown, weak/strong topics, and test history.
 * @returns {Promise<{ success, performance }>}
 */
export const getDashboardPerformance = async () => {
  return request('/dashboard/performance', { method: 'GET' });
};

/**
 * Fetch all available and enrolled courses with detailed modules.
 * @returns {Promise<{ success, courses }>}
 */
export const getDashboardCourses = async () => {
  return request('/dashboard/courses', { method: 'GET' });
};

/**
 * Update student's lesson progress and next topic for a course.
 * @param {number} courseId
 * @param {{ progress: number, nextTopic?: string }} data
 */
export const updateCourseProgress = async (courseId, data) => {
  return request(`/dashboard/courses/${courseId}/progress`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Real-Time Courses & Lessons API (Admin Uploaded)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all admin-uploaded courses accessible to the authenticated student.
 * Supports real-time filtering by subject and search.
 * @param {{ subject?: string, search?: string }} filters
 * @returns {Promise<{ success: boolean, studentLevel: string, subjects: string[], courses: Array }>}
 */
export const getCourses = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.subject && filters.subject !== 'All Subjects') {
    params.append('subject', filters.subject);
  }
  if (filters.search) {
    params.append('search', filters.search);
  }
  const qs = params.toString() ? `?${params.toString()}` : '';
  return request(`/courses${qs}`, { method: 'GET' });
};

/**
 * Fetch course detail with modules, individual lessons, and completion status.
 * @param {string|number} courseId
 * @returns {Promise<{ success: boolean, course: object }>}
 */
export const getCourseDetail = async (courseId) => {
  return request(`/courses/${courseId}`, { method: 'GET' });
};

/**
 * Enroll student into a course.
 * @param {string|number} courseId
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const enrollCourse = async (courseId) => {
  return request(`/courses/${courseId}/enroll`, { method: 'POST' });
};

/**
 * Mark a lesson completed in real time and recalculate progress.
 * @param {string|number} courseId
 * @param {string|number} lessonId
 * @returns {Promise<{ success: boolean, new_progress: number }>}
 */
export const completeLesson = async (courseId, lessonId) => {
  return request(`/courses/${courseId}/lessons/${lessonId}/complete`, { method: 'POST' });
};

/**
 * Fast O(1) algorithm: Fetch the optimal next lecture for a subject or course.
 * @param {{ subject?: string, course_id?: number|string }} query
 * @returns {Promise<{ success: boolean, lecture: object }>}
 */
export const getPerfectLecture = async (query = {}) => {
  const params = new URLSearchParams();
  if (query.subject && query.subject !== 'All Subjects') {
    params.append('subject', query.subject);
  }
  if (query.course_id) {
    params.append('course_id', query.course_id);
  }
  const qs = params.toString() ? `?${params.toString()}` : '';
  return request(`/courses/perfect-lecture${qs}`, { method: 'GET' });
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin / Faculty Course Management APIs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all courses with admin metrics (enrolled counts, module/lesson totals).
 * @param {{ search?: string, education_level?: string }} filters
 */
export const adminGetCourses = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.education_level && filters.education_level !== 'all') {
    params.append('education_level', filters.education_level);
  }
  const qs = params.toString() ? `?${params.toString()}` : '';
  return request(`/admin/courses${qs}`, { method: 'GET' });
};

/**
 * Fetch single course detail with modules and lessons for editing.
 * @param {number|string} courseId
 */
export const adminGetCourseDetail = async (courseId) => {
  return request(`/admin/courses/${courseId}`, { method: 'GET' });
};

/**
 * Create a new course.
 * @param {object} courseData
 */
export const adminCreateCourse = async (courseData) => {
  return request('/admin/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
};

/**
 * Update an existing course.
 * @param {number|string} courseId
 * @param {object} courseData
 */
export const adminUpdateCourse = async (courseId, courseData) => {
  return request(`/admin/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
};

/**
 * Delete a course and all cascaded modules & lessons.
 * @param {number|string} courseId
 */
export const adminDeleteCourse = async (courseId) => {
  return request(`/admin/courses/${courseId}`, { method: 'DELETE' });
};

/**
 * Add a module to a course syllabus.
 * @param {number|string} courseId
 * @param {object} moduleData
 */
export const adminAddModule = async (courseId, moduleData) => {
  return request(`/admin/courses/${courseId}/modules`, {
    method: 'POST',
    body: JSON.stringify(moduleData),
  });
};

/**
 * Delete a module from a course.
 * @param {number|string} moduleId
 */
export const adminDeleteModule = async (moduleId) => {
  return request(`/admin/modules/${moduleId}`, { method: 'DELETE' });
};

/**
 * Add a lesson (video, notes PDF, quiz) to a module.
 * @param {number|string} moduleId
 * @param {object} lessonData
 */
export const adminAddLesson = async (moduleId, lessonData) => {
  return request(`/admin/modules/${moduleId}/lessons`, {
    method: 'POST',
    body: JSON.stringify(lessonData),
  });
};

/**
 * Delete a lesson.
 * @param {number|string} lessonId
 */
export const adminDeleteLesson = async (lessonId) => {
  return request(`/admin/lessons/${lessonId}`, { method: 'DELETE' });
};

// ─────────────────────────────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────────────────────────────

/** Check if the backend is reachable. Returns { status: 'ok' } or throws. */
export const checkHealth = async () => {
  return request('/health', { method: 'GET' });
};

// ─────────────────────────────────────────────────────────────────────────────
// GameZone & Magic Number Aptitude Arena
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch GameZone overview and student's live aptitude profile.
 */
export const getGameZoneOverview = async () => {
  return request('/gamezone/overview', { method: 'GET' });
};

/**
 * Fetch all registered games from master catalog.
 */
export const getGameCatalog = async () => {
  return request('/gamezone/games', { method: 'GET' });
};

/**
 * Universal Game Start: Launches a session for ANY game.
 * @param {object} params - { gameId, level, mode, playerName }
 */
export const startGameSession = async ({ gameId = 'magic-number', level = 1, mode = 'Standard', playerName = 'Challenger' } = {}) => {
  return request('/gamezone/play/start', {
    method: 'POST',
    body: JSON.stringify({ gameId, level, mode, playerName }),
  });
};

/**
 * Universal Game Submit: Evaluates answer for ANY game.
 * @param {object} params - { gameId, sessionId, questionId, selectedOption, timeTakenSeconds }
 */
export const submitGameAnswer = async ({ gameId = 'magic-number', sessionId, questionId, selectedOption, timeTakenSeconds = 5 }) => {
  return request('/gamezone/play/submit', {
    method: 'POST',
    body: JSON.stringify({ gameId, sessionId, questionId, selectedOption, timeTakenSeconds }),
  });
};

/**
 * Universal Game Finish: Evaluates session & computes mastery stats for ANY game.
 * @param {object} params - { gameId, sessionId, timeSpentSeconds, maxStreak }
 */
export const finishGameSession = async ({ gameId = 'magic-number', sessionId, timeSpentSeconds = 60, maxStreak = 0 }) => {
  return request('/gamezone/play/finish', {
    method: 'POST',
    body: JSON.stringify({ gameId, sessionId, timeSpentSeconds, maxStreak }),
  });
};

/**
 * Universal Game Leaderboard: Retrieves rankings for ANY game.
 */
export const getGameLeaderboard = async ({ gameId = 'magic-number', limit = 10 } = {}) => {
  return request(`/gamezone/play/leaderboard?gameId=${encodeURIComponent(gameId)}&limit=${limit}`, { method: 'GET' });
};

/**
 * Universal Game Academy: Retrieves levels roadmap, methods, and tricks for ANY game.
 */
export const getGameAcademy = async (gameId = 'magic-number') => {
  return request(`/gamezone/play/academy?gameId=${encodeURIComponent(gameId)}`, { method: 'GET' });
};

/**
 * Start a new Magic Number game session for a specific level.
 * @param {object} params - { level, mode, playerName }
 */
export const startMagicNumberGame = async ({ level = 1, mode = 'Standard', playerName = 'Challenger' } = {}) => {
  return startGameSession({ gameId: 'magic-number', level, mode, playerName });
};

/**
 * Submit an answer for a question in a game session.
 * @param {object} params - { sessionId, questionId, selectedOption, timeTakenSeconds }
 */
export const submitMagicNumberAnswer = async ({ sessionId, questionId, selectedOption, timeTakenSeconds = 5 }) => {
  return submitGameAnswer({ gameId: 'magic-number', sessionId, questionId, selectedOption, timeTakenSeconds });
};

/**
 * Finish a game session and generate aptitude assessment report.
 * @param {object} params - { sessionId, timeSpentSeconds, maxStreak }
 */
export const finishMagicNumberGame = async ({ sessionId, timeSpentSeconds = 60, maxStreak = 0 }) => {
  return finishGameSession({ gameId: 'magic-number', sessionId, timeSpentSeconds, maxStreak });
};

/**
 * Fetch top leaderboard rankings.
 * @param {number} limit
 */
export const getMagicNumberLeaderboard = async (limit = 10) => {
  return getGameLeaderboard({ gameId: 'magic-number', limit });
};

/**
 * Fetch the master library of mental math and aptitude shortcuts.
 */
export const getMagicNumberTricks = async () => {
  return request('/gamezone/magic-number/tricks', { method: 'GET' });
};

// ─────────────────────────────────────────────────────────────────────────────
// Diagnostic Skill Assessment & ML Roadmap APIs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch adaptive 15-question diagnostic assessment for student.
 */
export const getDiagnosticQuestions = async () => {
  return request('/assessment/questions', { method: 'GET' });
};

/**
 * Submit diagnostic assessment answers for ML competency analysis & roadmap synthesis.
 * @param {object} payload - { answers: { qId: optionIndex }, timeSpentSeconds }
 */
export const submitDiagnosticAssessment = async (payload) => {
  return request('/assessment/submit', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

/**
 * Retrieve student's latest assessment, skill radar scores, and active roadmap.
 */
export const getStudentLatestAssessment = async () => {
  return request('/assessment/latest', { method: 'GET' });
};


