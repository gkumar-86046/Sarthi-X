"""
test_courses_algorithm.py  –  Automated verification of:
1. Strict Profile Isolation (B.Tech vs MBBS vs Schooling)
2. Fast O(1) Perfect Lecture Algorithm & Sequential Progression
3. Admin Lecture Upload & Instant Availability
"""

from pathlib import Path
import sys
import time

_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from database.connection import get_db, close_db
from cantroller.course_controller import get_courses, get_course_detail, get_perfect_lecture, complete_lesson
from cantroller.admin_controller import admin_add_lesson, admin_delete_lesson


def run_tests():
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    print("================================================================")
    print(" 1. TESTING PROFILE-BASED COURSE ISOLATION")
    print("================================================================")

    # Create 3 test users in DB if not exist
    cur.execute("DELETE FROM users WHERE email IN ('test_btech@sarathix.com', 'test_mbbs@sarathix.com', 'test_school@sarathix.com')")
    conn.commit()

    # User 1: B.Tech Student
    cur.execute("""
        INSERT INTO users (full_name, email, mobile, password_hash, education_level, graduation_course, graduation_year)
        VALUES ('Aryan BTech', 'test_btech@sarathix.com', '9876500001', 'dummyhash', 'graduation', 'B.Tech / B.E (Engineering)', '3rd Year')
    """)
    btech_id = cur.lastrowid

    # User 2: MBBS Medical Student
    cur.execute("""
        INSERT INTO users (full_name, email, mobile, password_hash, education_level, graduation_course, graduation_year)
        VALUES ('Dr. Priya MBBS', 'test_mbbs@sarathix.com', '9876500002', 'dummyhash', 'graduation', 'MBBS (Medical)', '2nd Year')
    """)
    mbbs_id = cur.lastrowid

    # User 3: Class 10 High School Student
    cur.execute("""
        INSERT INTO users (full_name, email, mobile, password_hash, education_level, highschool_class, stream)
        VALUES ('Rohan School', 'test_school@sarathix.com', '9876500003', 'dummyhash', 'highschool', 'Class 10', 'Science')
    """)
    school_id = cur.lastrowid
    conn.commit()

    # ── Test 1A: B.Tech Student Courses ──────────────────────────────────────
    res_btech, status = get_courses(btech_id)
    assert status == 200, f"Expected 200, got {status}"
    btech_titles = [c["title"] for c in res_btech["courses"]]
    btech_levels = {c["educationLevel"] for c in res_btech["courses"]}
    print(f"B.Tech Student visible courses ({len(btech_titles)}): {btech_titles}")
    assert all(lvl == "graduation" for lvl in btech_levels), "B.Tech student must ONLY see graduation courses!"
    assert any("AI" in t or "Web" in t or "DSA" in t or "DevOps" in t for t in btech_titles), "B.Tech courses must be present!"
    assert not any("Anatomy" in t for t in btech_titles), "MBBS courses must NOT show in B.Tech!"
    assert not any("Class 10" in t or "Class 12" in t for t in btech_titles), "Schooling courses must NOT show in B.Tech!"
    print("[PASS] B.Tech Student Isolation: PASSED (Zero leakage)")

    # ── Test 1B: MBBS Student Courses ────────────────────────────────────────
    res_mbbs, status = get_courses(mbbs_id)
    assert status == 200
    mbbs_titles = [c["title"] for c in res_mbbs["courses"]]
    print(f"MBBS Student visible courses ({len(mbbs_titles)}): {mbbs_titles}")
    assert any("Anatomy" in t for t in mbbs_titles), "MBBS course must be present!"
    assert not any("React" in t or "DevOps" in t for t in mbbs_titles), "B.Tech courses must NOT show in MBBS!"
    assert not any("Class 10" in t for t in mbbs_titles), "School courses must NOT show in MBBS!"
    print("[PASS] MBBS Student Isolation: PASSED (Zero leakage)")

    # ── Test 1C: School Student Courses ──────────────────────────────────────
    res_school, status = get_courses(school_id)
    assert status == 200
    school_titles = [c["title"] for c in res_school["courses"]]
    school_levels = {c["educationLevel"] for c in res_school["courses"]}
    print(f"School Student visible courses ({len(school_titles)}): {school_titles}")
    assert all(lvl == "highschool" for lvl in school_levels), "School student must ONLY see highschool courses!"
    assert any("Class 10" in t for t in school_titles), "Class 10 courses must be present!"
    assert not any("React" in t or "Anatomy" in t or "B.Tech" in t for t in school_titles), "College courses must NOT show in School!"
    print("[PASS] School Student Isolation: PASSED (Zero leakage)")

    print("\n================================================================")
    print(" 2. TESTING FAST O(1) PERFECT LECTURE ALGORITHM & SEQUENCING")
    print("================================================================")

    # Time complexity benchmark for get_perfect_lecture
    t0 = time.perf_counter()
    res_perf, status = get_perfect_lecture(btech_id, subject="Artificial Intelligence")
    elapsed_ms = (time.perf_counter() - t0) * 1000
    assert status == 200, f"Expected 200, got {status}: {res_perf}"
    lecture1 = res_perf["lecture"]
    print(f"Retrieved Perfect Lecture in {elapsed_ms:.2f} ms:")
    print(f"  - Course: {lecture1['course']['title']}")
    print(f"  - Module: {lecture1['module']['title']}")
    print(f"  - Lecture: {lecture1['title']} (Lesson #{lecture1['lessonNumber']})")
    print(f"  - Completed: {lecture1['completed']}")
    assert lecture1["completed"] is False, "Initial perfect lecture should be uncompleted!"
    assert elapsed_ms < 50.0, f"Algorithm must be fast O(1), took {elapsed_ms} ms"

    # Mark this lecture completed and verify progression
    course_id = int(lecture1["course"]["id"])
    lesson1_id = lecture1["id"]
    comp_res, comp_status = complete_lesson(btech_id, course_id, lesson1_id)
    assert comp_status == 200, "Failed to complete lesson"
    print(f"Lesson marked completed! New progress: {comp_res['new_progress']}%")

    # Re-fetch perfect lecture: algorithm must smoothly advance to Lesson 2!
    res_perf2, status2 = get_perfect_lecture(btech_id, subject="Artificial Intelligence")
    assert status2 == 200
    lecture2 = res_perf2["lecture"]
    print(f"Next Perfect Lecture auto-selected:")
    print(f"  - Lecture: {lecture2['title']} (Lesson #{lecture2['lessonNumber']})")
    assert lecture2["id"] != lesson1_id, "Algorithm must advance to next uncompleted lecture!"
    print("[PASS] Perfect Lecture Algorithm & Sequencing: PASSED")

    print("\n================================================================")
    print(" 3. TESTING ADMIN UPLOAD LECTURE & INSTANT MATCH")
    print("================================================================")

    # Get a module id from course_id
    cur.execute("SELECT id FROM course_modules WHERE course_id = %s ORDER BY module_number ASC LIMIT 1", (course_id,))
    mod_id = cur.fetchone()["id"]

    # Admin uploads a brand new lecture
    upload_data = {
        "title": "Quantum Neural Computing & Tensor Processing Units (Admin Uploaded)",
        "lessonType": "video",
        "duration": "42 mins",
        "contentUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "isPreview": True
    }
    t_up0 = time.perf_counter()
    add_res, add_status = admin_add_lesson(mod_id, upload_data)
    up_elapsed_ms = (time.perf_counter() - t_up0) * 1000
    assert add_status == 201, f"Expected 201, got {add_status}"
    uploaded_lesson_id = add_res["lessonId"]
    print(f"Admin uploaded lecture in {up_elapsed_ms:.2f} ms (Lesson ID: {uploaded_lesson_id})")

    # Verify syllabus includes the new lecture
    detail_res, detail_status = get_course_detail(btech_id, course_id)
    assert detail_status == 200
    all_lessons = [l["title"] for m in detail_res["course"]["modules"] for l in m["lessons"]]
    assert upload_data["title"] in all_lessons, "Newly uploaded lecture must immediately appear in curriculum!"
    print("[PASS] Admin Lecture Upload & Instant Availability: PASSED")

    # Cleanup test lecture
    admin_delete_lesson(uploaded_lesson_id)
    # Cleanup test users
    cur.execute("DELETE FROM users WHERE id IN (%s, %s, %s)", (btech_id, mbbs_id, school_id))
    conn.commit()
    close_db(conn)

    print("\n================================================================")
    print(" ALL 3 ALGORITHM & ISOLATION REQUIREMENTS VERIFIED 100%!")
    print("================================================================")


if __name__ == "__main__":
    run_tests()
