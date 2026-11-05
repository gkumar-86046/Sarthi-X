"""
cantroller/admin_controller.py  –  Business logic for Admin/Faculty Course Management.

Provides complete CRUD operations for:
  - Courses (creation, modification, deletion, metrics)
  - Modules (syllabus sequencing, adding, removing)
  - Lessons (video uploads, PDF notes, interactive quizzes)
  - Live statistics for faculty & administrator dashboards
"""

import re
import secrets
from database.connection import get_db, close_db


def _slugify(text: str) -> str:
    """Convert a title into an uppercase alphanumeric code prefix."""
    s = re.sub(r'[^a-zA-Z0-9]+', '-', text).strip('-').upper()
    return s[:12] if s else "CRS"


def _sync_course_totals(cursor, course_id: int):
    """Recalculate total_modules and total_lessons for a given course."""
    cursor.execute("""
        UPDATE courses c
        SET
            total_modules = (SELECT COUNT(*) FROM course_modules WHERE course_id = %s),
            total_lessons = (
                SELECT COUNT(*)
                FROM course_lessons cl
                JOIN course_modules cm ON cl.module_id = cm.id
                WHERE cm.course_id = %s
            )
        WHERE c.id = %s
    """, (course_id, course_id, course_id))


# ─────────────────────────────────────────────────────────────────────────────
# Courses: List & Metrics
# ─────────────────────────────────────────────────────────────────────────────

def admin_get_courses(search: str = None, education_level: str = None) -> tuple[dict, int]:
    """
    Fetch all courses with detailed faculty metrics (enrolled students, module/lesson counts).
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                c.id,
                c.course_code,
                c.title,
                c.education_level,
                c.target_field,
                c.category,
                c.subject,
                c.instructor,
                c.rating,
                c.thumbnail_bg,
                c.description,
                c.created_at,
                COUNT(DISTINCT m.id) AS total_modules,
                COUNT(DISTINCT l.id) AS total_lessons,
                COUNT(DISTINCT e.id) AS enrolled_students
            FROM courses c
            LEFT JOIN course_modules m ON m.course_id = c.id
            LEFT JOIN course_lessons l ON l.module_id = m.id
            LEFT JOIN user_course_enrollments e ON e.course_id = c.id
            WHERE 1=1
        """
        params = []

        if education_level and education_level != "all":
            query += " AND c.education_level = %s"
            params.append(education_level)

        if search:
            query += " AND (c.title LIKE %s OR c.instructor LIKE %s OR c.subject LIKE %s OR c.course_code LIKE %s)"
            s = f"%{search}%"
            params.extend([s, s, s, s])

        query += " GROUP BY c.id ORDER BY c.id DESC"

        cursor.execute(query, tuple(params))
        courses_raw = cursor.fetchall() or []

        courses = []
        total_students_enrolled = 0
        total_lessons_count = 0
        total_modules_count = 0

        for c in courses_raw:
            enrolled = int(c["enrolled_students"])
            mods = int(c["total_modules"])
            less = int(c["total_lessons"])
            total_students_enrolled += enrolled
            total_modules_count += mods
            total_lessons_count += less

            courses.append({
                "id": c["id"],
                "courseCode": c["course_code"],
                "title": c["title"],
                "educationLevel": c["education_level"],
                "targetField": c.get("target_field"),
                "category": c["category"],
                "subject": c["subject"],
                "instructor": c["instructor"],
                "rating": float(c["rating"]),
                "thumbnailBg": c["thumbnail_bg"],
                "description": c["description"] or "",
                "totalModules": mods,
                "totalLessons": less,
                "enrolledStudents": enrolled,
                "createdAt": str(c["created_at"]),
            })

        # Fetch system high-level stats
        cursor.execute("SELECT COUNT(*) AS count FROM users WHERE role = 'student'")
        total_users = (cursor.fetchone() or {}).get("count", 0)

        cursor.execute("SELECT DISTINCT subject FROM courses ORDER BY subject ASC")
        subjects = [row["subject"] for row in cursor.fetchall() or []]

        return {
            "success": True,
            "stats": {
                "totalCourses": len(courses),
                "totalModules": total_modules_count,
                "totalLessons": total_lessons_count,
                "totalEnrollments": total_students_enrolled,
                "totalRegisteredStudents": total_users,
            },
            "subjects": subjects,
            "courses": courses,
        }, 200

    except Exception as exc:
        print(f"[admin_get_courses] Error: {exc}")
        return {"success": False, "message": "Failed to load courses."}, 500
    finally:
        close_db(conn)


def admin_get_course_detail(course_id: int) -> tuple[dict, int]:
    """
    Fetch a single course with all its modules and lessons for editing / curriculum builder.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM courses WHERE id = %s", (course_id,))
        course = cursor.fetchone()
        if not course:
            return {"success": False, "message": "Course not found."}, 404

        # Fetch modules
        cursor.execute("""
            SELECT id, module_number, title, description, status, progress
            FROM course_modules
            WHERE course_id = %s
            ORDER BY module_number ASC
        """, (course_id,))
        modules = cursor.fetchall() or []

        modules_detail = []
        for m in modules:
            cursor.execute("""
                SELECT
                    id, lesson_number, lesson_type, title, duration,
                    file_size, questions_count, content_url, is_preview
                FROM course_lessons
                WHERE module_id = %s
                ORDER BY lesson_number ASC
            """, (m["id"],))
            lessons = cursor.fetchall() or []

            modules_detail.append({
                "id": m["id"],
                "moduleNumber": m["module_number"],
                "title": m["title"],
                "description": m["description"],
                "status": m["status"],
                "progress": m["progress"],
                "lessons": [
                    {
                        "id": l["id"],
                        "lessonNumber": l["lesson_number"],
                        "lessonType": l["lesson_type"],
                        "title": l["title"],
                        "duration": l["duration"] or "",
                        "fileSize": l["file_size"] or "",
                        "questionsCount": l["questions_count"],
                        "contentUrl": l["content_url"] or "",
                        "isPreview": bool(l["is_preview"]),
                    }
                    for l in lessons
                ]
            })

        return {
            "success": True,
            "course": {
                "id": course["id"],
                "courseCode": course["course_code"],
                "title": course["title"],
                "educationLevel": course["education_level"],
                "targetField": course.get("target_field"),
                "category": course["category"],
                "subject": course["subject"],
                "instructor": course["instructor"],
                "rating": float(course["rating"]),
                "thumbnailBg": course["thumbnail_bg"],
                "description": course["description"] or "",
                "modules": modules_detail,
            }
        }, 200

    except Exception as exc:
        print(f"[admin_get_course_detail] Error: {exc}")
        return {"success": False, "message": "Failed to fetch course details."}, 500
    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# Courses: Create, Update, Delete
# ─────────────────────────────────────────────────────────────────────────────

def admin_create_course(data: dict) -> tuple[dict, int]:
    """
    Insert a brand new course into MySQL.
    """
    conn = None
    try:
        title = data.get("title", "").strip()
        education_level = data.get("educationLevel") or data.get("education_level", "graduation")
        target_field = (data.get("targetField") or data.get("target_field") or "").strip() or None
        category = data.get("category", "").strip()
        subject = data.get("subject", "").strip()
        instructor = data.get("instructor", "").strip()

        if not title or not subject or not instructor:
            return {"success": False, "message": "Title, Subject, and Instructor are required."}, 400

        # Optional fields
        rating = float(data.get("rating", 4.85))
        thumbnail_bg = data.get("thumbnailBg") or data.get("thumbnail_bg") or "linear-gradient(135deg, #10b981 0%, #047857 100%)"
        description = data.get("description", "").strip()

        # Generate unique course code if not specified
        course_code = (data.get("courseCode") or data.get("course_code") or "").strip().upper()
        if not course_code:
            prefix = _slugify(title)
            course_code = f"{prefix}-{secrets.token_hex(2).upper()}"

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # Check unique code
        cursor.execute("SELECT id FROM courses WHERE course_code = %s", (course_code,))
        if cursor.fetchone():
            course_code = f"{course_code}-{secrets.token_hex(2).upper()}"

        cursor.execute("""
            INSERT INTO courses (
                course_code, title, education_level, target_field, category, subject,
                instructor, rating, total_modules, total_lessons, thumbnail_bg, description
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 0, 0, %s, %s)
        """, (
            course_code, title, education_level, target_field, category, subject,
            instructor, rating, thumbnail_bg, description
        ))
        conn.commit()

        new_id = cursor.lastrowid

        return {
            "success": True,
            "message": f"Course '{title}' created successfully.",
            "courseId": new_id,
        }, 201

    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[admin_create_course] Error: {exc}")
        return {"success": False, "message": "Failed to create course."}, 500
    finally:
        close_db(conn)


def admin_update_course(course_id: int, data: dict) -> tuple[dict, int]:
    """
    Update details of an existing course.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id FROM courses WHERE id = %s", (course_id,))
        if not cursor.fetchone():
            return {"success": False, "message": "Course not found."}, 404

        title = data.get("title", "").strip()
        education_level = data.get("educationLevel") or data.get("education_level")
        target_field = (data.get("targetField") or data.get("target_field") or "").strip() or None
        category = data.get("category", "").strip()
        subject = data.get("subject", "").strip()
        instructor = data.get("instructor", "").strip()
        rating = float(data.get("rating", 4.85))
        thumbnail_bg = data.get("thumbnailBg") or data.get("thumbnail_bg")
        description = data.get("description", "").strip()

        cursor.execute("""
            UPDATE courses
            SET
                title = COALESCE(NULLIF(%s, ''), title),
                education_level = COALESCE(NULLIF(%s, ''), education_level),
                target_field = %s,
                category = COALESCE(NULLIF(%s, ''), category),
                subject = COALESCE(NULLIF(%s, ''), subject),
                instructor = COALESCE(NULLIF(%s, ''), instructor),
                rating = %s,
                thumbnail_bg = COALESCE(NULLIF(%s, ''), thumbnail_bg),
                description = %s
            WHERE id = %s
        """, (title, education_level, target_field, category, subject, instructor, rating, thumbnail_bg, description, course_id))
        conn.commit()

        return {"success": True, "message": "Course updated successfully."}, 200

    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[admin_update_course] Error: {exc}")
        return {"success": False, "message": "Failed to update course."}, 500
    finally:
        close_db(conn)


def admin_delete_course(course_id: int) -> tuple[dict, int]:
    """
    Delete a course and all associated modules, lessons, and student progress (cascaded).
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, title FROM courses WHERE id = %s", (course_id,))
        course = cursor.fetchone()
        if not course:
            return {"success": False, "message": "Course not found."}, 404

        cursor.execute("DELETE FROM courses WHERE id = %s", (course_id,))
        conn.commit()

        return {"success": True, "message": f"Course '{course['title']}' deleted successfully."}, 200

    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[admin_delete_course] Error: {exc}")
        return {"success": False, "message": "Failed to delete course."}, 500
    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# Modules: Add, Update, Delete
# ─────────────────────────────────────────────────────────────────────────────

def admin_add_module(course_id: int, data: dict) -> tuple[dict, int]:
    """
    Add a new curriculum module to a course.
    """
    conn = None
    try:
        title = data.get("title", "").strip()
        description = data.get("description", "").strip()
        if not title:
            return {"success": False, "message": "Module title is required."}, 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id FROM courses WHERE id = %s", (course_id,))
        if not cursor.fetchone():
            return {"success": False, "message": "Course not found."}, 404

        # Calculate module sequence number
        cursor.execute("SELECT MAX(module_number) AS max_num FROM course_modules WHERE course_id = %s", (course_id,))
        row = cursor.fetchone()
        next_number = (row["max_num"] or 0) + 1 if row else 1

        cursor.execute("""
            INSERT INTO course_modules (course_id, module_number, title, description, status, progress)
            VALUES (%s, %s, %s, %s, 'Next Up', 0)
        """, (course_id, next_number, title, description))
        new_module_id = cursor.lastrowid
        cursor.execute("UPDATE courses SET total_modules = total_modules + 1 WHERE id = %s", (course_id,))
        conn.commit()

        return {
            "success": True,
            "message": f"Module '{title}' added successfully.",
            "moduleId": new_module_id,
        }, 201

    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[admin_add_module] Error: {exc}")
        return {"success": False, "message": "Failed to add module."}, 500
    finally:
        close_db(conn)


def admin_delete_module(module_id: int) -> tuple[dict, int]:
    """
    Delete a module and its lessons, updating course counters.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, course_id, title FROM course_modules WHERE id = %s", (module_id,))
        module = cursor.fetchone()
        if not module:
            return {"success": False, "message": "Module not found."}, 404

        course_id = module["course_id"]
        cursor.execute("DELETE FROM course_modules WHERE id = %s", (module_id,))
        conn.commit()

        _sync_course_totals(cursor, course_id)
        conn.commit()

        return {"success": True, "message": f"Module '{module['title']}' deleted successfully."}, 200

    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[admin_delete_module] Error: {exc}")
        return {"success": False, "message": "Failed to delete module."}, 500
    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# Lessons: Add, Update, Delete
# ─────────────────────────────────────────────────────────────────────────────

def admin_add_lesson(module_id: int, data: dict) -> tuple[dict, int]:
    """
    Add a lesson (video lecture, PDF notes, or quiz) to a module.
    """
    conn = None
    try:
        title = data.get("title", "").strip()
        lesson_type = data.get("lessonType") or data.get("lesson_type", "video")
        if not title:
            return {"success": False, "message": "Lesson title is required."}, 400

        if lesson_type not in ('video', 'pdf', 'quiz', 'assignment'):
            return {"success": False, "message": "Invalid lesson type."}, 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, course_id FROM course_modules WHERE id = %s", (module_id,))
        mod = cursor.fetchone()
        if not mod:
            return {"success": False, "message": "Module not found."}, 404

        course_id = mod["course_id"]

        # Fast O(1) index-guided sequence seek
        cursor.execute("SELECT COALESCE(MAX(lesson_number), 0) + 1 AS next_num FROM course_lessons WHERE module_id = %s", (module_id,))
        next_number = cursor.fetchone()["next_num"]

        duration = data.get("duration", "").strip() if lesson_type == "video" else None
        file_size = data.get("fileSize") or data.get("file_size") if lesson_type == "pdf" else None
        questions_count = int(data.get("questionsCount") or data.get("questions_count", 0)) if lesson_type == "quiz" else None
        content_url = data.get("contentUrl") or data.get("content_url", "").strip() or None
        is_preview = 1 if data.get("isPreview") else 0

        cursor.execute("""
            INSERT INTO course_lessons (
                module_id, lesson_number, lesson_type, title,
                duration, file_size, questions_count, content_url, is_preview
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            module_id, next_number, lesson_type, title,
            duration, file_size, questions_count, content_url, is_preview
        ))
        new_lesson_id = cursor.lastrowid

        # Atomic O(1) total_lessons increment
        cursor.execute("UPDATE courses SET total_lessons = total_lessons + 1 WHERE id = %s", (course_id,))
        conn.commit()

        return {
            "success": True,
            "message": f"Lesson '{title}' added successfully.",
            "lessonId": new_lesson_id,
        }, 201

    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[admin_add_lesson] Error: {exc}")
        return {"success": False, "message": "Failed to add lesson."}, 500
    finally:
        close_db(conn)


def admin_delete_lesson(lesson_id: int) -> tuple[dict, int]:
    """
    Delete a lesson and update course counters.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT l.id, l.title, m.course_id
            FROM course_lessons l
            JOIN course_modules m ON l.module_id = m.id
            WHERE l.id = %s
        """, (lesson_id,))
        lesson = cursor.fetchone()
        if not lesson:
            return {"success": False, "message": "Lesson not found."}, 404

        course_id = lesson["course_id"]
        cursor.execute("DELETE FROM course_lessons WHERE id = %s", (lesson_id,))
        cursor.execute("UPDATE courses SET total_lessons = GREATEST(0, total_lessons - 1) WHERE id = %s", (course_id,))
        conn.commit()

        return {"success": True, "message": f"Lesson '{lesson['title']}' deleted successfully."}, 200

    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[admin_delete_lesson] Error: {exc}")
        return {"success": False, "message": "Failed to delete lesson."}, 500
    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# Admin Analytics: Dashboard & Performance Overview
# ─────────────────────────────────────────────────────────────────────────────

def admin_get_dashboard_analytics() -> tuple[dict, int]:
    """
    Consolidated analytics for the top-level Administrator Dashboard.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # 1. Total counts
        cursor.execute("SELECT COUNT(*) AS total_students FROM users WHERE role = 'student'")
        total_students = cursor.fetchone()["total_students"]

        cursor.execute("SELECT COUNT(*) AS active_students FROM users WHERE role = 'student' AND is_active = 1")
        active_students = cursor.fetchone()["active_students"]

        cursor.execute("SELECT COUNT(*) AS total_courses FROM courses")
        total_courses = cursor.fetchone()["total_courses"]

        cursor.execute("SELECT COUNT(*) AS total_lessons FROM course_lessons")
        total_lessons = cursor.fetchone()["total_lessons"]

        cursor.execute("SELECT COUNT(*) AS total_modules FROM course_modules")
        total_modules = cursor.fetchone()["total_modules"]

        cursor.execute("SELECT COUNT(*) AS total_enrollments FROM user_course_enrollments")
        total_enrollments = cursor.fetchone()["total_enrollments"]

        cursor.execute("SELECT COUNT(*) AS total_assessments FROM student_assessments")
        total_assessments = cursor.fetchone()["total_assessments"]

        cursor.execute("SELECT COALESCE(AVG(score_percent), 0) AS avg_score FROM student_assessments")
        avg_score = float(cursor.fetchone()["avg_score"])

        # 2. Education tier distribution
        cursor.execute("""
            SELECT education_level, COUNT(*) AS count
            FROM users
            WHERE role = 'student'
            GROUP BY education_level
        """)
        tier_dist = {r["education_level"]: r["count"] for r in cursor.fetchall() or []}

        # 3. Lesson types breakdown
        cursor.execute("""
            SELECT lesson_type, COUNT(*) AS count
            FROM course_lessons
            GROUP BY lesson_type
        """)
        lesson_breakdown = {r["lesson_type"]: r["count"] for r in cursor.fetchall() or []}

        # 4. Recent assessments with student names
        cursor.execute("""
            SELECT
                sa.id, sa.score_percent, sa.archetype_name, sa.created_at,
                u.full_name, u.email, u.education_level
            FROM student_assessments sa
            JOIN users u ON sa.user_id = u.id
            ORDER BY sa.created_at DESC
            LIMIT 6
        """)
        recent_assessments = [
            {
                "id": a["id"],
                "studentName": a["full_name"],
                "email": a["email"],
                "scorePercent": float(a["score_percent"]),
                "archetype": a["archetype_name"],
                "educationLevel": a["education_level"],
                "date": str(a["created_at"]),
            }
            for a in cursor.fetchall() or []
        ]

        # 5. Recent courses added
        cursor.execute("""
            SELECT id, title, course_code, subject, instructor, rating, total_lessons, total_modules
            FROM courses
            ORDER BY id DESC
            LIMIT 5
        """)
        recent_courses = [
            {
                "id": c["id"],
                "title": c["title"],
                "courseCode": c["course_code"],
                "subject": c["subject"],
                "instructor": c["instructor"],
                "rating": float(c["rating"]),
                "lessons": c["total_lessons"],
                "modules": c["total_modules"],
            }
            for c in cursor.fetchall() or []
        ]

        return {
            "success": True,
            "metrics": {
                "totalStudents": total_students,
                "activeStudents": active_students,
                "totalCourses": total_courses,
                "totalModules": total_modules,
                "totalLessons": total_lessons,
                "totalEnrollments": total_enrollments,
                "totalAssessments": total_assessments,
                "averageDiagnosticScore": round(avg_score, 1),
            },
            "tierDistribution": tier_dist,
            "lessonTypes": lesson_breakdown,
            "recentAssessments": recent_assessments,
            "recentCourses": recent_courses,
        }, 200

    except Exception as exc:
        print(f"[admin_get_dashboard_analytics] Error: {exc}")
        return {"success": False, "message": "Failed to load dashboard analytics."}, 500
    finally:
        close_db(conn)


def admin_get_performance_analytics() -> tuple[dict, int]:
    """
    In-depth analysis of student diagnostic tests, competency scores, and archetype trends.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # 1. Competency averages across all student diagnostic submissions
        cursor.execute("""
            SELECT
                COALESCE(AVG(aptitude_score), 0) AS avg_aptitude,
                COALESCE(AVG(logic_score), 0) AS avg_logic,
                COALESCE(AVG(technical_score), 0) AS avg_technical,
                COALESCE(AVG(verbal_score), 0) AS avg_verbal,
                COALESCE(AVG(problem_solving_score), 0) AS avg_problem_solving,
                COALESCE(AVG(score_percent), 0) AS avg_overall,
                COALESCE(MAX(score_percent), 0) AS max_score,
                COALESCE(MIN(score_percent), 0) AS min_score,
                COUNT(*) AS total_submissions
            FROM student_assessments
        """)
        stats = cursor.fetchone() or {}

        competencies = [
            {"domain": "Aptitude", "score": round(float(stats.get("avg_aptitude", 0)), 1), "benchmark": 75},
            {"domain": "Logic", "score": round(float(stats.get("avg_logic", 0)), 1), "benchmark": 80},
            {"domain": "Technical", "score": round(float(stats.get("avg_technical", 0)), 1), "benchmark": 70},
            {"domain": "Verbal", "score": round(float(stats.get("avg_verbal", 0)), 1), "benchmark": 75},
            {"domain": "Problem Solving", "score": round(float(stats.get("avg_problem_solving", 0)), 1), "benchmark": 85},
        ]

        # 2. Archetype distribution
        cursor.execute("""
            SELECT archetype_name, COUNT(*) AS count
            FROM student_assessments
            GROUP BY archetype_name
            ORDER BY count DESC
        """)
        archetypes = [
            {"archetype": r["archetype_name"], "count": r["count"]}
            for r in cursor.fetchall() or []
        ]

        # 3. Student Assessment submissions list
        cursor.execute("""
            SELECT
                sa.id, sa.user_id, sa.score_percent, sa.aptitude_score, sa.logic_score,
                sa.technical_score, sa.verbal_score, sa.problem_solving_score,
                sa.archetype_name, sa.created_at,
                u.full_name, u.email, u.education_level, u.mobile, u.graduation_course
            FROM student_assessments sa
            JOIN users u ON sa.user_id = u.id
            ORDER BY sa.created_at DESC
            LIMIT 50
        """)
        submissions = [
            {
                "id": s["id"],
                "studentName": s["full_name"],
                "email": s["email"],
                "mobile": s["mobile"],
                "educationLevel": s["education_level"],
                "course": s["graduation_course"] or s["education_level"],
                "scorePercent": float(s["score_percent"]),
                "archetype": s["archetype_name"],
                "scores": {
                    "aptitude": float(s["aptitude_score"]),
                    "logic": float(s["logic_score"]),
                    "technical": float(s["technical_score"]),
                    "verbal": float(s["verbal_score"]),
                    "problemSolving": float(s["problem_solving_score"]),
                },
                "date": str(s["created_at"]),
            }
            for s in cursor.fetchall() or []
        ]

        return {
            "success": True,
            "overall": {
                "avgScore": round(float(stats.get("avg_overall", 0)), 1),
                "maxScore": round(float(stats.get("max_score", 0)), 1),
                "totalSubmissions": stats.get("total_submissions", 0),
            },
            "competencies": competencies,
            "archetypes": archetypes,
            "submissions": submissions,
        }, 200

    except Exception as exc:
        print(f"[admin_get_performance_analytics] Error: {exc}")
        return {"success": False, "message": "Failed to load performance analytics."}, 500
    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# Students Management
# ─────────────────────────────────────────────────────────────────────────────

def admin_get_students(search: str = None, education_level: str = None) -> tuple[dict, int]:
    """
    List registered students with enrollment counts and assessment statuses.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                u.id, u.full_name, u.email, u.mobile, u.education_level,
                u.nursery_class, u.stream, u.highschool_class, u.intermediate_year,
                u.graduation_course, u.graduation_year, u.role, u.is_active, u.created_at,
                COUNT(DISTINCT e.id) AS enrolled_courses,
                MAX(sa.score_percent) AS latest_score,
                MAX(sa.archetype_name) AS archetype
            FROM users u
            LEFT JOIN user_course_enrollments e ON e.user_id = u.id
            LEFT JOIN student_assessments sa ON sa.user_id = u.id
            WHERE u.role = 'student'
        """
        params = []

        if education_level and education_level != "all":
            query += " AND u.education_level = %s"
            params.append(education_level)

        if search:
            query += " AND (u.full_name LIKE %s OR u.email LIKE %s OR u.mobile LIKE %s)"
            s = f"%{search}%"
            params.extend([s, s, s])

        query += " GROUP BY u.id ORDER BY u.id DESC"

        cursor.execute(query, tuple(params))
        students_raw = cursor.fetchall() or []

        students = []
        for s in students_raw:
            level = s["education_level"]
            detail = ""
            if level == "graduation":
                detail = f"{s.get('graduation_course') or 'Graduation'} ({s.get('graduation_year') or ''})"
            elif level == "intermediate":
                detail = f"11th/12th - {s.get('stream') or 'General'}"
            elif level == "highschool":
                detail = f"{s.get('highschool_class') or 'School'}"
            else:
                detail = f"{s.get('nursery_class') or 'Primary'}"

            students.append({
                "id": s["id"],
                "fullName": s["full_name"],
                "email": s["email"],
                "mobile": s["mobile"],
                "educationLevel": s["education_level"],
                "academicDetail": detail,
                "isActive": bool(s["is_active"]),
                "enrolledCourses": int(s["enrolled_courses"]),
                "diagnosticScore": float(s["latest_score"]) if s["latest_score"] is not None else None,
                "archetype": s["archetype"] or "Pending Test",
                "createdAt": str(s["created_at"]),
            })

        return {
            "success": True,
            "total": len(students),
            "students": students,
        }, 200

    except Exception as exc:
        print(f"[admin_get_students] Error: {exc}")
        return {"success": False, "message": "Failed to load student directory."}, 500
    finally:
        close_db(conn)


def admin_toggle_student_status(student_id: int) -> tuple[dict, int]:
    """Toggle a student's active/deactivated status."""
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, is_active, full_name FROM users WHERE id = %s", (student_id,))
        student = cursor.fetchone()
        if not student:
            return {"success": False, "message": "Student not found."}, 404

        new_status = 0 if student["is_active"] else 1
        cursor.execute("UPDATE users SET is_active = %s WHERE id = %s", (new_status, student_id))
        conn.commit()

        status_text = "activated" if new_status == 1 else "deactivated"
        return {
            "success": True,
            "message": f"Student '{student['full_name']}' has been {status_text}.",
            "isActive": bool(new_status),
        }, 200

    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[admin_toggle_student_status] Error: {exc}")
        return {"success": False, "message": "Failed to update student status."}, 500
    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# Roadmaps Management
# ─────────────────────────────────────────────────────────────────────────────

def admin_get_roadmaps() -> tuple[dict, int]:
    """
    List all generated student learning roadmaps with milestones and progress.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                r.id, r.user_id, r.title, r.target_role, r.estimated_weeks,
                r.current_phase, r.phases_json, r.status, r.created_at,
                u.full_name, u.email, u.education_level
            FROM student_roadmaps r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        """)
        roadmaps_raw = cursor.fetchall() or []

        roadmaps = []
        for r in roadmaps_raw:
            phases = []
            try:
                import json
                phases = json.loads(r["phases_json"]) if r["phases_json"] else []
            except Exception:
                phases = []

            roadmaps.append({
                "id": r["id"],
                "studentName": r["full_name"],
                "email": r["email"],
                "educationLevel": r["education_level"],
                "title": r["title"],
                "targetRole": r["target_role"],
                "estimatedWeeks": r["estimated_weeks"],
                "currentPhase": r["current_phase"],
                "totalPhases": len(phases),
                "phases": phases,
                "status": r["status"],
                "createdAt": str(r["created_at"]),
            })

        return {
            "success": True,
            "total": len(roadmaps),
            "roadmaps": roadmaps,
        }, 200

    except Exception as exc:
        print(f"[admin_get_roadmaps] Error: {exc}")
        return {"success": False, "message": "Failed to load roadmaps."}, 500
    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# Question Bank Management
# ─────────────────────────────────────────────────────────────────────────────

def admin_get_questions() -> tuple[dict, int]:
    """
    Fetch all diagnostic & assessment questions grouped by domain.
    """
    from cantroller.assessment_controller import QUESTIONS_GRADUATION

    # Format questions cleanly for admin editor
    return {
        "success": True,
        "domains": ["aptitude", "logic", "technical", "verbal", "problem_solving"],
        "questions": QUESTIONS_GRADUATION,
    }, 200

