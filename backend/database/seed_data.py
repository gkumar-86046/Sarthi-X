"""
database/seed_data.py  –  Seed real courses, live sessions, and sample curriculum into MySQL.
Includes distinct branches/streams (B.Tech, MBBS, B.Com, BCA, School Class 9/10/11/12/Primary)
for strict profile-based isolation.
"""

from pathlib import Path
import os
import sys

_backend_dir = Path(__file__).resolve().parent.parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from dotenv import load_dotenv
load_dotenv(_backend_dir / ".env", override=True)

from database.connection import get_db, close_db


COURSES_DATA = [
    # ── Graduation: B.Tech / B.E (Engineering) ──────────────────────────────
    {
        "course_code": "cs-ai-grad",
        "title": "Advanced AI & Machine Learning Fundamentals",
        "education_level": "graduation",
        "target_field": "B.Tech / B.E (Engineering)",
        "category": "Computer Science & AI",
        "subject": "Artificial Intelligence",
        "instructor": "Dr. Evelyn Reed (Head AI Faculty)",
        "rating": 4.95,
        "total_modules": 6,
        "total_lessons": 18,
        "thumbnail_bg": "linear-gradient(135deg, rgba(99, 102, 241, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Master deep neural networks, computer vision, natural language processing, and production deployment with PyTorch and Scikit-Learn.",
        "modules": [
            ("Module 1: Foundations of Machine Learning & Math", "Linear algebra, vector spaces, gradient descent optimization", "Completed", 100),
            ("Module 2: Supervised Learning & Regression Models", "Linear and logistic regression, decision trees, random forests", "In Progress", 60),
            ("Module 3: Neural Networks & Backpropagation", "Perceptrons, multi-layer networks, activation functions", "Next Up", 0),
            ("Module 4: Convolutional Neural Networks (CNN)", "Image classification, convolution filters, pooling, transfer learning", "Next Up", 0),
            ("Module 5: Natural Language Processing & Transformers", "Attention mechanisms, BERT, GPT architecture foundations", "Next Up", 0),
            ("Module 6: Capstone Project & Model Serving", "Deploying models with FastAPI, Docker, and ONNX runtime", "Next Up", 0),
        ]
    },
    {
        "course_code": "cs-web-react",
        "title": "Modern Web Development & React 19",
        "education_level": "graduation",
        "target_field": "B.Tech / B.E (Engineering)",
        "category": "Software Engineering",
        "subject": "Web Development",
        "instructor": "Sarah Jenkins (Lead Frontend Architect)",
        "rating": 4.90,
        "total_modules": 5,
        "total_lessons": 15,
        "thumbnail_bg": "linear-gradient(135deg, rgba(6, 182, 212, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Full-stack modern application development covering React 19 Actions, Server Components, Vite, State Management, and REST/GraphQL APIs.",
        "modules": [
            ("Module 1: Modern JavaScript & React 19 Core", "Hooks deep-dive, useOptimistic, useActionState, compiler architecture", "Completed", 100),
            ("Module 2: Advanced State Architecture & Context", "Zustand, Context optimization, custom reducer patterns", "Completed", 100),
            ("Module 3: Fullstack API Integration & JWT Security", "Axios interceptors, token refresh lifecycle, error boundaries", "In Progress", 80),
            ("Module 4: Performance, CSS Design Systems & Animations", "Glassmorphism design tokens, CSS variables, micro-interactions", "Next Up", 0),
            ("Module 5: Production Deployment & CI/CD", "Vercel, Docker containerization, Lighthouse audit optimization", "Next Up", 0),
        ]
    },
    {
        "course_code": "cs-dsa-grad",
        "title": "Data Structures & Algorithms Mastery",
        "education_level": "graduation",
        "target_field": "B.Tech / B.E (Engineering)",
        "category": "Core Computer Science",
        "subject": "Data Structures",
        "instructor": "Prof. Marcus Vance",
        "rating": 4.88,
        "total_modules": 6,
        "total_lessons": 18,
        "thumbnail_bg": "linear-gradient(135deg, rgba(16, 185, 129, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Comprehensive preparation for technical interviews: trees, graphs, dynamic programming, heaps, and asymptotic complexity.",
        "modules": [
            ("Module 1: Arrays, Linked Lists & Strings", "Two-pointer approach, sliding window, memory allocation", "Completed", 100),
            ("Module 2: Stacks, Queues & Priority Queues", "Monotonic stack, circular buffer, heap implementations", "In Progress", 50),
            ("Module 3: Binary Trees & BST", "Tree traversals, AVL trees, lowest common ancestor", "Next Up", 0),
            ("Module 4: Graphs & Shortest Paths", "BFS, DFS, Dijkstra, Bellman-Ford, Topological Sort", "Next Up", 0),
            ("Module 5: Dynamic Programming", "Memoization, tabulation, knapsack, LCS, matrix chain", "Next Up", 0),
            ("Module 6: Advanced Strings & Bit Manipulation", "Trie, KMP string search, bitwise optimizations", "Next Up", 0),
        ]
    },
    {
        "course_code": "btech-devops",
        "title": "Cloud Computing & DevOps Engineering",
        "education_level": "graduation",
        "target_field": "B.Tech / B.E (Engineering)",
        "category": "Cloud Infrastructure",
        "subject": "Cloud Computing",
        "instructor": "Alex Rivera (Cloud Solutions Architect)",
        "rating": 4.92,
        "total_modules": 4,
        "total_lessons": 12,
        "thumbnail_bg": "linear-gradient(135deg, rgba(245, 158, 11, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Docker containerization, Kubernetes cluster orchestration, GitHub Actions CI/CD pipelines, and AWS Terraform deployments.",
        "modules": [
            ("Module 1: Linux Kernel, Shell & Networking", "Process management, memory virtualisation, socket programming", "Completed", 100),
            ("Module 2: Docker Containers & Registry", "Multi-stage builds, Docker compose, container networking", "In Progress", 40),
            ("Module 3: Kubernetes Architecture & Ingress", "Pods, Deployments, Services, ConfigMaps and Secrets", "Next Up", 0),
            ("Module 4: CI/CD Automation & Terraform", "Infrastructure as Code, AWS ECS/EKS deployment workflows", "Next Up", 0),
        ]
    },

    # ── Graduation: MBBS (Medical) ──────────────────────────────────────────
    {
        "course_code": "med-anat-mbbs",
        "title": "Human Gross Anatomy & Clinical Embryology",
        "education_level": "graduation",
        "target_field": "MBBS (Medical)",
        "category": "Medical Sciences",
        "subject": "Human Anatomy",
        "instructor": "Dr. Rajesh Khanna (MD Anatomy)",
        "rating": 4.96,
        "total_modules": 4,
        "total_lessons": 12,
        "thumbnail_bg": "linear-gradient(135deg, rgba(244, 63, 94, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Comprehensive regional study of thorax, abdomen, pelvis, neuroanatomy, and cross-sectional radiological correlations.",
        "modules": [
            ("Module 1: General Histology & Embryological Development", "Epithelium, connective tissue, gametogenesis, germ layers", "Next Up", 0),
            ("Module 2: Thorax, Cardiovascular & Respiratory Anatomy", "Heart chambers, coronary circulation, lungs, mediastinum", "Next Up", 0),
            ("Module 3: Neuroanatomy & Cranial Nerves", "Brainstem, cerebral cortex, spinal pathways, cranial reflexes", "Next Up", 0),
            ("Module 4: Clinical Anatomy & Cadaver Dissection", "Applied surgical landmarks, vascular supply, clinical cases", "Next Up", 0),
        ]
    },

    # ── Graduation: B.Com (Bachelor of Commerce) ───────────────────────────
    {
        "course_code": "bcom-corp-fin",
        "title": "Corporate Financial Accounting & Indian AS",
        "education_level": "graduation",
        "target_field": "B.Com (Bachelor of Commerce)",
        "category": "Finance & Commerce",
        "subject": "Accounting",
        "instructor": "CA Manisha Bansal",
        "rating": 4.87,
        "total_modules": 4,
        "total_lessons": 12,
        "thumbnail_bg": "linear-gradient(135deg, rgba(16, 185, 129, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Preparation of financial statements, cash flow analysis, corporate restructuring, and GST taxation compliance.",
        "modules": [
            ("Module 1: Advanced Share Capital & Debentures", "Issue, forfeiture and re-issue of shares, redemption of debentures", "Next Up", 0),
            ("Module 2: Cash Flow Statements & Ratio Analysis", "Operating, investing and financing activities under AS-3", "Next Up", 0),
            ("Module 3: Corporate Restructuring & Amalgamation", "Purchase consideration, pooling of interest, merger accounting", "Next Up", 0),
            ("Module 4: Goods & Services Tax (GST) Practices", "Input tax credit, reverse charge mechanism, GST return filing", "Next Up", 0),
        ]
    },

    # ── Graduation: BCA (Computer Applications) ─────────────────────────────
    {
        "course_code": "bca-dbms-sql",
        "title": "Database Management Systems & Advanced SQL",
        "education_level": "graduation",
        "target_field": "BCA (Computer Applications)",
        "category": "Database Engineering",
        "subject": "Database Systems",
        "instructor": "Vikram Sethi",
        "rating": 4.85,
        "total_modules": 4,
        "total_lessons": 12,
        "thumbnail_bg": "linear-gradient(135deg, rgba(139, 92, 246, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Relational algebra, ER modeling, normalization forms, indexing, ACID transactions, and complex query optimizations.",
        "modules": [
            ("Module 1: Relational Model & SQL DDL/DML", "Tables, foreign keys, constraints, basic and nested SQL queries", "Next Up", 0),
            ("Module 2: Normalization (1NF to BCNF)", "Functional dependencies, lossless join decomposition, multi-valued dependencies", "Next Up", 0),
            ("Module 3: Transactions & Concurrency Control", "ACID guarantees, two-phase locking, serializability, recovery logs", "Next Up", 0),
            ("Module 4: Storage Engines & Indexing Architectures", "B+ Trees, hash indexing, query execution planning, EXPLAIN", "Next Up", 0),
        ]
    },

    # ── Intermediate (Class 11 / 12) ─────────────────────────────────────────
    {
        "course_code": "phys-12",
        "title": "Class 12th Physics: Electrodynamics & Modern Physics",
        "education_level": "intermediate",
        "target_field": "12th (2nd Year)",
        "category": "Science & Engineering Foundation",
        "subject": "Physics",
        "instructor": "Dr. Evelyn Reed (Head Faculty)",
        "rating": 4.90,
        "total_modules": 4,
        "total_lessons": 12,
        "thumbnail_bg": "linear-gradient(135deg, rgba(6, 182, 212, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Comprehensive Class 12th Physics syllabus covering electrostatics, current electricity, optics, and modern physics.",
        "modules": [
            ("Module 1: Electrostatics & Electric Potential", "Coulomb’s law, electric field lines, Gauss theorem, and potential energy", "Completed", 100),
            ("Module 2: Current Electricity & Kirchhoff’s Laws", "Drift velocity, Ohm’s law, Kirchhoff’s rules, and Wheatstone bridge", "In Progress", 60),
            ("Module 3: Magnetism & Electromagnetic Induction", "Biot-Savart law, Ampere’s law, Faraday’s law, and Lenz’s law", "Next Up", 0),
            ("Module 4: Ray Optics & Modern Physics", "Reflection, refraction, lensmaker formula, photoelectric effect", "Next Up", 0),
        ]
    },
    {
        "course_code": "math-12",
        "title": "Class 12th Mathematics: Calculus & Vectors",
        "education_level": "intermediate",
        "target_field": "12th (2nd Year)",
        "category": "Mathematics & Logic",
        "subject": "Mathematics",
        "instructor": "Prof. Marcus Vance",
        "rating": 4.92,
        "total_modules": 4,
        "total_lessons": 12,
        "thumbnail_bg": "linear-gradient(135deg, rgba(99, 102, 241, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Complete Class 12th Calculus syllabus: Continuity, Differentiability, Integrals, Differential Equations, and 3D Vectors.",
        "modules": [
            ("Module 1: Relations, Functions & Inverse Trigonometry", "Types of relations, domain and range, principal value branch", "Completed", 100),
            ("Module 2: Continuity, Differentiability & Derivatives", "Chain rule, parametric differentiation, implicit functions", "Completed", 100),
            ("Module 3: Applications of Derivatives & Integrals", "Rate of change, maxima and minima, definite and indefinite integrals", "In Progress", 75),
            ("Module 4: Vector Algebra & 3D Geometry", "Dot and cross product, direction cosines, shortest distance between lines", "Next Up", 0),
        ]
    },
    {
        "course_code": "chem-11",
        "title": "Class 11th Chemistry: Atomic Structure & Chemical Bonding",
        "education_level": "intermediate",
        "target_field": "11th (1st Year)",
        "category": "Chemical Sciences",
        "subject": "Chemistry",
        "instructor": "Dr. Anita Roy",
        "rating": 4.88,
        "total_modules": 4,
        "total_lessons": 12,
        "thumbnail_bg": "linear-gradient(135deg, rgba(236, 72, 153, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Foundational chemistry covering quantum numbers, periodic trends, VSEPR theory, hybridization, and thermodynamics.",
        "modules": [
            ("Module 1: Some Basic Concepts of Chemistry & Mole Concept", "Empirical formula, molar mass, stoichiometry, concentration units", "Next Up", 0),
            ("Module 2: Structure of Atom & Quantum Mechanics", "Bohr model, de Broglie relation, Heisenberg uncertainty, orbitals", "Next Up", 0),
            ("Module 3: Chemical Bonding & Molecular Structure", "Ionic and covalent bonds, Lewis structures, VSEPR, hybridization", "Next Up", 0),
            ("Module 4: Chemical Thermodynamics & Equilibrium", "First and second law of thermodynamics, enthalpy, Le Chatelier principle", "Next Up", 0),
        ]
    },

    # ── High School (Class 9 / 10) ──────────────────────────────────────────
    {
        "course_code": "sci-10",
        "title": "Class 10th Comprehensive Science: Physics, Chemistry & Biology",
        "education_level": "highschool",
        "target_field": "Class 10",
        "category": "High School Science",
        "subject": "Science",
        "instructor": "Dr. Evelyn Reed",
        "rating": 4.88,
        "total_modules": 4,
        "total_lessons": 12,
        "thumbnail_bg": "linear-gradient(135deg, rgba(16, 185, 129, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Essential board exam preparation covering Light Reflection & Refraction, Electricity, Chemical Reactions, and Life Processes.",
        "modules": [
            ("Module 1: Chemical Reactions & Equations", "Types of reactions, balancing equations, oxidation and reduction", "Completed", 100),
            ("Module 2: Light: Reflection and Refraction", "Mirror formula, Snell's law, lens formula, power of lens", "In Progress", 70),
            ("Module 3: Electricity & Magnetic Effects", "Ohm's law, series/parallel combinations, right-hand thumb rule", "Next Up", 0),
            ("Module 4: Life Processes & Our Environment", "Nutrition, respiration, circulation, ecosystems and food chains", "Next Up", 0),
        ]
    },
    {
        "course_code": "math-9",
        "title": "Class 9th Mathematics: Polynomials, Triangles & Coordinate Geometry",
        "education_level": "highschool",
        "target_field": "Class 9",
        "category": "High School Mathematics",
        "subject": "Mathematics",
        "instructor": "Prof. Marcus Vance",
        "rating": 4.86,
        "total_modules": 4,
        "total_lessons": 12,
        "thumbnail_bg": "linear-gradient(135deg, rgba(99, 102, 241, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Core Class 9th CBSE mathematics covering Real Numbers, Remainder Theorem, Congruence of Triangles, and Heron's Formula.",
        "modules": [
            ("Module 1: Number Systems & Rational Numbers", "Irrational numbers, real numbers and decimal expansions, laws of exponents", "Next Up", 0),
            ("Module 2: Polynomials & Algebraic Identities", "Factor theorem, zeroes of a polynomial, cubic and quadratic factoring", "Next Up", 0),
            ("Module 3: Coordinate Geometry & Linear Equations", "Cartesian plane, quadrants, plotting points, solutions of 2-variable equations", "Next Up", 0),
            ("Module 4: Lines, Angles & Triangles Congruence", "Axioms and theorems, SAS, ASA, SSS congruence criteria", "Next Up", 0),
        ]
    },

    # ── Nursery / Primary ───────────────────────────────────────────────────
    {
        "course_code": "found-math-1",
        "title": "Foundational Mathematics & Logical Reasoning (Primary)",
        "education_level": "nursery",
        "target_field": "Class 1",
        "category": "Primary Education",
        "subject": "Mathematics",
        "instructor": "Priya Sharma",
        "rating": 4.85,
        "total_modules": 4,
        "total_lessons": 12,
        "thumbnail_bg": "linear-gradient(135deg, rgba(245, 158, 11, 0.45), rgba(15, 23, 42, 0.95))",
        "description": "Interactive learning games, mental arithmetic, geometry shapes, fractions, and everyday problem-solving.",
        "modules": [
            ("Module 1: Numbers & Basic Operations", "Addition, subtraction, multiplication tables, number lines", "Completed", 100),
            ("Module 2: Shapes, Geometry & Patterns", "2D and 3D shapes, symmetry, spatial awareness games", "In Progress", 60),
            ("Module 3: Fractions, Time & Measurement", "Clock reading, calendar math, basic fraction slices", "Next Up", 0),
            ("Module 4: Everyday Logic & Story Problems", "Word puzzles, budgeting play, logical sequences", "Next Up", 0),
        ]
    },
]

SESSIONS_DATA = [
    ("graduation", "B.Tech Live System Design & Microservices Masterclass", "Saturday, 2:00 PM", "Sarah Jenkins", "Software Engineering"),
    ("graduation", "AI & Deep Learning Hands-on Model Training", "Sunday, 11:00 AM", "Dr. Evelyn Reed", "Artificial Intelligence"),
    ("intermediate", "Class 12th Calculus Mock Assessment Sprint", "Friday, 5:00 PM", "Prof. Marcus Vance", "Mathematics"),
    ("intermediate", "Class 12th Physics Doubt Solving Clinic", "Today, 4:00 PM", "Dr. Evelyn Reed", "Physics"),
    ("highschool", "Class 10th Science Board Exam Strategy", "Thursday, 6:00 PM", "Dr. Evelyn Reed", "Science"),
    ("nursery", "Fun Primary Math Quest & Animated Quiz Game", "Sunday, 10:00 AM", "Priya Sharma", "Mathematics"),
]


def seed():
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        print("[seed] Seeding targeted courses into MySQL...")

        for c in COURSES_DATA:
            cursor.execute("SELECT id FROM courses WHERE course_code = %s", (c["course_code"],))
            existing = cursor.fetchone()

            if existing:
                course_id = existing["id"]
                cursor.execute("""
                    UPDATE courses SET
                        title = %s, education_level = %s, target_field = %s,
                        category = %s, subject = %s, instructor = %s,
                        rating = %s, total_modules = %s, total_lessons = %s,
                        thumbnail_bg = %s, description = %s
                    WHERE id = %s
                """, (
                    c["title"], c["education_level"], c.get("target_field"),
                    c["category"], c["subject"], c["instructor"],
                    c["rating"], c["total_modules"], c["total_lessons"],
                    c["thumbnail_bg"], c["description"], course_id
                ))
            else:
                cursor.execute("""
                    INSERT INTO courses (
                        course_code, title, education_level, target_field,
                        category, subject, instructor, rating,
                        total_modules, total_lessons, thumbnail_bg, description
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    c["course_code"], c["title"], c["education_level"], c.get("target_field"),
                    c["category"], c["subject"], c["instructor"],
                    c["rating"], c["total_modules"], c["total_lessons"],
                    c["thumbnail_bg"], c["description"]
                ))
                course_id = cursor.lastrowid

            # Seed modules & lessons
            for idx, (m_title, m_desc, m_status, m_prog) in enumerate(c["modules"], 1):
                cursor.execute("""
                    SELECT id FROM course_modules
                    WHERE course_id = %s AND module_number = %s
                """, (course_id, idx))
                mod_row = cursor.fetchone()

                if mod_row:
                    module_id = mod_row["id"]
                    cursor.execute("""
                        UPDATE course_modules SET
                            title = %s, description = %s, status = %s, progress = %s
                        WHERE id = %s
                    """, (m_title, m_desc, m_status, m_prog, module_id))
                else:
                    cursor.execute("""
                        INSERT INTO course_modules (course_id, module_number, title, description, status, progress)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (course_id, idx, m_title, m_desc, m_status, m_prog))
                    module_id = cursor.lastrowid

                # Ensure 3 high-quality lessons per module with streaming URL
                cursor.execute("SELECT COUNT(*) AS cnt FROM course_lessons WHERE module_id = %s", (module_id,))
                lesson_count = cursor.fetchone()["cnt"]
                if lesson_count == 0:
                    cursor.execute("""
                        INSERT INTO course_lessons (module_id, lesson_number, lesson_type, title, duration, content_url, is_preview)
                        VALUES (%s, 1, 'video', %s, '35 mins', %s, %s)
                    """, (
                        module_id,
                        f"{idx}.1 Video Masterclass: {m_title}",
                        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        1 if idx == 1 else 0
                    ))

                    cursor.execute("""
                        INSERT INTO course_lessons (module_id, lesson_number, lesson_type, title, file_size, content_url, is_preview)
                        VALUES (%s, 2, 'pdf', %s, '2.8 MB', %s, 0)
                    """, (
                        module_id,
                        f"Admin Verified Notes: {m_title} Comprehensive Guide",
                        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                    ))

                    cursor.execute("""
                        INSERT INTO course_lessons (module_id, lesson_number, lesson_type, title, questions_count, content_url, is_preview)
                        VALUES (%s, 3, 'quiz', %s, 15, %s, 0)
                    """, (
                        module_id,
                        f"Module {idx} Practice & Concept Assessment Quiz",
                        "https://forms.gle/sampleQuizUrl"
                    ))

        # Seed upcoming sessions if empty
        cursor.execute("SELECT COUNT(*) AS cnt FROM upcoming_sessions")
        count_res = cursor.fetchone()
        if count_res and count_res["cnt"] == 0:
            print("[seed] Seeding upcoming live sessions...")
            for s in SESSIONS_DATA:
                cursor.execute("""
                    INSERT INTO upcoming_sessions (education_level, title, session_time, instructor, subject)
                    VALUES (%s, %s, %s, %s, %s)
                """, s)

        conn.commit()
        print("[seed] Seeding completed successfully!")

    except Exception as e:
        conn.rollback()
        print(f"[seed] Error during seeding: {e}")
        raise e
    finally:
        close_db(conn)


if __name__ == "__main__":
    seed()
