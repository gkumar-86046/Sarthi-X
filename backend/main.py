"""
main.py  –  Sarathi-X Backend Application Entry Point

Bootstraps the Flask app, loads environment config, registers Blueprints,
and configures CORS for the React frontend.

Run locally:
    python main.py

Or with a production WSGI server:
    gunicorn -w 4 -b 0.0.0.0:5000 main:app
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pathlib import Path
from dotenv import load_dotenv

# ─── Load .env explicitly from the backend directory ──────────────────────────
_backend_dir = Path(__file__).resolve().parent
load_dotenv(_backend_dir / ".env", override=True)

# ─── Import Blueprints ────────────────────────────────────────────────────────
from api.auth_routes      import auth_bp
from api.profile_routes   import profile_bp
from api.dashboard_routes import dashboard_bp
from api.course_routes    import course_bp
from api.admin_routes     import admin_bp
from api.game_routes      import game_bp
from api.assessment_routes import assessment_bp


# ─────────────────────────────────────────────────────────────────────────────
# App Factory
# ─────────────────────────────────────────────────────────────────────────────

def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Disable strict slash enforcement so /api/profile and /api/profile/ both resolve
    app.url_map.strict_slashes = False

    # ── Flask config from environment ─────────────────────────────────────────
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev_secret_change_me")
    app.config["DEBUG"]      = os.getenv("FLASK_DEBUG", "True").lower() == "true"

    # ── CORS: allow requests from React dev servers (all localhost/127.0.0.1 ports) ──
    raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
    cors_origins = [o.strip() for o in raw_origins if o.strip()]
    default_dev_origins = [
        "http://localhost:3000", "http://127.0.0.1:3000",
        "http://localhost:3001", "http://127.0.0.1:3001",
        "http://localhost:3002", "http://127.0.0.1:3002",
        "http://localhost:5173", "http://127.0.0.1:5173"
    ]
    for orig in default_dev_origins:
        if orig not in cors_origins:
            cors_origins.append(orig)

    CORS(
        app,
        resources={r"/api/*": {"origins": cors_origins}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    )

    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin")
        if origin and ("localhost" in origin or "127.0.0.1" in origin or origin in cors_origins):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        return response

    # ── Register Blueprints (API routes) ──────────────────────────────────────
    app.register_blueprint(auth_bp,      url_prefix="/api/auth")
    app.register_blueprint(profile_bp,   url_prefix="/api/profile")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(course_bp,    url_prefix="/api/courses")
    app.register_blueprint(admin_bp,     url_prefix="/api/admin")
    app.register_blueprint(game_bp,      url_prefix="/api/gamezone")
    app.register_blueprint(assessment_bp, url_prefix="/api/assessment")

    # ── Root & Index endpoints ────────────────────────────────────────────────
    @app.route("/", methods=["GET"])
    @app.route("/api", methods=["GET"])
    def index():
        """Welcome / API index response."""
        return jsonify({
            "service": "Sarathi-X Backend API",
            "status": "online",
            "version": "1.0.0",
            "endpoints": {
                "health": "GET /api/health",
                "auth": {
                    "register": "POST /api/auth/register",
                    "login": "POST /api/auth/login",
                    "refresh": "POST /api/auth/refresh",
                    "logout": "POST /api/auth/logout"
                },
                "profile": {
                    "get_profile": "GET /api/profile",
                    "update_profile": "PUT /api/profile",
                    "change_password": "PUT /api/profile/change-password"
                },
                "dashboard": {
                    "summary": "GET /api/dashboard/summary",
                    "performance": "GET /api/dashboard/performance",
                    "courses": "GET /api/dashboard/courses",
                    "update_progress": "POST /api/dashboard/courses/<id>/progress"
                },
                "assessment": {
                    "questions": "GET /api/assessment/questions",
                    "submit": "POST /api/assessment/submit",
                    "latest": "GET /api/assessment/latest"
                }
            }
        }), 200

    # ── Health-check endpoint ─────────────────────────────────────────────────
    @app.route("/api/health", methods=["GET"])
    def health():
        """
        GET /api/health
        Quick liveness check. Returns 200 if the server is running.
        """
        return jsonify({"status": "ok", "service": "sarathi-x-backend"}), 200

    # ── Global 404 handler ────────────────────────────────────────────────────
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"success": False, "message": "Endpoint not found."}), 404

    # ── Global 405 handler ────────────────────────────────────────────────────
    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"success": False, "message": "Method not allowed."}), 405

    # ── Global 500 handler ────────────────────────────────────────────────────
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"success": False, "message": "Internal server error."}), 500

    return app


# ─────────────────────────────────────────────────────────────────────────────
# Application instance (used by gunicorn / direct run)
# ─────────────────────────────────────────────────────────────────────────────

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    print(f"\n[Sarathi-X] Backend running on http://localhost:{port}")
    print(f"[Sarathi-X] API docs: see backend/README.md\n")
    app.run(host="0.0.0.0", port=port, debug=app.config["DEBUG"])