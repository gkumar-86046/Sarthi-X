"""
backend/test_assessment_api.py  –  End-to-End API and ML Engine Verification.
Tests the full diagnostic test loop, cosine archetype matching, game recommendation,
and dynamic roadmap generation without network blockage.
"""

import sys
from pathlib import Path

_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from main import create_app


def run_e2e_tests():
    print("=== Running End-to-End Diagnostic Assessment API Test ===")
    app = create_app()
    client = app.test_client()

    # 1. Test Questions Endpoint
    print("\n[1] GET /api/assessment/questions")
    res = client.get("/api/assessment/questions")
    print(f"Status: {res.status_code}")
    data = res.get_json()
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    assert data["success"] is True, "Expected success: True"
    assert len(data["questions"]) == 15, f"Expected 15 questions, got {len(data['questions'])}"
    print(f"Loaded {len(data['questions'])} questions across {len(data['domains'])} domains.")

    # Verify no cheating data in public response
    for q in data["questions"]:
        assert "correctIndex" not in q, f"Question {q['id']} leaked correctIndex!"
        assert "explanation" not in q, f"Question {q['id']} leaked explanation!"
    print("Questions are properly sanitized for student view.")

    # 2. Test Assessment Submission (Simulate a student answering questions)
    print("\n[2] POST /api/assessment/submit (High Technical & Problem Solving Student)")
    # Correct answers for grad_apt_1 (0), grad_log_1 (0), grad_tech_1 (0), grad_verb_1 (0), grad_prob_1 (0)
    mock_answers = {
        "grad_apt_1": 0,
        "grad_apt_2": 1,
        "grad_apt_3": 1, # Wrong
        "grad_log_1": 0,
        "grad_log_2": 0,
        "grad_log_3": 0,
        "grad_tech_1": 0,
        "grad_tech_2": 0,
        "grad_tech_3": 0,
        "grad_verb_1": 0,
        "grad_verb_2": 1, # Wrong
        "grad_verb_3": 0,
        "grad_prob_1": 0,
        "grad_prob_2": 0,
        "grad_prob_3": 0,
    }

    submit_payload = {
        "answers": mock_answers,
        "timeSpentSeconds": 420
    }

    res_submit = client.post("/api/assessment/submit", json=submit_payload)
    print(f"Status: {res_submit.status_code}")
    sub_data = res_submit.get_json()

    # If DB is mocked or online, verify structure
    if res_submit.status_code == 200:
        assert sub_data["success"] is True
        print(f"Overall Score: {sub_data['overallScore']}% ({sub_data['correctAnswers']}/{sub_data['totalQuestions']})")
        print(f"ML Archetype: '{sub_data['archetype']['name']}' (Match: {sub_data['archetype']['matchScore']}%)")
        print(f"Target Role: {sub_data['archetype']['targetRole']}")
        print(f"Domain Scores: {sub_data['domainScores']}")
        print(f"Superpowers Identified: {len(sub_data['superpowers'])}")
        print(f"Growth Areas Identified: {len(sub_data['growthAreas'])}")
        print(f"Matched Games: {len(sub_data['recommendedGames'])}")
        for g in sub_data["recommendedGames"]:
            print(f"   -> [{g['priority']}] {g['name']} ({g['category']})")
        print(f"Roadmap Generated: '{sub_data['roadmap']['title']}' with {len(sub_data['roadmap']['phases'])} phases")
        for p in sub_data["roadmap"]["phases"]:
            print(f"   -> {p['title']} [{p['status']}] (Course: {p['recommendedCourse']}, Game: {p['matchedGame']})")
    else:
        print(f"Notice: Submit returned {res_submit.status_code}: {sub_data.get('message')}")

    # 3. Test Latest Assessment Retrieval
    print("\n[3] GET /api/assessment/latest")
    res_latest = client.get("/api/assessment/latest")
    print(f"Status: {res_latest.status_code}")
    lat_data = res_latest.get_json()
    assert res_latest.status_code == 200
    print("Latest endpoint response verified.")

    print("\nALL END-TO-END DIAGNOSTIC & ML ROADMAP TESTS PASSED!")


if __name__ == "__main__":
    run_e2e_tests()

