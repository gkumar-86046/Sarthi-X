"""
auth/decorators.py  –  Flask route decorators for JWT-protected endpoints.

Usage:
    from auth.decorators import jwt_required

    @app.route('/api/profile')
    @jwt_required
    def profile(current_user):
        return jsonify(current_user)

The decorator injects `current_user` (a dict with user_id, email) as the
first positional argument of the wrapped view function.
"""

from functools import wraps
from flask import request, jsonify
from auth.jwt_handler import verify_access_token


def jwt_required(fn):
    """
    Decorator that enforces a valid JWT access token on the request.

    Token must be supplied in the Authorization header:
        Authorization: Bearer <access_token>

    On success  → calls fn(current_user, *args, **kwargs)
    On failure  → returns a 401 JSON error response.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # ── 1. Extract the Authorization header ──────────────────────────────
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({
                "success": False,
                "message": "Authorization header missing or invalid format. "
                           "Expected: 'Bearer <token>'",
            }), 401

        token = auth_header.split(" ", 1)[1].strip()

        # ── 2. Verify the token ───────────────────────────────────────────────
        payload = verify_access_token(token)

        if payload is None:
            return jsonify({
                "success": False,
                "message": "Token is invalid or has expired. Please log in again.",
            }), 401

        # ── 3. Build the current_user context and call the view ───────────────
        current_user = {
            "user_id": int(payload["sub"]),
            "email":   payload.get("email", ""),
            "role":    payload.get("role", "student"),
        }

        return fn(current_user, *args, **kwargs)

    return wrapper


def optional_jwt(fn):
    """
    Decorator that inspects JWT access token if present, but does not block if missing.
    Passes current_user dict if valid, or None if unauthenticated.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        current_user = None

        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1].strip()
            payload = verify_access_token(token)
            if payload:
                current_user = {
                    "user_id": int(payload["sub"]),
                    "email":   payload.get("email", ""),
                    "role":    payload.get("role", "student"),
                }

        return fn(current_user, *args, **kwargs)

    return wrapper


def role_required(*allowed_roles):
    """
    Decorator that enforces user has one of the allowed roles ('admin', 'faculty', etc.).
    Must wrap a function that already receives `current_user` from @jwt_required.

    Usage:
        @admin_bp.route('/courses', methods=['POST'])
        @jwt_required
        @role_required('admin', 'faculty')
        def create_course(current_user):
            ...
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(current_user, *args, **kwargs):
            user_id = current_user.get("user_id")
            user_role = current_user.get("role", "student")

            # Always verify role against live DB record for instant authorization update
            try:
                from database.connection import get_db, close_db
                conn = get_db()
                cur = conn.cursor(dictionary=True)
                cur.execute("SELECT role FROM users WHERE id = %s", (user_id,))
                row = cur.fetchone()
                close_db(conn)
                if row and row.get("role"):
                    user_role = row["role"]
            except Exception as e:
                print(f"[role_required] DB role check warning: {e}")

            if user_role not in allowed_roles:
                return jsonify({
                    "success": False,
                    "message": f"Access denied. Requires one of roles: {', '.join(allowed_roles)}. Your role is '{user_role}'.",
                }), 403

            current_user["role"] = user_role
            return fn(current_user, *args, **kwargs)

        return wrapper

    return decorator

