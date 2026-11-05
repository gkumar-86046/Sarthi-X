"""
api/admin_routes.py  –  REST API endpoints for Admin/Faculty Course Management.

All endpoints require:
  - Valid JWT access token via @jwt_required
  - Role authorization via @role_required('admin', 'faculty')
"""

from flask import Blueprint, request, jsonify
from auth.decorators import jwt_required, role_required
from cantroller.admin_controller import (
    admin_get_courses,
    admin_get_course_detail,
    admin_create_course,
    admin_update_course,
    admin_delete_course,
    admin_add_module,
    admin_delete_module,
    admin_add_lesson,
    admin_delete_lesson,
    admin_get_dashboard_analytics,
    admin_get_performance_analytics,
    admin_get_students,
    admin_toggle_student_status,
    admin_get_roadmaps,
    admin_get_questions,
)

admin_bp = Blueprint("admin", __name__)


# ─────────────────────────────────────────────────────────────────────────────
# Courses
# ─────────────────────────────────────────────────────────────────────────────

@admin_bp.route("/courses", methods=["GET"])
@jwt_required
@role_required("admin", "faculty")
def get_courses(current_user):
    """List all courses with faculty metrics."""
    search = request.args.get("search", "").strip() or None
    edu_level = request.args.get("education_level", "").strip() or None
    result, status = admin_get_courses(search=search, education_level=edu_level)
    return jsonify(result), status


@admin_bp.route("/courses/<int:course_id>", methods=["GET"])
@jwt_required
@role_required("admin", "faculty")
def get_course_detail(current_user, course_id):
    """Get full course syllabus with modules and lessons."""
    result, status = admin_get_course_detail(course_id)
    return jsonify(result), status


@admin_bp.route("/courses", methods=["POST"])
@jwt_required
@role_required("admin", "faculty")
def create_course(current_user):
    """Create a new course."""
    data = request.get_json() or {}
    result, status = admin_create_course(data)
    return jsonify(result), status


@admin_bp.route("/courses/<int:course_id>", methods=["PUT"])
@jwt_required
@role_required("admin", "faculty")
def update_course(current_user, course_id):
    """Update course attributes."""
    data = request.get_json() or {}
    result, status = admin_update_course(course_id, data)
    return jsonify(result), status


@admin_bp.route("/courses/<int:course_id>", methods=["DELETE"])
@jwt_required
@role_required("admin", "faculty")
def delete_course(current_user, course_id):
    """Delete course and cascaded syllabus."""
    result, status = admin_delete_course(course_id)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# Modules
# ─────────────────────────────────────────────────────────────────────────────

@admin_bp.route("/courses/<int:course_id>/modules", methods=["POST"])
@jwt_required
@role_required("admin", "faculty")
def add_module(current_user, course_id):
    """Add a module to a course."""
    data = request.get_json() or {}
    result, status = admin_add_module(course_id, data)
    return jsonify(result), status


@admin_bp.route("/modules/<int:module_id>", methods=["DELETE"])
@jwt_required
@role_required("admin", "faculty")
def delete_module(current_user, module_id):
    """Delete a module."""
    result, status = admin_delete_module(module_id)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# Lessons
# ─────────────────────────────────────────────────────────────────────────────

@admin_bp.route("/modules/<int:module_id>/lessons", methods=["POST"])
@jwt_required
@role_required("admin", "faculty")
def add_lesson(current_user, module_id):
    """Add a lesson (video, pdf notes, quiz) to a module."""
    data = request.get_json() or {}
    result, status = admin_add_lesson(module_id, data)
    return jsonify(result), status


@admin_bp.route("/lessons/<int:lesson_id>", methods=["DELETE"])
@jwt_required
@role_required("admin", "faculty")
def delete_lesson(current_user, lesson_id):
    """Delete a lesson."""
    result, status = admin_delete_lesson(lesson_id)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# Dashboard & Performance Analytics
# ─────────────────────────────────────────────────────────────────────────────

@admin_bp.route("/dashboard", methods=["GET"])
@jwt_required
@role_required("admin", "faculty")
def get_dashboard_stats(current_user):
    """Comprehensive admin dashboard stats and KPIs."""
    result, status = admin_get_dashboard_analytics()
    return jsonify(result), status


@admin_bp.route("/analytics/performance", methods=["GET"])
@jwt_required
@role_required("admin", "faculty")
def get_performance_stats(current_user):
    """In-depth student diagnostic scores, competencies & archetype trends."""
    result, status = admin_get_performance_analytics()
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# Students Directory
# ─────────────────────────────────────────────────────────────────────────────

@admin_bp.route("/students", methods=["GET"])
@jwt_required
@role_required("admin", "faculty")
def get_students(current_user):
    """List registered students with filtering and enrollment stats."""
    search = request.args.get("search", "").strip() or None
    edu_level = request.args.get("education_level", "").strip() or None
    result, status = admin_get_students(search=search, education_level=edu_level)
    return jsonify(result), status


@admin_bp.route("/students/<int:student_id>/status", methods=["PATCH"])
@jwt_required
@role_required("admin", "faculty")
def toggle_student(current_user, student_id):
    """Activate or deactivate student account."""
    result, status = admin_toggle_student_status(student_id)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# Roadmaps Management
# ─────────────────────────────────────────────────────────────────────────────

@admin_bp.route("/roadmaps", methods=["GET"])
@jwt_required
@role_required("admin", "faculty")
def get_roadmaps(current_user):
    """List all student generated career roadmaps and progress."""
    result, status = admin_get_roadmaps()
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# Question Bank
# ─────────────────────────────────────────────────────────────────────────────

@admin_bp.route("/questions", methods=["GET"])
@jwt_required
@role_required("admin", "faculty")
def get_questions(current_user):
    """Get diagnostic assessment questions for management."""
    result, status = admin_get_questions()
    return jsonify(result), status

