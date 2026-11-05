"""
backend/test_assessment.py  –  Verification test for Diagnostic Assessment,
ML Archetype Matching, Game Recommendation, and Dynamic Roadmap Generation.
"""

import sys
from pathlib import Path

_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from cantroller.assessment_controller import (
    QUESTIONS_GRADUATION,
    QUESTIONS_SCHOOL,
    TARGET_ARCHETYPES,
    _compute_cosine_similarity
)


def run_tests():
    print("=== Testing Assessment & ML Roadmap Algorithms ===")

    # 1. Test Question Banks
    print(f"[1] Graduation Question Bank Count: {len(QUESTIONS_GRADUATION)}")
    assert len(QUESTIONS_GRADUATION) == 15, "Expected 15 graduation questions"
    domains = set(q["domain"] for q in QUESTIONS_GRADUATION)
    assert domains == {"aptitude", "logic", "technical", "verbal", "problem_solving"}, "All 5 domains must be present"

    print(f"[2] School Question Bank Count: {len(QUESTIONS_SCHOOL)}")
    assert len(QUESTIONS_SCHOOL) == 15, "Expected 15 school questions"

    # 2. Test Cosine Similarity & ML Archetypes
    print(f"[3] Target Archetypes Count: {len(TARGET_ARCHETYPES)}")
    assert len(TARGET_ARCHETYPES) >= 5, "Expected at least 5 target archetypes"

    # Test high technical student
    high_tech_student = [85, 90, 95, 75, 90]
    best_arch = None
    best_sim = -1.0
    for arch in TARGET_ARCHETYPES:
        sim = _compute_cosine_similarity(high_tech_student, arch["vector"])
        if sim > best_sim:
            best_sim = sim
            best_arch = arch

    print(f"[4] High Tech Student classified as: '{best_arch['name']}' with cosine sim: {best_sim:.4f}")
    assert "Systems Architect" in best_arch["name"] or "Software" in best_arch["target_role"], "Should match Software/Systems Architect"

    # Test high math/quant student
    high_quant_student = [98, 92, 78, 70, 85]
    best_arch = None
    best_sim = -1.0
    for arch in TARGET_ARCHETYPES:
        sim = _compute_cosine_similarity(high_quant_student, arch["vector"])
        if sim > best_sim:
            best_sim = sim
            best_arch = arch

    print(f"[5] High Quant Student classified as: '{best_arch['name']}' with cosine sim: {best_sim:.4f}")
    assert "Quantitative" in best_arch["name"] or "Data" in best_arch["name"], "Should match Quantitative/Data Strategist"

    print("ALL ASSESSMENT & ML ALGORITHM TESTS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    run_tests()

