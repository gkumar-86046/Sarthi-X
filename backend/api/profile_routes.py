"""
api/profile_routes.py  –  Flask Blueprint for user profile endpoints.

Registered under the prefix: /api/profile
All endpoints are protected by JWT (via @jwt_required).

Endpoints:
  GET   /api/profile        – Get the authenticated user's full profile
  PATCH /api/profile        – Update editable profile fields
"""

from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from api.validators import UpdateProfileSchema
from cantroller.profile_controller import get_profile, update_profile
from auth.decorators import jwt_required


profile_bp = Blueprint("profile", __name__)

_update_schema = UpdateProfileSchema()


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/profile
# ─────────────────────────────────────────────────────────────────────────────

@profile_bp.route("", methods=["GET"])
@jwt_required
def fetch_profile(current_user):
    """
    Return the full profile of the currently authenticated user.

    Headers:
        Authorization: Bearer <access_token>

    Response (200):
    {
        "success": true,
        "user": {
            "id":              1,
            "full_name":       "Arjun Sharma",
            "email":           "arjun@example.com",
            "mobile":          "9876543210",
            "education_level": "graduation",
            "academic_detail": "Graduation (B.Tech / B.E - 2nd Year)",
            "avatar_url":      null,
            "bio":             null,
            "created_at":      "2025-01-01 00:00:00"
        }
    }

    Responses:
      200 – Profile data returned
      401 – Invalid/missing token
      404 – User not found
      500 – Server error
    """
    result, status = get_profile(current_user["user_id"])
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# PATCH /api/profile
# ─────────────────────────────────────────────────────────────────────────────

@profile_bp.route("", methods=["PATCH"])
@jwt_required
def edit_profile(current_user):
    """
    Update one or more editable profile fields.

    Headers:
        Authorization: Bearer <access_token>

    Request Body (JSON) – all fields optional:
    {
        "full_name":  "Arjun K. Sharma",
        "bio":        "Final-year CSE student passionate about AI.",
        "avatar_url": "https://example.com/avatar.jpg",
        "mobile":     "9000000000"
    }

    Responses:
      200 – Updated profile returned
      400 – Validation error or no valid fields provided
      401 – Invalid/missing token
      404 – User not found
      409 – Mobile number already in use
      500 – Server error
    """
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"success": False, "message": "Request body must be valid JSON."}), 400

    try:
        data = _update_schema.load(body)
    except ValidationError as err:
        return jsonify({"success": False, "message": "Validation failed.", "errors": err.messages}), 400

    # Remove None values so the controller only processes explicitly sent fields
    data = {k: v for k, v in data.items() if v is not None}

    result, status = update_profile(current_user["user_id"], data)
    return jsonify(result), status
