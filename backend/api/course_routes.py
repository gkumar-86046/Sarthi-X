"""
api/course_routes.py  –  Flask Blueprint for Courses & Lesson Access API.

Prefix: /api/courses
All routes are secured via @jwt_required to ensure authenticated access.

Endpoints:
  GET  /api/courses                                       – List all courses tailored strictly to student's profile/branch
  GET  /api/courses/<id>                                  – Get course detail with modules, lessons, and completion state
  GET  /api/courses/perfect-lecture                       – O(1) time & space complexity perfect lecture for subject/course
  POST /api/courses/<id>/enroll                           – Enroll in a course
  POST /api/courses/<id>/lessons/<lesson_id>/complete     – Mark a lesson completed and recalculate course progress
"""

from flask import Blueprint, request, jsonify
from auth.decorators import jwt_required
from cantroller.course_controller import (
    get_courses,
    get_course_detail,
    get_perfect_lecture,
    enroll_course,
    complete_lesson,
)

course_bp = Blueprint("courses", __name__)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/courses
# ─────────────────────────────────────────────────────────────────────────────

@course_bp.route("", methods=["GET"])
@jwt_required
def list_courses(current_user):
    """
    Fetch all courses uploaded by Admin matching student's branch/class.
    Query params:
      ?subject=Physics
      ?search=Calculus
    """
    subject = request.args.get("subject")
    search  = request.args.get("search")
    result, status = get_courses(current_user["user_id"], subject=subject, search=search)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/courses/perfect-lecture (Fast O(1) Algorithm)
# ─────────────────────────────────────────────────────────────────────────────

@course_bp.route("/perfect-lecture", methods=["GET"])
@jwt_required
def fetch_perfect_lecture(current_user):
    """
    Fetch the optimal next lecture for a subject or course,
    executing with O(1) index seek and O(1) space complexity.
    Query params:
      ?subject=Artificial Intelligence
      ?course_id=1
    """
    subject = request.args.get("subject")
    course_id = request.args.get("course_id", type=int)
    result, status = get_perfect_lecture(current_user["user_id"], subject=subject, course_id=course_id)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/courses/<id>
# ─────────────────────────────────────────────────────────────────────────────

@course_bp.route("/<int:course_id>", methods=["GET"])
@jwt_required
def course_detail(current_user, course_id):
    """
    Fetch full syllabus with modules and lessons for a course,
    with real-time completion state for the student.
    """
    result, status = get_course_detail(current_user["user_id"], course_id)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/courses/<id>/enroll
# ─────────────────────────────────────────────────────────────────────────────

@course_bp.route("/<int:course_id>/enroll", methods=["POST"])
@jwt_required
def enroll(current_user, course_id):
    """Enroll student into a course."""
    result, status = enroll_course(current_user["user_id"], course_id)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/courses/<id>/lessons/<lesson_id>/complete
# ─────────────────────────────────────────────────────────────────────────────

@course_bp.route("/<int:course_id>/lessons/<int:lesson_id>/complete", methods=["POST"])
@jwt_required
def complete(current_user, course_id, lesson_id):
    """Mark a lesson completed and recalculate the student's course progress."""
    result, status = complete_lesson(current_user["user_id"], course_id, lesson_id)
    return jsonify(result), status
