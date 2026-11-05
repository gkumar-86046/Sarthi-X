"""
api/game_routes.py  –  Flask Blueprint for Universal GameZone Engine.
Supports all 10 educational games (Aptitude, Science, GK, English, Algebra, Coding).
"""

from flask import Blueprint, request, jsonify
from auth.decorators import optional_jwt
from cantroller.game_controller import (
    get_gamezone_overview,
    start_game_session,
    submit_game_answer,
    finish_game_session,
    get_game_leaderboard,
    get_game_academy,
    start_magic_number_session,
    submit_magic_number_answer,
    finish_magic_number_session,
    get_magic_number_leaderboard,
    get_magic_number_tricks,
)
from gamezone.all_games_bank import ALL_GAMES_METADATA

game_bp = Blueprint("gamezone", __name__)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/gamezone/overview
# ─────────────────────────────────────────────────────────────────────────────
@game_bp.route("/overview", methods=["GET"])
@optional_jwt
def overview(current_user):
    user_id = current_user["user_id"] if current_user else None
    result, status = get_gamezone_overview(user_id)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/gamezone/games  – All registered games catalog
# ─────────────────────────────────────────────────────────────────────────────
@game_bp.route("/games", methods=["GET"])
def list_games():
    return jsonify({
        "success": True,
        "totalGames": len(ALL_GAMES_METADATA),
        "games": ALL_GAMES_METADATA
    }), 200


# ─────────────────────────────────────────────────────────────────────────────
# UNIVERSAL GAME SESSION ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────
@game_bp.route("/play/start", methods=["POST"])
@optional_jwt
def play_start(current_user):
    user_id = current_user["user_id"] if current_user else None
    data = request.get_json(silent=True) or {}
    game_id = data.get("gameId", "magic-number")
    level = data.get("level", 1)
    mode = data.get("mode", "Standard")
    player_name = data.get("playerName", "Challenger")

    result, status = start_game_session(
        game_id=game_id,
        user_id=user_id,
        player_name=player_name,
        level=level,
        mode=mode
    )
    return jsonify(result), status


@game_bp.route("/play/submit", methods=["POST"])
@optional_jwt
def play_submit(current_user):
    user_id = current_user["user_id"] if current_user else None
    data = request.get_json(silent=True) or {}

    game_id = data.get("gameId", "magic-number")
    session_id = data.get("sessionId")
    question_id = data.get("questionId")
    selected_option = data.get("selectedOption")
    time_taken = data.get("timeTakenSeconds", 5)

    if not session_id or not question_id or not selected_option:
        return jsonify({
            "success": False,
            "message": "Missing required fields: sessionId, questionId, selectedOption"
        }), 400

    result, status = submit_game_answer(
        game_id=game_id,
        user_id=user_id,
        session_id=session_id,
        question_id=question_id,
        selected_option=selected_option,
        time_taken_seconds=time_taken
    )
    return jsonify(result), status


@game_bp.route("/play/finish", methods=["POST"])
@optional_jwt
def play_finish(current_user):
    user_id = current_user["user_id"] if current_user else None
    data = request.get_json(silent=True) or {}

    game_id = data.get("gameId", "magic-number")
    session_id = data.get("sessionId")
    time_spent = data.get("timeSpentSeconds", 60)
    streak_max = data.get("maxStreak", 0)

    if not session_id:
        return jsonify({
            "success": False,
            "message": "Missing required field: sessionId"
        }), 400

    result, status = finish_game_session(
        game_id=game_id,
        user_id=user_id,
        session_id=session_id,
        time_spent_seconds=time_spent,
        streak_max=streak_max
    )
    return jsonify(result), status


@game_bp.route("/play/leaderboard", methods=["GET"])
def play_leaderboard():
    game_id = request.args.get("gameId", "magic-number")
    limit = int(request.args.get("limit", 10))
    result, status = get_game_leaderboard(game_id=game_id, limit=limit)
    return jsonify(result), status


@game_bp.route("/play/academy", methods=["GET"])
def play_academy():
    game_id = request.args.get("gameId", "magic-number")
    result, status = get_game_academy(game_id=game_id)
    return jsonify(result), status


# ─────────────────────────────────────────────────────────────────────────────
# BACKWARD COMPATIBLE /magic-number/* ROUTES
# ─────────────────────────────────────────────────────────────────────────────
@game_bp.route("/magic-number/start", methods=["POST"])
@optional_jwt
def start_game(current_user):
    user_id = current_user["user_id"] if current_user else None
    data = request.get_json(silent=True) or {}
    level = data.get("level", 1)
    mode = data.get("mode", "Standard")
    player_name = data.get("playerName", "Challenger")

    result, status = start_magic_number_session(
        user_id=user_id,
        player_name=player_name,
        level=level,
        mode=mode
    )
    return jsonify(result), status


@game_bp.route("/magic-number/submit", methods=["POST"])
@optional_jwt
def submit_answer(current_user):
    user_id = current_user["user_id"] if current_user else None
    data = request.get_json(silent=True) or {}

    session_id = data.get("sessionId")
    question_id = data.get("questionId")
    selected_option = data.get("selectedOption")
    time_taken = data.get("timeTakenSeconds", 5)

    if not session_id or not question_id or not selected_option:
        return jsonify({
            "success": False,
            "message": "Missing required fields: sessionId, questionId, selectedOption"
        }), 400

    result, status = submit_magic_number_answer(
        user_id=user_id,
        session_id=session_id,
        question_id=question_id,
        selected_option=selected_option,
        time_taken_seconds=time_taken
    )
    return jsonify(result), status


@game_bp.route("/magic-number/finish", methods=["POST"])
@optional_jwt
def finish_game(current_user):
    user_id = current_user["user_id"] if current_user else None
    data = request.get_json(silent=True) or {}

    session_id = data.get("sessionId")
    time_spent = data.get("timeSpentSeconds", 60)
    streak_max = data.get("maxStreak", 0)

    if not session_id:
        return jsonify({
            "success": False,
            "message": "Missing required field: sessionId"
        }), 400

    result, status = finish_magic_number_session(
        user_id=user_id,
        session_id=session_id,
        time_spent_seconds=time_spent,
        streak_max=streak_max
    )
    return jsonify(result), status


@game_bp.route("/magic-number/leaderboard", methods=["GET"])
def leaderboard():
    limit = int(request.args.get("limit", 10))
    result, status = get_magic_number_leaderboard(limit=limit)
    return jsonify(result), status


@game_bp.route("/magic-number/tricks", methods=["GET"])
def tricks():
    result, status = get_magic_number_tricks()
    return jsonify(result), status
