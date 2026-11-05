<div align="center">

<br/>

```
  ███████╗ █████╗ ██████╗  █████╗ ████████╗██╗  ██╗██╗    ██╗  ██╗
  ██╔════╝██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██║    ╚██╗██╔╝
  ███████╗███████║██████╔╝███████║   ██║   ███████║██║     ╚███╔╝ 
  ╚════██║██╔══██║██╔══██╗██╔══██║   ██║   ██╔══██║██║     ██╔██╗ 
  ███████║██║  ██║██║  ██║██║  ██║   ██║   ██║  ██║██║    ██╔╝ ██╗
  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝    ╚═╝  ╚═╝
```

<h2>Intelligence-Powered E-Learning Platform</h2>

<p>
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Flask-3.0.3-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask"/>
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge" alt="Status"/>
</p>

<p>
  <strong>Sarathi-X</strong> is a full-stack, branch-aware e-learning platform designed for academic institutions. It delivers personalized course content, skill assessments, performance tracking, gamified learning, and an intelligent mentoring experience — all within a modern, glassmorphic interface with full dark/light theme support.
</p>

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
  - [Student Panel](#student-panel)
  - [Admin Panel](#admin-panel)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Design System](#-design-system)
- [Scripts & Commands](#-scripts--commands)

---

## 🌐 Overview

Sarathi-X is a monorepo containing three independent applications that work together as a single platform:

| Application | Technology | Port | Purpose |
|---|---|---|---|
| **Student Frontend** | React 19 + Framer Motion | `3000` | Student-facing portal — courses, assessments, gamezone, mentoring |
| **Admin Panel** | React 19 + Lucide Icons | `3002` | Institutional dashboard — content, analytics, student management |
| **Backend API** | Python Flask + MySQL | `5000` | RESTful API serving both frontends via JWT authentication |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                   │
│   ┌───────────────────────┐     ┌───────────────────────┐       │
│   │   Student Frontend    │     │     Admin Panel        │       │
│   │   React 19 · :3000    │     │   React 19 · :3002     │       │
│   │                       │     │                        │       │
│   │  Landing Page         │     │  Dashboard             │       │
│   │  Dashboard            │     │  Student Directory     │       │
│   │  My Courses           │     │  Content Management    │       │
│   │  Skill Test           │     │  Question Bank         │       │
│   │  Performance          │     │  Roadmap Manager       │       │
│   │  Game Zone            │     │  Performance Analytics │       │
│   │  AI Mentor            │     │  System Settings       │       │
│   │  Health Analysis      │     │  Admin Profile         │       │
│   │  Startup Hub          │     │                        │       │
│   └──────────┬────────────┘     └──────────┬─────────────┘      │
│              │  REST / JSON                 │  REST / JSON        │
└──────────────┼──────────────────────────────┼────────────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER · :5000                         │
│                                                                   │
│   Flask 3.0  ·  JWT Authentication  ·  CORS  ·  Marshmallow      │
│                                                                   │
│   /api/auth          /api/courses         /api/admin             │
│   /api/dashboard     /api/assessment      /api/profile           │
│   /api/game          /api/roadmaps        /api/questions         │
└──────────────────────────────┬──────────────────────────────────┘
                               │  PyMySQL / mysql-connector
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER · MySQL 8                        │
│                                                                   │
│   users  ·  courses  ·  modules  ·  lessons  ·  enrollments      │
│   assessments  ·  questions  ·  roadmaps  ·  game_sessions       │
│   admin_activity_logs  ·  student_progress                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend (Student & Admin)

| Category | Library / Tool | Version |
|---|---|---|
| UI Framework | React | `^19.2.7` |
| Animation | Framer Motion | `^12.42.2` |
| Icon Library | Lucide React | `^1.21.0` |
| Routing | React Router DOM | `^7.6.3` |
| HTTP Client | Fetch API (native) | — |
| Build Tool | Create React App / Webpack | `5.0.1` |
| Fonts | Outfit, Plus Jakarta Sans | Google Fonts |
| Theme | CSS Custom Properties (dark/light) | — |

### Backend

| Category | Library / Tool | Version |
|---|---|---|
| Web Framework | Flask | `3.0.3` |
| Cross-Origin | flask-cors | `4.0.1` |
| Database ORM | PyMySQL + mysql-connector | `1.1.1 / 8.4.0` |
| Authentication | PyJWT | `2.9.0` |
| Password Hashing | bcrypt | `4.2.0` |
| Schema Validation | Marshmallow | `3.21.3` |
| Environment | python-dotenv | `1.0.1` |
| WSGI Utilities | Werkzeug | `3.0.4` |

---

## 📁 Project Structure

```
Talent/                              ← Monorepo Root
├── frontend/                        ← Student Portal (React · :3000)
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.js            ← Landing navbar + theme toggle
│       │   ├── Hero.js
│       │   ├── Features.js
│       │   ├── Courses.js
│       │   ├── Pricing.js
│       │   ├── Testimonials.js
│       │   ├── Footer.js
│       │   ├── dashboard/
│       │   │   ├── Sidebar.jsx      ← Static sidebar with independent scroll
│       │   │   ├── DashboardHome.jsx
│       │   │   ├── AIMentorPage.jsx
│       │   │   └── ProfilePage.jsx
│       │   └── gamezone/
│       │       ├── MagicNumberArena.jsx
│       │       ├── GameDashboardWindow.jsx
│       │       ├── GameModuleCard.jsx
│       │       └── ...
│       ├── pages/
│       │   ├── DashboardLayout.jsx  ← Master layout (scroll isolation + theme)
│       │   ├── CoursesPage.jsx      ← Branch-filtered course catalog
│       │   ├── DiagnosticTestPage.jsx
│       │   ├── PerformancePage.jsx
│       │   ├── HealthAnalysisPage.jsx
│       │   ├── GameZonePage.jsx
│       │   ├── StartupHubPage.jsx
│       │   ├── SettingsPage.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       ├── services/
│       │   └── api.js               ← Centralized API client
│       ├── App.css                  ← Global styles + theme variables
│       └── App.js
│
├── admin/                           ← Admin Panel (React · :3002)
│   └── src/
│       ├── components/
│       │   ├── layout/
│       │   │   ├── AdminLayout.jsx  ← Root layout wrapper
│       │   │   ├── Sidebar.jsx      ← Static navigation sidebar
│       │   │   └── Header.jsx       ← Header + theme toggle + notifications
│       │   └── common/
│       │       ├── StatCard.jsx
│       │       ├── Badge.jsx
│       │       ├── Modal.jsx
│       │       ├── Notification.jsx
│       │       └── SearchBar.jsx
│       ├── pages/
│       │   ├── Dashboard/           ← Platform overview + KPIs
│       │   ├── Students/            ← Student directory + status management
│       │   ├── Performance/         ← Analytics + score distributions
│       │   ├── Content/             ← Course & lesson content management
│       │   ├── Roadmaps/            ← Career roadmap builder
│       │   ├── Questions/           ← Question bank CRUD
│       │   ├── Profile/             ← Admin profile
│       │   ├── Settings/            ← System configuration
│       │   └── Auth/Login.jsx
│       ├── styles/
│       │   ├── variables.css        ← Design tokens (dark + light theme)
│       │   ├── layout.css           ← Sidebar/header scroll isolation
│       │   ├── dashboard.css
│       │   ├── performance.css
│       │   └── ...
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js
│       └── utils/
│           └── formatters.js
│
├── backend/                         ← Flask REST API (:5000)
│   ├── cantroller/                  ← Business logic controllers
│   │   ├── auth_controller.py
│   │   ├── course_controller.py
│   │   ├── assessment_controller.py
│   │   ├── dashboard_controller.py
│   │   ├── game_controller.py
│   │   ├── profile_controller.py
│   │   └── admin_controller.py
│   ├── api/                         ← Flask route blueprints
│   │   ├── auth_routes.py
│   │   ├── course_routes.py
│   │   ├── assessment_routes.py
│   │   ├── dashboard_routes.py
│   │   ├── game_routes.py
│   │   ├── profile_routes.py
│   │   ├── admin_routes.py
│   │   └── validators.py
│   ├── database/
│   │   ├── connection.py
│   │   ├── schema.sql
│   │   ├── init_db.py
│   │   ├── migrate_admin.py
│   │   ├── migrate_courses.py
│   │   ├── migrate_assessment.py
│   │   ├── migrate_gamezone.py
│   │   ├── seed_data.py
│   │   └── seed_student_user.py
│   ├── gamezone/
│   │   ├── all_games_bank.py
│   │   └── magic_number_bank.py
│   ├── main.py                      ← Flask app entry point
│   └── requirements.txt
│
├── .gitignore
└── README.md                        ← You are here
```

---

## ✨ Features

### Student Panel

#### 🏠 Landing Page
- Animated hero section with platform introduction
- Feature highlights, course preview, pricing tiers
- Testimonials, how-it-works walkthrough, and footer
- **Dark / Light theme toggle** persisted in localStorage

#### 📊 Dashboard
- Personalized greeting with academic profile display
- Quick-access cards for courses, skill test, and performance
- Recent activity feed and progress summary

#### 📚 My Courses
- Branch-filtered course catalog (auto-matched to enrolled program)
- Subject filter pills and full-text search
- Per-course progress bars with module-level breakdown
- One-click lecture launcher with auto-advance to next lesson
- Enroll, view syllabus, and mark lessons as complete

#### 🎯 Skill Test (Diagnostic Assessment)
- Multi-subject adaptive question flow
- Timed sessions with real-time progress indicator
- Subject-wise score breakdown on completion
- Navigates to Performance page or Game Zone on result

#### 📈 Performance
- Comprehensive analytics across all attempted assessments
- Score trends, subject strengths and improvement areas
- Linked roadmap recommendations per subject

#### 🎮 Game Zone
- Gamified learning modules including **Magic Number Arena**
- Daily challenges and mission-based progression
- Space-themed background with animated level transitions
- Global leaderboard and personal score tracking

#### 🤖 AI Mentor
- Interactive mentoring sessions with contextual guidance
- Branch and subject-aware conversation flow
- Session history and topic recommendations

#### 🏥 Health Analysis
- Cognitive load and study habit metrics
- Live status estimation for readiness and focus
- Benchmark comparisons and wellness indicators

#### 🚀 Startup Hub
- Entrepreneurship resources and startup idea guidance
- Curated content for student innovators

#### 👤 Profile & Settings
- Full academic profile editor (education level, branch, year)
- Password change, notification preferences
- Theme and display settings

---

### Admin Panel

#### 📊 Dashboard
- Platform-wide KPIs: total students, active courses, assessments conducted
- Real-time activity feed from admin action logs
- Enrollment trends and subject engagement overview

#### 👥 Student Directory
- Searchable, filterable student roster
- Status management (active / suspended / inactive)
- Student profile drill-down with academic and performance data

#### 📈 Performance Analytics
- Institution-level score distributions per subject
- Student ranking tables with sortable columns
- Assessment completion rates and average scores

#### 📝 Content Management
- Full CRUD for courses, modules, and lessons
- Video URL, notes, and quiz attachment per lesson
- Branch and subject tagging for targeted content delivery

#### 🗺 Roadmap Manager
- Create and edit structured career roadmaps
- Phase-based milestone builder (JSON-backed)
- Assign roadmaps to academic branches or subjects

#### ❓ Question Bank
- Add, edit, and categorize assessment questions
- Subject and difficulty tagging
- Bulk question management with search and filter

#### ⚙️ System Settings
- Platform configuration panel
- Admin credential and notification settings

---

## 📡 API Reference

All endpoints require a valid JWT Bearer token (except `/auth/login` and `/auth/register`).

```
Base URL: http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register new student account |
| `POST` | `/auth/login` | Login and receive JWT token |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/` | Student dashboard summary and stats |

### Courses

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/courses/` | List branch-filtered courses |
| `GET` | `/courses/<id>` | Full course detail with modules and lessons |
| `POST` | `/courses/<id>/enroll` | Enroll in a course |
| `POST` | `/courses/<id>/lessons/<lid>/complete` | Mark lesson as complete |
| `GET` | `/courses/perfect-lecture` | Fetch next optimal uncompleted lecture |

### Assessments

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/assessment/questions` | Fetch assessment question set |
| `POST` | `/assessment/submit` | Submit answers and receive score |
| `GET` | `/assessment/results` | Student's past assessment results |

### Game Zone

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/game/sessions` | List game sessions for the student |
| `POST` | `/game/session/start` | Start a new game session |
| `POST` | `/game/session/<id>/submit` | Submit game answer |

### Profile

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/profile/` | Get full student profile |
| `PUT` | `/profile/` | Update profile data |
| `PUT` | `/profile/password` | Change password |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/dashboard` | Admin platform overview stats |
| `GET` | `/admin/analytics/performance` | Institution performance analytics |
| `GET` | `/admin/students` | All students list |
| `PATCH` | `/admin/students/<id>/status` | Update student status |
| `GET` | `/admin/roadmaps` | List all roadmaps |
| `GET` | `/admin/questions` | List all questions |

---

## 🗄 Database Schema

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│    users     │     │    enrollments   │     │    courses    │
│──────────────│     │──────────────────│     │───────────────│
│ id (PK)      │◄────│ user_id (FK)     │────►│ id (PK)       │
│ full_name    │     │ course_id (FK)   │     │ title         │
│ email        │     │ progress         │     │ subject       │
│ password_hash│     │ enrolled_at      │     │ instructor    │
│ phone        │     └──────────────────┘     │ target_field  │
│ education_   │                               │ class_standard│
│   level      │     ┌──────────────────┐     │ rating        │
│ graduation_  │     │     modules      │     └───────┬───────┘
│   course     │     │──────────────────│             │
│ graduation_  │     │ id (PK)          │◄────────────┘
│   year       │     │ course_id (FK)   │
│ role         │     │ title            │     ┌───────────────┐
│ created_at   │     │ module_number    │     │    lessons    │
└──────────────┘     └──────────────────┘     │───────────────│
                                               │ id (PK)       │
┌──────────────┐     ┌──────────────────┐     │ module_id (FK)│
│  assessments │     │   roadmaps       │     │ title         │
│──────────────│     │──────────────────│     │ video_url     │
│ id (PK)      │     │ id (PK)          │     │ notes         │
│ user_id (FK) │     │ title            │     │ duration_min  │
│ subject      │     │ target_field     │     │ completed     │
│ score        │     │ estimated_weeks  │     └───────────────┘
│ total        │     │ phases_json      │
│ taken_at     │     └──────────────────┘
└──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Minimum Version |
|---|---|
| Node.js | 18.x or higher |
| Python | 3.11 or higher |
| MySQL | 8.0 or higher |
| npm | 9.x or higher |

---

### 1 · Clone the Repository

```bash
git clone <repository-url>
cd Talent
```

---

### 2 · Database Setup

```sql
-- In MySQL client
CREATE DATABASE sarathi_x CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux / macOS

# Install dependencies
pip install -r requirements.txt

# Initialize schema and run migrations
python database/init_db.py
python database/migrate_courses.py
python database/migrate_assessment.py
python database/migrate_gamezone.py
python database/migrate_admin.py

# Seed initial data
python database/seed_data.py
python database/seed_student_user.py
```

---

### 3 · Backend

Create `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sarathi_x
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
FLASK_ENV=development
```

```bash
cd backend
python main.py
# API running at http://localhost:5000
```

---

### 4 · Student Frontend

```bash
cd frontend
npm install
npm start
# Running at http://localhost:3000
```

---

### 5 · Admin Panel

```bash
cd admin
npm install
npm start
# Running at http://localhost:3002
```

---

### Default Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@sarathix.com` | `Admin@123` |
| **Student** | `student@sarathix.com` | `Student@123` |

---

## 🔐 Environment Variables

### `backend/.env`

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | MySQL host address | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `sarathi_x` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `FLASK_ENV` | Flask environment | `development` |

### `frontend/.env`

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

### `admin/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Admin panel dev port | `3002` |
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 🎨 Design System

Sarathi-X uses a unified glassmorphic design language across all three applications.

### Color Palette

| Token | Dark Theme | Light Theme | Usage |
|---|---|---|---|
| `--bg-primary` | `#030712` | `#f8fafc` | Page background |
| `--bg-secondary` | `#0f172a` | `#f1f5f9` | Card / panel background |
| `--primary` | `#6366f1` | `#4f46e5` | Indigo — primary actions |
| `--accent` | `#8b5cf6` | `#7c3aed` | Violet — accents |
| `--cyan` | `#06b6d4` | `#0891b2` | Cyan — highlights |
| `--pink` | `#ec4899` | `#db2777` | Pink — badges / alerts |
| `--success` | `#10b981` | `#059669` | Success states |
| `--text-primary` | `#f1f5f9` | `#0f172a` | Primary text |
| `--text-muted` | `#64748b` | `#64748b` | Secondary / muted text |
| `--glass-bg` | `rgba(15,23,42,0.6)` | `rgba(255,255,255,0.7)` | Glass panels |

### Typography

| Font | Weight | Usage |
|---|---|---|
| Outfit | 300–700 | Primary UI font — all labels, headings, body |
| Plus Jakarta Sans | 400–600 | Supplementary — card titles, stats |

### Glassmorphism Pattern

```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
}
```

### Scroll Isolation Pattern

Both sidebar and main content use independent scroll contexts — scrolling one does not affect the other:

```css
.dashboard-layout { height: 100vh; overflow: hidden; display: flex; }
.dashboard-sidebar { height: 100vh; overflow-y: auto; overflow-x: hidden; }
.dashboard-main   { height: 100vh; overflow-y: auto; flex: 1; }
```

---

## 📜 Scripts & Commands

### Frontend (Student · `/frontend`)

| Command | Description |
|---|---|
| `npm start` | Start development server on port 3000 |
| `npm run build` | Production build to `/frontend/build` |
| `npm test` | Run test suite |

### Admin Panel (`/admin`)

| Command | Description |
|---|---|
| `npm start` | Start development server on port 3002 |
| `npm run build` | Production build to `/admin/build` |
| `npm test` | Run test suite |

### Backend (`/backend`)

| Command | Description |
|---|---|
| `python main.py` | Start Flask API on port 5000 |
| `python database/init_db.py` | Initialize database schema |
| `python database/migrate_*.py` | Run individual migration scripts |
| `python database/seed_data.py` | Seed sample course and question data |
| `python test_assessment.py` | Run assessment module tests |
| `python test_courses_algorithm.py` | Run course algorithm tests |
| `python test_gamezone.py` | Run gamezone module tests |

---

## 📌 Notes

- The backend controllers directory is named **`cantroller`** — this is intentional and must not be renamed.
- All three services must be running simultaneously for full platform functionality.
- The student panel and admin panel use separate `localStorage` keys for theme persistence (`sarathi_theme` and `sarathi_admin_theme` respectively).
- JWT tokens are issued per-user at login and must be included as `Authorization: Bearer <token>` in all protected API requests.

---

<div align="center">

<br/>

**Built with precision for academic excellence.**

<br/>

</div>

