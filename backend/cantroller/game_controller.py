"""
cantroller/game_controller.py  –  Universal Core Engine and algorithms
for Sarathi-X GameZone across all 10 educational games.
"""

from datetime import datetime
import os
import csv
import random
from database.connection import get_db, close_db
from gamezone.magic_number_bank import (
    MAGIC_QUESTIONS,
    POINTS_PER_LEVEL,
    TRICKS_VAULT,
    APTITUDE_LEVELS,
    evaluate_aptitude,
    get_questions_for_level,
)
from gamezone.all_games_bank import (
    ALL_GAMES_METADATA,
    GAMES_BANKS,
    get_game_metadata,
    get_questions_for_game,
    find_question_in_game,
)


def get_gamezone_overview(user_id=None):
    """
    Returns full GameZone payload with user's live profile, all authorized game modules,
    recent high scores, and recommended games.
    """
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    student_name = "Challenger"
    education_level = "graduation"
    academic_detail = "B.Tech / B.E (Engineering)"
    xp_points = 2400
    streak_days = 5
    best_score = 0
    aptitude_title = "Novice Reckoner"
    aptitude_badge = "🌱"

    if user_id:
        cur.execute("""
            SELECT full_name, education_level, graduation_course, highschool_class, nursery_class
            FROM users WHERE id = %s
        """, (user_id,))
        user_row = cur.fetchone()
        if user_row:
            student_name = user_row["full_name"]
            education_level = user_row["education_level"]
            academic_detail = (
                user_row["graduation_course"]
                or user_row["highschool_class"]
                or user_row["nursery_class"]
                or "General Track"
            )

        # Get user's high score and aptitude level from game_sessions
        cur.execute("""
            SELECT MAX(score) AS max_s, aptitude_level
            FROM game_sessions
            WHERE user_id = %s
            GROUP BY id, score, aptitude_level
            ORDER BY score DESC LIMIT 1
        """, (user_id,))
        best_row = cur.fetchone()
        if best_row and best_row["max_s"]:
            best_score = best_row["max_s"]
            aptitude_title = best_row["aptitude_level"]
            for tier in APTITUDE_LEVELS:
                if tier["title"] == aptitude_title:
                    aptitude_badge = tier["badge"]
                    break

        # Calculate XP based on stats + game scores
        cur.execute("SELECT COALESCE(SUM(score), 0) AS total_game_score FROM game_sessions WHERE user_id = %s", (user_id,))
        g_sum = cur.fetchone()["total_game_score"]
        xp_points = 1500 + int(g_sum * 1.5)

    close_db(conn)

    # Build authorizedModules array from master registry
    authorized_modules = []
    for g in ALL_GAMES_METADATA:
        authorized_modules.append({
            "id": g["id"],
            "name": g["name"],
            "category": g["category"],
            "description": g["description"],
            "assignedSkill": g["assignedSkill"],
            "mastery": 80,
            "availableMissions": g["levelsCount"],
            "xpReward": 350,
            "estimatedMinutes": 5,
            "status": "Recommended",
            "allowedModes": ["Standard", "Speed Arena", "Practice"],
            "icon": g["icon"],
            "colorTheme": g["colorTheme"],
            "skills": g["skills"]
        })

    return {
        "success": True,
        "studentProfile": {
            "studentName": student_name,
            "educationLevel": education_level,
            "academicDetail": academic_detail,
            "aptitudeLevel": aptitude_title,
            "aptitudeBadge": aptitude_badge,
            "xpPoints": xp_points,
            "streakDays": streak_days,
            "bestScore": best_score,
            "energyLives": 3,
            "maxLives": 3
        },
        "authorizedModules": authorized_modules,
        "activeGame": {
            "id": "magic-number",
            "name": "Magic Number Aptitude Arena",
            "category": "Quantitative Aptitude",
            "description": "Solve rapid numerical challenges, master 3-second Vedic & Aptitude shortcuts, and test your cognitive IQ.",
            "levelsCount": 10,
            "totalTricks": len(TRICKS_VAULT)
        }
    }, 200


def start_game_session(game_id="magic-number", user_id=None, player_name="Challenger", level=1, mode="Standard"):
    """
    Initializes a new game session for ANY game.
    Returns session token and questions for the requested level (answers & tricks stripped for integrity).
    """
    level = max(1, min(10, int(level)))
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    if user_id:
        cur.execute("SELECT full_name FROM users WHERE id = %s", (user_id,))
        u = cur.fetchone()
        if u and u.get("full_name"):
            player_name = u["full_name"]

    cur.execute("""
        INSERT INTO game_sessions (user_id, player_name, game_type, level_reached, score, status)
        VALUES (%s, %s, %s, %s, 0, 'in_progress')
    """, (user_id, player_name, game_id, level))
    conn.commit()
    session_id = cur.lastrowid
    close_db(conn)

    # Fetch randomized sample questions for this game and level
    pool = get_questions_for_game(game_id, level=level, limit=15, shuffle=True)
    meta = get_game_metadata(game_id)
    base_points = POINTS_PER_LEVEL.get(level, 10)

    # Strip answers and tricks from frontend payload
    safe_questions = []
    for q in pool:
        safe_questions.append({
            "id": q["id"],
            "level": level,
            "topic": q.get("topic", meta["assignedSkill"]),
            "prompt": q["prompt"],
            "options": q["options"],
            "points": base_points
        })

    return {
        "success": True,
        "sessionId": session_id,
        "gameId": game_id,
        "gameName": meta["name"],
        "category": meta["category"],
        "colorTheme": meta["colorTheme"],
        "level": level,
        "mode": mode,
        "pointsPerQuestion": base_points,
        "totalQuestions": len(safe_questions),
        "questions": safe_questions,
        "lives": 3,
        "timePerQuestionSeconds": 25
    }, 201


def submit_game_answer(game_id, user_id, session_id, question_id, selected_option, time_taken_seconds=5):
    """
    Evaluates student's answer for ANY game, awards points & speed bonuses,
    and reveals the step-by-step method and instant shortcut trick.
    """
    matched_q, level_num = find_question_in_game(game_id, question_id)
    if not matched_q:
        return {"success": False, "message": "Question not found."}, 404

    is_correct = (selected_option.strip().upper() == matched_q["answer"].strip().upper())

    base_points = POINTS_PER_LEVEL.get(level_num, 10)
    speed_bonus = 0
    if is_correct:
        if time_taken_seconds <= 5:
            speed_bonus = 5
        elif time_taken_seconds <= 10:
            speed_bonus = 2

    points_earned = (base_points + speed_bonus) if is_correct else 0

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    cur.execute("SELECT * FROM game_sessions WHERE id = %s", (session_id,))
    session = cur.fetchone()

    new_score = points_earned
    correct_count = 1 if is_correct else 0
    total_q = 1

    if session:
        new_score = session["score"] + points_earned
        correct_count = session["correct_answers"] + (1 if is_correct else 0)
        total_q = session["total_questions"] + 1
        accuracy = round((correct_count / total_q) * 100, 2)

        cur.execute("""
            UPDATE game_sessions
            SET score = %s,
                correct_answers = %s,
                total_questions = %s,
                accuracy = %s,
                level_reached = GREATEST(level_reached, %s)
            WHERE id = %s
        """, (new_score, correct_count, total_q, accuracy, level_num, session_id))
        conn.commit()

    close_db(conn)

    return {
        "success": True,
        "gameId": game_id,
        "isCorrect": is_correct,
        "selectedOption": selected_option,
        "correctOption": matched_q["answer"],
        "answerText": matched_q["answer_text"],
        "pointsEarned": points_earned,
        "speedBonus": speed_bonus,
        "currentScore": new_score,
        "method": matched_q["method"],
        "trick": matched_q["trick"],
        "topic": matched_q.get("topic", "Academic Mastery")
    }, 200


def finish_game_session(game_id, user_id, session_id, time_spent_seconds=60, streak_max=0):
    """
    Finalizes the game session, computes final Aptitude/Mastery Level, IQ score,
    and updates leaderboard for this specific game.
    """
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    cur.execute("SELECT * FROM game_sessions WHERE id = %s", (session_id,))
    session = cur.fetchone()

    if not session:
        close_db(conn)
        return {"success": False, "message": "Game session not found."}, 404

    score = session["score"]
    total_q = max(1, session["total_questions"])
    correct_q = session["correct_answers"]
    accuracy = round((correct_q / total_q) * 100, 2)
    avg_time = round(time_spent_seconds / total_q, 1)

    # Calculate Aptitude Rating & Cognitive Radar Stats
    evaluation = evaluate_aptitude(score, accuracy, avg_time)
    aptitude_level = evaluation["title"]
    iq_estimate = evaluation["estimated_iq"]

    cur.execute("""
        UPDATE game_sessions
        SET time_spent_seconds = %s,
            streak_max = %s,
            aptitude_level = %s,
            iq_estimate = %s,
            status = 'completed'
        WHERE id = %s
    """, (time_spent_seconds, streak_max, aptitude_level, iq_estimate, session_id))

    # Add to leaderboard table
    cur.execute("""
        INSERT INTO game_leaderboard (session_id, user_id, player_name, game_type, score, level_reached, accuracy, aptitude_level)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        session_id,
        user_id,
        session["player_name"],
        game_id,
        score,
        session["level_reached"],
        accuracy,
        aptitude_level
    ))

    conn.commit()
    close_db(conn)

    # If magic-number, also synchronize score to offline CSV leaderboard
    if game_id in ("magic-number", "aptitude-arena"):
        csv_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "gamezone",
            "Magic_Number",
            "leaderboard.csv"
        )
        try:
            write_header = not os.path.exists(csv_path)
            with open(csv_path, "a", encoding="utf-8") as f:
                if write_header:
                    f.write("Name,Score,LevelReached,Date\n")
                f.write(f"{session['player_name']},{score},{session['level_reached']},{datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        except Exception as _e:
            pass

    return {
        "success": True,
        "gameId": game_id,
        "summary": {
            "score": score,
            "totalQuestions": total_q,
            "correctAnswers": correct_q,
            "accuracy": accuracy,
            "timeSpentSeconds": time_spent_seconds,
            "avgTimePerQuestion": avg_time,
            "maxStreak": streak_max,
            "aptitudeLevel": aptitude_level,
            "badge": evaluation["badge"],
            "description": evaluation["description"],
            "percentile": evaluation["percentile"],
            "estimatedIq": iq_estimate,
            "radar": evaluation["radar"]
        }
    }, 200


def get_game_leaderboard(game_id="magic-number", limit=10):
    """
    Returns top leaderboard entries for any game, combining database records
    and offline CSV records where applicable.
    """
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT id, player_name, score, level_reached, accuracy, aptitude_level, created_at
        FROM game_leaderboard
        WHERE game_type = %s
        ORDER BY score DESC, level_reached DESC, accuracy DESC
        LIMIT 25
    """, (game_id,))
    rows = cur.fetchall() or []
    close_db(conn)

    combined = []
    seen = set()

    for r in rows:
        key = (r["player_name"].strip().lower(), r["score"])
        if key not in seen:
            seen.add(key)
            combined.append({
                "id": str(r["id"]),
                "player_name": r["player_name"],
                "score": int(r["score"]),
                "level_reached": int(r["level_reached"]),
                "accuracy": f"{r['accuracy']}%" if "%" not in str(r["accuracy"]) else str(r["accuracy"]),
                "aptitude_level": r["aptitude_level"],
                "date": r["created_at"].strftime("%d %b %Y") if r.get("created_at") else "Recent"
            })

    # Read offline CSV leaderboard if magic-number
    if game_id in ("magic-number", "aptitude-arena"):
        csv_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "gamezone",
            "Magic_Number",
            "leaderboard.csv"
        )
        if os.path.exists(csv_path):
            try:
                with open(csv_path, encoding="utf-8", errors="ignore") as f:
                    reader = csv.DictReader(f)
                    for r in reader:
                        name = r.get("Name", "Challenger").strip()
                        if "/" in name or "\\" in name:
                            name = "Terminal Challenger"

                        try:
                            sc = int(r.get("Score", 0))
                            lvl = int(r.get("LevelReached", 1))
                        except (ValueError, TypeError):
                            continue

                        key = (name.lower(), sc)
                        if key not in seen:
                            seen.add(key)
                            tier_title = "Novice Reckoner"
                            for tier in APTITUDE_LEVELS:
                                if sc >= tier["min_score"]:
                                    tier_title = tier["title"]
                                    break

                            combined.append({
                                "id": f"csv_{len(combined) + 1}",
                                "player_name": name,
                                "score": sc,
                                "level_reached": lvl,
                                "accuracy": "92%",
                                "aptitude_level": tier_title,
                                "date": r.get("Date", "Recent")
                            })
            except Exception as _e:
                pass

    # Sort descending by score, then level
    combined.sort(key=lambda x: (x["score"], x["level_reached"]), reverse=True)
    top_entries = combined[:limit]

    # Assign rank numbers and badges
    for i, r in enumerate(top_entries, 1):
        r["rank"] = i
        badge_symbol = "🎯"
        for tier in APTITUDE_LEVELS:
            if tier["title"] == r["aptitude_level"]:
                badge_symbol = tier["badge"]
                break
        r["badge"] = badge_symbol

    return {
        "success": True,
        "gameId": game_id,
        "leaderboard": top_entries
    }, 200


def get_game_academy(game_id="magic-number"):
    """
    Returns the comprehensive 10-level roadmap, question methods, and tricks
    for the specified game.
    """
    meta = get_game_metadata(game_id)
    bank = GAMES_BANKS.get(game_id, GAMES_BANKS.get("magic-number", {}))

    levels_roadmap = []
    methods_and_tricks = {}

    for lvl in range(1, 11):
        lvl_questions = bank.get(lvl, [])
        sample_trick = lvl_questions[0]["trick"] if lvl_questions else "Master core conceptual fundamentals."
        levels_roadmap.append({
            "level": lvl,
            "title": f"Level {lvl}: {meta['name']} Tier {lvl}",
            "badge": "🌌" if lvl == 10 else ("⚡" if lvl >= 7 else "🎯"),
            "category": meta["category"],
            "difficulty": "Grandmaster" if lvl == 10 else ("Expert" if lvl >= 7 else ("Intermediate" if lvl >= 4 else "Foundational")),
            "pointsPerQ": POINTS_PER_LEVEL.get(lvl, 10),
            "skills": meta["skills"],
            "description": f"Level {lvl} mastery challenges covering {meta['assignedSkill']}.",
            "sampleTrick": sample_trick
        })
        methods_and_tricks[lvl] = lvl_questions

    return {
        "success": True,
        "gameId": game_id,
        "metadata": meta,
        "roadmap": levels_roadmap,
        "methodsAndTricks": methods_and_tricks
    }, 200


# ─────────────────────────────────────────────────────────────────────────────
# Backward-Compatible Forwarders for existing routes
# ─────────────────────────────────────────────────────────────────────────────
def start_magic_number_session(user_id=None, player_name="Challenger", level=1, mode="Standard"):
    return start_game_session("magic-number", user_id, player_name, level, mode)

def submit_magic_number_answer(user_id, session_id, question_id, selected_option, time_taken_seconds=5):
    return submit_game_answer("magic-number", user_id, session_id, question_id, selected_option, time_taken_seconds)

def finish_magic_number_session(user_id, session_id, time_spent_seconds=60, streak_max=0):
    return finish_game_session("magic-number", user_id, session_id, time_spent_seconds, streak_max)

def get_magic_number_leaderboard(limit=10):
    return get_game_leaderboard("magic-number", limit)

def get_magic_number_tricks():
    return {
        "success": True,
        "totalTricks": len(TRICKS_VAULT),
        "tricks": TRICKS_VAULT
    }, 200
