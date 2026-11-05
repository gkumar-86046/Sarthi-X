"""
api/auth_routes.py  –  Flask Blueprint for authentication endpoints.

Registered under the prefix: /api/auth

Endpoints:
  POST /api/auth/register  – Create a new account
  POST /api/auth/login     – Authenticate and get tokens
  POST /api/auth/refresh   – Get a new access token via refresh token
  POST /api/auth/logout    – Revoke current refresh token
"""

from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from api.validators import RegisterSchema, LoginSchema, RefreshSchema
from cantroller.auth_controller import (
    register_user,
    login_user,
    refresh_access_token,
    logout_user,
)
from auth.decorators import jwt_required


# Blueprint prefix is /api/auth (set in main.py when registering)
auth_bp = Blueprint("auth", __name__)

# ─── Schema instances (reused across requests) ────────────────────────────────
_register_schema = RegisterSchema()
_login_schema    = LoginSchema()
_refresh_schema  = RefreshSchema()


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/auth/register
# ─────────────────────────────────────────────────────────────────────────────

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new Sarathi-X student account.

    Request Body (JSON):
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

    Responses:
      201 – Account created, access_token + refresh_token returned
      400 – Validation error
      409 – Email or mobile already exists
      500 – Server error
    """
    # ── 1. Parse JSON ─────────────────────────────────────────────────────────
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"success": False, "message": "Request body must be valid JSON."}), 400

    # ── 2. Validate with schema ───────────────────────────────────────────────
    # Inject password into context for cross-field confirmPassword check
    _register_schema.context["password"] = body.get("password", "")

    try:
        data = _register_schema.load(body)
    except ValidationError as err:
        return jsonify({"success": False, "message": "Validation failed.", "errors": err.messages}), 400

    # ── 3. Business logic ─────────────────────────────────────────────────────
    result, status = register_user(data)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/auth/login
# ─────────────────────────────────────────────────────────────────────────────

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticate a user and issue JWT tokens.

    Request Body (JSON):
    {
        "email":    "arjun@example.com",
        "password": "SecurePass@1"
    }

    Responses:
      200 – Login successful, access_token + refresh_token returned
      400 – Validation error
      401 – Invalid credentials
      403 – Account deactivated
      500 – Server error
    """
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"success": False, "message": "Request body must be valid JSON."}), 400

    try:
        data = _login_schema.load(body)
    except ValidationError as err:
        return jsonify({"success": False, "message": "Validation failed.", "errors": err.messages}), 400

    result, status = login_user(data)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/auth/refresh
# ─────────────────────────────────────────────────────────────────────────────

@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    """
    Obtain a new access token using a valid refresh token.

    Request Body (JSON):
    {
        "refresh_token": "<raw_refresh_token>"
    }

    Responses:
      200 – New access_token returned
      400 – Missing refresh token
      401 – Invalid/expired/revoked refresh token
      500 – Server error
    """
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"success": False, "message": "Request body must be valid JSON."}), 400

    try:
        data = _refresh_schema.load(body)
    except ValidationError as err:
        return jsonify({"success": False, "message": "Validation failed.", "errors": err.messages}), 400

    result, status = refresh_access_token(data["refresh_token"])
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/auth/logout
# ─────────────────────────────────────────────────────────────────────────────

@auth_bp.route("/logout", methods=["POST"])
@jwt_required
def logout(current_user):
    """
    Revoke the user's current refresh token (logout this session).

    Headers:
        Authorization: Bearer <access_token>

    Request Body (JSON):
    {
        "refresh_token": "<raw_refresh_token>"
    }

    Responses:
      200 – Logged out successfully
      400 – Missing refresh token
      401 – Access token invalid/expired
      500 – Server error
    """
    body = request.get_json(silent=True) or {}
    raw_refresh = body.get("refresh_token", "")

    if not raw_refresh:
        return jsonify({"success": False, "message": "refresh_token is required."}), 400

    result, status = logout_user(current_user["user_id"], raw_refresh)
    return jsonify(result), status
