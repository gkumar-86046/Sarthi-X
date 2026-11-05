"""
api/assessment_routes.py  –  Flask Blueprint for Diagnostic Skill Assessment,
ML Competency Profiling, and Dynamic Roadmap.
"""

from flask import Blueprint, request, jsonify
from auth.decorators import jwt_required, optional_jwt
from cantroller.assessment_controller import (
    get_diagnostic_questions,
    submit_diagnostic_assessment,
    get_student_latest_assessment
)

assessment_bp = Blueprint("assessment", __name__)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/assessment/questions
# ─────────────────────────────────────────────────────────────────────────────
@assessment_bp.route("/questions", methods=["GET"])
@optional_jwt
def questions(current_user):
    user_id = current_user["user_id"] if current_user else 1
    result, status = get_diagnostic_questions(user_id)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/assessment/submit
# ─────────────────────────────────────────────────────────────────────────────
@assessment_bp.route("/submit", methods=["POST"])
@optional_jwt
def submit(current_user):
    user_id = current_user["user_id"] if current_user else 1
    payload = request.get_json(silent=True) or {}
    result, status = submit_diagnostic_assessment(user_id, payload)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/assessment/latest
# ─────────────────────────────────────────────────────────────────────────────
@assessment_bp.route("/latest", methods=["GET"])
@optional_jwt
def latest(current_user):
    user_id = current_user["user_id"] if current_user else 1
    result, status = get_student_latest_assessment(user_id)
    return jsonify(result), status

