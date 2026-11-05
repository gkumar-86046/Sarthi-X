# Sarathi-X Backend API

Python + Flask + MySQL REST API powering the Sarathi-X student learning platform.

---

## 📁 File Structure

```
backend/
├── main.py                        # App entry point, Blueprint registration
├── requirements.txt               # Python dependencies
├── .env                           # Environment variables (git-ignored)
├── .env.example                   # Template for .env
│
├── database/
│   ├── __init__.py
│   ├── connection.py              # MySQL connection pool
│   └── schema.sql                 # DB schema (run once to set up tables)
│
├── auth/
│   ├── __init__.py
│   ├── jwt_handler.py             # JWT create / verify / hash utilities
│   └── decorators.py             # @jwt_required route decorator
│
├── cantroller/
│   ├── __init__.py
│   ├── auth_controller.py         # Register, Login, Refresh, Logout logic
│   └── profile_controller.py     # Get Profile, Update Profile logic
│
└── api/
    ├── __init__.py
    ├── validators.py              # Marshmallow request schemas
    ├── auth_routes.py             # Blueprint: /api/auth/*
    └── profile_routes.py         # Blueprint: /api/profile/*
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.11+
- MySQL 8.0+

### 2. Set Up MySQL Database

```sql
mysql -u root -p < database/schema.sql
```

### 3. Configure Environment

```bash
# Copy and edit the env file
copy .env.example .env
# Update DB_PASSWORD with your MySQL password
```

### 4. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 5. Run the Server

```bash
python main.py
# → Server starts at http://localhost:5000
```

---

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api
```

---

### 🔓 Authentication Endpoints

#### `POST /api/auth/register`
Create a new student account.

**Request Body:**
```json
{
  "fullName":        "Arjun Sharma",
  "email":           "arjun@example.com",
  "mobile":          "9876543210",
  "password":        "SecurePass@1",
  "confirmPassword": "SecurePass@1",
  "educationLevel":  "graduation",
  "graduationCourse":"B.Tech / B.E (Engineering)",
  "graduationYear":  "2nd Year",
  "agreeTerms":      true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "access_token":  "<jwt_access_token>",
  "refresh_token": "<raw_refresh_token>",
  "user": {
    "id": 1,
    "full_name": "Arjun Sharma",
    "email": "arjun@example.com",
    "mobile": "9876543210",
    "education_level": "graduation",
    "academic_detail": "Graduation (B.Tech / B.E (Engineering) - 2nd Year)",
    "graduation_course": "B.Tech / B.E (Engineering)",
    "graduation_year": "2nd Year",
    "avatar_url": null,
    "bio": null,
    "created_at": "2025-01-01 12:00:00"
  }
}
```

---

#### `POST /api/auth/login`
Authenticate with email + password.

**Request Body:**
```json
{
  "email":    "arjun@example.com",
  "password": "SecurePass@1"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "access_token":  "<jwt_access_token>",
  "refresh_token": "<raw_refresh_token>",
  "user": { ... }
}
```

---

#### `POST /api/auth/refresh`
Obtain a new access token using a refresh token.

**Request Body:**
```json
{
  "refresh_token": "<raw_refresh_token>"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "access_token": "<new_jwt_access_token>"
}
```

---

#### `POST /api/auth/logout` 🔒
Revoke the current refresh token.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "refresh_token": "<raw_refresh_token>"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### 👤 Profile Endpoints

#### `GET /api/profile/` 🔒
Get the authenticated user's full profile.

**Headers:** `Authorization: Bearer <access_token>`

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "full_name": "Arjun Sharma",
    "email": "arjun@example.com",
    "mobile": "9876543210",
    "education_level": "graduation",
    "academic_detail": "Graduation (B.Tech / B.E (Engineering) - 2nd Year)",
    "avatar_url": null,
    "bio": null,
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

#### `PATCH /api/profile/` 🔒
Update editable profile fields (send only what needs updating).

**Headers:** `Authorization: Bearer <access_token>`

**Request Body (all fields optional):**
```json
{
  "full_name":  "Arjun K. Sharma",
  "bio":        "Final-year CSE student passionate about AI.",
  "mobile":     "9000000000"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "user": { ... }
}
```

---

### ❤️ Health Check

#### `GET /api/health`
```json
{
  "status": "ok",
  "service": "sarathi-x-backend"
}
```

---

## 🔑 JWT Token Flow

```
1. Register / Login  →  receive access_token + refresh_token
2. API requests      →  Authorization: Bearer <access_token>
3. Token expires     →  POST /api/auth/refresh with refresh_token
4. Logout            →  POST /api/auth/logout to revoke refresh_token
```

> Store **access_token** in memory (React state / context).  
> Store **refresh_token** in `localStorage` or a secure `httpOnly` cookie.

---

## 🔒 Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt with auto-generated salt |
| JWT signing | HS256 with secret key from env |
| Token expiry | Access: 1h · Refresh: 7 days |
| Refresh revocation | SHA-256 hash stored in DB |
| SQL injection | Parameterized queries only |
| CORS | Configured per `CORS_ORIGINS` env var |

---

## ⚠️ Education Level Field Mapping

| `educationLevel` | Active DB columns |
|---|---|
| `nursery` | `nursery_class` |
| `highschool` | `stream`, `highschool_class` |
| `intermediate` | `stream`, `intermediate_year` |
| `graduation` | `graduation_course`, `graduation_year` |
