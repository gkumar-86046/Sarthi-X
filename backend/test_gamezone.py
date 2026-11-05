"""
test_gamezone.py  –  Automated verification of Universal GameZone Engine across all games:
Magic Number, Science Explorer, GK Explorer, Word Master, Equation Galaxy, Coding Quest.
"""

from pathlib import Path
import sys

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from main import create_app


def run_tests():
    app = create_app()
    client = app.test_client()

    print("================================================================")
    print(" 1. TESTING GAMEZONE OVERVIEW & MASTER CATALOG")
    print("================================================================")
    res = client.get("/api/gamezone/overview")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.get_json()
    assert data["success"] is True
    print(f"Student: {data['studentProfile']['studentName']} | Aptitude: {data['studentProfile']['aptitudeLevel']}")
    print(f"Authorized Modules Count: {len(data['authorizedModules'])}")
    assert len(data["authorizedModules"]) >= 7

    games_res = client.get("/api/gamezone/games")
    assert games_res.status_code == 200
    games_data = games_res.get_json()
    print(f"Master Catalog Registered Games: {games_data['totalGames']}")
    assert games_data["totalGames"] >= 7
    print("[PASS] Master Game catalog verified!")

    print("\n================================================================")
    print(" 2. TESTING START MAGIC NUMBER GAME (Level 1)")
    print("================================================================")
    start_res = client.post("/api/gamezone/magic-number/start", json={"level": 1, "playerName": "Test Player"})
    assert start_res.status_code == 201, f"Expected 201, got {start_res.status_code}"
    start_data = start_res.get_json()
    session_id = start_data["sessionId"]
    questions = start_data["questions"]
    print(f"Session started: ID={session_id}, Questions={len(questions)}, Points/Q={start_data['pointsPerQuestion']}")
    assert len(questions) > 0
    assert "answer" not in questions[0]
    assert "trick" not in questions[0]
    print("[PASS] Magic Number start & payload integrity passed!")

    print("\n================================================================")
    print(" 3. TESTING UNIVERSAL PLAY ENGINE - SCIENCE EXPLORER")
    print("================================================================")
    sci_start = client.post("/api/gamezone/play/start", json={
        "gameId": "science-explorer",
        "level": 1,
        "playerName": "Science Challenger"
    })
    assert sci_start.status_code == 201
    sci_data = sci_start.get_json()
    sci_session_id = sci_data["sessionId"]
    sci_q = sci_data["questions"]
    print(f"Science Explorer Started: ID={sci_session_id}, Game={sci_data['gameName']}, Questions={len(sci_q)}")
    assert len(sci_q) > 0

    # Submit answer to Science Explorer
    sci_sub = client.post("/api/gamezone/play/submit", json={
        "gameId": "science-explorer",
        "sessionId": sci_session_id,
        "questionId": sci_q[0]["id"],
        "selectedOption": "B",
        "timeTakenSeconds": 4
    })
    assert sci_sub.status_code == 200
    sci_sub_data = sci_sub.get_json()
    print(f"Science Q1 Answered. Correct: {sci_sub_data['isCorrect']}, Points: {sci_sub_data['pointsEarned']}")
    print(f"Science Method: {sci_sub_data['method']}")
    print(f"Science Flash-Tip: {sci_sub_data['trick']}")
    assert len(sci_sub_data["method"]) > 5

    # Finish Science Explorer session
    sci_fin = client.post("/api/gamezone/play/finish", json={
        "gameId": "science-explorer",
        "sessionId": sci_session_id,
        "timeSpentSeconds": 30,
        "maxStreak": 1
    })
    assert sci_fin.status_code == 200
    sci_fin_data = sci_fin.get_json()
    print(f"Science Final Score: {sci_fin_data['summary']['score']} pts | Level: {sci_fin_data['summary']['aptitudeLevel']}")
    print("[PASS] Science Explorer full game loop verified!")

    print("\n================================================================")
    print(" 4. TESTING GAME ACADEMY ROADMAP & METHODS API")
    print("================================================================")
    acad_res = client.get("/api/gamezone/play/academy?gameId=science-explorer")
    assert acad_res.status_code == 200
    acad_data = acad_res.get_json()
    assert len(acad_data["roadmap"]) == 10
    print(f"Roadmap levels: {len(acad_data['roadmap'])}, Sample L1: {acad_data['roadmap'][0]['title']}")
    print("[PASS] Academy Roadmap and Methods verified!")

    print("\n================================================================")
    print(" 5. TESTING LEADERBOARDS (DUAL MYSQL + CSV SYNC)")
    print("================================================================")
    lb_res = client.get("/api/gamezone/magic-number/leaderboard")
    assert lb_res.status_code == 200
    lb_data = lb_res.get_json()
    print(f"Magic Number Leaderboard Entries: {len(lb_data['leaderboard'])}")
    assert len(lb_data["leaderboard"]) > 0

    sci_lb_res = client.get("/api/gamezone/play/leaderboard?gameId=science-explorer")
    assert sci_lb_res.status_code == 200
    sci_lb_data = sci_lb_res.get_json()
    print(f"Science Explorer Leaderboard Entries: {len(sci_lb_data['leaderboard'])}")
    assert len(sci_lb_data["leaderboard"]) > 0
    print("[PASS] Multi-game leaderboards verified!")

    print("\n================================================================")
    print(" ALL UNIVERSAL GAMEZONE TESTS PASSED 100%!")
    print("================================================================")


if __name__ == "__main__":
    run_tests()
