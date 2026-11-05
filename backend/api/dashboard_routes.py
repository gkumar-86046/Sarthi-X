"""
api/dashboard_routes.py  –  Flask Blueprint for real dashboard & performance data.

Prefix: /api/dashboard
All endpoints require a valid JWT token via @jwt_required.

Endpoints:
  GET  /api/dashboard/summary                  – High-level metrics, active courses, upcoming sessions, AI recommendations
  GET  /api/dashboard/performance              – Academic performance, subject scores, and test history
  GET  /api/dashboard/courses                  – Enrolled & catalog courses with detailed modules
  POST /api/dashboard/courses/<id>/progress    – Update course progress & lesson tracking
"""

from flask import Blueprint, request, jsonify
from auth.decorators import jwt_required
from cantroller.dashboard_controller import (
    get_dashboard_summary,
    get_performance_data,
    get_user_courses,
    update_course_progress,
)

dashboard_bp = Blueprint("dashboard", __name__)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/dashboard/summary
# ─────────────────────────────────────────────────────────────────────────────

@dashboard_bp.route("/summary", methods=["GET"])
@jwt_required
def summary(current_user):
    """
    Return comprehensive dashboard data:
    - User details (full name, education level, academic detail)
    - Key stats cards (enrolled courses, hours learned, certificates, rank)
    - Active enrolled courses with progress bars
    - Upcoming live sessions
    - AI-tailored learning recommendation
    """
    result, status = get_dashboard_summary(current_user["user_id"])
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/dashboard/performance
# ─────────────────────────────────────────────────────────────────────────────

@dashboard_bp.route("/performance", methods=["GET"])
@jwt_required
def performance(current_user):
    """
    Return student academic performance metrics:
    - Overall grade, percentage, class rank, quiz accuracy
    - Subject-wise scores, strong topics, weak topics, and test count
    - Chronological test and quiz history
    """
    result, status = get_performance_data(current_user["user_id"])
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/dashboard/courses
# ─────────────────────────────────────────────────────────────────────────────

@dashboard_bp.route("/courses", methods=["GET"])
@jwt_required
def courses(current_user):
    """
    Return all courses for the user with module breakdown and progress.
    """
    result, status = get_user_courses(current_user["user_id"])
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/dashboard/courses/<id>/progress
# ─────────────────────────────────────────────────────────────────────────────

@dashboard_bp.route("/courses/<int:course_id>/progress", methods=["POST"])
@jwt_required
def set_course_progress(current_user, course_id):
    """
    Update progress percentage and current topic for a course.
    Request body: { "progress": 80, "nextTopic": "Module 3: Linear Differential Equations" }
    """
    data = request.get_json(silent=True) or {}
    result, status = update_course_progress(current_user["user_id"], course_id, data)
    return jsonify(result), status
