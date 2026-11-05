"""
cantroller/auth_controller.py  –  Business logic for auth endpoints.

Separated from routes so controllers stay testable without Flask context.
Each function returns a (response_dict, http_status_code) tuple.

Functions:
  register_user(data)       – Validate + create a new user account
  login_user(data)          – Authenticate credentials, issue tokens
  refresh_access_token(raw) – Rotate access token using a valid refresh token
  logout_user(user_id, raw) – Revoke a refresh token (logout)
"""

import bcrypt
from datetime import datetime

from database.connection import get_db, close_db
from auth.jwt_handler import (
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
    get_refresh_token_expiry,
)


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _hash_password(plain: str) -> str:
    """Return the bcrypt hash of a plain-text password."""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _check_password(plain: str, hashed: str) -> bool:
    """Return True if plain-text matches the bcrypt hash."""
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def _build_academic_detail(user_row: dict) -> str:
    """Build a human-readable academic detail string (same logic as Register.jsx)."""
    level = user_row.get("education_level", "")
    if level == "nursery":
        return f"Nursery / Primary ({user_row.get('nursery_class', '')})"
    elif level == "highschool":
        return f"High School ({user_row.get('highschool_class', '')} - {user_row.get('stream', '')})"
    elif level == "intermediate":
        return f"Intermediate ({user_row.get('intermediate_year', '')} - {user_row.get('stream', '')})"
    elif level == "graduation":
        return f"Graduation ({user_row.get('graduation_course', '')} - {user_row.get('graduation_year', '')})"
    return ""


def _serialize_user(row: dict) -> dict:
    """Convert a DB user row into a safe public-facing dict (no password hash)."""
    academic_detail = _build_academic_detail(row)
    return {
        "id":                row["id"],
        "full_name":         row["full_name"],
        "fullName":          row["full_name"],
        "email":             row["email"],
        "mobile":            row["mobile"],
        "education_level":   row["education_level"],
        "educationLevel":    row["education_level"],
        "nursery_class":     row.get("nursery_class"),
        "nurseryClass":      row.get("nursery_class"),
        "stream":            row.get("stream"),
        "highschool_class":  row.get("highschool_class"),
        "highschoolClass":   row.get("highschool_class"),
        "intermediate_year": row.get("intermediate_year"),
        "intermediateYear":  row.get("intermediate_year"),
        "graduation_course": row.get("graduation_course"),
        "graduationCourse":  row.get("graduation_course"),
        "graduation_year":   row.get("graduation_year"),
        "graduationYear":    row.get("graduation_year"),
        "academic_detail":   academic_detail,
        "academicDetail":    academic_detail,
        "role":              row.get("role", "student"),
        "avatar_url":        row.get("avatar_url"),
        "avatarUrl":         row.get("avatar_url"),
        "bio":               row.get("bio"),
        "is_active":         bool(row.get("is_active", True)),
        "created_at":        str(row.get("created_at", "")),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Controller: Register
# ─────────────────────────────────────────────────────────────────────────────

def register_user(data: dict) -> tuple[dict, int]:
    """
    Create a new user account.

    Expected `data` keys:
        fullName, email, mobile, password,
        educationLevel, nurseryClass, stream,
        highschoolClass, intermediateYear,
        graduationCourse, graduationYear

    Returns:
        (response_dict, http_status_code)
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # ── 1. Check for existing email ───────────────────────────────────────
        cursor.execute("SELECT id FROM users WHERE email = %s", (data["email"],))
        if cursor.fetchone():
            return {"success": False, "message": "An account with this email already exists."}, 409

        # ── 2. Check for existing mobile ──────────────────────────────────────
        cursor.execute("SELECT id FROM users WHERE mobile = %s", (data["mobile"],))
        if cursor.fetchone():
            return {"success": False, "message": "An account with this mobile number already exists."}, 409

        # ── 3. Hash password ──────────────────────────────────────────────────
        password_hash = _hash_password(data["password"])

        # ── 4. Map education level to DB columns ──────────────────────────────
        level = data.get("educationLevel", "nursery")
        edu_fields = {
            "nursery_class":     data.get("nurseryClass")     if level == "nursery"      else None,
            "stream":            data.get("stream")           if level in ("highschool", "intermediate") else None,
            "highschool_class":  data.get("highschoolClass")  if level == "highschool"   else None,
            "intermediate_year": data.get("intermediateYear") if level == "intermediate" else None,
            "graduation_course": data.get("graduationCourse") if level == "graduation"   else None,
            "graduation_year":   data.get("graduationYear")   if level == "graduation"   else None,
        }

        # ── 5. Insert user ────────────────────────────────────────────────────
        insert_sql = """
            INSERT INTO users (
                full_name, email, mobile, password_hash,
                education_level,
                nursery_class, stream, highschool_class,
                intermediate_year, graduation_course, graduation_year
            ) VALUES (
                %(full_name)s, %(email)s, %(mobile)s, %(password_hash)s,
                %(education_level)s,
                %(nursery_class)s, %(stream)s, %(highschool_class)s,
                %(intermediate_year)s, %(graduation_course)s, %(graduation_year)s
            )
        """
        cursor.execute(insert_sql, {
            "full_name":     data["fullName"],
            "email":         data["email"],
            "mobile":        data["mobile"],
            "password_hash": password_hash,
            "education_level": level,
            **edu_fields,
        })
        conn.commit()

        user_id = cursor.lastrowid

        # ── 6. Issue tokens ───────────────────────────────────────────────────
        access_token             = create_access_token(user_id, data["email"], "student")
        raw_refresh, hash_refresh = create_refresh_token(user_id)

        cursor.execute(
            """INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
               VALUES (%s, %s, %s)""",
            (user_id, hash_refresh, get_refresh_token_expiry()),
        )
        conn.commit()

        # ── 7. Fetch the new user for response ────────────────────────────────
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        new_user = cursor.fetchone()

        return {
            "success":       True,
            "message":       "Account created successfully.",
            "access_token":  access_token,
            "refresh_token": raw_refresh,
            "user":          _serialize_user(new_user),
        }, 201

    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[register_user] Error: {exc}")
        return {"success": False, "message": "Registration failed due to a server error."}, 500

    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# Controller: Login
# ─────────────────────────────────────────────────────────────────────────────

def login_user(data: dict) -> tuple[dict, int]:
    """
    Authenticate a user and return JWT tokens.

    Expected `data` keys:
        email, password

    Returns:
        (response_dict, http_status_code)
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # ── 1. Fetch user by email ────────────────────────────────────────────
        cursor.execute("SELECT * FROM users WHERE email = %s", (data["email"],))
        user = cursor.fetchone()

        if not user:
            # Generic message to avoid email enumeration
            return {"success": False, "message": "Invalid email or password."}, 401

        # ── 2. Check account is active ────────────────────────────────────────
        if not user["is_active"]:
            return {"success": False, "message": "Your account has been deactivated. Contact support."}, 403

        # ── 3. Verify password ────────────────────────────────────────────────
        if not _check_password(data["password"], user["password_hash"]):
            return {"success": False, "message": "Invalid email or password."}, 401

        # ── 4. Issue tokens ───────────────────────────────────────────────────
        access_token             = create_access_token(user["id"], user["email"], user.get("role", "student"))
        raw_refresh, hash_refresh = create_refresh_token(user["id"])

        cursor.execute(
            """INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
               VALUES (%s, %s, %s)""",
            (user["id"], hash_refresh, get_refresh_token_expiry()),
        )
        conn.commit()

        return {
            "success":       True,
            "message":       "Login successful.",
            "access_token":  access_token,
            "refresh_token": raw_refresh,
            "user":          _serialize_user(user),
        }, 200

    except Exception as exc:
        print(f"[login_user] Error: {exc}")
        return {"success": False, "message": "Login failed due to a server error."}, 500

    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# Controller: Refresh Token
# ─────────────────────────────────────────────────────────────────────────────

def refresh_access_token(raw_token: str) -> tuple[dict, int]:
    """
    Issue a new access token using a valid refresh token.

    The refresh token is validated against the DB (not expired, not revoked).
    Returns:
        (response_dict, http_status_code)
    """
    conn = None
    try:
        token_hash = hash_refresh_token(raw_token)

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # ── 1. Look up the refresh token ──────────────────────────────────────
        cursor.execute(
            """SELECT rt.*, u.email, u.is_active, u.role
               FROM refresh_tokens rt
               JOIN users u ON rt.user_id = u.id
               WHERE rt.token_hash = %s""",
            (token_hash,),
        )
        record = cursor.fetchone()

        if not record:
            return {"success": False, "message": "Invalid refresh token."}, 401

        if record["revoked"]:
            return {"success": False, "message": "Refresh token has been revoked."}, 401

        if record["expires_at"] < datetime.utcnow():
            return {"success": False, "message": "Refresh token has expired. Please log in again."}, 401

        if not record["is_active"]:
            return {"success": False, "message": "Account is deactivated."}, 403

        # ── 2. Issue a new access token ───────────────────────────────────────
        new_access = create_access_token(record["user_id"], record["email"], record.get("role", "student"))

        return {
            "success":      True,
            "access_token": new_access,
        }, 200

    except Exception as exc:
        print(f"[refresh_access_token] Error: {exc}")
        return {"success": False, "message": "Token refresh failed."}, 500

    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# Controller: Logout
# ─────────────────────────────────────────────────────────────────────────────

def logout_user(user_id: int, raw_token: str) -> tuple[dict, int]:
    """
    Revoke the given refresh token (logout the current session).

    Returns:
        (response_dict, http_status_code)
    """
    conn = None
    try:
        token_hash = hash_refresh_token(raw_token)

        conn = get_db()
        cursor = conn.cursor()

        cursor.execute(
            """UPDATE refresh_tokens
               SET revoked = 1
               WHERE token_hash = %s AND user_id = %s""",
            (token_hash, user_id),
        )
        conn.commit()

        return {"success": True, "message": "Logged out successfully."}, 200

    except Exception as exc:
        print(f"[logout_user] Error: {exc}")
        return {"success": False, "message": "Logout failed."}, 500

    finally:
        close_db(conn)
