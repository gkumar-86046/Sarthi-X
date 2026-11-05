"""
database/init_db.py  –  One-time database setup script for Sarathi-X.

Run this ONCE after setting your DB_PASSWORD in backend/.env:
    python database/init_db.py

It will:
  1. Connect to MySQL (no database selected yet)
  2. Create the `sarathi_x` database if it doesn't exist
  3. Run all CREATE TABLE statements from schema.sql
  4. Print a success summary
"""

import os
import sys
from pathlib import Path

# ── Load .env from the backend root ──────────────────────────────────────────
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / '.env')

import mysql.connector
from mysql.connector import Error as MySQLError

# ── Config ────────────────────────────────────────────────────────────────────
HOST     = os.getenv("DB_HOST",     "localhost")
PORT     = int(os.getenv("DB_PORT", "3306"))
USER     = os.getenv("DB_USER",     "root")
PASSWORD = os.getenv("DB_PASSWORD", "2006")
DB_NAME  = os.getenv("DB_NAME",     "sarathi_x")

SCHEMA_FILE = Path(__file__).parent / "schema.sql"


def run():
    print(f"\n[init_db] Connecting to MySQL at {HOST}:{PORT} as '{USER}'...")

    try:
        # ── Step 1: Connect without specifying a database ─────────────────────
        conn = mysql.connector.connect(
            host=HOST, port=PORT, user=USER, password=PASSWORD,
            charset="utf8mb4", use_unicode=True
        )
        cursor = conn.cursor()
        print(f"[init_db] Connected! Server: {conn.get_server_info()}")

        # ── Step 2: Create database ───────────────────────────────────────────
        cursor.execute(
            f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` "
            "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        )
        cursor.execute(f"USE `{DB_NAME}`;")
        print(f"[init_db] Database '{DB_NAME}' ready.")

        # ── Step 3: Read and execute schema.sql ──────────────────────────────
        sql_raw = SCHEMA_FILE.read_text(encoding="utf-8")

        # Strip comments before splitting by semicolon (avoid stripping '#' inside quoted hex colors)
        import re
        sql_clean = re.sub(r'/\*.*?\*/', '', sql_raw, flags=re.DOTALL)
        sql_clean = re.sub(r'^\s*#.*$', '', sql_clean, flags=re.MULTILINE)
        sql_clean = re.sub(r'--(?:\s.*|$)', '', sql_clean, flags=re.MULTILINE)

        statements = [
            s.strip() for s in sql_clean.split(";")
            if s.strip()
        ]

        tables_created = 0
        for stmt in statements:
            # Skip USE and CREATE DATABASE (already handled above)
            upper = stmt.upper()
            if upper.startswith("USE") or upper.startswith("CREATE DATABASE"):
                continue
            try:
                cursor.execute(stmt)
                if "CREATE TABLE" in upper:
                    tables_created += 1
            except MySQLError as e:
                # Ignore "table already exists" errors
                if e.errno == 1050:
                    print(f"   [skip] Table already exists — OK")
                else:
                    print(f"   [warn] {e}")

        conn.commit()
        cursor.close()
        conn.close()

        print(f"\n[init_db] SUCCESS — {tables_created} table(s) created/verified in '{DB_NAME}'.")
        print("[init_db] You can now run:  python main.py\n")

    except MySQLError as exc:
        print(f"\n[init_db] ERROR: {exc}")
        print("\nTroubleshooting:")
        print(f"  1. Make sure MySQL is running on {HOST}:{PORT}")
        print(f"  2. Check DB_PASSWORD in backend/.env")
        print(f"  3. Verify '{USER}' has CREATE DATABASE privileges")
        sys.exit(1)


if __name__ == "__main__":
    run()
