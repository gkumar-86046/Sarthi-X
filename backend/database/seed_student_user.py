"""
backend/database/seed_student_user.py  –  Ensure guaranteed working student credentials.
Updates gkum86046@gmail.com to Student@123 and inserts student@sarathix.com / Student@123.
"""

import sys
from pathlib import Path
import bcrypt

_backend_dir = Path(__file__).resolve().parent.parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from database.connection import get_db, close_db


def hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt(12)).decode("utf-8")


def seed_users():
    conn = None
    try:
        conn = get_db()
        cur = conn.cursor(dictionary=True)
        password_hash = hash_pw("Student@123")

        # 1. Update existing user Govind Sharma (gkum86046@gmail.com)
        cur.execute("""
            UPDATE users
            SET password_hash = %s, is_active = 1
            WHERE email = 'gkum86046@gmail.com'
        """, (password_hash,))
        print("Updated gkum86046@gmail.com password to Student@123")

        # 2. Check if student@sarathix.com exists
        cur.execute("SELECT id FROM users WHERE email = 'student@sarathix.com'")
        if not cur.fetchone():
            cur.execute("""
                INSERT INTO users (
                    full_name, email, mobile, password_hash,
                    education_level, graduation_course, graduation_year, is_active
                ) VALUES (
                    'Govind Sharma', 'student@sarathix.com', '9876543210', %s,
                    'graduation', 'B.Tech / B.E (Engineering)', '4th Year', 1
                )
            """, (password_hash,))
            print("Inserted demo user: student@sarathix.com / Student@123")
        else:
            cur.execute("""
                UPDATE users
                SET password_hash = %s, is_active = 1
                WHERE email = 'student@sarathix.com'
            """, (password_hash,))
            print("Updated student@sarathix.com password to Student@123")

        conn.commit()
        print("User credentials updated successfully!")
    finally:
        if conn:
            close_db(conn)


if __name__ == "__main__":
    seed_users()

