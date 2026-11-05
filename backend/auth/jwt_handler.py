"""
auth/jwt_handler.py  –  JWT utility functions for Sarathi-X.

Handles creation and verification of:
  • Access tokens  – short-lived (1 hour default), used on every request.
  • Refresh tokens – long-lived (7 days default), used to obtain new access tokens.

All secrets and TTLs come from environment variables (see .env.example).
"""

import os
import jwt
import datetime
import hashlib
import secrets


# ─── Config from environment ──────────────────────────────────────────────────
JWT_SECRET       = os.getenv("JWT_SECRET_KEY",           "sarathi_jwt_dev_secret")
ACCESS_TTL_SEC   = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES",  "3600"))    # 1 hour
REFRESH_TTL_SEC  = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", "604800"))  # 7 days
ALGORITHM        = "HS256"


# ─── Token Creation ───────────────────────────────────────────────────────────

def create_access_token(user_id: int, email: str, role: str = "student") -> str:
    """
    Generate a signed JWT access token.

    Payload fields:
      sub   – subject (user ID as string)
      email – user's email (informational)
      role  – user's role ('student', 'faculty', 'admin')
      iat   – issued-at timestamp
      exp   – expiry timestamp
      type  – literal 'access'
    """
    now = datetime.datetime.utcnow()
    payload = {
        "sub":   str(user_id),
        "email": email,
        "role":  role,
        "iat":   now,
        "exp":   now + datetime.timedelta(seconds=ACCESS_TTL_SEC),
        "type":  "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)


def create_refresh_token(user_id: int) -> tuple[str, str]:
    """
    Generate a secure random refresh token.

    Returns:
        (raw_token, hashed_token)
        - raw_token   : sent to the client (stored in httpOnly cookie or response body)
        - hashed_token: stored in the DB (SHA-256 of raw_token for security)
    """
    raw = secrets.token_hex(64)                           # 128-char hex string
    hashed = hashlib.sha256(raw.encode()).hexdigest()     # SHA-256 hash for DB storage
    return raw, hashed


# ─── Token Verification ───────────────────────────────────────────────────────

def verify_access_token(token: str) -> dict | None:
    """
    Decode and validate a JWT access token.

    Returns the decoded payload dict on success, or None if invalid/expired.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])

        # Ensure it is actually an access token (not a misused refresh token)
        if payload.get("type") != "access":
            return None

        return payload

    except jwt.ExpiredSignatureError:
        return None   # Token has expired – caller should request a refresh
    except jwt.InvalidTokenError:
        return None   # Malformed, tampered, or wrong secret


def hash_refresh_token(raw_token: str) -> str:
    """Return the SHA-256 hex digest of a raw refresh token string."""
    return hashlib.sha256(raw_token.encode()).hexdigest()


def get_refresh_token_expiry() -> datetime.datetime:
    """Return the UTC datetime at which a newly issued refresh token will expire."""
    return datetime.datetime.utcnow() + datetime.timedelta(seconds=REFRESH_TTL_SEC)
