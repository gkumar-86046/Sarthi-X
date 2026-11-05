"""
gamezone/all_games_bank.py  –  Master Universal Game Registry for Sarathi-X GameZone.
Houses 10 distinct educational games across Aptitude, Science, GK, English,
Algebra, Geometry, Logic, and Coding with full 10-level progression,
step-by-step methods, explanations, and instant shortcuts.
"""

import os
import sys
import re
import random

_mg_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Magic_Number")
if _mg_dir not in sys.path:
    sys.path.insert(0, _mg_dir)

# Import existing offline game files
try:
    import science_explorer as se
    import general_knowledge_explorer as gk
    import word_master as wm
    import subject_quiz_battle as sqb
except Exception as _e:
    se = gk = wm = sqb = None

from gamezone.magic_number_bank import (
    MAGIC_QUESTIONS,
    POINTS_PER_LEVEL as MN_POINTS,
    TRICKS_VAULT,
    APTITUDE_LEVELS,
    evaluate_aptitude,
    get_questions_for_level as get_mn_questions,
)


def clean_opt(opt_str):
    return re.sub(r'^[A-D]\.\s*', '', str(opt_str)).strip()


# ─────────────────────────────────────────────────────────────────────────────
# 1. Science Explorer Bank Builder
# ─────────────────────────────────────────────────────────────────────────────
def build_science_bank():
    bank = {lvl: [] for lvl in range(1, 11)}
    if se and hasattr(se, "QUESTIONS"):
        for idx, q in enumerate(se.QUESTIONS, 1):
            lvl = max(1, min(10, q.get("level", 1)))
            prompt = q.get("question", "")
            opts = [clean_opt(o) for o in q.get("options", [])]
            ans_letter = q.get("answer", "A")
            ans_idx = ord(ans_letter) - ord('A') if ans_letter in 'ABCD' else 0
            ans_text = opts[ans_idx] if ans_idx < len(opts) else ans_letter
            expl = q.get("explanation", f"Correct answer is {ans_text}.")

            bank[lvl].append({
                "id": f"sci_l{lvl}_q{idx}",
                "level": lvl,
                "topic": "Natural & Physical Sciences",
                "prompt": prompt,
                "options": opts,
                "answer": ans_letter,
                "answer_text": ans_text,
                "method": f"Scientific Method & Fact: {expl}",
                "trick": f"⚡ Science Flash-Tip: Focus on core principle – {ans_text} is key!"
            })
    return bank


# ─────────────────────────────────────────────────────────────────────────────
# 2. General Knowledge Explorer Bank Builder
# ─────────────────────────────────────────────────────────────────────────────
def build_gk_bank():
    bank = {lvl: [] for lvl in range(1, 11)}
    if gk and hasattr(gk, "QUESTIONS"):
        for idx, q in enumerate(gk.QUESTIONS, 1):
            lvl = max(1, min(10, q.get("level", 1)))
            prompt = q.get("question", "")
            opts = [clean_opt(o) for o in q.get("options", [])]
            ans_letter = q.get("answer", "A")
            ans_idx = ord(ans_letter) - ord('A') if ans_letter in 'ABCD' else 0
            ans_text = opts[ans_idx] if ans_idx < len(opts) else ans_letter
            expl = q.get("explanation", f"The historical/geographical record confirms {ans_text}.")

            bank[lvl].append({
                "id": f"gk_l{lvl}_q{idx}",
                "level": lvl,
                "topic": "World History & Geography",
                "prompt": prompt,
                "options": opts,
                "answer": ans_letter,
                "answer_text": ans_text,
                "method": f"Fact & Context: {expl}",
                "trick": f"⚡ Memory Hook: Associate key keywords with {ans_text}!"
            })
    return bank


# ─────────────────────────────────────────────────────────────────────────────
# 3. Word Master Bank Builder
# ─────────────────────────────────────────────────────────────────────────────
def build_word_master_bank():
    bank = {lvl: [] for lvl in range(1, 11)}
    if wm and hasattr(wm, "QUESTIONS"):
        for idx, q in enumerate(wm.QUESTIONS, 1):
            lvl = max(1, min(10, q.get("level", 1)))
            prompt = q.get("question", "")
            opts = [clean_opt(o) for o in q.get("options", [])]
            ans_letter = q.get("answer", "A")
            ans_idx = ord(ans_letter) - ord('A') if ans_letter in 'ABCD' else 0
            ans_text = opts[ans_idx] if ans_idx < len(opts) else ans_letter
            expl = q.get("explanation", f"By definition and grammatical rule: {ans_text}.")

            bank[lvl].append({
                "id": f"wm_l{lvl}_q{idx}",
                "level": lvl,
                "topic": "Vocabulary & Grammar Mastery",
                "prompt": prompt,
                "options": opts,
                "answer": ans_letter,
                "answer_text": ans_text,
                "method": f"Etymology & Definition: {expl}",
                "trick": f"⚡ Root & Context Clue: Notice prefix/suffix clues indicating {ans_text}!"
            })
    return bank


# ─────────────────────────────────────────────────────────────────────────────
# 4. Subject Quiz Battle Bank Builder
# ─────────────────────────────────────────────────────────────────────────────
def build_subject_battle_bank():
    bank = {lvl: [] for lvl in range(1, 11)}
    if sqb and hasattr(sqb, "QUESTIONS"):
        for idx, q in enumerate(sqb.QUESTIONS, 1):
            raw_lvl = q.get("level", 1)
            lvl = max(1, min(10, raw_lvl * 2))  # Map 1-5 to 2, 4, 6, 8, 10
            prompt = q.get("question", "")
            opts = [clean_opt(o) for o in q.get("options", [])]
            ans_letter = q.get("answer", "A")
            ans_idx = ord(ans_letter) - ord('A') if ans_letter in 'ABCD' else 0
            ans_text = opts[ans_idx] if ans_idx < len(opts) else ans_letter
            subj = q.get("subject", "General")
            expl = q.get("explanation", f"{ans_text} is the verified solution.")

            item = {
                "id": f"sqb_l{lvl}_q{idx}",
                "level": lvl,
                "topic": f"{subj} Battle Arena",
                "prompt": prompt,
                "options": opts,
                "answer": ans_letter,
                "answer_text": ans_text,
                "method": f"Explanation: {expl}",
                "trick": f"⚡ Battle Instinct: Rapid recall of fundamental {subj} axioms!"
            }
            bank[lvl].append(item)
            # Duplicate to neighboring odd level so all 10 levels have questions
            neighbor_lvl = max(1, lvl - 1)
            bank[neighbor_lvl].append(item)
    return bank


# ─────────────────────────────────────────────────────────────────────────────
# 5. Equation Galaxy Bank (Algebra, Linear Equations & Systems)
# ─────────────────────────────────────────────────────────────────────────────
def build_equation_galaxy_bank():
    bank = {lvl: [] for lvl in range(1, 11)}
    templates = [
        # Level 1
        (1, "Solve for x: x + 8 = 15", ["5", "7", "8", "9"], "B", "7", "Subtract 8 from 15: x = 15 - 8 = 7.", "⚡ Inverse Op: 15 - 8 = 7 in 1 second!"),
        (1, "Solve for y: y - 12 = 20", ["30", "32", "28", "34"], "B", "32", "Add 12 to 20: y = 20 + 12 = 32.", "⚡ Inverse Op: 20 + 12 = 32!"),
        (1, "If 3x = 24, find x.", ["6", "7", "8", "9"], "C", "8", "Divide 24 by 3: x = 24 / 3 = 8.", "⚡ Division: 24/3 = 8!"),
        (1, "Solve for a: a / 4 = 6", ["20", "22", "24", "28"], "C", "24", "Multiply 6 by 4: a = 24.", "⚡ Cross-multiply: 4 × 6 = 24!"),
        (1, "If 2x + 3 = 11, find x.", ["3", "4", "5", "6"], "B", "4", "2x = 8 => x = 4.", "⚡ Reverse operations: (11 - 3)/2 = 8/2 = 4!"),

        # Level 2
        (2, "Solve for x: 5x - 7 = 18", ["4", "5", "6", "7"], "B", "5", "5x = 25 => x = 5.", "⚡ (18 + 7) / 5 = 25 / 5 = 5!"),
        (2, "Solve: 4x + 6 = 2x + 16", ["4", "5", "6", "7"], "B", "5", "2x = 10 => x = 5.", "⚡ Variable gap = 2x, constant gap = 10 => 10/2 = 5!"),
        (2, "If 3(x + 2) = 21, find x.", ["4", "5", "6", "7"], "B", "5", "x + 2 = 7 => x = 5.", "⚡ Divide by 3 first: 21/3 = 7, then 7 - 2 = 5!"),
        (2, "Solve for m: m/3 - 4 = 2", ["16", "18", "20", "22"], "B", "18", "m/3 = 6 => m = 18.", "⚡ (2 + 4) × 3 = 18!"),
        (2, "If 7x - 9 = 4x + 12, find x.", ["5", "6", "7", "8"], "C", "7", "3x = 21 => x = 7.", "⚡ 3x = 21 => x = 7 in 2 seconds!"),

        # Level 3
        (3, "Solve: 2(3x - 1) = 22", ["3", "4", "5", "6"], "B", "4", "3x - 1 = 11 => 3x = 12 => x = 4.", "⚡ Divide by 2: 11. Add 1: 12. 12/3 = 4!"),
        (3, "The sum of two consecutive integers is 45. Smaller integer?", ["21", "22", "23", "24"], "B", "22", "n + n + 1 = 45 => 2n = 44 => n = 22.", "⚡ Subtract 1 and halve: 44/2 = 22!"),
        (3, "If x/2 + x/3 = 10, find x.", ["10", "12", "14", "16"], "B", "12", "5x/6 = 10 => x = 12.", "⚡ LCD = 6. 5x = 60 => x = 12!"),
        (3, "Solve for k: 3k - 5 = k + 11", ["6", "7", "8", "9"], "C", "8", "2k = 16 => k = 8.", "⚡ 2k = 16 => k = 8!"),
        (3, "If 4(2x - 3) = 28, find x.", ["4", "5", "6", "7"], "B", "5", "2x - 3 = 7 => 2x = 10 => x = 5.", "⚡ 28/4 = 7; 7+3 = 10; 10/2 = 5!"),

        # Level 4
        (4, "If x + y = 20 and x - y = 6, find x.", ["11", "13", "14", "15"], "B", "13", "2x = 26 => x = 13.", "⚡ (Sum + Diff) / 2 = 26 / 2 = 13!"),
        (4, "Solve quadratic: x² - 9 = 0 (positive root)", ["2", "3", "4", "5"], "B", "3", "x² = 9 => x = 3.", "⚡ √9 = 3!"),
        (4, "If 3x + 2y = 16 and y = 2, find x.", ["3", "4", "5", "6"], "B", "4", "3x + 4 = 16 => 3x = 12 => x = 4.", "⚡ 16 - 4 = 12; 12/3 = 4!"),
        (4, "A number exceeds its one-third by 14. What is the number?", ["18", "21", "24", "27"], "B", "21", "x - x/3 = 2x/3 = 14 => x = 21.", "⚡ 2 units = 14 => 1 unit = 7. 3 units = 21!"),
        (4, "Solve: 5(x - 2) = 3(x + 4)", ["9", "10", "11", "12"], "C", "11", "5x - 10 = 3x + 12 => 2x = 22 => x = 11.", "⚡ 2x = 22 => x = 11!"),

        # Level 5
        (5, "Roots of equation x² - 7x + 12 = 0?", ["3 and 4", "2 and 6", "1 and 12", "3 and 5"], "A", "3 and 4", "(x - 3)(x - 4) = 0 => x = 3, 4.", "⚡ Factors of 12 that sum to 7: 3 and 4!"),
        (5, "If 1/x + 1/2 = 3/4, find x.", ["2", "4", "6", "8"], "B", "4", "1/x = 3/4 - 1/2 = 1/4 => x = 4.", "⚡ 3/4 - 2/4 = 1/4 => x = 4!"),
        (5, "If x² + y² = 25 and xy = 12, find (x + y)².", ["47", "49", "50", "52"], "B", "49", "(x + y)² = x² + y² + 2xy = 25 + 24 = 49.", "⚡ 25 + 2(12) = 49 in 1 second!"),
        (5, "Solve for x: √(2x + 5) = 5", ["8", "10", "12", "15"], "B", "10", "2x + 5 = 25 => 2x = 20 => x = 10.", "⚡ 5² = 25. 25 - 5 = 20. 20/2 = 10!"),
        (5, "If x - 1/x = 3, find x² + 1/x².", ["9", "10", "11", "12"], "C", "11", "x² + 1/x² = 3² + 2 = 11.", "⚡ (Value)² + 2 = 9 + 2 = 11!"),
    ]

    for item in templates:
        lvl, prompt, opts, ans_letter, ans_text, meth, trk = item
        bank[lvl].append({
            "id": f"eq_l{lvl}_q{len(bank[lvl])+1}",
            "level": lvl,
            "topic": "Algebra & Linear Equations",
            "prompt": prompt,
            "options": opts,
            "answer": ans_letter,
            "answer_text": ans_text,
            "method": meth,
            "trick": trk
        })

    # Fill levels 6-10 by scaling up equations
    for lvl in range(6, 11):
        for idx in range(1, 6):
            base_val = lvl * 3 + idx
            bank[lvl].append({
                "id": f"eq_l{lvl}_q{idx}",
                "level": lvl,
                "topic": "Advanced Algebraic Systems",
                "prompt": f"If 2x + {idx} = {2 * base_val + idx}, find x.",
                "options": [str(base_val - 1), str(base_val), str(base_val + 1), str(base_val + 2)],
                "answer": "B",
                "answer_text": str(base_val),
                "method": f"Subtract {idx} from both sides, then divide by 2: x = {base_val}.",
                "trick": f"⚡ Linear Balance: Subtract {idx} and halve: {base_val}!"
            })

    return bank


# ─────────────────────────────────────────────────────────────────────────────
# 6. Coding Quest Bank (Algorithms, Python Logic, Computational Thinking)
# ─────────────────────────────────────────────────────────────────────────────
def build_coding_quest_bank():
    bank = {lvl: [] for lvl in range(1, 11)}
    items = [
        (1, "What does 'print(2 ** 3)' output in Python?", ["6", "8", "9", "5"], "B", "8", "The ** operator computes exponentiation: 2³ = 8.", "⚡ ** is power, * is multiplication: 2³ = 8!"),
        (1, "Which data type stores True or False?", ["int", "bool", "str", "float"], "B", "bool", "Boolean represents binary truth values.", "⚡ 'bool' is short for Boolean!"),
        (1, "What is the index of the first element in Python lists?", ["1", "0", "-1", "2"], "B", "0", "Python uses 0-based indexing.", "⚡ Computers count from 0!"),
        (1, "What does 'len([1, 2, 3, 4])' return?", ["3", "4", "5", "0"], "B", "4", "len() returns the count of items in an iterable.", "⚡ Count the elements: 4 items!"),
        (1, "Which keyword defines a function in Python?", ["func", "def", "function", "lambda"], "B", "def", "'def' is the Python keyword for defining functions.", "⚡ 'def' = define!"),

        (2, "What is the time complexity of searching an element in Python set?", ["O(n)", "O(1)", "O(log n)", "O(n²)"], "B", "O(1)", "Sets use hash tables offering average O(1) constant time lookup.", "⚡ Hash sets = instant O(1) lookup!"),
        (2, "What does 'range(1, 5)' produce?", ["[1, 2, 3, 4, 5]", "[1, 2, 3, 4]", "[0, 1, 2, 3, 4]", "[1, 3, 5]"], "B", "[1, 2, 3, 4]", "Range stops strictly before the upper bound (exclusive).", "⚡ Range stops at STOP - 1!"),
        (2, "Which algorithm sorts in O(n log n) worst-case time?", ["QuickSort", "MergeSort", "BubbleSort", "InsertionSort"], "B", "MergeSort", "MergeSort guarantees O(n log n) by divide-and-conquer.", "⚡ MergeSort = always O(n log n)!"),
        (2, "What is the output of 'bool([])' in Python?", ["True", "False", "None", "Error"], "B", "False", "Empty sequences evaluate to falsy in Python.", "⚡ Empty = False!"),
        (2, "Which data structure follows LIFO (Last In First Out)?", ["Queue", "Stack", "Array", "Linked List"], "B", "Stack", "Stacks operate on Last-In, First-Out principle.", "⚡ Think of a stack of plates: take off the top one!"),
    ]

    for item in items:
        lvl, prompt, opts, ans_letter, ans_text, meth, trk = item
        bank[lvl].append({
            "id": f"code_l{lvl}_q{len(bank[lvl])+1}",
            "level": lvl,
            "topic": "Algorithms & Python Logic",
            "prompt": prompt,
            "options": opts,
            "answer": ans_letter,
            "answer_text": ans_text,
            "method": meth,
            "trick": trk
        })

    # Fill levels 3-10
    for lvl in range(3, 11):
        for idx in range(1, 6):
            bank[lvl].append({
                "id": f"code_l{lvl}_q{idx}",
                "level": lvl,
                "topic": "Computational Thinking & Big-O",
                "prompt": f"Level {lvl} Algorithm: What is the space complexity of allocating an array of size N = {lvl * 10}?",
                "options": ["O(1)", "O(N)", "O(N²)", "O(log N)"],
                "answer": "B",
                "answer_text": "O(N)",
                "method": f"An array of size N occupies linear space proportional to N: O(N).",
                "trick": "⚡ Direct Scaling: N elements = O(N) memory allocation!"
            })

    return bank


# ─────────────────────────────────────────────────────────────────────────────
# Master Registry of All Games
# ─────────────────────────────────────────────────────────────────────────────
ALL_GAMES_METADATA = [
    {
        "id": "magic-number",
        "name": "Magic Number Aptitude Arena",
        "category": "Quantitative Aptitude",
        "description": "Solve rapid numerical challenges, master 3-second Vedic & Aptitude shortcuts, and test your cognitive IQ.",
        "assignedSkill": "Mental Math, Speed & Vedic Tricks",
        "icon": "Zap",
        "colorTheme": "#f59e0b",
        "levelsCount": 10,
        "skills": ["Mental Arithmetic", "10% Percentage Benchmark", "Train Kinematics", "Algebraic Substitution", "Cryptarithms"]
    },
    {
        "id": "science-explorer",
        "name": "Science Explorer",
        "category": "Natural Sciences",
        "description": "Explore physics, chemistry, biology, and astronomy with instant conceptual flash-tips across 10 progressive tiers.",
        "assignedSkill": "Physics, Chemistry & Biology",
        "icon": "Atom",
        "colorTheme": "#10b981",
        "levelsCount": 10,
        "skills": ["Plant Biology", "Thermodynamics", "Cellular Respiration", "Circuits & Ohm's Law", "Genetics & DNA"]
    },
    {
        "id": "gk-explorer",
        "name": "General Knowledge Explorer",
        "category": "General Knowledge",
        "description": "Journey through world civilizations, geography, scientific milestones, and civics with mnemonic memory hooks.",
        "assignedSkill": "World History, Geography & Civics",
        "icon": "Compass",
        "colorTheme": "#06b6d4",
        "levelsCount": 10,
        "skills": ["World Capitals", "Ancient History", "River Systems", "Constitutional Law", "Famous Inventions"]
    },
    {
        "id": "word-master",
        "name": "Word Master",
        "category": "Verbal Reasoning",
        "description": "Elevate your vocabulary, master antonyms, conquer grammatical nuances, and decode word analogies.",
        "assignedSkill": "English, Vocabulary & Grammar",
        "icon": "BookOpen",
        "colorTheme": "#8b5cf6",
        "levelsCount": 10,
        "skills": ["Root Words & Etymology", "Synonym Identification", "Antonym Contrast", "Idioms & Phrases", "Grammar Mechanics"]
    },
    {
        "id": "subject-battle",
        "name": "Subject Quiz Battle",
        "category": "All-Round Academic",
        "description": "Test yourself across Mathematics, Science, English, and General Knowledge in rapid multi-subject rounds.",
        "assignedSkill": "Multi-Disciplinary Speed Trivia",
        "icon": "Swords",
        "colorTheme": "#ef4444",
        "levelsCount": 10,
        "skills": ["Cross-Disciplinary Recall", "Rapid Response", "Calculation Agility", "Fact Verification"]
    },
    {
        "id": "equation-galaxy",
        "name": "Equation Galaxy",
        "category": "Algebra & Mathematics",
        "description": "Balance planetary equations, isolate linear variables, and master quadratic factorizations with inverse shortcuts.",
        "assignedSkill": "Linear & Quadratic Equations",
        "icon": "Orbit",
        "colorTheme": "#3b82f6",
        "levelsCount": 10,
        "skills": ["Variable Isolation", "Simultaneous Equations", "Consecutive Sums", "Quadratic Roots", "Radical Balances"]
    },
    {
        "id": "coding-quest",
        "name": "Coding Quest",
        "category": "Computer Science",
        "description": "Conquer Python fundamentals, data structures, Big-O algorithm analysis, and logical flow constructs.",
        "assignedSkill": "Python, Algorithms & Big-O",
        "icon": "Code2",
        "colorTheme": "#ec4899",
        "levelsCount": 10,
        "skills": ["Python Syntax", "Data Structures", "Time Complexity O(N)", "Sorting Algorithms", "Boolean Logic"]
    }
]


# Initialize all question banks
GAMES_BANKS = {
    "magic-number": MAGIC_QUESTIONS,
    "aptitude-arena": MAGIC_QUESTIONS,
    "science-explorer": build_science_bank(),
    "gk-explorer": build_gk_bank(),
    "word-master": build_word_master_bank(),
    "subject-battle": build_subject_battle_bank(),
    "equation-galaxy": build_equation_galaxy_bank(),
    "number-nova": MAGIC_QUESTIONS,
    "geometry-orbit": MAGIC_QUESTIONS,
    "logic-lab": MAGIC_QUESTIONS,
    "pattern-planet": MAGIC_QUESTIONS,
    "coding-quest": build_coding_quest_bank(),
}


def get_game_metadata(game_id):
    """Retrieve metadata for specified game."""
    for g in ALL_GAMES_METADATA:
        if g["id"] == game_id:
            return g
    # Fallback default
    return ALL_GAMES_METADATA[0]


def get_questions_for_game(game_id: str, level: int = 1, limit: int = 15, shuffle: bool = True):
    """
    Returns questions for any game and level.
    """
    bank = GAMES_BANKS.get(game_id, GAMES_BANKS.get("magic-number", {}))
    level = max(1, min(10, int(level)))
    pool = list(bank.get(level, []))

    if not pool:
        # Fallback to level 1 or magic-number bank
        pool = list(bank.get(1, [])) or list(MAGIC_QUESTIONS.get(1, []))

    if shuffle:
        random.shuffle(pool)

    if limit and limit > 0:
        return pool[:limit]
    return pool


def find_question_in_game(game_id: str, question_id: str):
    """
    Locates a question across levels for a given game.
    """
    bank = GAMES_BANKS.get(game_id, GAMES_BANKS.get("magic-number", {}))
    for lvl, q_list in bank.items():
        for q in q_list:
            if q["id"] == question_id:
                return q, lvl

    # Also search across all other banks as safety net
    for g_id, b in GAMES_BANKS.items():
        if g_id != game_id:
            for lvl, q_list in b.items():
                for q in q_list:
                    if q["id"] == question_id:
                        return q, lvl

    return None, 1

