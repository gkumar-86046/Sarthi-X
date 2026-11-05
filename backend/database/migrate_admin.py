"""
database/migrate_admin.py  –  Setup admin role, admin credentials, and activity logs.
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


def run_migration():
    conn = None
    try:
        conn = get_db()
        cur = conn.cursor(dictionary=True)
        print("[migrate_admin] Ensuring role column on users table...")

        # 1. Add role column to users if missing
        cur.execute("""
            SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = 'sarathi_x' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
        """)
        if cur.fetchone()["cnt"] == 0:
            cur.execute("""
                ALTER TABLE users 
                ADD COLUMN role ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student' AFTER bio
            """)
            print("[migrate_admin] Added role column.")
        else:
            print("[migrate_admin] role column already exists.")

        # 2. Add or update admin user: admin@sarathix.com / Admin@123
        admin_pass = hash_pw("Admin@123")
        cur.execute("SELECT id FROM users WHERE email = 'admin@sarathix.com'")
        existing_admin = cur.fetchone()
        if not existing_admin:
            cur.execute("""
                INSERT INTO users (
                    full_name, email, mobile, password_hash,
                    education_level, role, is_active
                ) VALUES (
                    'System Administrator', 'admin@sarathix.com', '9999999999', %s,
                    'graduation', 'admin', 1
                )
            """, (admin_pass,))
            print("[migrate_admin] Created admin user: admin@sarathix.com / Admin@123")
        else:
            cur.execute("""
                UPDATE users 
                SET role = 'admin', password_hash = %s, is_active = 1 
                WHERE email = 'admin@sarathix.com'
            """, (admin_pass,))
            print("[migrate_admin] Updated admin user role to 'admin'")

        # 3. Create admin_activity_logs table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS admin_activity_logs (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                admin_id INT UNSIGNED NOT NULL,
                action VARCHAR(100) NOT NULL,
                entity_type VARCHAR(50) NOT NULL,
                entity_id INT UNSIGNED NULL,
                details TEXT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_admin_act (created_at DESC)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        """)
        print("[migrate_admin] Verified admin_activity_logs table.")

        conn.commit()
        print("[migrate_admin] Admin migration completed successfully!")

    finally:
        if conn:
            close_db(conn)


if __name__ == "__main__":
    run_migration()

