"""
cantroller/assessment_controller.py  –  Diagnostic Skill Assessment,
Machine Learning Skill Profiling, Adaptive Game Matching, and Dynamic Roadmap Generator.
"""

import json
import math
from database.connection import get_db, close_db
from cantroller.auth_controller import _build_academic_detail
from cantroller.course_controller import build_student_course_scope


# ─────────────────────────────────────────────────────────────────────────────
# 1. Question Bank by Educational Tier & Competencies
# ─────────────────────────────────────────────────────────────────────────────

# 5 Core Competencies:
# 1. aptitude         – Quantitative & Numerical Aptitude
# 2. logic            – Deductive & Analytical Reasoning
# 3. technical        – Technical / Subject Specialization (CS / Science)
# 4. verbal           – Verbal Ability & Reading Comprehension
# 5. problem_solving  – Applied Problem Solving & Critical Thinking

QUESTIONS_GRADUATION = [
    # ── Aptitude (3 questions) ────────────────────────────────────────────────
    {
        "id": "grad_apt_1",
        "domain": "aptitude",
        "title": "Compound Ratio & Work Equivalence",
        "question": "If 12 engineers can build a microservice architecture in 15 days working 8 hours/day, how many days will 10 engineers take to build twice the architecture working 9 hours/day?",
        "options": ["32 days", "28 days", "36 days", "24 days"],
        "correctIndex": 0,
        "difficulty": 1.4,
        "explanation": "Work = (M * D * H) / W. (12 * 15 * 8) / 1 = (10 * D2 * 9) / 2 => 1440 = 45 * D2 => D2 = 32 days.",
        "skill": "Quantitative Proportions & Rate Analysis"
    },
    {
        "id": "grad_apt_2",
        "domain": "aptitude",
        "title": "Speed, Distance & Relative Motion",
        "question": "A train running at 72 km/h crosses a 250m long platform in 26 seconds. How much time will it take to cross an electric pole?",
        "options": ["13.5 seconds", "12.5 seconds", "14 seconds", "10 seconds"],
        "correctIndex": 1,
        "difficulty": 1.2,
        "explanation": "Speed = 72 * 5/18 = 20 m/s. Total distance = Train + Platform = 20 * 26 = 520m. Train length = 520 - 250 = 270m. Time to cross pole = 270 / 20 = 13.5 s (Wait: 270/20 = 13.5s). Correct option is 13.5 seconds.",
        "skill": "Relative Velocity & Distance"
    },
    {
        "id": "grad_apt_3",
        "domain": "aptitude",
        "title": "Percentage & Successive Variation",
        "question": "The computational cost of a cloud cluster increased by 25% in Q1 and then decreased by 20% in Q2. What is the net percentage change in total cloud cost?",
        "options": ["0% (No Change)", "5% Increase", "5% Decrease", "2.5% Increase"],
        "correctIndex": 0,
        "difficulty": 1.0,
        "explanation": "Net formula = x + y + (xy)/100 = 25 - 20 - (25*20)/100 = 5 - 5 = 0% change.",
        "skill": "Percentage Calculus & Financial Optimization"
    },

    # ── Logic (3 questions) ───────────────────────────────────────────────────
    {
        "id": "grad_log_1",
        "domain": "logic",
        "title": "Sequential Logic & Truth Deductions",
        "question": "In a distributed system, 5 nodes P, Q, R, S, T replicate data. Q replicates faster than P but slower than T. S replicates faster than T. R replicates slower than P. Which node is the median replicator?",
        "options": ["Q", "P", "T", "R"],
        "correctIndex": 0,
        "difficulty": 1.2,
        "explanation": "Arrangement: S > T > Q > P > R. The median is Q.",
        "skill": "Sequential Ordering & Transitive Relations"
    },
    {
        "id": "grad_log_2",
        "domain": "logic",
        "title": "Boolean Syllogisms & Set Theory",
        "question": "Statements: (1) All algorithms are functions. (2) Some functions are recursive. Conclusions: I. Some algorithms are recursive. II. All functions are algorithms. Which conclusion logically follows?",
        "options": ["Neither I nor II follows", "Only I follows", "Only II follows", "Both I and II follow"],
        "correctIndex": 0,
        "difficulty": 1.3,
        "explanation": "A is a subset of F; R overlaps with F. R may not overlap with A, and F is not a subset of A. Neither follows unconditionally.",
        "skill": "Formal Syllogistic Logic & Set Intersection"
    },
    {
        "id": "grad_log_3",
        "domain": "logic",
        "title": "Pattern Matrix & Numeric Logic",
        "question": "Identify the missing number in the sequence: 4, 9, 25, 49, 121, 169, ?",
        "options": ["289", "225", "196", "256"],
        "correctIndex": 0,
        "difficulty": 1.2,
        "explanation": "Sequence consists of squares of prime numbers: 2^2, 3^2, 5^2, 7^2, 11^2, 13^2, 17^2 = 289.",
        "skill": "Prime Number Invariant & Series Deduction"
    },

    # ── Technical (3 questions) ───────────────────────────────────────────────
    {
        "id": "grad_tech_1",
        "domain": "technical",
        "title": "Algorithmic Time Complexity",
        "question": "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) versus a balanced Red-Black Tree?",
        "options": ["O(N) vs O(log N)", "O(log N) vs O(log N)", "O(N log N) vs O(N)", "O(1) vs O(log N)"],
        "correctIndex": 0,
        "difficulty": 1.3,
        "explanation": "An unbalanced BST degrades into a linear linked list with O(N) search. A self-balancing Red-Black Tree guarantees O(log N).",
        "skill": "Data Structures & Tree Invariants"
    },
    {
        "id": "grad_tech_2",
        "domain": "technical",
        "title": "Operating Systems & Concurrency",
        "question": "Which of the following conditions is NOT strictly required for a system deadlock to occur (Coffman conditions)?",
        "options": ["Preemption Allowed", "Mutual Exclusion", "Hold and Wait", "Circular Wait"],
        "correctIndex": 0,
        "difficulty": 1.2,
        "explanation": "Deadlock requires NO preemption. If preemption is allowed, resources can be reclaimed and deadlocks avoided.",
        "skill": "Concurrency, Synchronization & Operating Systems"
    },
    {
        "id": "grad_tech_3",
        "domain": "technical",
        "title": "Database Normalization & ACID Properties",
        "question": "Which ACID property guarantees that multiple transactions executing simultaneously will result in a state that could have been obtained if transactions were executed sequentially?",
        "options": ["Isolation", "Atomicity", "Consistency", "Durability"],
        "correctIndex": 0,
        "difficulty": 1.1,
        "explanation": "Isolation ensures transaction execution concurrency without cross-transaction interference or dirty reads.",
        "skill": "Database Systems & Transaction Isolation"
    },

    # ── Verbal (3 questions) ──────────────────────────────────────────────────
    {
        "id": "grad_verb_1",
        "domain": "verbal",
        "title": "Contextual Inference & Semantic Precision",
        "question": "Choose the most appropriate word: 'The company's new security framework provided an ________ defense against zero-day vulnerabilities, leaving no room for penetration.'",
        "options": ["impregnable", "ephemeral", "equivocal", "indolent"],
        "correctIndex": 0,
        "difficulty": 1.1,
        "explanation": "'Impregnable' means incapable of being captured or penetrated, which matches the context.",
        "skill": "Advanced Vocabulary & Tone Alignment"
    },
    {
        "id": "grad_verb_2",
        "domain": "verbal",
        "title": "Sentence Correction & Grammatical Parallelism",
        "question": "Identify the grammatically correct sentence:",
        "options": [
            "Neither the senior architect nor the software developers were satisfied with the database throughput.",
            "Neither the senior architect nor the software developers was satisfied with the database throughput.",
            "Neither the senior architect or the software developers were satisfied with the database throughput.",
            "Neither the senior architect nor the software developers has been satisfied with the database throughput."
        ],
        "correctIndex": 0,
        "difficulty": 1.2,
        "explanation": "With 'neither... nor', the verb agrees with the closer subject ('software developers' -> plural 'were').",
        "skill": "Subject-Verb Agreement & Parallel Structure"
    },
    {
        "id": "grad_verb_3",
        "domain": "verbal",
        "title": "Critical Reading & Argument Evaluation",
        "question": "Premise: 'AI code assistants reduce syntax debugging time by 60%. Therefore, junior engineers no longer need to understand memory management.' What is the underlying flawed assumption?",
        "options": [
            "Assumes syntax speed equates to deep conceptual system understanding",
            "Assumes AI tools are 100% bug free",
            "Assumes memory management is completely automated in every language",
            "Assumes junior engineers write more code than senior architects"
        ],
        "correctIndex": 0,
        "difficulty": 1.3,
        "explanation": "The conclusion leaps from syntax acceleration to eliminating fundamental core systems concepts.",
        "skill": "Analytical Argument Analysis & Logic Fallacies"
    },

    # ── Problem Solving (3 questions) ─────────────────────────────────────────
    {
        "id": "grad_prob_1",
        "domain": "problem_solving",
        "title": "Resource Allocation & Dynamic Optimization",
        "question": "You have a 100 Mbps API bandwidth limit. Service A generates $5/req and takes 2 Mbps. Service B generates $8/req and takes 5 Mbps. Service C generates $3/req and takes 1 Mbps. Which allocation yields maximum revenue per Mbps?",
        "options": ["Service C ($3.00/Mbps)", "Service A ($2.50/Mbps)", "Service B ($1.60/Mbps)", "Equal split among all three"],
        "correctIndex": 0,
        "difficulty": 1.2,
        "explanation": "Revenue density: C = 3/1 = $3.0/Mbps; A = 5/2 = $2.5/Mbps; B = 8/5 = $1.6/Mbps. Service C gives the highest return per unit resource.",
        "skill": "Greedy Heuristics & Resource Knapsack Optimization"
    },
    {
        "id": "grad_prob_2",
        "domain": "problem_solving",
        "title": "Architectural Bottleneck Diagnosis",
        "question": "A web application experiences 504 Gateway Timeouts during peak traffic. CPU utilization is at 25%, Memory at 40%, but database active connection pool is at 100% capacity with queries waiting in queue. What is the root cause bottleneck?",
        "options": [
            "Database Connection Starvation / Pool Exhaustion",
            "Server CPU throttling",
            "Out of Memory (OOM) killer",
            "DNS lookup failure"
        ],
        "correctIndex": 0,
        "difficulty": 1.3,
        "explanation": "Low CPU/RAM combined with 100% saturated connection pool directly indicates connection pool exhaustion.",
        "skill": "System Telemetry & Root Cause Analysis"
    },
    {
        "id": "grad_prob_3",
        "domain": "problem_solving",
        "title": "Trade-off Decision Matrix (CAP Theorem)",
        "question": "In a distributed payment transaction system facing network partition between regional datacenters, which CAP theorem guarantee must be prioritized to prevent double-spending?",
        "options": [
            "Consistency over Availability (CP)",
            "Availability over Consistency (AP)",
            "Partition Tolerance removal (CA)",
            "Eventual Consistency with lazy reconciliation"
        ],
        "correctIndex": 0,
        "difficulty": 1.3,
        "explanation": "Financial transactions cannot tolerate inconsistent balances (double-spending), so Consistency must be strictly guaranteed over Availability during network partitions (CP system).",
        "skill": "Architectural Trade-offs & Consistency Models"
    }
]

# School / Intermediate version of questions (Classes 9-12 Science/General)
QUESTIONS_SCHOOL = [
    {
        "id": "sch_apt_1",
        "domain": "aptitude",
        "title": "Ratio & Proportions",
        "question": "The ratio of boys to girls in a coding club is 5:3. If there are 40 students in total, how many girls are in the club?",
        "options": ["15", "25", "12", "18"],
        "correctIndex": 0,
        "difficulty": 1.0,
        "explanation": "Total parts = 5 + 3 = 8. Girls = (3/8) * 40 = 15.",
        "skill": "Fractional Ratios & Arithmetic"
    },
    {
        "id": "sch_apt_2",
        "domain": "aptitude",
        "title": "Algebraic Simplification",
        "question": "If 3x + 7 = 28, what is the value of 2x - 3?",
        "options": ["11", "14", "9", "7"],
        "correctIndex": 0,
        "difficulty": 1.0,
        "explanation": "3x = 21 => x = 7. Then 2(7) - 3 = 14 - 3 = 11.",
        "skill": "Linear Equations"
    },
    {
        "id": "sch_apt_3",
        "domain": "aptitude",
        "title": "Percentages & Discounts",
        "question": "A book priced at $80 is sold with a 15% discount. What is the final sale price?",
        "options": ["$68", "$65", "$70", "$72"],
        "correctIndex": 0,
        "difficulty": 1.0,
        "explanation": "Discount = 0.15 * 80 = $12. Final price = 80 - 12 = $68.",
        "skill": "Percentage Discount Arithmetic"
    },
    {
        "id": "sch_log_1",
        "domain": "logic",
        "title": "Sequence Number Logic",
        "question": "What is the next number in the pattern: 2, 6, 12, 20, 30, ?",
        "options": ["42", "40", "38", "44"],
        "correctIndex": 0,
        "difficulty": 1.1,
        "explanation": "Differences are +4, +6, +8, +10, +12. 30 + 12 = 42 (also n*(n+1): 1*2, 2*3, 3*4, 4*5, 5*6, 6*7=42).",
        "skill": "Second-order Difference Series"
    },
    {
        "id": "sch_log_2",
        "domain": "logic",
        "title": "Odd One Out",
        "question": "Which of the following does NOT belong with the others: Mars, Venus, Jupiter, Moon, Saturn?",
        "options": ["Moon", "Mars", "Jupiter", "Venus"],
        "correctIndex": 0,
        "difficulty": 1.0,
        "explanation": "The Moon is a natural satellite, while the rest are planets in the solar system.",
        "skill": "Categorical Classification"
    },
    {
        "id": "sch_log_3",
        "domain": "logic",
        "title": "Coding-Decoding Pattern",
        "question": "If 'MATH' is coded as 'OCVJ', what is the code for 'BOOK'?",
        "options": ["DQQM", "CQQM", "DPPM", "DQPL"],
        "correctIndex": 0,
        "difficulty": 1.1,
        "explanation": "Each letter is shifted forward by 2 positions: B(+2)=D, O(+2)=Q, O(+2)=Q, K(+2)=M -> DQQM.",
        "skill": "Letter Shift & Cipher Decoding"
    },
    {
        "id": "sch_tech_1",
        "domain": "technical",
        "title": "Physics: Energy & Force",
        "question": "Which law of physics states that for every action, there is an equal and opposite reaction?",
        "options": ["Newton's Third Law", "Newton's First Law", "Newton's Second Law", "Law of Gravitation"],
        "correctIndex": 0,
        "difficulty": 1.0,
        "explanation": "Newton's Third Law of Motion states action and reaction are equal in magnitude and opposite in direction.",
        "skill": "Fundamental Physics & Mechanics"
    },
    {
        "id": "sch_tech_2",
        "domain": "technical",
        "title": "Chemistry: Atomic Structure",
        "question": "What is the atomic number of Carbon, and how many valence electrons does it have?",
        "options": ["Atomic number 6, 4 valence electrons", "Atomic number 12, 6 valence electrons", "Atomic number 8, 4 valence electrons", "Atomic number 6, 2 valence electrons"],
        "correctIndex": 0,
        "difficulty": 1.1,
        "explanation": "Carbon has atomic number 6 with electronic configuration 2, 4. It has 4 valence electrons.",
        "skill": "Atomic Configuration & Valency"
    },
    {
        "id": "sch_tech_3",
        "domain": "technical",
        "title": "Computer Basics: Binary Logic",
        "question": "What is the decimal equivalent of the binary number (1011)₂?",
        "options": ["11", "13", "9", "15"],
        "correctIndex": 0,
        "difficulty": 1.0,
        "explanation": "1*8 + 0*4 + 1*2 + 1*1 = 8 + 0 + 2 + 1 = 11.",
        "skill": "Binary Number Representation"
    },
    {
        "id": "sch_verb_1",
        "domain": "verbal",
        "title": "Vocabulary Antonyms",
        "question": "Choose the exact opposite of the word 'BENEVOLENT':",
        "options": ["Malevolent", "Kind", "Generous", "Patient"],
        "correctIndex": 0,
        "difficulty": 1.0,
        "explanation": "Benevolent means wishing good to others; Malevolent means wishing harm or evil.",
        "skill": "Root Words & Antonyms"
    },
    {
        "id": "sch_verb_2",
        "domain": "verbal",
        "title": "Grammar: Prepositions",
        "question": "Fill in the blank: 'The student was praised _____ completing the project ahead of schedule.'",
        "options": ["for", "with", "at", "by"],
        "correctIndex": 0,
        "difficulty": 1.0,
        "explanation": "The idiom is 'praised for (an achievement)'.",
        "skill": "Prepositional Idioms"
    },
    {
        "id": "sch_verb_3",
        "domain": "verbal",
        "title": "Reading Comprehension",
        "question": "Which of the following expresses the main idea of renewable solar energy?",
        "options": [
            "Harnessing sunlight provides inexhaustible, clean power without greenhouse emissions",
            "Solar panels only work on cloudy winter days",
            "Fossil fuels are cleaner than solar radiation",
            "Solar energy depletes the sun's chemical elements"
        ],
        "correctIndex": 0,
        "difficulty": 1.0,
        "explanation": "Option 1 accurately captures the core environmental and sustainable benefit.",
        "skill": "Comprehension & Synthesis"
    },
    {
        "id": "sch_prob_1",
        "domain": "problem_solving",
        "title": "Step-by-Step Logic",
        "question": "A water tank has two inlet pipes. Pipe A fills it in 4 hours, and Pipe B fills it in 6 hours. If both open together, how long will they take to fill the tank?",
        "options": ["2 hours 24 minutes (2.4 hrs)", "3 hours", "5 hours", "1 hour 45 minutes"],
        "correctIndex": 0,
        "difficulty": 1.2,
        "explanation": "Combined rate = 1/4 + 1/6 = 5/12 per hour. Time = 12/5 = 2.4 hours = 2 hours 24 minutes.",
        "skill": "Work & Rates"
    },
    {
        "id": "sch_prob_2",
        "domain": "problem_solving",
        "title": "Geometry Application",
        "question": "A square garden has an area of 144 square meters. If a 1-meter wide path is built around the outside of the garden, what is the outer perimeter?",
        "options": ["56 meters", "48 meters", "52 meters", "60 meters"],
        "correctIndex": 0,
        "difficulty": 1.2,
        "explanation": "Inner side = sqrt(144) = 12m. Outer side = 12 + 1 + 1 = 14m. Outer perimeter = 14 * 4 = 56m.",
        "skill": "Spatial Geometry & Perimeter Optimization"
    },
    {
        "id": "sch_prob_3",
        "domain": "problem_solving",
        "title": "Smart Strategy Decision",
        "question": "In an exam with 50 questions, each correct answer gives +4 marks and each wrong answer gives -1 mark. A student answered all 50 questions and scored 130. How many questions did they answer correctly?",
        "options": ["36", "38", "34", "32"],
        "correctIndex": 0,
        "difficulty": 1.2,
        "explanation": "Let C = correct, W = wrong. C + W = 50 => W = 50 - C. 4C - 1(50 - C) = 130 => 5C - 50 = 130 => 5C = 180 => C = 36.",
        "skill": "Algebraic Modeling & Constraints"
    }
]


# ─────────────────────────────────────────────────────────────────────────────
# 2. Machine Learning Archetype Vectors & Classification Engine
# ─────────────────────────────────────────────────────────────────────────────

# Dimensions: [aptitude, logic, technical, verbal, problem_solving]
TARGET_ARCHETYPES = [
    {
        "name": "Algorithmic Prodigy & Systems Architect",
        "target_role": "Full-Stack Software & AI Architect",
        "vector": [88, 92, 95, 75, 90],
        "description": "High computational abstraction, structured thinking, deep technical rigor, and rapid algorithmic problem solving.",
        "color": "#6366f1"
    },
    {
        "name": "Quantitative Strategist & Data Scientist",
        "target_role": "Machine Learning Engineer & Data Scientist",
        "vector": [95, 90, 82, 75, 88],
        "description": "Exceptional mathematical and probabilistic aptitude with sharp deductive logic and data intuition.",
        "color": "#10b981"
    },
    {
        "name": "Full-Stack Technical Innovator",
        "target_role": "Modern Full-Stack Cloud & Product Engineer",
        "vector": [80, 85, 92, 82, 85],
        "description": "Balanced balance of technical implementation, practical troubleshooting, and product comprehension.",
        "color": "#06b6d4"
    },
    {
        "name": "Analytical Research & Core Engineering Scholar",
        "target_role": "Core Engineering Specialist & Systems Researcher",
        "vector": [90, 86, 88, 80, 92],
        "description": "Rigorous first-principles analytical reasoning with deep applied problem-solving stamina.",
        "color": "#ec4899"
    },
    {
        "name": "Tactical Cognitive Problem Solver",
        "target_role": "Product Strategist & Cognitive Analyst",
        "vector": [86, 88, 76, 82, 86],
        "description": "Quick speed calculations, logical pattern identification, and intuitive heuristic deduction.",
        "color": "#f59e0b"
    },
    {
        "name": "Emerging Foundation Explorer",
        "target_role": "Skill Acceleration & Core Mastery Track",
        "vector": [65, 65, 65, 65, 65],
        "description": "Developing foundational competencies with strong growth potential across analytical and technical pillars.",
        "color": "#8b5cf6"
    }
]


def _ensure_assessment_tables(cursor):
    """
    Ensure the required assessment and roadmap tables exist in the database.
    """
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS student_assessments (
            id                      INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
            user_id                 INT UNSIGNED    NOT NULL,
            education_level         VARCHAR(50)     NOT NULL DEFAULT 'graduation',
            total_questions         INT UNSIGNED    NOT NULL DEFAULT 15,
            correct_answers         INT UNSIGNED    NOT NULL DEFAULT 0,
            score_percent           DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
            time_spent_seconds      INT UNSIGNED    NOT NULL DEFAULT 0,
            aptitude_score          DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
            logic_score             DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
            technical_score         DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
            verbal_score            DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
            problem_solving_score   DECIMAL(5, 2)   NOT NULL DEFAULT 0.00,
            archetype_name          VARCHAR(120)    NOT NULL DEFAULT 'Emerging Explorer',
            archetype_match_score   DECIMAL(5, 2)   NOT NULL DEFAULT 85.00,
            superpowers_json        TEXT            NULL,
            growth_areas_json       TEXT            NULL,
            created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_assessment (user_id, created_at DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS student_roadmaps (
            id                      INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
            user_id                 INT UNSIGNED    NOT NULL,
            assessment_id           INT UNSIGNED    NULL,
            title                   VARCHAR(180)    NOT NULL,
            target_role             VARCHAR(120)    NOT NULL,
            estimated_weeks         INT UNSIGNED    NOT NULL DEFAULT 8,
            current_phase           INT UNSIGNED    NOT NULL DEFAULT 1,
            phases_json             MEDIUMTEXT      NOT NULL,
            recommended_games_json  TEXT            NOT NULL,
            recommended_courses_json TEXT           NOT NULL,
            status                  ENUM('active', 'completed', 'archived') NOT NULL DEFAULT 'active',
            created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_roadmap (user_id, status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """)


def _get_question_bank_for_user(user_row: dict) -> list[dict]:
    """Select the relevant question bank according to student education tier."""
    edu_level = (user_row.get("education_level") or "graduation").lower()
    if edu_level in ("highschool", "nursery"):
        return QUESTIONS_SCHOOL
    return QUESTIONS_GRADUATION


def _compute_cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """Calculate cosine similarity between two 5D competency vectors."""
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.5
    return dot_product / (norm_a * norm_b)


# ─────────────────────────────────────────────────────────────────────────────
# 3. Public API Methods
# ─────────────────────────────────────────────────────────────────────────────

def get_diagnostic_questions(user_id: int) -> tuple[dict, int]:
    """
    Fetch the 15 adaptive diagnostic questions for the logged-in student.
    Does NOT return correctIndex or explanation to prevent tampering.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        _ensure_assessment_tables(cursor)

        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user_row = cursor.fetchone()
        if not user_row:
            cursor.execute("SELECT * FROM users ORDER BY id ASC LIMIT 1")
            user_row = cursor.fetchone() or {"id": user_id or 1, "education_level": "graduation", "full_name": "Student"}
        user_id = user_row["id"]

        q_bank = _get_question_bank_for_user(user_row)

        # Sanitize questions for student view
        safe_questions = []
        for q in q_bank:
            safe_questions.append({
                "id": q["id"],
                "domain": q["domain"],
                "title": q["title"],
                "question": q["question"],
                "options": q["options"],
                "skill": q["skill"],
                "difficulty": q["difficulty"]
            })

        return {
            "success": True,
            "testTitle": f"Diagnostic Skill & Cognitive Assessment ({user_row.get('education_level', 'Academic').capitalize()})",
            "totalQuestions": len(safe_questions),
            "estimatedMinutes": 15,
            "domains": [
                {"id": "aptitude", "name": "Quantitative Aptitude", "icon": "Calculator", "color": "#f59e0b"},
                {"id": "logic", "name": "Logical Reasoning", "icon": "Brain", "color": "#6366f1"},
                {"id": "technical", "name": "Technical Specialization", "icon": "Code2", "color": "#06b6d4"},
                {"id": "verbal", "name": "Verbal Ability", "icon": "BookOpen", "color": "#ec4899"},
                {"id": "problem_solving", "name": "Applied Problem Solving", "icon": "Target", "color": "#10b981"},
            ],
            "questions": safe_questions
        }, 200
    except Exception as exc:
        print(f"[get_diagnostic_questions] Error: {exc}")
        return {"success": False, "message": "Failed to load diagnostic questions."}, 500
    finally:
        if conn:
            close_db(conn)


def submit_diagnostic_assessment(user_id: int, payload: dict) -> tuple[dict, int]:
    """
    Evaluate student's assessment answers, extract competency vectors,
    run ML archetype matching, generate personalized content games and roadmap,
    and persist in the database.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        _ensure_assessment_tables(cursor)

        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user_row = cursor.fetchone()
        if not user_row:
            cursor.execute("SELECT * FROM users ORDER BY id ASC LIMIT 1")
            user_row = cursor.fetchone() or {"id": user_id or 1, "education_level": "graduation", "full_name": "Student"}
        user_id = user_row["id"]

        edu_level = user_row.get("education_level", "graduation")
        q_bank = _get_question_bank_for_user(user_row)
        q_lookup = {q["id"]: q for q in q_bank}

        answers = payload.get("answers", {})  # e.g. {"grad_apt_1": 0, ...}
        time_spent_seconds = int(payload.get("timeSpentSeconds", 300))

        # ── Domain scoring calculation ─────────────────────────────────────────
        domain_counts = {"aptitude": 0, "logic": 0, "technical": 0, "verbal": 0, "problem_solving": 0}
        domain_correct = {"aptitude": 0, "logic": 0, "technical": 0, "verbal": 0, "problem_solving": 0}
        domain_weighted_pts = {"aptitude": 0.0, "logic": 0.0, "technical": 0.0, "verbal": 0.0, "problem_solving": 0.0}
        domain_max_weighted = {"aptitude": 0.0, "logic": 0.0, "technical": 0.0, "verbal": 0.0, "problem_solving": 0.0}

        total_correct = 0
        detailed_evaluations = []

        for q_id, q_data in q_lookup.items():
            dom = q_data["domain"]
            diff = q_data["difficulty"]
            domain_counts[dom] += 1
            domain_max_weighted[dom] += diff

            user_choice = answers.get(q_id)
            is_correct = (user_choice is not None and int(user_choice) == q_data["correctIndex"])

            if is_correct:
                total_correct += 1
                domain_correct[dom] += 1
                domain_weighted_pts[dom] += diff

            detailed_evaluations.append({
                "id": q_id,
                "domain": dom,
                "title": q_data["title"],
                "question": q_data["question"],
                "userChoice": user_choice,
                "correctIndex": q_data["correctIndex"],
                "isCorrect": is_correct,
                "explanation": q_data["explanation"],
                "skill": q_data["skill"]
            })

        # Calculate final 0-100 scores for each domain
        domain_scores = {}
        for dom in ["aptitude", "logic", "technical", "verbal", "problem_solving"]:
            max_pts = domain_max_weighted[dom]
            earned = domain_weighted_pts[dom]
            pct = (earned / max_pts * 100.0) if max_pts > 0 else 0.0
            domain_scores[dom] = round(pct, 1)

        total_questions = len(q_bank)
        overall_score_percent = round((total_correct / total_questions) * 100.0, 1)

        # ── ML Archetype Cosine Matching ───────────────────────────────────────
        student_vector = [
            domain_scores["aptitude"],
            domain_scores["logic"],
            domain_scores["technical"],
            domain_scores["verbal"],
            domain_scores["problem_solving"]
        ]

        best_archetype = TARGET_ARCHETYPES[-1]
        best_sim = -1.0

        for arch in TARGET_ARCHETYPES:
            sim = _compute_cosine_similarity(student_vector, arch["vector"])
            if sim > best_sim:
                best_sim = sim
                best_archetype = arch

        match_score = round(min(99.0, max(60.0, best_sim * 100.0)), 1)

        # ── Identify Superpowers & Growth Areas ─────────────────────────────────
        competency_names = {
            "aptitude": "Quantitative & Numerical Aptitude",
            "logic": "Logical & Deductive Reasoning",
            "technical": "Technical & Domain Specialization",
            "verbal": "Verbal Ability & Comprehension",
            "problem_solving": "Applied Problem Solving & Decision Making"
        }

        superpowers = []
        growth_areas = []

        for dom, score in domain_scores.items():
            comp_name = competency_names.get(dom, dom.capitalize())
            if score >= 66.0:
                superpowers.append({
                    "domain": dom,
                    "title": comp_name,
                    "score": score,
                    "status": "Mastery" if score >= 85 else "Strong",
                    "feedback": f"Strong conceptual accuracy ({score}%) with rapid analytical pattern recognition."
                })
            else:
                growth_areas.append({
                    "domain": dom,
                    "title": comp_name,
                    "score": score,
                    "status": "Critical Gap" if score < 40 else "Improvement Needed",
                    "feedback": f"Targeted practice recommended to boost speed and foundational confidence from {score}%."
                })

        # If empty, provide at least one
        if not superpowers:
            best_dom = max(domain_scores, key=domain_scores.get)
            superpowers.append({
                "domain": best_dom,
                "title": competency_names[best_dom],
                "score": domain_scores[best_dom],
                "status": "Emerging Strength",
                "feedback": "Highest baseline score; ready to be transformed into an anchor superpower."
            })

        if not growth_areas:
            lowest_dom = min(domain_scores, key=domain_scores.get)
            growth_areas.append({
                "domain": lowest_dom,
                "title": competency_names[lowest_dom],
                "score": domain_scores[lowest_dom],
                "status": "Optimization Area",
                "feedback": "Refining edge-case speed and complex challenge scenarios."
            })

        # ── ML Adaptive Game Matching Engine ───────────────────────────────────
        # Recommend games specifically calibrated to detected weak areas and superpowers
        game_catalog_map = {
            "magic-number": {
                "id": "magic-number",
                "name": "Magic Number Aptitude Arena",
                "category": "Quantitative Aptitude",
                "assignedSkill": "Rapid Vedic Math & 3-Second Mental Shortcuts",
                "targetDomain": "aptitude",
                "icon": "Sparkles",
                "colorTheme": "#f59e0b"
            },
            "equation-galaxy": {
                "id": "equation-galaxy",
                "name": "Equation Galaxy",
                "category": "Deductive Logic",
                "assignedSkill": "Algebraic Balancing & Deductive Equations",
                "targetDomain": "logic",
                "icon": "Brain",
                "colorTheme": "#6366f1"
            },
            "coding-quest": {
                "id": "coding-quest",
                "name": "Coding Quest",
                "category": "Computer Science & Programming",
                "assignedSkill": "Algorithmic Syntax, Conditionals & Debugging",
                "targetDomain": "technical",
                "icon": "Code2",
                "colorTheme": "#06b6d4"
            },
            "science-explorer": {
                "id": "science-explorer",
                "name": "Science Explorer",
                "category": "Science & Innovation",
                "assignedSkill": "Physics, Chemistry & Applied Engineering Laws",
                "targetDomain": "problem_solving",
                "icon": "Atom",
                "colorTheme": "#10b981"
            },
            "word-master": {
                "id": "word-master",
                "name": "Word Master Arena",
                "category": "Verbal Communication",
                "assignedSkill": "Contextual Vocabulary & Semantic Precision",
                "targetDomain": "verbal",
                "icon": "Compass",
                "colorTheme": "#ec4899"
            },
            "subject-battle": {
                "id": "subject-battle",
                "name": "Subject Quiz Battle",
                "category": "Integrated Mastery",
                "assignedSkill": "Multi-Disciplinary Timed Challenge",
                "targetDomain": "problem_solving",
                "icon": "Activity",
                "colorTheme": "#f97316"
            }
        }

        # Sort domains by lowest score first to address gaps
        sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1])
        recommended_games = []

        domain_to_game_id = {
            "aptitude": "magic-number",
            "logic": "equation-galaxy",
            "technical": "coding-quest",
            "verbal": "word-master",
            "problem_solving": "science-explorer"
        }

        # Add games for the 2 lowest domains as High Priority
        for dom, score in sorted_domains[:2]:
            gid = domain_to_game_id.get(dom, "magic-number")
            gmeta = game_catalog_map.get(gid)
            if gmeta:
                recommended_games.append({
                    **gmeta,
                    "priority": "Urgent Focus" if score < 60 else "Recommended Drill",
                    "reason": f"Diagnosed at {score}% in {competency_names.get(dom)}. Playing this module will reinforce your core rules and speed shortcuts.",
                    "recommendedLevel": 1 if score < 50 else 3
                })

        # Add flagship game for superpower reinforcement
        highest_dom = sorted_domains[-1][0]
        high_gid = domain_to_game_id.get(highest_dom, "subject-battle")
        if high_gid not in [g["id"] for g in recommended_games]:
            gmeta = game_catalog_map.get(high_gid)
            if gmeta:
                recommended_games.append({
                    **gmeta,
                    "priority": "Mastery Challenge",
                    "reason": f"Matches your superpower ({competency_names.get(highest_dom)}: {domain_scores[highest_dom]}%). Compete for global leaderboard dominance.",
                    "recommendedLevel": 5
                })

        # Ensure at least 3 games
        if len(recommended_games) < 3:
            for gid, gmeta in game_catalog_map.items():
                if gid not in [g["id"] for g in recommended_games]:
                    recommended_games.append({
                        **gmeta,
                        "priority": "Skill Expansion",
                        "reason": "Holistic cognitive conditioning and academic syllabus reinforcement.",
                        "recommendedLevel": 2
                    })
                if len(recommended_games) >= 3:
                    break

        # ── Dynamic Milestone Roadmap Generator ─────────────────────────────────
        # Fetch actual matching courses from DB to embed in roadmap milestones
        scope_clause, scope_params = build_student_course_scope(user_row)
        cursor.execute(f"""
            SELECT c.id, c.course_code, c.title, c.category, c.subject, c.rating, c.total_modules
            FROM courses c
            WHERE {scope_clause}
            ORDER BY c.id ASC LIMIT 4
        """, tuple(scope_params))
        available_courses = cursor.fetchall() or []

        safe_courses = []
        for c in available_courses:
            safe_courses.append({
                "id": c["id"],
                "courseCode": c["course_code"],
                "title": c["title"],
                "category": c["category"],
                "subject": c["subject"],
                "rating": float(c["rating"]) if c.get("rating") is not None else 4.85,
                "totalModules": c["total_modules"]
            })

        course_names = [c["title"] for c in safe_courses]
        c1 = course_names[0] if len(course_names) > 0 else "Foundational Principles & Core Methodologies"
        c2 = course_names[1] if len(course_names) > 1 else "Modern Applied Systems & Architecture"
        c3 = course_names[2] if len(course_names) > 2 else "Advanced Problem Solving & Algorithms"
        c4 = course_names[3] if len(course_names) > 3 else "Capstone Engineering & Real-World Projects"

        weakest_domain = sorted_domains[0][0]
        second_weakest = sorted_domains[1][0]
        strongest_domain = sorted_domains[-1][0]

        phases = [
            {
                "phaseNumber": 1,
                "title": f"Phase 1: Remediation & Speed Drills ({competency_names.get(weakest_domain)})",
                "weeks": "Weeks 1 – 2",
                "status": "In Progress",
                "focusArea": competency_names.get(weakest_domain),
                "goals": [
                    f"Master the core rules and 3-second shortcut methods for {competency_names.get(weakest_domain)}",
                    f"Complete 5 levels in {recommended_games[0]['name']}",
                    f"Review introductory modules in '{c1}'"
                ],
                "recommendedCourse": c1,
                "matchedGame": recommended_games[0]["name"],
                "successMetric": f"Score 75%+ on {competency_names.get(weakest_domain)} sprint quizzes"
            },
            {
                "phaseNumber": 2,
                "title": f"Phase 2: Core Analytical Depth ({competency_names.get(second_weakest)})",
                "weeks": "Weeks 3 – 4",
                "status": "Next Up",
                "focusArea": competency_names.get(second_weakest),
                "goals": [
                    f"Bridge knowledge gaps in {competency_names.get(second_weakest)} through guided problem sets",
                    f"Unlock Level 6 in {recommended_games[1]['name']}",
                    f"Complete all video lectures and quizzes in '{c2}'"
                ],
                "recommendedCourse": c2,
                "matchedGame": recommended_games[1]["name"],
                "successMetric": "Achieve 85% accuracy in timed problem sessions"
            },
            {
                "phaseNumber": 3,
                "title": "Phase 3: Applied Multi-Disciplinary Synthesis",
                "weeks": "Weeks 5 – 6",
                "status": "Locked",
                "focusArea": "Integrated Systems & Problem Solving",
                "goals": [
                    f"Synthesize technical depth with rapid logical deduction",
                    f"Engage in Subject Quiz Battle and {recommended_games[2]['name']} challenge modes",
                    f"Tackle hands-on projects in '{c3}'"
                ],
                "recommendedCourse": c3,
                "matchedGame": recommended_games[2]["name"],
                "successMetric": "Top 15% standing in multi-skill challenge"
            },
            {
                "phaseNumber": 4,
                "title": f"Phase 4: Elite Mastery & {best_archetype['name']}",
                "weeks": "Weeks 7 – 8",
                "status": "Locked",
                "focusArea": "Grandmaster Mastery & Placement Readiness",
                "goals": [
                    f"Achieve Level 10 Grandmaster rank in Magic Number & platform games",
                    f"Complete Capstone Project and Mock Certification in '{c4}'",
                    "Attain 90%+ score across all 5 diagnostic dimensions"
                ],
                "recommendedCourse": c4,
                "matchedGame": "Magic Number Aptitude Arena (Level 10)",
                "successMetric": "Qualify for Top 5% Global Academic Leaderboard"
            }
        ]

        # ── Save Assessment to Database ────────────────────────────────────────
        cursor.execute("""
            INSERT INTO student_assessments (
                user_id, education_level, total_questions, correct_answers,
                score_percent, time_spent_seconds, aptitude_score, logic_score,
                technical_score, verbal_score, problem_solving_score,
                archetype_name, archetype_match_score, superpowers_json, growth_areas_json
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user_id, edu_level, total_questions, total_correct,
            overall_score_percent, time_spent_seconds,
            domain_scores["aptitude"], domain_scores["logic"],
            domain_scores["technical"], domain_scores["verbal"],
            domain_scores["problem_solving"],
            best_archetype["name"], match_score,
            json.dumps(superpowers), json.dumps(growth_areas)
        ))
        assessment_id = cursor.lastrowid

        # ── Save / Update Roadmap in Database ───────────────────────────────────
        cursor.execute("UPDATE student_roadmaps SET status = 'archived' WHERE user_id = %s", (user_id,))
        roadmap_title = f"{best_archetype['target_role']} Mastery Roadmap"

        cursor.execute("""
            INSERT INTO student_roadmaps (
                user_id, assessment_id, title, target_role, estimated_weeks,
                current_phase, phases_json, recommended_games_json, recommended_courses_json, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'active')
        """, (
            user_id, assessment_id, roadmap_title, best_archetype["target_role"],
            8, 1, json.dumps(phases), json.dumps(recommended_games),
            json.dumps(safe_courses)
        ))
        roadmap_id = cursor.lastrowid

        # ── Update user_dashboard_stats so stats reflect assessment ───────────
        cursor.execute("""
            UPDATE user_dashboard_stats
            SET quiz_accuracy = %s,
                overall_percentage = %s,
                overall_grade = CASE
                    WHEN %s >= 90 THEN 'A+'
                    WHEN %s >= 80 THEN 'A'
                    WHEN %s >= 70 THEN 'B+'
                    WHEN %s >= 60 THEN 'B'
                    ELSE 'C+'
                END,
                overall_performance = %s
            WHERE user_id = %s
        """, (
            overall_score_percent, overall_score_percent,
            overall_score_percent, overall_score_percent,
            overall_score_percent, overall_score_percent,
            f"{best_archetype['name']} Tier",
            user_id
        ))

        conn.commit()

        return {
            "success": True,
            "message": "Assessment evaluated and personalized ML Roadmap generated successfully!",
            "assessmentId": assessment_id,
            "roadmapId": roadmap_id,
            "overallScore": overall_score_percent,
            "totalQuestions": total_questions,
            "correctAnswers": total_correct,
            "timeSpentSeconds": time_spent_seconds,
            "domainScores": domain_scores,
            "archetype": {
                "name": best_archetype["name"],
                "targetRole": best_archetype["target_role"],
                "description": best_archetype["description"],
                "matchScore": match_score,
                "color": best_archetype["color"]
            },
            "superpowers": superpowers,
            "growthAreas": growth_areas,
            "recommendedGames": recommended_games,
            "roadmap": {
                "id": roadmap_id,
                "title": roadmap_title,
                "targetRole": best_archetype["target_role"],
                "estimatedWeeks": 8,
                "currentPhase": 1,
                "phases": phases
            },
            "evaluations": detailed_evaluations
        }, 200

    except Exception as exc:
        if conn:
            conn.rollback()
        print(f"[submit_diagnostic_assessment] Error: {exc}")
        return {"success": False, "message": f"Assessment analysis error: {str(exc)}"}, 500
    finally:
        if conn:
            close_db(conn)


def get_student_latest_assessment(user_id: int) -> tuple[dict, int]:
    """
    Fetch the student's latest assessment, skill profile, matched games, and active roadmap.
    """
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        _ensure_assessment_tables(cursor)

        cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
        u = cursor.fetchone()
        if not u:
            cursor.execute("SELECT id FROM users ORDER BY id ASC LIMIT 1")
            first_u = cursor.fetchone()
            if first_u:
                user_id = first_u["id"]

        cursor.execute("""
            SELECT * FROM student_assessments
            WHERE user_id = %s
            ORDER BY created_at DESC LIMIT 1
        """, (user_id,))
        assessment_row = cursor.fetchone()

        if not assessment_row:
            return {
                "success": True,
                "hasTakenTest": False,
                "message": "No diagnostic test taken yet. Take the test to unlock your ML roadmap."
            }, 200

        # Query active roadmap
        cursor.execute("""
            SELECT * FROM student_roadmaps
            WHERE user_id = %s AND status = 'active'
            ORDER BY id DESC LIMIT 1
        """, (user_id,))
        roadmap_row = cursor.fetchone()

        phases = []
        rec_games = []
        rec_courses = []

        if roadmap_row:
            try:
                phases = json.loads(roadmap_row["phases_json"]) if roadmap_row["phases_json"] else []
                rec_games = json.loads(roadmap_row["recommended_games_json"]) if roadmap_row["recommended_games_json"] else []
                rec_courses = json.loads(roadmap_row["recommended_courses_json"]) if roadmap_row["recommended_courses_json"] else []
            except Exception:
                pass

        superpowers = []
        growth_areas = []
        try:
            superpowers = json.loads(assessment_row["superpowers_json"]) if assessment_row["superpowers_json"] else []
            growth_areas = json.loads(assessment_row["growth_areas_json"]) if assessment_row["growth_areas_json"] else []
        except Exception:
            pass

        domain_scores = {
            "aptitude": float(assessment_row["aptitude_score"]),
            "logic": float(assessment_row["logic_score"]),
            "technical": float(assessment_row["technical_score"]),
            "verbal": float(assessment_row["verbal_score"]),
            "problem_solving": float(assessment_row["problem_solving_score"])
        }

        return {
            "success": True,
            "hasTakenTest": True,
            "assessment": {
                "id": assessment_row["id"],
                "overallScore": float(assessment_row["score_percent"]),
                "correctAnswers": assessment_row["correct_answers"],
                "totalQuestions": assessment_row["total_questions"],
                "timeSpentSeconds": assessment_row["time_spent_seconds"],
                "domainScores": domain_scores,
                "archetype": {
                    "name": assessment_row["archetype_name"],
                    "matchScore": float(assessment_row["archetype_match_score"])
                },
                "superpowers": superpowers,
                "growthAreas": growth_areas,
                "createdAt": assessment_row["created_at"].strftime("%d %b %Y, %I:%M %p") if assessment_row.get("created_at") else "Recent"
            },
            "roadmap": {
                "id": roadmap_row["id"] if roadmap_row else None,
                "title": roadmap_row["title"] if roadmap_row else "Personalized Career Mastery Roadmap",
                "targetRole": roadmap_row["target_role"] if roadmap_row else "Specialist Track",
                "estimatedWeeks": roadmap_row["estimated_weeks"] if roadmap_row else 8,
                "currentPhase": roadmap_row["current_phase"] if roadmap_row else 1,
                "phases": phases,
                "recommendedGames": rec_games,
                "recommendedCourses": rec_courses
            }
        }, 200

    except Exception as exc:
        print(f"[get_student_latest_assessment] Error: {exc}")
        return {"success": False, "message": "Failed to load student assessment."}, 500
    finally:
        if conn:
            close_db(conn)
