# ─────────────────────────────────────────────────────────────────────────────
# database/schema.sql  –  Sarathi-X MySQL Database Schema
#
# Run once to create the database and tables:
#   mysql -u root -p < database/schema.sql
# ─────────────────────────────────────────────────────────────────────────────

-- Create & use the sarathi_x database
CREATE DATABASE IF NOT EXISTS sarathi_x
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sarathi_x;

-- ─────────────────────────────────────────────────────────────────────────────
-- Table: users
-- Stores core account credentials and identity fields.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(120)    NOT NULL,
    email           VARCHAR(180)    NOT NULL UNIQUE,
    mobile          VARCHAR(15)     NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,           -- bcrypt hash

    -- Education fields (matched to Register.jsx form)
    education_level ENUM(
        'nursery',
        'highschool',
        'intermediate',
        'graduation'
    ) NOT NULL DEFAULT 'nursery',

    -- Sub-fields per education level (nullable, only relevant one is filled)
    nursery_class       VARCHAR(20)  NULL,              -- 'Class 1' … 'Class 8'
    stream              VARCHAR(30)  NULL,              -- 'Science' | 'Arts' | 'Commerce'
    highschool_class    VARCHAR(20)  NULL,              -- 'Class 9' | 'Class 10'
    intermediate_year   VARCHAR(30)  NULL,              -- '11th (1st Year)' | '12th (2nd Year)'
    graduation_course   VARCHAR(80)  NULL,              -- e.g. 'B.Tech / B.E (Engineering)'
    graduation_year     VARCHAR(20)  NULL,              -- '1st Year' … '5th Year'

    -- Profile extras (updated via profile endpoint)
    avatar_url      VARCHAR(500)    NULL,
    bio             TEXT            NULL,
    role            ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student',

    -- Meta
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email  (email),
    INDEX idx_mobile (mobile)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Table: refresh_tokens
-- Tracks issued refresh tokens so they can be revoked (logout / rotation).
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED    NOT NULL,
    token_hash  VARCHAR(255)    NOT NULL UNIQUE,        -- SHA-256 hash of the token
    expires_at  DATETIME        NOT NULL,
    revoked     TINYINT(1)      NOT NULL DEFAULT 0,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token_hash (token_hash),
    INDEX idx_user_id    (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Table: courses
-- Available courses across educational levels
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    course_code     VARCHAR(50)     NOT NULL UNIQUE,
    title           VARCHAR(255)    NOT NULL,
    education_level ENUM('nursery', 'highschool', 'intermediate', 'graduation', 'all') NOT NULL DEFAULT 'all',
    target_field    VARCHAR(100)    NULL DEFAULT NULL,
    category        VARCHAR(100)    NOT NULL,
    subject         VARCHAR(100)    NOT NULL,
    instructor      VARCHAR(150)    NOT NULL,
    rating          DECIMAL(3, 2)   NOT NULL DEFAULT 4.85,
    total_modules   INT UNSIGNED    NOT NULL DEFAULT 6,
    total_lessons   INT UNSIGNED    NOT NULL DEFAULT 24,
    thumbnail_bg    VARCHAR(255)    NULL,
    description     TEXT            NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_edu_level (education_level),
    INDEX idx_edu_target (education_level, target_field),
    INDEX idx_course_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Table: course_modules
-- Modules for each course
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_modules (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    course_id       INT UNSIGNED    NOT NULL,
    module_number   INT UNSIGNED    NOT NULL,
    title           VARCHAR(255)    NOT NULL,
    description     TEXT            NULL,
    status          VARCHAR(50)     NOT NULL DEFAULT 'Next Up',
    progress        INT UNSIGNED    NOT NULL DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Table: course_lessons
-- Individual lessons, admin notes PDFs, videos, and quizzes uploaded per module
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_lessons (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    module_id       INT UNSIGNED    NOT NULL,
    lesson_number   INT UNSIGNED    NOT NULL,
    lesson_type     ENUM('video', 'pdf', 'quiz', 'assignment') NOT NULL DEFAULT 'video',
    title           VARCHAR(255)    NOT NULL,
    duration        VARCHAR(50)     NULL,
    file_size       VARCHAR(50)     NULL,
    questions_count INT UNSIGNED    NULL,
    content_url     VARCHAR(500)    NULL,
    is_preview      TINYINT(1)      NOT NULL DEFAULT 0,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE,
    INDEX idx_module_id (module_id),
    INDEX idx_mod_lesson (module_id, lesson_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Table: user_lesson_progress
-- Tracks individual lesson completion by students in real time
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED    NOT NULL,
    lesson_id       INT UNSIGNED    NOT NULL,
    completed       TINYINT(1)      NOT NULL DEFAULT 1,
    completed_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_lesson (user_id, lesson_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ─────────────────────────────────────────────────────────────────────────────
-- Table: user_course_enrollments
-- Tracks user's active courses and lesson progress
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_course_enrollments (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED    NOT NULL,
    course_id       INT UNSIGNED    NOT NULL,
    progress        INT UNSIGNED    NOT NULL DEFAULT 0,
    next_topic      VARCHAR(255)    NULL,
    status          ENUM('active', 'completed', 'paused') NOT NULL DEFAULT 'active',
    last_accessed   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_course (user_id, course_id),
    INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Table: user_dashboard_stats
-- High-level learning statistics per user
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_dashboard_stats (
    id                  INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    user_id             INT UNSIGNED    NOT NULL UNIQUE,
    hours_learned       DECIMAL(6, 1)   NOT NULL DEFAULT 38.5,
    certificates_earned INT UNSIGNED    NOT NULL DEFAULT 2,
    overall_performance VARCHAR(50)     NOT NULL DEFAULT 'Top 5%',
    overall_grade       VARCHAR(10)     NOT NULL DEFAULT 'A+',
    overall_percentage  DECIMAL(5, 2)   NOT NULL DEFAULT 94.20,
    quiz_accuracy       DECIMAL(5, 2)   NOT NULL DEFAULT 88.50,
    weekly_streak_days  INT UNSIGNED    NOT NULL DEFAULT 14,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Table: upcoming_sessions
-- Live interactive webinars and doubt solving sessions
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS upcoming_sessions (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    education_level ENUM('nursery', 'highschool', 'intermediate', 'graduation', 'all') NOT NULL DEFAULT 'all',
    title           VARCHAR(255)    NOT NULL,
    session_time    VARCHAR(100)    NOT NULL,
    instructor      VARCHAR(150)    NOT NULL,
    subject         VARCHAR(100)    NOT NULL,
    join_url        VARCHAR(500)    NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Table: user_subject_performance
-- Subject-level grades, breakdown, and strong/weak topics
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_subject_performance (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED    NOT NULL,
    subject_name    VARCHAR(100)    NOT NULL,
    score           INT UNSIGNED    NOT NULL DEFAULT 90,
    grade           VARCHAR(10)     NOT NULL DEFAULT 'A+',
    color           VARCHAR(20)     NOT NULL DEFAULT '#10b981',
    strong_topics   TEXT            NULL,
    weak_topics     TEXT            NULL,
    tests_taken     INT UNSIGNED    NOT NULL DEFAULT 5,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_subject (user_id, subject_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- Table: user_test_history
-- Recent test scores and assessment results
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_test_history (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED    NOT NULL,
    title           VARCHAR(255)    NOT NULL,
    test_date       VARCHAR(50)     NOT NULL,
    score_text      VARCHAR(50)     NOT NULL,
    percentage      DECIMAL(5, 2)   NOT NULL DEFAULT 92.00,
    status          VARCHAR(50)     NOT NULL DEFAULT 'Passed',
    subject         VARCHAR(100)    NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_history (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

