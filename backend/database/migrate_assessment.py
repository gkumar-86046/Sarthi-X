"""
database/migrate_assessment.py  –  Database migration for Student Skill Diagnostic Test,
Skill Profile, and ML-Powered Dynamic Roadmaps.
"""

from pathlib import Path
import sys

_backend_dir = Path(__file__).resolve().parent.parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from database.connection import get_db, close_db


def migrate():
    conn = None
    try:
        conn = get_db()
        cur = conn.cursor()
        print("Running Student Assessment & ML Roadmap migration...")

        # 1. Table: student_assessments
        cur.execute("""
            CREATE TABLE IF NOT EXISTS student_assessments (
                id                      INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
                user_id                 INT UNSIGNED    NOT NULL,
                education_level         VARCHAR(50)     NOT NULL DEFAULT 'graduation',
                total_questions         INT UNSIGNED    NOT NULL DEFAULT 15,
                correct_answers         INT UNSIGNED    NOT NULL DEFAULT 0,
                score_percent           DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
                time_spent_seconds      INT UNSIGNED    NOT NULL DEFAULT 0,
                aptitude_score          DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
                logic_score             DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
                technical_score         DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
                verbal_score            DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
                problem_solving_score   DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
                archetype_name          VARCHAR(120)    NOT NULL DEFAULT 'Emerging Explorer',
                archetype_match_score   DECIMAL(5, 2)   NOT NULL DEFAULT 85.00,
                superpowers_json        TEXT            NULL,
                growth_areas_json       TEXT            NULL,
                created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_assessment (user_id, created_at DESC)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """)

        # 2. Table: student_roadmaps
        cur.execute("""
            CREATE TABLE IF NOT EXISTS student_roadmaps (
                id                      INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
                user_id                 INT UNSIGNED    NOT NULL,
                assessment_id           INT UNSIGNED    NULL,
                title                   VARCHAR(180)    NOT NULL,
                target_role             VARCHAR(120)    NOT NULL,
                estimated_weeks         INT UNSIGNED    NOT NULL DEFAULT 8,
                current_phase           INT UNSIGNED    NOT NULL DEFAULT 1,
                phases_json             MEDIUMTEXT      NOT NULL,
                recommended_games_json  TEXT            NOT NULL,
                recommended_courses_json TEXT           NOT NULL,
                status                  ENUM('active', 'completed', 'archived') NOT NULL DEFAULT 'active',
                created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_roadmap (user_id, status)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """)

        conn.commit()
        print("Student Assessment & ML Roadmap migration completed successfully!")
    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"Migration error: {exc}")
        raise exc
    finally:
        if conn:
            close_db(conn)


if __name__ == "__main__":
    migrate()

