"""
database/migrate_gamezone.py  –  Add game_sessions and game_leaderboard tables
for the Magic Number Aptitude Game.
"""

from pathlib import Path
import sys

_backend_dir = Path(__file__).resolve().parent.parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from database.connection import get_db, close_db


def migrate():
    conn = get_db()
    cur = conn.cursor()

    print("Running GameZone & Magic Number migration...")

    # 1. Table: game_sessions
    cur.execute("""
        CREATE TABLE IF NOT EXISTS game_sessions (
            id                  INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
            user_id             INT UNSIGNED    NULL,
            player_name         VARCHAR(120)    NOT NULL DEFAULT 'Challenger',
            game_type           VARCHAR(50)     NOT NULL DEFAULT 'magic_number',
            level_reached       INT UNSIGNED    NOT NULL DEFAULT 1,
            score               INT UNSIGNED    NOT NULL DEFAULT 0,
            total_questions     INT UNSIGNED    NOT NULL DEFAULT 0,
            correct_answers     INT UNSIGNED    NOT NULL DEFAULT 0,
            accuracy            DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
            time_spent_seconds  INT UNSIGNED    NOT NULL DEFAULT 0,
            streak_max          INT UNSIGNED    NOT NULL DEFAULT 0,
            aptitude_level      VARCHAR(80)     NOT NULL DEFAULT 'Novice Explorer',
            iq_estimate         INT UNSIGNED    NOT NULL DEFAULT 100,
            status              ENUM('in_progress', 'completed', 'failed') NOT NULL DEFAULT 'in_progress',
            created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_user_game (user_id, game_type),
            INDEX idx_score (score DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """)

    # 2. Table: game_leaderboard
    cur.execute("""
        CREATE TABLE IF NOT EXISTS game_leaderboard (
            id                  INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
            session_id          INT UNSIGNED    NULL,
            user_id             INT UNSIGNED    NULL,
            player_name         VARCHAR(120)    NOT NULL,
            game_type           VARCHAR(50)     NOT NULL DEFAULT 'magic_number',
            score               INT UNSIGNED    NOT NULL DEFAULT 0,
            level_reached       INT UNSIGNED    NOT NULL DEFAULT 1,
            accuracy            DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
            aptitude_level      VARCHAR(80)     NOT NULL DEFAULT 'Novice Explorer',
            created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_game_rank (game_type, score DESC, level_reached DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """)

    # 3. Seed some initial high scores if leaderboard is empty
    cur.execute("SELECT COUNT(*) AS c FROM game_leaderboard WHERE game_type = 'magic_number'")
    count = cur.fetchone()[0]
    if count == 0:
        seed_entries = [
            ("Devansh Sharma", 1250, 10, 95.0, "Grandmaster Prodigy"),
            ("Aanya Patel", 1120, 9, 91.5, "Elite Problem Solver"),
            ("Vikram Aditya", 980, 8, 88.0, "Tactical Calculator"),
            ("Sanya Malhotra", 850, 7, 85.0, "Tactical Calculator"),
            ("Rohan Iyer", 720, 6, 80.0, "Pattern Analyst"),
        ]
        cur.executemany("""
            INSERT INTO game_leaderboard (player_name, score, level_reached, accuracy, aptitude_level, game_type)
            VALUES (%s, %s, %s, %s, %s, 'magic_number')
        """, seed_entries)
        print(f"Seeded {len(seed_entries)} leaderboard entries.")

    conn.commit()
    close_db(conn)
    print("GameZone migration completed successfully!")


if __name__ == "__main__":
    migrate()

