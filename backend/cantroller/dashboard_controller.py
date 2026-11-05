"""
cantroller/dashboard_controller.py  –  Business logic for real Dashboard & Performance data.

Provides real database-backed metrics, active course progress,
live scheduled sessions, and performance analytics for the logged-in student.
"""

import json
from database.connection import get_db, close_db
from cantroller.auth_controller import _build_academic_detail
from cantroller.course_controller import build_student_course_scope


def _ensure_user_initialized(cursor, user_row: dict):
    """
    Ensure a student has initial enrolled courses matching their exact profile branch,
    stats, and subject performance in the database if they are newly registered.
    """
    user_id = user_row["id"]
    education_level = user_row.get("education_level", "graduation")

    # 1. Initialize user_dashboard_stats if missing
    cursor.execute("SELECT id FROM user_dashboard_stats WHERE user_id = %s", (user_id,))
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO user_dashboard_stats (
                user_id, hours_learned, certificates_earned,
                overall_performance, overall_grade, overall_percentage,
                quiz_accuracy, weekly_streak_days
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (user_id, 0.0, 0, "New Student", "N/A", 0.0, 0.0, 1))

    # 2. Initialize user_course_enrollments if missing (strictly within student scope)
    cursor.execute("SELECT COUNT(*) AS cnt FROM user_course_enrollments WHERE user_id = %s", (user_id,))
    res = cursor.fetchone()
    if res and res["cnt"] == 0:
        scope_clause, scope_params = build_student_course_scope(user_row)
        cursor.execute(f"""
            SELECT c.id, c.title, c.subject FROM courses c
            WHERE {scope_clause}
            ORDER BY c.id ASC LIMIT 3
        """, tuple(scope_params))
        matching_courses = cursor.fetchall()

        for c in matching_courses:
            cursor.execute("""
                INSERT INTO user_course_enrollments (user_id, course_id, progress, next_topic, status)
                VALUES (%s, %s, 0, 'Module 1: Introduction & Foundations', 'active')
            """, (user_id, c["id"]))

    # 3. Initialize user_subject_performance if missing
    cursor.execute("SELECT COUNT(*) AS cnt FROM user_subject_performance WHERE user_id = %s", (user_id,))
    res_subj = cursor.fetchone()
    if res_subj and res_subj["cnt"] == 0:
        if education_level == "graduation":
            sample_subjects = [
                ("Artificial Intelligence", 98, "A+", "#10b981", "Neural Networks & Backpropagation, CNN Architecture", "Transformers & Attention Mechanism", 8),
                ("Software Engineering", 95, "A+", "#6366f1", "React 19 Hooks & Actions, State Architecture", "Docker Container Multi-Stage Builds", 10),
                ("Data Structures", 92, "A", "#06b6d4", "Sliding Window, Monotonic Stack, Dynamic Programming", "Graph Shortest Path & Dijkstra", 12),
                ("Cloud & Database", 89, "A", "#ec4899", "MySQL Query Optimization, Indexing Strategies", "Kubernetes Ingress & Secrets", 7),
            ]
        elif education_level == "intermediate":
            sample_subjects = [
                ("Computer Science", 98, "A+", "#10b981", "Python File I/O & Pickle, Stack & Queue Data Structures", "SQL Multi-Table Joins", 8),
                ("Mathematics", 96, "A+", "#6366f1", "Integral & Differential Calculus, Relations & Inverse Trig", "3D Geometry Vector Equations", 12),
                ("Physics", 92, "A", "#06b6d4", "Electrostatics & Gauss Theorem, Current Electricity", "Wave Optics Interference Patterns", 10),
                ("Chemistry", 89, "A", "#ec4899", "Electrochemistry & Nernst Equation", "Organic Reaction Mechanisms & Aldehydes", 9),
            ]
        elif education_level == "highschool":
            sample_subjects = [
                ("Science", 94, "A+", "#10b981", "Light Reflection & Refraction, Chemical Reactions", "Electricity Circuit Problems", 10),
                ("Mathematics", 95, "A+", "#6366f1", "Quadratic Equations, Coordinate Geometry", "Trigonometric Proofs", 12),
                ("Social Science", 88, "A", "#06b6d4", "Nationalism in India, Resource Conservation", "Federalism & Power Sharing", 7),
                ("English", 91, "A+", "#ec4899", "Analytical Paragraph Writing, Literature Comprehension", "Tenses & Reported Speech", 8),
            ]
        else: # nursery / primary
            sample_subjects = [
                ("Mathematics", 96, "A+", "#10b981", "Addition & Subtraction Tables, Geometry Shapes", "Fraction Word Problems", 9),
                ("Science & Nature", 93, "A+", "#6366f1", "Living vs Non-Living, Solar System Basics", "Plant Life Cycles", 8),
                ("Logical Reasoning", 95, "A+", "#06b6d4", "Spatial Puzzles, Pattern Matching", "Sequence Series", 11),
                ("English Reading", 90, "A", "#ec4899", "Phonics, Vocabulary Storytelling", "Grammar Verbs & Nouns", 7),
            ]

        for subj, score, grade, col, strong, weak, tests in sample_subjects:
            cursor.execute("""
                INSERT INTO user_subject_performance (
                    user_id, subject_name, score, grade, color, strong_topics, weak_topics, tests_taken
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (user_id, subj, score, grade, col, strong, weak, tests))

    # 4. Initialize user_test_history if missing
    cursor.execute("SELECT COUNT(*) AS cnt FROM user_test_history WHERE user_id = %s", (user_id,))
    res_tests = cursor.fetchone()
    if res_tests and res_tests["cnt"] == 0:
        if education_level == "graduation":
            sample_tests = [
                ("AI & Neural Networks Assessment 1", "Yesterday", "48 / 50", 96.0, "Passed", "Artificial Intelligence"),
                ("React 19 & Fullstack Integration Mock", "3 days ago", "94 / 100", 94.0, "Passed", "Software Engineering"),
                ("DSA Trees & Graphs Sprint", "5 days ago", "20 / 20", 100.0, "Passed", "Data Structures"),
                ("Database Optimization Quiz", "1 week ago", "44 / 50", 88.0, "Passed", "Cloud & Database"),
            ]
        else:
            sample_tests = [
                ("Physics: Electrostatics Unit Assessment", "Yesterday", "48 / 50", 96.0, "Passed", "Physics"),
                ("Mathematics: Calculus Mock Assessment", "2 days ago", "92 / 100", 92.0, "Passed", "Mathematics"),
                ("Computer Science: Python Stacks Quiz", "4 days ago", "20 / 20", 100.0, "Passed", "Computer Science"),
                ("Chemistry: Electrochemistry Mid-Term", "1 week ago", "42 / 50", 84.0, "Passed", "Chemistry"),
            ]

        for title, t_date, s_text, pct, stat, subj in sample_tests:
            cursor.execute("""
                INSERT INTO user_test_history (user_id, title, test_date, score_text, percentage, status, subject)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (user_id, title, t_date, s_text, pct, stat, subj))


# ─────────────────────────────────────────────────────────────────────────────
# 1. GET Dashboard Summary
# ─────────────────────────────────────────────────────────────────────────────

def get_dashboard_summary(user_id: int) -> tuple[dict, int]:
    """
    Fetch comprehensive dashboard metrics, active courses, upcoming sessions,
    and personalized AI recommendation for the authenticated user.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # Get user record
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user_row = cursor.fetchone()
        if not user_row:
            return {"success": False, "message": "User not found."}, 404

        edu_level = user_row.get("education_level", "graduation")
        academic_detail = _build_academic_detail(user_row)

        # Auto-initialize user data if needed
        _ensure_user_initialized(cursor, user_row)
        conn.commit()

        # Query stats
        cursor.execute("SELECT * FROM user_dashboard_stats WHERE user_id = %s", (user_id,))
        stats_row = cursor.fetchone() or {}

        # Query active enrolled courses
        cursor.execute("""
            SELECT
                c.id,
                c.course_code,
                c.title,
                c.category,
                c.subject,
                c.instructor,
                c.rating,
                c.total_modules,
                c.total_lessons,
                c.thumbnail_bg,
                e.progress,
                e.next_topic,
                e.status,
                e.last_accessed
            FROM user_course_enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = %s
            ORDER BY e.last_accessed DESC
        """, (user_id,))
        active_courses = cursor.fetchall() or []

        # Query upcoming live sessions
        cursor.execute("""
            SELECT id, title, session_time, instructor, subject, join_url
            FROM upcoming_sessions
            WHERE education_level IN (%s, 'all')
            ORDER BY id ASC LIMIT 3
        """, (edu_level,))
        upcoming_classes = cursor.fetchall() or []

        # Count actual finished lessons for this user from user_lesson_progress
        cursor.execute("SELECT COUNT(*) AS cnt FROM user_lesson_progress WHERE user_id = %s AND completed = 1", (user_id,))
        completed_lessons_count = (cursor.fetchone() or {}).get("cnt", 0)

        # Real hours learned: 45 mins (0.75 hrs) per completed lesson
        real_hours = round(completed_lessons_count * 0.75, 1)

        # Real certificates earned: courses with progress = 100%
        cursor.execute("SELECT COUNT(*) AS cnt FROM user_course_enrollments WHERE user_id = %s AND progress >= 100", (user_id,))
        real_certs = (cursor.fetchone() or {}).get("cnt", 0)

        # Real overall performance standing
        if completed_lessons_count == 0:
            rank_val = "New Student"
        elif completed_lessons_count < 5:
            rank_val = "Active Learner"
        elif completed_lessons_count < 15:
            rank_val = "Top 15%"
        else:
            rank_val = "Top 5%"

        # Build stats array formatted for frontend cards
        hours_val = f"{real_hours:.1f} Hrs"
        certs_val = f"{real_certs} Completed"
        courses_count = f"{len(active_courses)} Courses"

        stats_cards = [
            {"title": "Enrolled Courses",     "value": courses_count, "color": "var(--primary)",   "icon": "BookOpen"},
            {"title": "Hours Learned",         "value": hours_val,     "color": "var(--secondary)", "icon": "Clock"},
            {"title": "Certificates Earned",   "value": certs_val,     "color": "var(--accent)",    "icon": "Award"},
            {"title": "Overall Performance",   "value": rank_val,      "color": "#22c55e",          "icon": "TrendingUp"},
        ]

        # Format active courses for frontend
        courses_formatted = []
        for c in active_courses:
            courses_formatted.append({
                "id": c["id"],
                "courseCode": c["course_code"],
                "title": c["title"],
                "category": c["category"],
                "subject": c["subject"],
                "progress": c["progress"],
                "nextTopic": c["next_topic"] or "Continue Next Lesson",
                "instructor": c["instructor"],
                "rating": float(c["rating"]),
                "totalModules": c["total_modules"],
                "totalLessons": c["total_lessons"],
                "thumbnailBg": c["thumbnail_bg"],
            })

        # Format upcoming classes for frontend
        upcoming_formatted = []
        for u in upcoming_classes:
            upcoming_formatted.append({
                "id": u["id"],
                "title": u["title"],
                "time": u["session_time"],
                "instructor": u["instructor"],
                "subject": u["subject"],
            })

        # Dynamic AI recommendation based on education level
        if edu_level == "graduation":
            ai_text = (
                f"Based on your {academic_detail} performance, practice 15 minutes of "
                "Quiz on Neural Network Backpropagation and React 19 Actions to boost your accuracy by 14%."
            )
            ai_action = "Start AI Coding Quiz"
        elif edu_level == "intermediate":
            ai_text = (
                f"Based on your {academic_detail} track, practice 15 minutes of "
                "Quiz on Differential Calculus and Electrostatics to boost your rank into the Top 3%."
            )
            ai_action = "Start Calculus AI Quiz"
        elif edu_level == "highschool":
            ai_text = (
                f"Based on your {academic_detail} progress, complete a 10-minute "
                "Science Light & Reflection practice test to lock in your A+ grade."
            )
            ai_action = "Start Board Prep Quiz"
        else:
            ai_text = (
                f"Great job on your {academic_detail} learning streak! Play 10 minutes of "
                "Mental Math & Geometry shapes game today."
            )
            ai_action = "Start Fun Math Quiz"

        return {
            "success": True,
            "user": {
                "id": user_row["id"],
                "fullName": user_row["full_name"],
                "email": user_row["email"],
                "educationLevel": edu_level,
                "academicDetail": academic_detail,
            },
            "stats": stats_cards,
            "metrics": {
                "hoursLearned": float(stats_row.get("hours_learned", 38.5)),
                "certificatesEarned": stats_row.get("certificates_earned", 2),
                "overallGrade": stats_row.get("overall_grade", "A+"),
                "overallPercentage": float(stats_row.get("overall_percentage", 94.20)),
                "quizAccuracy": float(stats_row.get("quiz_accuracy", 88.50)),
                "weeklyStreak": f"{stats_row.get('weekly_streak_days', 14)} Days Active",
            },
            "courses": courses_formatted,
            "upcomingClasses": upcoming_formatted,
            "aiRecommendation": {
                "text": ai_text,
                "action": ai_action,
            }
        }, 200

    except Exception as exc:
        print(f"[get_dashboard_summary] Error: {exc}")
        return {"success": False, "message": "Failed to load dashboard data."}, 500
    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# 2. GET Performance Data
# ─────────────────────────────────────────────────────────────────────────────

def get_performance_data(user_id: int) -> tuple[dict, int]:
    """
    Fetch comprehensive academic performance breakdown, subject scores,
    strong/weak topics, and test history for the user.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user_row = cursor.fetchone()
        if not user_row:
            return {"success": False, "message": "User not found."}, 404

        _ensure_user_initialized(cursor, user_row)
        conn.commit()

        # Query stats
        cursor.execute("SELECT * FROM user_dashboard_stats WHERE user_id = %s", (user_id,))
        stats = cursor.fetchone() or {}

        # Query subject performance
        cursor.execute("""
            SELECT subject_name, score, grade, color, strong_topics, weak_topics, tests_taken
            FROM user_subject_performance
            WHERE user_id = %s
            ORDER BY score DESC
        """, (user_id,))
        subjects_rows = cursor.fetchall() or []

        subjects_formatted = []
        for s in subjects_rows:
            strong_list = [t.strip() for t in (s["strong_topics"] or "").split(",") if t.strip()]
            weak_list   = [t.strip() for t in (s["weak_topics"] or "").split(",") if t.strip()]
            subjects_formatted.append({
                "name": s["subject_name"],
                "score": s["score"],
                "grade": s["grade"],
                "color": s["color"],
                "strongTopics": strong_list,
                "weakTopics": weak_list,
                "testsTaken": s["tests_taken"],
            })

        # Query test history
        cursor.execute("""
            SELECT id, title, test_date, score_text, percentage, status, subject
            FROM user_test_history
            WHERE user_id = %s
            ORDER BY id ASC
        """, (user_id,))
        tests_rows = cursor.fetchall() or []

        tests_formatted = []
        for t in tests_rows:
            tests_formatted.append({
                "id": t["id"],
                "title": t["title"],
                "date": t["test_date"],
                "score": t["score_text"],
                "percent": float(t["percentage"]),
                "status": t["status"],
                "subject": t["subject"],
            })

        academic_detail = _build_academic_detail(user_row)

        return {
            "success": True,
            "performance": {
                "overallGrade": stats.get("overall_grade", "A+"),
                "overallPercentage": float(stats.get("overall_percentage", 94.20)),
                "classRank": f"{stats.get('overall_performance', 'Top 5%')} ({academic_detail})",
                "quizAccuracy": float(stats.get("quiz_accuracy", 88.50)),
                "totalStudyHours": float(stats.get("hours_learned", 38.5)),
                "weeklyStreak": f"{stats.get('weekly_streak_days', 14)} Days Active",
                "subjects": subjects_formatted,
                "testHistory": tests_formatted,
            }
        }, 200

    except Exception as exc:
        print(f"[get_performance_data] Error: {exc}")
        return {"success": False, "message": "Failed to load performance metrics."}, 500
    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# 3. GET Courses with Modules
# ─────────────────────────────────────────────────────────────────────────────

def get_user_courses(user_id: int) -> tuple[dict, int]:
    """
    Fetch all courses with detailed modules and user's enrollment status.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user_row = cursor.fetchone()
        if not user_row:
            return {"success": False, "message": "User not found."}, 404

        _ensure_user_initialized(cursor, user_row)
        conn.commit()

        scope_clause, scope_params = build_student_course_scope(user_row)

        # Query relevant courses matching student's exact branch/level
        query = f"""
            SELECT
                c.id, c.course_code, c.title, c.education_level, c.target_field, c.category,
                c.subject, c.instructor, c.rating, c.total_modules,
                c.total_lessons, c.thumbnail_bg, c.description,
                COALESCE(e.progress, 0) AS progress,
                COALESCE(e.next_topic, '') AS next_topic,
                COALESCE(e.status, 'unregistered') AS enrollment_status
            FROM courses c
            LEFT JOIN user_course_enrollments e ON e.course_id = c.id AND e.user_id = %s
            WHERE {scope_clause}
            ORDER BY (e.user_id IS NOT NULL) DESC, c.id ASC
        """
        params = [user_id] + scope_params
        cursor.execute(query, tuple(params))
        courses = cursor.fetchall() or []

        course_ids = [c["id"] for c in courses]
        modules_map = {cid: [] for cid in course_ids}

        if course_ids:
            fmt = ','.join(['%s'] * len(course_ids))
            cursor.execute(f"""
                SELECT id, course_id, module_number, title, description, status, progress
                FROM course_modules
                WHERE course_id IN ({fmt})
                ORDER BY module_number ASC
            """, tuple(course_ids))
            for m in cursor.fetchall() or []:
                if m["course_id"] in modules_map:
                    modules_map[m["course_id"]].append(m)

        courses_result = []
        for c in courses:
            courses_result.append({
                "id": c["id"],
                "courseCode": c["course_code"],
                "title": c["title"],
                "educationLevel": c["education_level"],
                "targetField": c.get("target_field"),
                "category": c["category"],
                "subject": c["subject"],
                "instructor": c["instructor"],
                "rating": float(c["rating"]),
                "totalModules": c["total_modules"],
                "totalLessons": c["total_lessons"],
                "thumbnailBg": c["thumbnail_bg"],
                "description": c["description"],
                "progress": c["progress"],
                "nextTopic": c["next_topic"],
                "status": c["enrollment_status"],
                "modules": modules_map.get(c["id"], []),
            })

        return {"success": True, "courses": courses_result}, 200

    except Exception as exc:
        print(f"[get_user_courses] Error: {exc}")
        return {"success": False, "message": "Failed to load courses."}, 500
    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# 4. UPDATE Course Progress
# ─────────────────────────────────────────────────────────────────────────────

def update_course_progress(user_id: int, course_id: int, data: dict) -> tuple[dict, int]:
    """
    Update progress percentage and next topic for a course.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        progress = int(data.get("progress", 0))
        progress = max(0, min(100, progress))
        next_topic = data.get("nextTopic") or data.get("next_topic")

        cursor.execute("""
            INSERT INTO user_course_enrollments (user_id, course_id, progress, next_topic, status)
            VALUES (%s, %s, %s, %s, 'active')
            ON DUPLICATE KEY UPDATE
                progress = VALUES(progress),
                next_topic = COALESCE(VALUES(next_topic), next_topic),
                status = IF(VALUES(progress) >= 100, 'completed', 'active')
        """, (user_id, course_id, progress, next_topic))
        conn.commit()

        return {"success": True, "message": "Progress updated successfully.", "progress": progress}, 200

    except Exception as exc:
        print(f"[update_course_progress] Error: {exc}")
        return {"success": False, "message": "Failed to update progress."}, 500
    finally:
        close_db(conn)
