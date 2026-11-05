"""
database/migrate_courses.py  –  Database migration for branch/stream targeting & lecture performance indexing.
"""

from pathlib import Path
import sys

_backend_dir = Path(__file__).resolve().parent.parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from database.connection import get_db, close_db


def run_migration():
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    try:
        # 1. Add target_field column to courses if missing
        cur.execute("""
            SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = 'sarathi_x' AND TABLE_NAME = 'courses' AND COLUMN_NAME = 'target_field'
        """)
        if cur.fetchone()["cnt"] == 0:
            cur.execute("ALTER TABLE courses ADD COLUMN target_field VARCHAR(100) NULL DEFAULT NULL AFTER education_level")
            print("[migration] Added target_field column to courses.")
        else:
            print("[migration] target_field column already exists.")

        # 2. Add composite index on course_lessons (module_id, lesson_number) for O(1) index seek
        cur.execute("""
            SELECT COUNT(*) AS cnt FROM information_schema.STATISTICS 
            WHERE TABLE_SCHEMA = 'sarathi_x' AND TABLE_NAME = 'course_lessons' AND INDEX_NAME = 'idx_mod_lesson'
        """)
        if cur.fetchone()["cnt"] == 0:
            cur.execute("CREATE INDEX idx_mod_lesson ON course_lessons (module_id, lesson_number)")
            print("[migration] Created idx_mod_lesson index.")
        else:
            print("[migration] idx_mod_lesson already exists.")

        # 3. Add composite index on courses (education_level, target_field)
        cur.execute("""
            SELECT COUNT(*) AS cnt FROM information_schema.STATISTICS 
            WHERE TABLE_SCHEMA = 'sarathi_x' AND TABLE_NAME = 'courses' AND INDEX_NAME = 'idx_edu_target'
        """)
        if cur.fetchone()["cnt"] == 0:
            cur.execute("CREATE INDEX idx_edu_target ON courses (education_level, target_field)")
            print("[migration] Created idx_edu_target index.")
        else:
            print("[migration] idx_edu_target already exists.")

        # 4. Add index on courses (subject)
        cur.execute("""
            SELECT COUNT(*) AS cnt FROM information_schema.STATISTICS 
            WHERE TABLE_SCHEMA = 'sarathi_x' AND TABLE_NAME = 'courses' AND INDEX_NAME = 'idx_course_subject'
        """)
        if cur.fetchone()["cnt"] == 0:
            cur.execute("CREATE INDEX idx_course_subject ON courses (subject)")
            print("[migration] Created idx_course_subject index.")
        else:
            print("[migration] idx_course_subject already exists.")

        # 5. Update existing courses with precise target fields
        cur.execute("UPDATE courses SET target_field = 'B.Tech / B.E (Engineering)' WHERE course_code IN ('cs-ai-grad', 'cs-web-react', 'cs-dsa-grad')")
        cur.execute("UPDATE courses SET target_field = '12th (2nd Year)' WHERE course_code IN ('phys-12', 'math-12', 'chem-12')")
        cur.execute("UPDATE courses SET target_field = 'Class 10' WHERE course_code = 'sci-10'")
        cur.execute("UPDATE courses SET target_field = 'Class 1' WHERE course_code = 'found-math-1'")

        conn.commit()
        print("[migration] Schema updated successfully!")

    except Exception as e:
        conn.rollback()
        print(f"[migration] Error: {e}")
        raise e
    finally:
        close_db(conn)


if __name__ == "__main__":
    run_migration()

