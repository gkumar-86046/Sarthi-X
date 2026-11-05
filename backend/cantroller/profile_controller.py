"""
cantroller/profile_controller.py  –  Business logic for user profile endpoints.

Functions:
  get_profile(user_id)          – Fetch the full user profile
  update_profile(user_id, data) – Update editable profile fields
"""

from database.connection import get_db, close_db


# ─── Helper: Serialize user row ───────────────────────────────────────────────

def _build_academic_detail(row: dict) -> str:
    """Mirror the academicDetail logic from Register.jsx."""
    level = row.get("education_level", "")
    if level == "nursery":
        return f"Nursery / Primary ({row.get('nursery_class', '')})"
    elif level == "highschool":
        return f"High School ({row.get('highschool_class', '')} - {row.get('stream', '')})"
    elif level == "intermediate":
        return f"Intermediate ({row.get('intermediate_year', '')} - {row.get('stream', '')})"
    elif level == "graduation":
        return f"Graduation ({row.get('graduation_course', '')} - {row.get('graduation_year', '')})"
    return ""


def _serialize_user(row: dict) -> dict:
    """Return safe, public-facing user dict (no password hash)."""
    academic_detail = _build_academic_detail(row)
    return {
        "id":                row["id"],
        "full_name":         row["full_name"],
        "fullName":          row["full_name"],
        "email":             row["email"],
        "mobile":            row["mobile"],
        "education_level":   row["education_level"],
        "educationLevel":    row["education_level"],
        "nursery_class":     row.get("nursery_class"),
        "nurseryClass":      row.get("nursery_class"),
        "stream":            row.get("stream"),
        "highschool_class":  row.get("highschool_class"),
        "highschoolClass":   row.get("highschool_class"),
        "intermediate_year": row.get("intermediate_year"),
        "intermediateYear":  row.get("intermediate_year"),
        "graduation_course": row.get("graduation_course"),
        "graduationCourse":  row.get("graduation_course"),
        "graduation_year":   row.get("graduation_year"),
        "graduationYear":    row.get("graduation_year"),
        "academic_detail":   academic_detail,
        "academicDetail":    academic_detail,
        "role":              row.get("role", "student"),
        "avatar_url":        row.get("avatar_url"),
        "avatarUrl":         row.get("avatar_url"),
        "bio":               row.get("bio"),
        "is_active":         bool(row.get("is_active", True)),
        "created_at":        str(row.get("created_at", "")),
        "updated_at":        str(row.get("updated_at", "")),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Controller: Get Profile
# ─────────────────────────────────────────────────────────────────────────────

def get_profile(user_id: int) -> tuple[dict, int]:
    """
    Fetch the full profile for the authenticated user.

    Returns:
        (response_dict, http_status_code)
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE id = %s AND is_active = 1", (user_id,))
        user = cursor.fetchone()

        if not user:
            return {"success": False, "message": "User not found."}, 404

        return {
            "success": True,
            "user":    _serialize_user(user),
        }, 200

    except Exception as exc:
        print(f"[get_profile] Error: {exc}")
        return {"success": False, "message": "Failed to fetch profile."}, 500

    finally:
        close_db(conn)


# ─────────────────────────────────────────────────────────────────────────────
# Controller: Update Profile
# ─────────────────────────────────────────────────────────────────────────────

def update_profile(user_id: int, data: dict) -> tuple[dict, int]:
    """
    Update editable profile fields for the authenticated user.

    Allowed `data` keys (all optional):
        full_name, mobile, avatar_url, bio,
        education_level, nursery_class, stream,
        highschool_class, intermediate_year,
        graduation_course, graduation_year

    Returns:
        (response_dict, http_status_code)
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)

        # ── 1. Verify user exists ─────────────────────────────────────────────
        cursor.execute("SELECT id FROM users WHERE id = %s AND is_active = 1", (user_id,))
        if not cursor.fetchone():
            return {"success": False, "message": "User not found."}, 404

        # ── 2. Build SET clause dynamically (only include provided fields) ─────
        allowed_fields = [
            "full_name", "mobile", "avatar_url", "bio",
            "education_level",
            "nursery_class", "stream", "highschool_class",
            "intermediate_year", "graduation_course", "graduation_year",
        ]

        updates = {}
        for field in allowed_fields:
            # Accept both snake_case (API) and camelCase (React form) keys
            camel = _to_camel(field)
            if field in data:
                updates[field] = data[field]
            elif camel in data:
                updates[field] = data[camel]

        if not updates:
            return {"success": False, "message": "No valid fields provided to update."}, 400

        # ── 3. Uniqueness check for mobile (if being changed) ─────────────────
        if "mobile" in updates:
            cursor.execute(
                "SELECT id FROM users WHERE mobile = %s AND id != %s",
                (updates["mobile"], user_id),
            )
            if cursor.fetchone():
                return {"success": False, "message": "This mobile number is already in use."}, 409

        # ── 4. Execute UPDATE ─────────────────────────────────────────────────
        set_clause = ", ".join(f"{col} = %({col})s" for col in updates)
        updates["user_id"] = user_id

        cursor.execute(
            f"UPDATE users SET {set_clause} WHERE id = %(user_id)s",
            updates,
        )
        conn.commit()

        # ── 5. Return updated user ────────────────────────────────────────────
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        updated_user = cursor.fetchone()

        return {
            "success": True,
            "message": "Profile updated successfully.",
            "user":    _serialize_user(updated_user),
        }, 200

    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[update_profile] Error: {exc}")
        return {"success": False, "message": "Failed to update profile."}, 500

    finally:
        close_db(conn)


# ─── Utility ──────────────────────────────────────────────────────────────────

def _to_camel(snake: str) -> str:
    """Convert snake_case to camelCase (e.g. full_name → fullName)."""
    parts = snake.split("_")
    return parts[0] + "".join(word.capitalize() for word in parts[1:])
