"""
gamezone/magic_number_bank.py  –  Comprehensive 10-Level Question Bank,
Vedic/Aptitude Magic Tricks, Step-by-Step Methods, and Cognitive Rating Rules.
"""

import os
import sys
import re
import random

_magic_number_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Magic_Number")
if _magic_number_dir not in sys.path:
    sys.path.insert(0, _magic_number_dir)

try:
    import a as a_game
    import aptitude as apt_game
except Exception as _err:
    a_game = None
    apt_game = None


# ─────────────────────────────────────────────────────────────────────────────
# Aptitude Level Classification
# ─────────────────────────────────────────────────────────────────────────────
APTITUDE_LEVELS = [
    {
        "min_score": 250,
        "title": "Grandmaster Prodigy",
        "badge": "🌌",
        "description": "Elite Olympiad-grade mental agility. Lightning-fast numerical deduction.",
        "percentile": "Top 1%",
        "iq_range": "135 - 145+"
    },
    {
        "min_score": 180,
        "title": "Elite Problem Solver",
        "badge": "⚡",
        "description": "Mastery over complex multi-step word problems, speed ratios, and combinatorics.",
        "percentile": "Top 5%",
        "iq_range": "120 - 134"
    },
    {
        "min_score": 120,
        "title": "Tactical Calculator",
        "badge": "🎯",
        "description": "High proficiency in mental shortcuts, algebraic substitutions, and percentage splits.",
        "percentile": "Top 15%",
        "iq_range": "110 - 119"
    },
    {
        "min_score": 60,
        "title": "Pattern Analyst",
        "badge": "🧩",
        "description": "Strong foundational number sense, arithmetic speed, and ratio comprehension.",
        "percentile": "Top 35%",
        "iq_range": "100 - 109"
    },
    {
        "min_score": 0,
        "title": "Novice Reckoner",
        "badge": "🌱",
        "description": "Building essential numerical intuition and arithmetic fluency.",
        "percentile": "Baseline",
        "iq_range": "90 - 99"
    }
]

# Points awarded per level
POINTS_PER_LEVEL = {
    1: 10,
    2: 15,
    3: 20,
    4: 25,
    5: 30,
    6: 35,
    7: 40,
    8: 45,
    9: 50,
    10: 60,
}

# ─────────────────────────────────────────────────────────────────────────────
# Master Library of Magic Shortcuts (Tricks Vault)
# ─────────────────────────────────────────────────────────────────────────────
TRICKS_VAULT = [
    {
        "id": "trick-11-mult",
        "title": "The 11-Multiplication Lightning Rule",
        "category": "Mental Arithmetic",
        "formula": "ab × 11 = a | (a + b) | b",
        "description": "To multiply any 2-digit number by 11, split the two digits and place their sum in between.",
        "example": "45 × 11 → Put 4 and 5 apart: 4 _ 5. Add 4 + 5 = 9. Answer = 495!",
        "carryExample": "78 × 11 → 7 _ 8. 7 + 8 = 15. Carry the 1 to 7: (7+1) 5 8 = 858."
    },
    {
        "id": "trick-square-5",
        "title": "Instant Squaring for Numbers Ending in 5",
        "category": "Vedic Squares",
        "formula": "(N5)² = [N × (N + 1)] 25",
        "description": "Multiply the first digit(s) N by (N + 1), then simply suffix 25 to the result.",
        "example": "75² → N = 7. 7 × (7 + 1) = 7 × 8 = 56. Suffix 25 → 5,625 in 1 second!",
        "carryExample": "115² → N = 11. 11 × 12 = 132. Suffix 25 → 13,225!"
    },
    {
        "id": "trick-percent-split",
        "title": "The Universal Percentage Splitter",
        "category": "Commercial Math",
        "formula": "X% = 50% / 10% / 5% / 1% Combinations",
        "description": "Never use long formulas for percentages. Deconstruct any percentage into 10% (move decimal 1 place left) and 1% (move decimal 2 places left).",
        "example": "Find 15% of 340: 10% = 34. 5% is half of 34 = 17. Total = 34 + 17 = 51!",
        "carryExample": "Find 29% of 400: Take 30% (3 × 40 = 120) minus 1% (4) = 116."
    },
    {
        "id": "trick-speed-converter",
        "title": "Speed Conversion Golden Factor (5/18)",
        "category": "Speed & Distance",
        "formula": "km/h × (5/18) = m/s  |  m/s × (18/5) = km/h",
        "description": "Use the 18:5 multiplier table: 18 km/h = 5 m/s, 36 km/h = 10 m/s, 72 km/h = 20 m/s, 90 km/h = 25 m/s.",
        "example": "A train at 72 km/h: Since 72 is 4 × 18, its speed is directly 4 × 5 = 20 m/s!",
        "carryExample": "To convert 25 m/s to km/h: 25 is 5 × 5, so 5 × 18 = 90 km/h."
    },
    {
        "id": "trick-work-pipes",
        "title": "Product-Over-Sum Rule for Work & Pipes",
        "category": "Time & Work",
        "formula": "Combined Time = (A × B) / (A + B)",
        "description": "When person A takes x days and person B takes y days, their combined work time is the product divided by their sum.",
        "example": "Pipe A fills in 6 hrs, Pipe B in 8 hrs: (6 × 8) / (6 + 8) = 48 / 14 = 24 / 7 ≈ 3.43 hours!",
        "carryExample": "A finishes in 10 days, B in 15 days: (10 × 15) / (10 + 15) = 150 / 25 = 6 days flat."
    },
    {
        "id": "trick-consecutive-sum",
        "title": "Arithmetic Progression Middle Value Trick",
        "category": "Sequences & Series",
        "formula": "Average = Middle Term = Sum / N",
        "description": "For any odd number of consecutive integers, the middle integer is always the sum divided by N.",
        "example": "5 consecutive numbers sum to 125: Middle number = 125 / 5 = 25. Numbers are 23, 24, 25, 26, 27!",
        "carryExample": "Smallest term is 25 - 2 = 23 instantly without solving x + x+1 + x+2..."
    },
    {
        "id": "trick-ci-successive",
        "title": "Successive Percentage for 2-Year Compound Interest",
        "category": "Banking & Interest",
        "formula": "Effective Rate = a + b + (a × b)/100",
        "description": "Calculate 2-year CI directly as a single simple interest calculation using the successive percentage rule.",
        "example": "10% CI for 2 years: Effective Rate = 10 + 10 + (100/100) = 21%. On ₹2000, 21% of 2000 = ₹420!",
        "carryExample": "5% CI for 2 years: 5 + 5 + 0.25 = 10.25%. On ₹10,000, CI = ₹1,025."
    },
    {
        "id": "trick-pythagoras-triplets",
        "title": "Universal Pythagorean Triplets",
        "category": "Geometry & Vectors",
        "formula": "(3, 4, 5) | (5, 12, 13) | (8, 15, 17) | (7, 24, 25)",
        "description": "Save time on distance/displacement problems by spotting primitive triplets and their scalar multiples.",
        "example": "Walking 6 km North then 8 km East: (6, 8, ?) is 2 × (3, 4, 5) → Hypotenuse = 10 km!",
        "carryExample": "A 13m ladder against a wall reaching 12m height: Base distance = 5m directly."
    }
]

# ─────────────────────────────────────────────────────────────────────────────
# Curated Master Questions with Bespoke Vedic & Mental Math Tricks
# ─────────────────────────────────────────────────────────────────────────────
CURATED_QUESTIONS = {
    1: [
        {
            "id": "q1_1",
            "topic": "Mental Arithmetic",
            "prompt": "What is 15 + 27?",
            "options": ["A. 40", "B. 42", "C. 41", "D. 43"],
            "answer": "B",
            "answer_text": "42",
            "method": "Step 1: Add tens: 10 + 20 = 30. Step 2: Add units: 5 + 7 = 12. Step 3: Total = 30 + 12 = 42.",
            "trick": "⚡ Magic Trick: Round 27 to 30 (add 3). 15 + 30 = 45. Now subtract the 3: 45 - 3 = 42 in 1 second!"
        },
        {
            "id": "q1_2",
            "topic": "Rapid Multiplication",
            "prompt": "What is 8 × 7?",
            "options": ["A. 54", "B. 56", "C. 58", "D. 52"],
            "answer": "B",
            "answer_text": "56",
            "method": "Direct multiplication table: 8 groups of 7 equals 56.",
            "trick": "⚡ Magic Trick: Finger trick / 5678 sequence: 5, 6, 7, 8 → 56 = 7 × 8!"
        },
        {
            "id": "q1_3",
            "topic": "Division Blitz",
            "prompt": "What is 100 ÷ 4?",
            "options": ["A. 20", "B. 30", "C. 25", "D. 28"],
            "answer": "C",
            "answer_text": "25",
            "method": "Divide 100 into 4 equal quarters: 100 / 4 = 25.",
            "trick": "⚡ Magic Trick: Halve it twice! Half of 100 = 50. Half of 50 = 25!"
        },
        {
            "id": "q1_4",
            "topic": "Mental Percentages",
            "prompt": "What is 50% of 80?",
            "options": ["A. 40", "B. 30", "C. 45", "D. 35"],
            "answer": "A",
            "answer_text": "40",
            "method": "50% is equivalent to the fraction 1/2. 80 × 1/2 = 40.",
            "trick": "⚡ Magic Trick: 50% means divide by 2! Half of 80 is instantly 40."
        },
        {
            "id": "q1_5",
            "topic": "Power & Exponents",
            "prompt": "What is 6² (6 squared)?",
            "options": ["A. 12", "B. 36", "C. 30", "D. 42"],
            "answer": "B",
            "answer_text": "36",
            "method": "Squaring a number means multiplying it by itself: 6 × 6 = 36.",
            "trick": "⚡ Magic Trick: 6 × 6 is an even square ending in 6; eliminates odd numbers instantly!"
        },
        {
            "id": "q1_6",
            "topic": "Sequence Recognition",
            "prompt": "What comes next in the sequence: 2, 4, 8, 16, ___?",
            "options": ["A. 24", "B. 32", "C. 28", "D. 30"],
            "answer": "B",
            "answer_text": "32",
            "method": "Geometric progression with common ratio r = 2. 16 × 2 = 32.",
            "trick": "⚡ Magic Trick: Binary progression: 2^1, 2^2, 2^3, 2^4, 2^5 = 32!"
        }
    ],

    2: [
        {
            "id": "q2_1",
            "topic": "Commercial Discount",
            "prompt": "A branded shirt costs ₹500. A 20% discount is applied. What is the final price?",
            "options": ["A. ₹350", "B. ₹400", "C. ₹420", "D. ₹450"],
            "answer": "B",
            "answer_text": "₹400",
            "method": "Discount = 20% of 500 = (20/100) × 500 = ₹100. Final Price = 500 - 100 = ₹400.",
            "trick": "⚡ Magic Trick: 10% of 500 = ₹50. So 20% = ₹100. 500 - 100 = ₹400 in 2 seconds!"
        },
        {
            "id": "q2_2",
            "topic": "Unitary Method",
            "prompt": "If 5 pens cost ₹35, what is the cost of 8 pens?",
            "options": ["A. ₹54", "B. ₹56", "C. ₹58", "D. ₹60"],
            "answer": "B",
            "answer_text": "₹56",
            "method": "Cost of 1 pen = 35 / 5 = ₹7. Cost of 8 pens = 8 × 7 = ₹56.",
            "trick": "⚡ Magic Trick: Direct unit rate: 35/5 = 7. 8 × 7 = 56 (the 5678 sequence)!"
        },
        {
            "id": "q2_3",
            "topic": "Fraction Arithmetic",
            "prompt": "What is 2/3 + 1/4?",
            "options": ["A. 3/7", "B. 11/12", "C. 7/12", "D. 5/12"],
            "answer": "B",
            "answer_text": "11/12",
            "method": "Common denominator = 12. (2×4)/12 + (1×3)/12 = 8/12 + 3/12 = 11/12.",
            "trick": "⚡ Magic Trick: Butterfly Method: Cross-multiply: (2×4) + (3×1) = 8 + 3 = 11 (top). Denominator = 3 × 4 = 12. Result = 11/12!"
        },
        {
            "id": "q2_4",
            "topic": "Speed Calculation",
            "prompt": "A car covers 240 km in 4 hours. What is its speed in km/h?",
            "options": ["A. 50 km/h", "B. 55 km/h", "C. 60 km/h", "D. 65 km/h"],
            "answer": "C",
            "answer_text": "60 km/h",
            "method": "Speed = Distance / Time = 240 / 4 = 60 km/h.",
            "trick": "⚡ Magic Trick: Halve twice! 240 / 2 = 120; 120 / 2 = 60 km/h."
        },
        {
            "id": "q2_5",
            "topic": "Simple Interest",
            "prompt": "Calculate Simple Interest: Principal = ₹1,000, Rate = 5% p.a., Time = 2 years.",
            "options": ["A. ₹50", "B. ₹100", "C. ₹150", "D. ₹200"],
            "answer": "B",
            "answer_text": "₹100",
            "method": "SI = (P × R × T) / 100 = (1000 × 5 × 2) / 100 = ₹100.",
            "trick": "⚡ Magic Trick: Total percentage = Rate × Time = 5% × 2 = 10%. 10% of 1000 is simply ₹100!"
        }
    ],

    3: [
        {
            "id": "q3_1",
            "topic": "Train Speed & Distance",
            "prompt": "A 300-meter long train passes a telephone pole in 15 seconds. What is its speed in km/h?",
            "options": ["A. 60 km/h", "B. 66 km/h", "C. 72 km/h", "D. 78 km/h"],
            "answer": "C",
            "answer_text": "72 km/h",
            "method": "Speed = Distance / Time = 300m / 15s = 20 m/s. Convert to km/h: 20 × (18/5) = 4 × 18 = 72 km/h.",
            "trick": "⚡ Magic Trick: 20 m/s is 4 × 5 m/s. Since 5 m/s = 18 km/h, multiply 4 × 18 = 72 km/h instantly!"
        },
        {
            "id": "q3_2",
            "topic": "Compound Interest",
            "prompt": "Find the Compound Interest on ₹2,000 at 10% per annum for 2 years (compounded annually).",
            "options": ["A. ₹400", "B. ₹420", "C. ₹440", "D. ₹450"],
            "answer": "B",
            "answer_text": "₹420",
            "method": "Amount = 2000 × (1 + 10/100)² = 2000 × 1.21 = ₹2,420. CI = 2420 - 2000 = ₹420.",
            "trick": "⚡ Magic Trick: Successive percentage: 10 + 10 + (10×10)/100 = 21%. 21% of 2000 = 21 × 20 = ₹420!"
        },
        {
            "id": "q3_3",
            "topic": "Ratio Difference",
            "prompt": "Two numbers are in the ratio 4:7 and their difference is 18. What is the smaller number?",
            "options": ["A. 20", "B. 22", "C. 24", "D. 28"],
            "answer": "C",
            "answer_text": "24",
            "method": "Let numbers be 4x and 7x. 7x - 4x = 3x = 18 => x = 6. Smaller number = 4 × 6 = 24.",
            "trick": "⚡ Magic Trick: Ratio gap = 7 - 4 = 3 units. 3 units = 18 => 1 unit = 6. Smaller = 4 × 6 = 24!"
        },
        {
            "id": "q3_4",
            "topic": "Pipes & Cisterns",
            "prompt": "Pipe A fills a tank in 6 hours, Pipe B in 8 hours. How long do they take working together?",
            "options": ["A. 3.2 hrs", "B. 3.4 hrs", "C. 3.43 hrs", "D. 3.6 hrs"],
            "answer": "C",
            "answer_text": "3.43 hrs",
            "method": "Rate = 1/6 + 1/8 = (4+3)/24 = 7/24. Time = 24 / 7 ≈ 3.428 hours.",
            "trick": "⚡ Magic Trick: Product over Sum: (6 × 8) / (6 + 8) = 48 / 14 = 24 / 7 ≈ 3.43 hours!"
        },
        {
            "id": "q3_5",
            "topic": "Pythagorean Vectors",
            "prompt": "A person walks 4 km North and then 3 km East. How far are they from their starting point?",
            "options": ["A. 4 km", "B. 5 km", "C. 6 km", "D. 7 km"],
            "answer": "B",
            "answer_text": "5 km",
            "method": "Distance = √(4² + 3²) = √(16 + 9) = √25 = 5 km.",
            "trick": "⚡ Magic Trick: Golden Triplet (3, 4, 5)! The hypotenuse is immediately 5 without squaring."
        }
    ],

    4: [
        {
            "id": "q4_1",
            "topic": "Probability",
            "prompt": "A bag contains 3 Red, 2 Blue, and 5 Green balls. What is the probability of picking a Red ball?",
            "options": ["A. 1/5", "B. 3/10", "C. 2/5", "D. 1/2"],
            "answer": "B",
            "answer_text": "3/10",
            "method": "Total balls = 3 + 2 + 5 = 10. Favorable = 3 Red. Probability = 3 / 10.",
            "trick": "⚡ Magic Trick: Sum denominator first: 3+2+5=10. Answer is directly 3/10 (30%)!"
        },
        {
            "id": "q4_2",
            "topic": "Algebra Substitution",
            "prompt": "If 2(x - 3) = 10, what is the value of x?",
            "options": ["A. 5", "B. 6", "C. 7", "D. 8"],
            "answer": "D",
            "answer_text": "8",
            "method": "2x - 6 = 10 => 2x = 16 => x = 8.",
            "trick": "⚡ Magic Trick: Divide by 2 first: x - 3 = 5. Add 3: x = 8!"
        },
        {
            "id": "q4_3",
            "topic": "Circle Mensuration",
            "prompt": "What is the circumference of a circle with radius 14 cm? (Take π = 22/7)",
            "options": ["A. 78 cm", "B. 84 cm", "C. 88 cm", "D. 92 cm"],
            "answer": "C",
            "answer_text": "88 cm",
            "method": "Circumference = 2 × π × r = 2 × (22/7) × 14 = 2 × 22 × 2 = 88 cm.",
            "trick": "⚡ Magic Trick: Divisibility by 11: π formulas always yield multiples of 11. 88 is the only multiple of 11!"
        },
        {
            "id": "q4_4",
            "topic": "Coin Probability",
            "prompt": "A fair coin is tossed 3 times. What is the probability of getting all 3 Heads?",
            "options": ["A. 1/4", "B. 1/8", "C. 1/6", "D. 1/2"],
            "answer": "B",
            "answer_text": "1/8",
            "method": "Total outcomes = 2³ = 8. Favorable outcome = {HHH} = 1. Probability = 1/8.",
            "trick": "⚡ Magic Trick: Power of 2: 3 tosses means 2³ = 8 possible outcomes. (1/2) × (1/2) × (1/2) = 1/8!"
        }
    ],

    5: [
        {
            "id": "q5_1",
            "topic": "Profit & Loss Markups",
            "prompt": "A trader marks goods 40% above Cost Price and gives a 20% discount. What is his net Profit %?",
            "options": ["A. 10%", "B. 12%", "C. 15%", "D. 20%"],
            "answer": "B",
            "answer_text": "12%",
            "method": "Let CP = 100. Marked Price = 140. Discount = 20% of 140 = 28. SP = 140 - 28 = 112. Profit = 12%.",
            "trick": "⚡ Magic Trick: Formula: a - b - (ab/100) = 40 - 20 - (40×20/100) = 20 - 8 = 12% in 2 seconds!"
        },
        {
            "id": "q5_2",
            "topic": "Average Speed",
            "prompt": "A cyclist travels from A to B at 20 km/h and returns at 30 km/h. What is his average speed for the whole trip?",
            "options": ["A. 24 km/h", "B. 25 km/h", "C. 26 km/h", "D. 27 km/h"],
            "answer": "A",
            "answer_text": "24 km/h",
            "method": "Harmonic Mean: Avg Speed = (2xy) / (x + y) = (2 × 20 × 30) / (20 + 30) = 1200 / 50 = 24 km/h.",
            "trick": "⚡ Magic Trick: Never average speeds directly (25 is wrong!). Use 2xy/(x+y): (2 × 600)/50 = 24 km/h!"
        },
        {
            "id": "q5_3",
            "topic": "Permutations",
            "prompt": "In how many distinct ways can the letters of the word 'LEMON' be arranged?",
            "options": ["A. 60", "B. 100", "C. 120", "D. 240"],
            "answer": "C",
            "answer_text": "120",
            "method": "'LEMON' has 5 distinct letters. Arrangements = 5! = 5 × 4 × 3 × 2 × 1 = 120.",
            "trick": "⚡ Magic Trick: Memorized factorial benchmark: 5! is always 120."
        }
    ],

    6: [
        {
            "id": "q6_1",
            "topic": "Clock Angle Trick",
            "prompt": "What is the angle between the hour hand and minute hand of a clock at 3:30?",
            "options": ["A. 70°", "B. 75°", "C. 80°", "D. 90°"],
            "answer": "B",
            "answer_text": "75°",
            "method": "Angle = |30H - (11/2)M| = |30(3) - 5.5(30)| = |90 - 165| = 75°.",
            "trick": "⚡ Magic Trick: At :30, the hour hand is halfway between 3 and 4 (15° from 3). From 4 to 6 is 60°. 60° + 15° = 75°!"
        },
        {
            "id": "q6_2",
            "topic": "Work & Man-Days",
            "prompt": "12 men can complete a project in 8 days. How many men are needed to finish it in 6 days?",
            "options": ["A. 14", "B. 16", "C. 18", "D. 20"],
            "answer": "B",
            "answer_text": "16",
            "method": "M1 × D1 = M2 × D2 => 12 × 8 = M2 × 6 => 96 = 6 × M2 => M2 = 16.",
            "trick": "⚡ Magic Trick: Constant Man-Days: 12 × 8 = 96. Divide by 6: 96 / 6 = 16 men!"
        }
    ],

    7: [
        {
            "id": "q7_1",
            "topic": "Mixtures & Alligation",
            "prompt": "In what ratio must rice at ₹40/kg be mixed with rice at ₹60/kg to create a mixture worth ₹52/kg?",
            "options": ["A. 2:3", "B. 3:2", "C. 1:2", "D. 4:5"],
            "answer": "A",
            "answer_text": "2:3",
            "method": "Alligation Rule: (60 - 52) : (52 - 40) = 8 : 12 = 2 : 3.",
            "trick": "⚡ Magic Trick: Cross-differences: 60 - 52 = 8. 52 - 40 = 12. Ratio is 8:12 = 2:3 in 2 seconds!"
        },
        {
            "id": "q7_2",
            "topic": "Calendar Aptitude",
            "prompt": "If today is Monday, what day of the week will it be after 61 days?",
            "options": ["A. Friday", "B. Saturday", "C. Sunday", "D. Thursday"],
            "answer": "B",
            "answer_text": "Saturday",
            "method": "61 mod 7: 61 = 7 × 8 + 5. 5 odd days. Monday + 5 days = Saturday.",
            "trick": "⚡ Magic Trick: 61 is 3 days short of 64 or 2 days short of 63 (exact multiple of 7). Monday - 2 days = Saturday!"
        }
    ],

    8: [
        {
            "id": "q8_1",
            "topic": "Boats & Streams",
            "prompt": "A motorboat goes 36 km downstream in 2 hours and 36 km upstream in 3 hours. What is the speed of the current?",
            "options": ["A. 2 km/h", "B. 3 km/h", "C. 4 km/h", "D. 5 km/h"],
            "answer": "B",
            "answer_text": "3 km/h",
            "method": "Downstream Speed = 36/2 = 18 km/h. Upstream Speed = 36/3 = 12 km/h. Current = (D - U)/2 = (18 - 12)/2 = 3 km/h.",
            "trick": "⚡ Magic Trick: Current speed is half the difference: (18 - 12) / 2 = 6 / 2 = 3 km/h!"
        },
        {
            "id": "q8_2",
            "topic": "Series Sum",
            "prompt": "What is the sum of all odd integers from 1 to 49 inclusive?",
            "options": ["A. 625", "B. 576", "C. 600", "D. 650"],
            "answer": "A",
            "answer_text": "625",
            "method": "Number of terms n = (49 + 1)/2 = 25. Sum of first n odd numbers = n² = 25² = 625.",
            "trick": "⚡ Magic Trick: Sum of first n odd numbers is always n²! There are 25 terms, 25² = 625 using the 5-squaring trick (2×3=6, suffix 25)!"
        }
    ],

    9: [
        {
            "id": "q9_1",
            "topic": "Magic Matrices & Mensuration",
            "prompt": "If the diagonal of a cube is 6√3 cm, what is the total surface area of the cube?",
            "options": ["A. 144 cm²", "B. 180 cm²", "C. 216 cm²", "D. 240 cm²"],
            "answer": "C",
            "answer_text": "216 cm²",
            "method": "Diagonal of cube = a√3. Therefore side a = 6 cm. Total Surface Area = 6a² = 6 × (6²) = 6 × 36 = 216 cm².",
            "trick": "⚡ Magic Trick: Side is directly 6. TSA = 6 × 6² = 6³ = 216 cm³!"
        },
        {
            "id": "q9_2",
            "topic": "Combinatorial Handshakes",
            "prompt": "At a math olympiad, 12 participants shake hands with every other participant exactly once. How many total handshakes occur?",
            "options": ["A. 55", "B. 66", "C. 72", "D. 132"],
            "answer": "B",
            "answer_text": "66",
            "method": "Handshakes = n(n - 1) / 2 = 12 × 11 / 2 = 6 × 11 = 66.",
            "trick": "⚡ Magic Trick: 12 × 11 / 2 = 6 × 11. Using 11-rule: 6 × 11 = 66 in 1 second!"
        }
    ],

    10: [
        {
            "id": "q10_1",
            "topic": "Grandmaster Cryptarithm",
            "prompt": "If A, B are distinct non-zero digits and AB × 6 = BBB, find the digit value of A + B.",
            "options": ["A. 9", "B. 11", "C. 12", "D. 14"],
            "answer": "B",
            "answer_text": "11",
            "method": "BBB = 111 × B = 3 × 37 × B. So AB × 6 = 111 × B. Divide by 3: 2 × AB = 37 × B. Since 37 is prime, AB must be a multiple of 37. If AB = 74, 2 × 74 = 148 = 37 × 4 => B = 4, A = 7. A + B = 7 + 4 = 11.",
            "trick": "⚡ Magic Trick: BBB is always divisible by 37. The only 2-digit multiple of 37 ending in a compatible digit is 74 (74 × 6 = 444!). A=7, B=4, 7+4 = 11!"
        },
        {
            "id": "q10_2",
            "topic": "Olympiad Modular Aptitude",
            "prompt": "What is the remainder when 2^100 is divided by 7?",
            "options": ["A. 1", "B. 2", "C. 4", "D. 6"],
            "answer": "B",
            "answer_text": "2",
            "method": "2³ = 8 ≡ 1 (mod 7). 100 = 3 × 33 + 1. 2^100 = (2³)^33 × 2^1 ≡ (1)^33 × 2 = 2.",
            "trick": "⚡ Magic Trick: Cycle of 2 mod 7 is 3 (2, 4, 1). Divide exponent 100 by 3: remainder is 1. 2^1 = 2!"
        }
    ]
}

# ─────────────────────────────────────────────────────────────────────────────
# Dynamic Question Enrichment Engine & Question Bank Synthesis
# Merges authentic questions from Magic_Number/a.py and Magic_Number/aptitude.py
# ─────────────────────────────────────────────────────────────────────────────

LEVEL_TOPICS = {
    1: "Rapid Mental Arithmetic",
    2: "Commercial Percentages & Fractions",
    3: "Ratios, Proportions & Kinematics",
    4: "Profit & Loss, Interest & Speed",
    5: "Algebraic Equations & Mensuration",
    6: "Work & Time, Joint Tasks & Probability",
    7: "Deductive Logic, Patterns & Sequences",
    8: "Quantitative Analysis & Relative Motion",
    9: "Advanced Arithmetic, HCF/LCM & Progressions",
    10: "Grandmaster Olympiad & Non-Linear Reasoning"
}


def clean_opt(opt_str):
    """Strip leading letter indicators ('A. ', 'B. ') from option strings."""
    return re.sub(r'^[A-D]\.\s*', '', str(opt_str)).strip()


def derive_method_and_trick(prompt, ans_text, level):
    """
    Synthesize step-by-step mathematical reasoning and a 3-second mental math
    trick / Vedic shortcut for any question.
    """
    p = prompt.lower()
    ans = str(ans_text).strip()

    if '%' in p or 'percent' in p or 'discount' in p:
        if 'successive' in p or ('discount' in p and 'another' in p):
            method = f"Step 1: Let base = 100. Apply first percentage, then second to remainder. Step 2: Total change = {ans}."
            trick = "⚡ Magic Trick: Net successive formula: a + b - (ab / 100). Solves in 2 seconds!"
        elif 'discount' in p:
            method = f"Step 1: Compute discount amount = (discount % × marked price). Step 2: Selling price = Marked price - discount = {ans}."
            trick = "⚡ Magic Trick: Find 10% by shifting decimal left, scale up, then subtract directly!"
        else:
            method = f"Step 1: Convert percentage to fraction (X% = X/100). Step 2: Multiply by total value. Result = {ans}."
            trick = "⚡ Magic Trick: 10% benchmark split: 10% (move decimal) + 5% (half of 10%). Or reverse: X% of Y = Y% of X!"
    elif 'job' in p or 'work' in p or ('days' in p and ('finish' in p or 'alone' in p or 'together' in p)):
        method = f"Step 1: Compute 1-day work rate for each person (1/time). Step 2: Combine rates and take reciprocal to find total time = {ans}."
        trick = "⚡ Magic Trick: Product over Sum: Time together = (A × B) / (A + B). Multiply then divide by sum!"
    elif 'speed' in p or 'km/h' in p or 'm/s' in p or 'train' in p or 'travel' in p:
        method = f"Step 1: Use Distance = Speed × Time. Step 2: Convert units where 1 km/h = 5/18 m/s. Step 3: Solve for {ans}."
        trick = "⚡ Magic Trick: km/h to m/s: multiply by 5/18 (divide by 18, multiply by 5). m/s to km/h: multiply by 3.6!"
    elif 'ratio' in p or ':' in p:
        method = f"Step 1: Sum the ratio parts to find total units. Step 2: Divide total value by total units for 1-part value. Step 3: Multiply by requested ratio part = {ans}."
        trick = "⚡ Magic Trick: Unitary constant k = Total / Sum of Parts. Multiply target part directly by k!"
    elif 'interest' in p or 'si' in p or 'principal' in p:
        method = f"Step 1: Use SI = (Principal × Rate × Time) / 100. Step 2: Calculate effective percentage (R × T)% on Principal = {ans}."
        trick = "⚡ Magic Trick: Rate × Time gives total percentage. E.g. 5% for 2 years = 10% total interest directly!"
    elif 'solve' in p or 'find x' in p or 'x +' in p or 'x -' in p or '2x' in p or '3x' in p:
        method = f"Step 1: Collect variable terms on one side and constants on the other. Step 2: Divide by coefficient to isolate x = {ans}."
        trick = "⚡ Magic Trick: Reverse operations: apply inverse operations backwards or substitute option choices into equation!"
    elif 'area' in p or 'perimeter' in p or 'square' in p or 'rectangle' in p or 'triangle' in p or 'circle' in p or 'volume' in p:
        method = f"Step 1: State geometric formula. Step 2: Substitute given dimensions. Step 3: Evaluate = {ans}."
        trick = "⚡ Magic Trick: Perimeter of square = 4s (double twice). Circle problems with π = 22/7 usually yield multiples of 11!"
    elif 'next number' in p or 'series' in p or '__' in p:
        method = f"Step 1: Calculate differences between consecutive terms. Step 2: Identify progression pattern. Step 3: Apply to find next term = {ans}."
        trick = "⚡ Magic Trick: Check for square numbers (n²), cubes (n³), or n(n+1) differences!"
    elif 'probab' in p or 'die' in p or 'dice' in p or 'coin' in p or 'ball' in p:
        method = f"Step 1: Count favorable outcomes. Step 2: Count total outcomes in sample space. Step 3: Probability = Favorable / Total = {ans}."
        trick = "⚡ Magic Trick: For 'at least one' problems, compute 1 - P(none) for a 3-second shortcut!"
    elif '+' in p:
        method = f"Step 1: Add tens first. Step 2: Add units. Step 3: Combine for total = {ans}."
        trick = "⚡ Magic Trick: Round up to nearest 10, add, then subtract the excess in 1 second!"
    elif '-' in p:
        method = f"Step 1: Subtract tens, then subtract units. Result = {ans}."
        trick = "⚡ Magic Trick: Add up from smaller number to larger number (cashier complement method)!"
    elif '×' in p or '*' in p or 'squared' in p or 'cube' in p:
        method = f"Step 1: Break multiplier into convenient factors or powers of 10. Step 2: Multiply and sum = {ans}."
        trick = "⚡ Magic Trick: Double one number and halve the other, or use base-10 deficit (Vedic crosswise)!"
    elif '÷' in p or '/' in p or 'divide' in p:
        method = f"Step 1: Simplify common factors. Step 2: Compute quotient = {ans}."
        trick = "⚡ Magic Trick: Dividing by 4 is halving twice. Dividing by 5 is doubling and moving decimal left!"
    else:
        method = f"Step 1: Analyze problem constraints and identify core rule. Step 2: Eliminate invalid choices. Step 3: Conclude {ans}."
        trick = "⚡ Magic Trick: Fast elimination: eliminate the two extreme outliers to narrow down to 50/50 instantly!"

    return method, trick


def build_complete_magic_bank():
    """
    Builds the master question bank combining curated questions, 200 questions
    from Magic_Number/a.py, and 200 questions from Magic_Number/aptitude.py.
    """
    bank = {lvl: [] for lvl in range(1, 11)}

    # 1. Curated questions with handcrafted Vedic tricks
    for lvl, q_list in CURATED_QUESTIONS.items():
        for q in q_list:
            clean_q = dict(q)
            clean_q["options"] = [clean_opt(o) for o in q["options"]]
            bank[lvl].append(clean_q)

    # 2. Questions from Magic_Number/a.py (200 questions)
    if a_game and hasattr(a_game, "build_question_bank"):
        try:
            a_bank = a_game.build_question_bank()
            for lvl, q_list in a_bank.items():
                for idx, q in enumerate(q_list, 1):
                    prompt = q.get("question", "")
                    opts = [clean_opt(o) for o in q.get("options", [])]
                    ans_letter = q.get("answer", "A")
                    ans_text = str(q.get("answer_text", ""))
                    method, trick = derive_method_and_trick(prompt, ans_text, lvl)
                    bank[lvl].append({
                        "id": f"a_l{lvl}_q{idx}",
                        "level": lvl,
                        "topic": LEVEL_TOPICS.get(lvl, "Quantitative Aptitude"),
                        "prompt": prompt,
                        "options": opts,
                        "answer": ans_letter,
                        "answer_text": ans_text,
                        "method": method,
                        "trick": trick
                    })
        except Exception as e:
            print("Notice: Error loading a.py question bank:", e)

    # 3. Questions from Magic_Number/aptitude.py (200 questions)
    if apt_game and hasattr(apt_game, "QUESTIONS"):
        try:
            for lvl, q_list in apt_game.QUESTIONS.items():
                for idx, q in enumerate(q_list, 1):
                    prompt = q.get("q", "")
                    opts = [clean_opt(o) for o in q.get("options", [])]
                    ans_letter = q.get("ans", "A")
                    ans_idx = ord(ans_letter) - ord('A') if ans_letter in 'ABCD' else 0
                    ans_text = opts[ans_idx] if ans_idx < len(opts) else ans_letter
                    method, trick = derive_method_and_trick(prompt, ans_text, lvl)
                    bank[lvl].append({
                        "id": f"apt_l{lvl}_q{idx}",
                        "level": lvl,
                        "topic": LEVEL_TOPICS.get(lvl, "Quantitative Aptitude"),
                        "prompt": prompt,
                        "options": opts,
                        "answer": ans_letter,
                        "answer_text": ans_text,
                        "method": method,
                        "trick": trick
                    })
        except Exception as e:
            print("Notice: Error loading aptitude.py question bank:", e)

    return bank


# Master question registry loaded once at startup
MAGIC_QUESTIONS = build_complete_magic_bank()


def get_questions_for_level(level: int, limit: int = None, shuffle: bool = True):
    """
    Returns questions for the specified level. If shuffle is True, randomly samples questions.
    """
    level = max(1, min(10, int(level)))
    pool = list(MAGIC_QUESTIONS.get(level, MAGIC_QUESTIONS[1]))
    if shuffle:
        random.shuffle(pool)
    if limit and limit > 0:
        return pool[:limit]
    return pool



def evaluate_aptitude(score: int, accuracy: float, avg_time: float) -> dict:
    """
    Calculate aptitude tier, IQ estimate, and performance radar statistics.
    """
    # 1. Determine Tier
    matched_tier = APTITUDE_LEVELS[-1]
    for tier in APTITUDE_LEVELS:
        if score >= tier["min_score"]:
            matched_tier = tier
            break

    # 2. IQ Estimate calculation
    # Base IQ = 100. Scaled by score (max +35) and accuracy bonus (max +10), speed bonus (max +5)
    score_factor = min(35, int((score / 250) * 35))
    accuracy_factor = int((accuracy / 100) * 10)
    speed_factor = 5 if avg_time < 5.0 else (3 if avg_time < 10.0 else 0)
    estimated_iq = 95 + score_factor + accuracy_factor + speed_factor

    # 3. Radar scores (0-100)
    numerical_agility = min(100, int(accuracy * 0.7 + (score / 3)))
    calculation_speed = min(100, max(20, int(100 - (avg_time * 5))))
    logical_rigor = min(100, int(accuracy * 0.95))
    trick_mastery = min(100, int((score / 200) * 100))

    return {
        "title": matched_tier["title"],
        "badge": matched_tier["badge"],
        "description": matched_tier["description"],
        "percentile": matched_tier["percentile"],
        "estimated_iq": estimated_iq,
        "radar": {
            "numerical_agility": numerical_agility,
            "calculation_speed": calculation_speed,
            "logical_rigor": logical_rigor,
            "trick_mastery": trick_mastery
        }
    }

