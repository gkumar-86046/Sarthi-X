"""
database/connection.py  –  MySQL connection pool for Sarathi-X backend.

Provides a singleton-style connection pool (mysql-connector-python pooling)
so every request reuses an existing connection instead of opening a new one.

Usage:
    from database.connection import get_db, close_db
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Ensure .env is loaded even if connection is imported directly
load_dotenv(Path(__file__).resolve().parent.parent / ".env", override=True)

import mysql.connector
from mysql.connector import pooling, Error as MySQLError


# ─── Pool Configuration ───────────────────────────────────────────────────────
# Pool is created once when this module is first imported.

_pool: pooling.MySQLConnectionPool | None = None


def _create_pool() -> pooling.MySQLConnectionPool:
    """Build a MySQLConnectionPool from environment variables."""
    db_config = {
        "host":     os.getenv("DB_HOST",     "localhost"),
        "port":     int(os.getenv("DB_PORT", "3306")),
        "database": os.getenv("DB_NAME",     "sarathi_x"),
        "user":     os.getenv("DB_USER",     "root"),
        "password": os.getenv("DB_PASSWORD", ""),
        "charset":  "utf8mb4",
        "use_unicode": True,
        "autocommit": False,  # Transactions are managed explicitly
        "connection_timeout": 30,
    }

    return pooling.MySQLConnectionPool(
        pool_name="sarathi_pool",
        pool_size=10,           # Up to 10 simultaneous DB connections
        pool_reset_session=True,
        **db_config,
    )


def get_pool() -> pooling.MySQLConnectionPool:
    """Return the singleton pool, creating it on first call."""
    global _pool
    if _pool is None:
        _pool = _create_pool()
    return _pool


def get_db():
    """
    Borrow a connection from the pool.
    Call close_db(conn) when finished to return it to the pool.
    """
    try:
        return get_pool().get_connection()
    except MySQLError as exc:
        raise RuntimeError(f"[DB] Could not acquire connection: {exc}") from exc


def close_db(conn) -> None:
    """Return the connection back to the pool (not physically close it)."""
    if conn and conn.is_connected():
        conn.close()
