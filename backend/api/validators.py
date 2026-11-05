"""
api/validators.py  –  Marshmallow schemas for request validation.

Schemas:
  RegisterSchema   – Validates the /api/auth/register payload
  LoginSchema      – Validates the /api/auth/login payload
  RefreshSchema    – Validates the /api/auth/refresh payload
  UpdateProfileSchema – Validates the /api/profile (PATCH) payload
"""

from marshmallow import Schema, fields, validate, validates, ValidationError


# ─────────────────────────────────────────────────────────────────────────────
# Auth Schemas
# ─────────────────────────────────────────────────────────────────────────────

class RegisterSchema(Schema):
    """Mirrors the Register.jsx form fields."""

    # Identity
    fullName = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=120, error="Full name must be 2–120 characters."),
    )
    email = fields.Email(
        required=True,
        error_messages={"required": "Email is required.", "invalid": "Enter a valid email address."},
    )
    mobile = fields.Str(
        required=True,
        validate=validate.Regexp(r"^\d{10}$", error="Mobile must be exactly 10 digits."),
    )
    password = fields.Str(
        required=True,
        validate=validate.Length(min=8, error="Password must be at least 8 characters."),
        load_only=True,  # Never serialized in output
    )
    confirmPassword = fields.Str(required=True, load_only=True)

    # Education level selector
    educationLevel = fields.Str(
        required=True,
        validate=validate.OneOf(
            ["nursery", "highschool", "intermediate", "graduation"],
            error="Education level must be one of: nursery, highschool, intermediate, graduation.",
        ),
    )

    # Conditional sub-fields (optional at schema level; controller validates context)
    nurseryClass     = fields.Str(load_default=None)
    stream           = fields.Str(load_default=None)
    highschoolClass  = fields.Str(load_default=None)
    intermediateYear = fields.Str(load_default=None)
    graduationCourse = fields.Str(load_default=None)
    graduationYear   = fields.Str(load_default=None)

    agreeTerms = fields.Bool(load_default=False)

    @validates("confirmPassword")
    def validate_passwords_match(self, value):
        """Cross-field validation: confirmPassword must equal password."""
        # Access sibling field via self.context (populated during .load())
        password = self.context.get("password", "")
        if value != password:
            raise ValidationError("Passwords do not match.")


class LoginSchema(Schema):
    email    = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=1), load_only=True)
    rememberMe = fields.Bool(load_default=False)   # Ignored by backend, accepted for compat


class RefreshSchema(Schema):
    refresh_token = fields.Str(required=True)


# ─────────────────────────────────────────────────────────────────────────────
# Profile Schema
# ─────────────────────────────────────────────────────────────────────────────

class UpdateProfileSchema(Schema):
    """All fields are optional – supports both snake_case and camelCase keys."""

    full_name         = fields.Str(validate=validate.Length(min=2, max=120), load_default=None)
    fullName          = fields.Str(load_default=None)
    mobile            = fields.Str(validate=validate.Regexp(r"^\d{10}$"), load_default=None)
    bio               = fields.Str(validate=validate.Length(max=500), load_default=None)
    avatar_url        = fields.Url(load_default=None)
    avatarUrl         = fields.Url(load_default=None)

    # Education fields
    education_level   = fields.Str(
        validate=validate.OneOf(["nursery", "highschool", "intermediate", "graduation"]),
        load_default=None,
    )
    educationLevel    = fields.Str(
        validate=validate.OneOf(["nursery", "highschool", "intermediate", "graduation"]),
        load_default=None,
    )
    nursery_class     = fields.Str(load_default=None)
    nurseryClass      = fields.Str(load_default=None)
    stream            = fields.Str(load_default=None)
    highschool_class  = fields.Str(load_default=None)
    highschoolClass   = fields.Str(load_default=None)
    intermediate_year = fields.Str(load_default=None)
    intermediateYear  = fields.Str(load_default=None)
    graduation_course = fields.Str(load_default=None)
    graduationCourse  = fields.Str(load_default=None)
    graduation_year   = fields.Str(load_default=None)
    graduationYear    = fields.Str(load_default=None)
