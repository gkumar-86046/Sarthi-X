import random
import time
import os
import sys

# ─────────────────────────────────────────────────────────────────────────────
#  QUESTION BANK  (200 questions – 20 per level, Levels 1‑10)
#  Format: {"q": "question", "options": ["A","B","C","D"], "ans": "A"}
# ─────────────────────────────────────────────────────────────────────────────

QUESTIONS = {
    # ══════════════════════════════════════════════════════════════════
    #  LEVEL 1 – Very Basic Arithmetic & Number Sense
    # ══════════════════════════════════════════════════════════════════
    1: [
        {"q": "What is 15 + 27?", "options": ["A. 40", "B. 42", "C. 41", "D. 43"], "ans": "B"},
        {"q": "What is 8 × 7?", "options": ["A. 54", "B. 56", "C. 58", "D. 52"], "ans": "B"},
        {"q": "What is 100 ÷ 4?", "options": ["A. 20", "B. 30", "C. 25", "D. 28"], "ans": "C"},
        {"q": "What is 45 - 18?", "options": ["A. 27", "B. 26", "C. 28", "D. 29"], "ans": "A"},
        {"q": "What is 6² (6 squared)?", "options": ["A. 12", "B. 36", "C. 30", "D. 42"], "ans": "B"},
        {"q": "Which is the largest: 0.5, 0.25, 0.75, 0.1?", "options": ["A. 0.5", "B. 0.25", "C. 0.75", "D. 0.1"], "ans": "C"},
        {"q": "What is 50% of 80?", "options": ["A. 40", "B. 30", "C. 45", "D. 35"], "ans": "A"},
        {"q": "What is the value of 3³?", "options": ["A. 9", "B. 27", "C. 18", "D. 21"], "ans": "B"},
        {"q": "How many minutes are in 2 hours?", "options": ["A. 100", "B. 110", "C. 120", "D. 130"], "ans": "C"},
        {"q": "What is 12 × 12?", "options": ["A. 124", "B. 144", "C. 134", "D. 148"], "ans": "B"},
        {"q": "What is 1/4 as a decimal?", "options": ["A. 0.4", "B. 0.14", "C. 0.25", "D. 0.50"], "ans": "C"},
        {"q": "What is the square root of 81?", "options": ["A. 7", "B. 8", "C. 9", "D. 10"], "ans": "C"},
        {"q": "What is 25% of 200?", "options": ["A. 25", "B. 40", "C. 50", "D. 75"], "ans": "C"},
        {"q": "What comes next: 2, 4, 8, 16, ___?", "options": ["A. 24", "B. 32", "C. 28", "D. 30"], "ans": "B"},
        {"q": "If a dozen eggs costs ₹60, what is the cost of 1 egg?", "options": ["A. ₹4", "B. ₹5", "C. ₹6", "D. ₹7"], "ans": "B"},
        {"q": "What is 3/5 as a percentage?", "options": ["A. 35%", "B. 50%", "C. 60%", "D. 65%"], "ans": "C"},
        {"q": "What is the LCM of 4 and 6?", "options": ["A. 10", "B. 12", "C. 24", "D. 8"], "ans": "B"},
        {"q": "What is the HCF of 12 and 18?", "options": ["A. 4", "B. 6", "C. 9", "D. 3"], "ans": "B"},
        {"q": "A train travels 60 km in 1 hour. How far in 3 hours?", "options": ["A. 120 km", "B. 150 km", "C. 180 km", "D. 200 km"], "ans": "C"},
        {"q": "What is 1000 - 378?", "options": ["A. 612", "B. 622", "C. 632", "D. 642"], "ans": "B"},
    ],

    # ══════════════════════════════════════════════════════════════════
    #  LEVEL 2 – Basic Fractions, Percentages & Simple Word Problems
    # ══════════════════════════════════════════════════════════════════
    2: [
        {"q": "A shirt costs ₹500. 20% discount. Final price?", "options": ["A. ₹350", "B. ₹400", "C. ₹420", "D. ₹450"], "ans": "B"},
        {"q": "If 5 pens cost ₹35, what do 8 pens cost?", "options": ["A. ₹54", "B. ₹56", "C. ₹58", "D. ₹60"], "ans": "B"},
        {"q": "What is 2/3 + 1/4?", "options": ["A. 3/7", "B. 11/12", "C. 7/12", "D. 5/12"], "ans": "B"},
        {"q": "A car covers 240 km in 4 hours. Speed in km/h?", "options": ["A. 50", "B. 55", "C. 60", "D. 65"], "ans": "C"},
        {"q": "What is 15% of 300?", "options": ["A. 40", "B. 42", "C. 45", "D. 50"], "ans": "C"},
        {"q": "Ratio of 3:5. If smaller = 12, larger = ?", "options": ["A. 16", "B. 18", "C. 20", "D. 24"], "ans": "C"},
        {"q": "Simple Interest: P=₹1000, R=5%, T=2 years. SI = ?", "options": ["A. ₹50", "B. ₹100", "C. ₹150", "D. ₹200"], "ans": "B"},
        {"q": "What is 3/8 of 64?", "options": ["A. 20", "B. 22", "C. 24", "D. 26"], "ans": "C"},
        {"q": "Average of 10, 20, 30, 40, 50?", "options": ["A. 25", "B. 30", "C. 35", "D. 40"], "ans": "B"},
        {"q": "Find the missing: 3, 6, 12, 24, __, 96", "options": ["A. 36", "B. 48", "C. 50", "D. 60"], "ans": "B"},
        {"q": "5 workers finish a job in 12 days. 3 workers need?", "options": ["A. 18 days", "B. 20 days", "C. 22 days", "D. 24 days"], "ans": "B"},
        {"q": "If x + 5 = 13, what is x?", "options": ["A. 6", "B. 7", "C. 8", "D. 9"], "ans": "C"},
        {"q": "What is 7/8 - 1/4?", "options": ["A. 5/8", "B. 6/8", "C. 3/4", "D. 1/2"], "ans": "A"},
        {"q": "A and B share ₹800 in 3:5. B gets?", "options": ["A. ₹400", "B. ₹450", "C. ₹500", "D. ₹600"], "ans": "C"},
        {"q": "Profit% if CP=₹200 and SP=₹250?", "options": ["A. 20%", "B. 25%", "C. 30%", "D. 35%"], "ans": "B"},
        {"q": "What is the perimeter of a square with side 7 cm?", "options": ["A. 21 cm", "B. 28 cm", "C. 35 cm", "D. 49 cm"], "ans": "B"},
        {"q": "A can finish work in 10 days. % done in 4 days?", "options": ["A. 30%", "B. 35%", "C. 40%", "D. 45%"], "ans": "C"},
        {"q": "What is 4.5 × 2.2?", "options": ["A. 8.9", "B. 9.0", "C. 9.9", "D. 10.1"], "ans": "C"},
        {"q": "Consecutive numbers summing 45: smallest?", "options": ["A. 13", "B. 14", "C. 15", "D. 16"], "ans": "B"},
        {"q": "A rectangle: L=10, W=6. Area?", "options": ["A. 48", "B. 56", "C. 60", "D. 64"], "ans": "C"},
    ],

    # ══════════════════════════════════════════════════════════════════
    #  LEVEL 3 – Intermediate Arithmetic & Ratio / Proportion
    # ══════════════════════════════════════════════════════════════════
    3: [
        {"q": "If 3x - 7 = 14, find x.", "options": ["A. 5", "B. 6", "C. 7", "D. 8"], "ans": "C"},
        {"q": "Train 300 m long passes pole in 15 s. Speed (km/h)?", "options": ["A. 60", "B. 66", "C. 72", "D. 78"], "ans": "C"},
        {"q": "Compound Interest on ₹2000 at 10% for 2 years?", "options": ["A. ₹400", "B. ₹420", "C. ₹440", "D. ₹450"], "ans": "B"},
        {"q": "Two numbers in ratio 4:7, differ by 18. Smaller?", "options": ["A. 20", "B. 22", "C. 24", "D. 28"], "ans": "C"},
        {"q": "Area of circle with radius 7 cm? (π=22/7)", "options": ["A. 144 cm²", "B. 148 cm²", "C. 154 cm²", "D. 160 cm²"], "ans": "C"},
        {"q": "Cost price ₹400, SP ₹340. Loss%?", "options": ["A. 10%", "B. 15%", "C. 12%", "D. 18%"], "ans": "B"},
        {"q": "Find the average of 1st 10 natural numbers.", "options": ["A. 4.5", "B. 5.0", "C. 5.5", "D. 6.0"], "ans": "C"},
        {"q": "Pipe A fills tank in 6h, Pipe B in 8h. Together?", "options": ["A. 3.2h", "B. 3.4h", "C. 3.43h", "D. 3.6h"], "ans": "C"},
        {"q": "A person walks 4 km north then 3 km east. Distance from start?", "options": ["A. 4 km", "B. 5 km", "C. 6 km", "D. 7 km"], "ans": "B"},
        {"q": "Sum of angles in a triangle = ?", "options": ["A. 90°", "B. 120°", "C. 180°", "D. 360°"], "ans": "C"},
        {"q": "HCF(36,48) = ?", "options": ["A. 6", "B. 8", "C. 10", "D. 12"], "ans": "D"},
        {"q": "If A:B = 2:3 and B:C = 4:5, find A:C.", "options": ["A. 7:15", "B. 8:15", "C. 6:15", "D. 10:15"], "ans": "B"},
        {"q": "At 8% annual SI, how many years for ₹500 to become ₹660?", "options": ["A. 2", "B. 3", "C. 4", "D. 5"], "ans": "C"},
        {"q": "Diagonal of a rectangle 6×8 cm = ?", "options": ["A. 8 cm", "B. 9 cm", "C. 10 cm", "D. 12 cm"], "ans": "C"},
        {"q": "5! (5 factorial) = ?", "options": ["A. 60", "B. 100", "C. 120", "D. 150"], "ans": "C"},
        {"q": "Two trains 150 m and 100 m long pass each other in 10s. Relative speed (m/s)?", "options": ["A. 20", "B. 25", "C. 30", "D. 35"], "ans": "B"},
        {"q": "Number of prime numbers between 1 and 20?", "options": ["A. 6", "B. 7", "C. 8", "D. 9"], "ans": "C"},
        {"q": "Volume of cube with side 4 cm?", "options": ["A. 48 cm³", "B. 56 cm³", "C. 64 cm³", "D. 72 cm³"], "ans": "C"},
        {"q": "A boat goes 30 km upstream in 5h (still water speed: 8 km/h). Current speed?", "options": ["A. 1 km/h", "B. 2 km/h", "C. 3 km/h", "D. 4 km/h"], "ans": "B"},
        {"q": "Find x: 2x + 3y = 12, y = 2. x = ?", "options": ["A. 2", "B. 3", "C. 4", "D. 5"], "ans": "B"},
    ],

    # ══════════════════════════════════════════════════════════════════
    #  LEVEL 4 – Algebra, Geometry & Probability Basics
    # ══════════════════════════════════════════════════════════════════
    4: [
        {"q": "Probability of picking a red ball from 3R,2B,5G = ?", "options": ["A. 1/5", "B. 3/10", "C. 2/5", "D. 1/2"], "ans": "B"},
        {"q": "If 2(x-3) = 10, x = ?", "options": ["A. 5", "B. 6", "C. 7", "D. 8"], "ans": "D"},
        {"q": "Circumference of circle with radius 14 cm? (π=22/7)", "options": ["A. 78 cm", "B. 84 cm", "C. 88 cm", "D. 92 cm"], "ans": "C"},
        {"q": "If tan θ = 3/4, sin θ = ?", "options": ["A. 3/5", "B. 4/5", "C. 3/4", "D. 5/3"], "ans": "A"},
        {"q": "A coin is flipped 3 times. Probability of 3 heads?", "options": ["A. 1/4", "B. 1/8", "C. 1/6", "D. 1/2"], "ans": "B"},
        {"q": "Find the median of: 4, 7, 2, 9, 1, 5, 3", "options": ["A. 3", "B. 4", "C. 5", "D. 7"], "ans": "B"},
        {"q": "Two dice rolled. Probability sum = 7?", "options": ["A. 1/9", "B. 5/36", "C. 1/6", "D. 7/36"], "ans": "C"},
        {"q": "Exterior angle of a regular hexagon?", "options": ["A. 45°", "B. 60°", "C. 72°", "D. 90°"], "ans": "B"},
        {"q": "x² - 5x + 6 = 0. Roots?", "options": ["A. 2,3", "B. 1,6", "C. -2,-3", "D. 2,4"], "ans": "A"},
        {"q": "Perimeter of equilateral triangle with side 9 cm?", "options": ["A. 18 cm", "B. 24 cm", "C. 27 cm", "D. 30 cm"], "ans": "C"},
        {"q": "Mode of: 2,3,4,3,5,3,2,4?", "options": ["A. 2", "B. 3", "C. 4", "D. 5"], "ans": "B"},
        {"q": "A worker earns ₹240/day for 6 days, ₹300/day for 4 days. Average daily earnings?", "options": ["A. ₹260", "B. ₹264", "C. ₹270", "D. ₹280"], "ans": "B"},
        {"q": "Volume of cylinder r=7, h=10? (π=22/7)", "options": ["A. 1450 cm³", "B. 1540 cm³", "C. 1600 cm³", "D. 1620 cm³"], "ans": "B"},
        {"q": "Sum of interior angles of a pentagon?", "options": ["A. 450°", "B. 500°", "C. 540°", "D. 560°"], "ans": "C"},
        {"q": "In a class of 40, 60% are girls. How many boys?", "options": ["A. 12", "B. 14", "C. 16", "D. 18"], "ans": "C"},
        {"q": "What is √(144 + 25)?", "options": ["A. 11", "B. 12", "C. 13", "D. 14"], "ans": "C"},
        {"q": "Speed = 54 km/h in m/s = ?", "options": ["A. 12", "B. 13", "C. 15", "D. 18"], "ans": "C"},
        {"q": "A ladder 10m leans against wall, base 6m from wall. Height?", "options": ["A. 6 m", "B. 7 m", "C. 8 m", "D. 9 m"], "ans": "C"},
        {"q": "How many ways arrange letters in MATH?", "options": ["A. 12", "B. 18", "C. 24", "D. 36"], "ans": "C"},
        {"q": "If x:y = 3:4, (x+y):(x-y) = ?", "options": ["A. 7:1", "B. 7:-1", "C. 1:7", "D. 4:3"], "ans": "A"},
    ],

    # ══════════════════════════════════════════════════════════════════
    #  LEVEL 5 – Intermediate Algebra, Time-Work, Data Interpretation
    # ══════════════════════════════════════════════════════════════════
    5: [
        {"q": "A and B can do a job in 12 and 15 days. Together?", "options": ["A. 6 days", "B. 6.5 days", "C. 6.67 days", "D. 7 days"], "ans": "C"},
        {"q": "A sum triples in 15 years at SI. Rate%?", "options": ["A. 10%", "B. 12%", "C. 13.33%", "D. 15%"], "ans": "C"},
        {"q": "CE of ₹5000 at 8% for 2 years (compounded annually)?", "options": ["A. ₹5800", "B. ₹5828", "C. ₹5832", "D. ₹5850"], "ans": "C"},
        {"q": "Train 200m passes bridge 800m in 1 min. Speed (km/h)?", "options": ["A. 55", "B. 60", "C. 65", "D. 70"], "ans": "B"},
        {"q": "If log₁₀(100) = x, x = ?", "options": ["A. 1", "B. 2", "C. 10", "D. 20"], "ans": "B"},
        {"q": "Area of trapezium with parallel sides 10,6 cm; height 8 cm?", "options": ["A. 56 cm²", "B. 60 cm²", "C. 64 cm²", "D. 68 cm²"], "ans": "C"},
        {"q": "A is 40% more than B. B is what % less than A?", "options": ["A. 25.71%", "B. 28.57%", "C. 30%", "D. 33.33%"], "ans": "B"},
        {"q": "A pool filled by A in 12h, emptied by B in 8h. If both open, hours to empty?", "options": ["A. 20h", "B. 22h", "C. 24h", "D. 26h"], "ans": "C"},
        {"q": "Find arithmetic mean of 1st 20 odd natural numbers.", "options": ["A. 18", "B. 19", "C. 20", "D. 21"], "ans": "C"},
        {"q": "Successive discounts 20% and 10% ≡ single discount?", "options": ["A. 28%", "B. 29%", "C. 30%", "D. 31%"], "ans": "A"},
        {"q": "A car depreciates 20% yearly. Value after 2 years on ₹10000?", "options": ["A. ₹6000", "B. ₹6200", "C. ₹6400", "D. ₹6500"], "ans": "C"},
        {"q": "In an AP: 3,7,11,... What is the 10th term?", "options": ["A. 37", "B. 39", "C. 40", "D. 43"], "ans": "B"},
        {"q": "GP: 2, 6, 18, 54... What is the 6th term?", "options": ["A. 486", "B. 500", "C. 512", "D. 540"], "ans": "A"},
        {"q": "Upstream speed 4 km/h, downstream 8 km/h. Boat speed in still water?", "options": ["A. 4 km/h", "B. 5 km/h", "C. 6 km/h", "D. 7 km/h"], "ans": "C"},
        {"q": "Pipes A,B,C fill tank. A and B in 12h; B and C in 15h; A and C in 20h. A alone?", "options": ["A. 20h", "B. 24h", "C. 28h", "D. 30h"], "ans": "B"},
        {"q": "If 3A = 4B = 6C, ratio A:B:C = ?", "options": ["A. 4:3:2", "B. 2:3:4", "C. 3:4:6", "D. 6:4:3"], "ans": "A"},
        {"q": "A train overtakes two persons walking at 2 and 4 km/h, passing them in 9s and 10s. Train length?", "options": ["A. 45 m", "B. 50 m", "C. 55 m", "D. 60 m"], "ans": "B"},
        {"q": "Data: 5,8,12,15,20. Variance = ?", "options": ["A. 26", "B. 27.4", "C. 28", "D. 30"], "ans": "B"},
        {"q": "Milk:Water = 4:1 in mixture. Replace 10L with water. New ratio = 2:3 if original was 40L?", "options": ["A. Yes", "B. No", "C. Insufficient data", "D. None"], "ans": "A"},
        {"q": "Sum of GP 1+2+4+...+512 = ?", "options": ["A. 1022", "B. 1023", "C. 1024", "D. 1025"], "ans": "B"},
    ],

    # ══════════════════════════════════════════════════════════════════
    #  LEVEL 6 – Advanced Algebra, Geometry & Reasoning
    # ══════════════════════════════════════════════════════════════════
    6: [
        {"q": "Roots of 2x² - 7x + 3 = 0?", "options": ["A. 3, 0.5", "B. 3, 1", "C. 2, 1.5", "D. 4, 0.5"], "ans": "A"},
        {"q": "A sphere radius 6 cm. Surface area? (π=22/7)", "options": ["A. 452.57 cm²", "B. 460 cm²", "C. 464 cm²", "D. 480 cm²"], "ans": "A"},
        {"q": "A sum becomes ₹1331 in 3 years at 10% CI. Principal?", "options": ["A. ₹900", "B. ₹950", "C. ₹1000", "D. ₹1100"], "ans": "C"},
        {"q": "If sinθ = 5/13, cosθ = ?", "options": ["A. 12/13", "B. 5/12", "C. 8/13", "D. 13/5"], "ans": "A"},
        {"q": "Speed ratio of A:B = 3:4. Time ratio to cover same distance?", "options": ["A. 3:4", "B. 4:3", "C. 9:16", "D. 2:3"], "ans": "B"},
        {"q": "nC₂ = 21. Find n.", "options": ["A. 5", "B. 6", "C. 7", "D. 8"], "ans": "C"},
        {"q": "Slant height of cone: r=5, h=12?", "options": ["A. 11 cm", "B. 12 cm", "C. 13 cm", "D. 14 cm"], "ans": "C"},
        {"q": "Average of 5 numbers is 18. If one is removed, avg becomes 16. Removed number?", "options": ["A. 24", "B. 26", "C. 28", "D. 30"], "ans": "B"},
        {"q": "In a class, 30% fail English, 20% fail Maths, 10% fail both. Pass both%?", "options": ["A. 55%", "B. 60%", "C. 65%", "D. 70%"], "ans": "B"},
        {"q": "Rationalise: 1/(√5+√3) = ?", "options": ["A. (√5-√3)/2", "B. (√5+√3)/2", "C. (√5-√3)/4", "D. 1/2"], "ans": "A"},
        {"q": "At what point does y=2x+3 intersect the x-axis?", "options": ["A. (-1.5, 0)", "B. (0, 3)", "C. (1.5, 0)", "D. (-3, 0)"], "ans": "A"},
        {"q": "A shopkeeper marks 40% above CP and gives 20% discount. Profit%?", "options": ["A. 10%", "B. 12%", "C. 14%", "D. 16%"], "ans": "B"},
        {"q": "nP₃ = 120. Find n.", "options": ["A. 4", "B. 5", "C. 6", "D. 7"], "ans": "B"},
        {"q": "Volume of a cone: r=7, h=9? (π=22/7)", "options": ["A. 452 cm³", "B. 462 cm³", "C. 472 cm³", "D. 482 cm³"], "ans": "B"},
        {"q": "Angle subtended by diameter = ?", "options": ["A. 45°", "B. 60°", "C. 90°", "D. 120°"], "ans": "C"},
        {"q": "Length of longest rod in room 12×9×8 m?", "options": ["A. 17 m", "B. 18 m", "C. 19 m", "D. 20 m"], "ans": "A"},
        {"q": "4 men+6 women finish in 8days; 3 men+7 women in 10 days. One man VS one woman?", "options": ["A. Man faster", "B. Woman faster", "C. Equal", "D. Cannot determine"], "ans": "A"},
        {"q": "Sum = ₹12000. Invested at 5% and 8%. Total interest ₹840. Amount at 5%?", "options": ["A. ₹6000", "B. ₹7000", "C. ₹8000", "D. ₹9000"], "ans": "C"},
        {"q": "Two circles tangent externally, radii 3 and 5. Distance between centres?", "options": ["A. 6", "B. 7", "C. 8", "D. 9"], "ans": "C"},
        {"q": "Remainder when 2^100 is divided by 3?", "options": ["A. 0", "B. 1", "C. 2", "D. 3"], "ans": "B"},
    ],

    # ══════════════════════════════════════════════════════════════════
    #  LEVEL 7 – Advanced Word Problems & Number Theory
    # ══════════════════════════════════════════════════════════════════
    7: [
        {"q": "A can do work in 'a' days, B in 'b' days. Together in?", "options": ["A. ab/(a+b)", "B. (a+b)/ab", "C. a+b", "D. ab"], "ans": "A"},
        {"q": "If x+y=10 and xy=24, then x²+y²=?", "options": ["A. 48", "B. 52", "C. 56", "D. 60"], "ans": "B"},
        {"q": "A number when divided by 6 leaves 4, by 10 leaves 8. Smallest such number?", "options": ["A. 28", "B. 34", "C. 38", "D. 44"], "ans": "A"},
        {"q": "A merchant sells at 15% profit. If CP increased by 10% and SP unchanged, profit%?", "options": ["A. 4.54%", "B. 4.76%", "C. 5.0%", "D. 5.5%"], "ans": "A"},
        {"q": "y = x² - 4x + 4. Minimum value?", "options": ["A. 0", "B. 2", "C. 4", "D. -4"], "ans": "A"},
        {"q": "In a triangle, angles in ratio 1:2:3. Largest angle?", "options": ["A. 60°", "B. 80°", "C. 90°", "D. 100°"], "ans": "C"},
        {"q": "Harmonic mean of 4 and 12?", "options": ["A. 6", "B. 7", "C. 8", "D. 9"], "ans": "A"},
        {"q": "How many 3-digit numbers divisible by 7?", "options": ["A. 126", "B. 127", "C. 128", "D. 129"], "ans": "C"},
        {"q": "Sum of series: 1+3+5+...+99?", "options": ["A. 2400", "B. 2500", "C. 2600", "D. 2700"], "ans": "B"},
        {"q": "A boat goes 48 km upstream in 4h, downstream in 3h. Speed of stream?", "options": ["A. 2 km/h", "B. 3 km/h", "C. 4 km/h", "D. 5 km/h"], "ans": "A"},
        {"q": "If (a+b)=5 and (a²+b²)=13, find ab.", "options": ["A. 4", "B. 5", "C. 6", "D. 7"], "ans": "C"},
        {"q": "A well is dug 20m deep, 7m diameter. Volume of earth removed? (π=22/7)", "options": ["A. 770 m³", "B. 880 m³", "C. 950 m³", "D. 990 m³"], "ans": "A"},
        {"q": "P, Q, R together do job in 6 days. P and Q in 10 days. R alone?", "options": ["A. 12 days", "B. 14 days", "C. 15 days", "D. 16 days"], "ans": "C"},
        {"q": "Price fell 20%. By what % must it rise to restore original?", "options": ["A. 20%", "B. 22%", "C. 25%", "D. 30%"], "ans": "C"},
        {"q": "Next prime after 97?", "options": ["A. 99", "B. 101", "C. 103", "D. 107"], "ans": "B"},
        {"q": "cos 60° × sin 30° = ?", "options": ["A. 1/8", "B. 1/4", "C. 1/2", "D. 3/4"], "ans": "B"},
        {"q": "Amount after 2 yrs CI at 20% on ₹5000?", "options": ["A. ₹7000", "B. ₹7200", "C. ₹7400", "D. ₹7500"], "ans": "B"},
        {"q": "Trains approaching each other at 60 and 90 km/h. Distance 300 km. Time to meet?", "options": ["A. 1.5h", "B. 2h", "C. 2.5h", "D. 3h"], "ans": "B"},
        {"q": "A cistern has outlet. Inlet fills in 9h, together fills in 18h. Outlet empties in?", "options": ["A. 9h", "B. 12h", "C. 18h", "D. 24h"], "ans": "C"},
        {"q": "Solve: x/3 + x/5 = 16. Find x.", "options": ["A. 20", "B. 25", "C. 30", "D. 35"], "ans": "C"},
    ],

    # ══════════════════════════════════════════════════════════════════
    #  LEVEL 8 – Complex Reasoning, Permutation & Combination
    # ══════════════════════════════════════════════════════════════════
    8: [
        {"q": "Number of ways to arrange BANANA?", "options": ["A. 50", "B. 60", "C. 70", "D. 80"], "ans": "B"},
        {"q": "Committee of 3 men, 2 women from 5M,4W. Ways?", "options": ["A. 60", "B. 70", "C. 80", "D. 90"], "ans": "A"},
        {"q": "Probability of getting at least 1 head in 4 coin flips?", "options": ["A. 13/16", "B. 14/16", "C. 15/16", "D. 1"], "ans": "C"},
        {"q": "Positive factors of 360?", "options": ["A. 20", "B. 22", "C. 24", "D. 26"], "ans": "C"},
        {"q": "If log₂8 + log₂4 = x, x = ?", "options": ["A. 3", "B. 4", "C. 5", "D. 6"], "ans": "C"},
        {"q": "How many 4-digit even numbers have no digit repeated?", "options": ["A. 1968", "B. 2016", "C. 2126", "D. 2296"], "ans": "B"},
        {"q": "x³ - 6x² + 11x - 6 = 0. One root is 1. Other roots?", "options": ["A. 2,3", "B. -2,-3", "C. 3,4", "D. 1,4"], "ans": "A"},
        {"q": "Sum of all 4-digit numbers formed by 1,2,3,4 (no repeat)?", "options": ["A. 66660", "B. 67000", "C. 68000", "D. 70000"], "ans": "A"},
        {"q": "In how many ways can 5 boys and 3 girls sit in a row so no two girls sit together?", "options": ["A. 14000", "B. 14400", "C. 15000", "D. 16000"], "ans": "B"},
        {"q": "Pipes A fill in 20h, B fill in 30h, C drain in 40h. Together fill in?", "options": ["A. 17.1h", "B. 17.5h", "C. 18h", "D. 20h"], "ans": "A"},
        {"q": "A four-digit perfect square lies between 5000 and 6000. Which is it?", "options": ["A. 5041", "B. 5184", "C. 5625", "D. 5929"], "ans": "C"},
        {"q": "If (x-a)(x-b) = 0, x=3 or x=-2. Then a+b and ab?", "options": ["A. 1 and -6", "B. -1 and 6", "C. 1 and 6", "D. -1 and -6"], "ans": "A"},
        {"q": "p(A∪B)=0.7, p(A)=0.4, p(B)=0.5. p(A∩B)=?", "options": ["A. 0.2", "B. 0.25", "C. 0.3", "D. 0.35"], "ans": "A"},
        {"q": "GP: 3,9,27,...,2187. How many terms?", "options": ["A. 5", "B. 6", "C. 7", "D. 8"], "ans": "C"},
        {"q": "The number 7 in base 10 is what in binary?", "options": ["A. 101", "B. 110", "C. 111", "D. 1000"], "ans": "C"},
        {"q": "Curved surface area of cylinder: r=7, h=20? (π=22/7)", "options": ["A. 840 cm²", "B. 870 cm²", "C. 880 cm²", "D. 900 cm²"], "ans": "C"},
        {"q": "10 persons shake hands with each other. Total handshakes?", "options": ["A. 40", "B. 45", "C. 50", "D. 55"], "ans": "B"},
        {"q": "Geometric mean of 4, 8, 16?", "options": ["A. 7", "B. 8", "C. 9", "D. 10"], "ans": "B"},
        {"q": "Equation of line through (2,3) with slope 4?", "options": ["A. y=4x+5", "B. y=4x-5", "C. y=4x+3", "D. y=4x-3"], "ans": "B"},
        {"q": "Smallest 6-digit number divisible by 12, 15, and 20?", "options": ["A. 100020", "B. 100040", "C. 100060", "D. 100080"], "ans": "C"},
    ],

    # ══════════════════════════════════════════════════════════════════
    #  LEVEL 9 – High-Difficulty: Calculus-touch, Advanced Number Theory
    # ══════════════════════════════════════════════════════════════════
    9: [
        {"q": "Sum of infinite GP: 1/2+1/4+1/8+...?", "options": ["A. 0.5", "B. 1", "C. 2", "D. ∞"], "ans": "B"},
        {"q": "If f(x) = x² - 3x + 2, f(5) = ?", "options": ["A. 10", "B. 12", "C. 14", "D. 15"], "ans": "B"},
        {"q": "Bayes' theorem: p(A)=0.3, p(B|A)=0.7, p(B|A')=0.2. p(A|B) = ?", "options": ["A. 0.44", "B. 0.50", "C. 0.60", "D. 0.70"], "ans": "A"},
        {"q": "d/dx (x³ + 3x² - x + 5) at x=2?", "options": ["A. 20", "B. 23", "C. 25", "D. 28"], "ans": "B"},
        {"q": "Euler's formula for polyhedra: F+V-E = ?", "options": ["A. 0", "B. 1", "C. 2", "D. 3"], "ans": "C"},
        {"q": "∫(2x+3)dx from 0 to 2 = ?", "options": ["A. 8", "B. 10", "C. 12", "D. 14"], "ans": "B"},
        {"q": "A and B start from opposite ends of 100m track at 5m/s and 3m/s. When do they first meet?", "options": ["A. 10.25s", "B. 11.5s", "C. 12.5s", "D. 13.5s"], "ans": "C"},
        {"q": "How many zeroes in 50!?", "options": ["A. 10", "B. 12", "C. 13", "D. 14"], "ans": "B"},
        {"q": "Number of ways to distribute 10 identical balls into 3 distinct boxes?", "options": ["A. 66", "B. 72", "C. 78", "D. 84"], "ans": "A"},
        {"q": "Modular arithmetic: 17 mod 5 = ?", "options": ["A. 1", "B. 2", "C. 3", "D. 4"], "ans": "B"},
        {"q": "Limit of (x²-4)/(x-2) as x→2?", "options": ["A. 0", "B. 2", "C. 4", "D. ∞"], "ans": "C"},
        {"q": "Matrix det: |2 3; 1 4| = ?", "options": ["A. 4", "B. 5", "C. 6", "D. 8"], "ans": "B"},
        {"q": "Fibonacci: 1,1,2,3,5,8,13,__?", "options": ["A. 18", "B. 19", "C. 20", "D. 21"], "ans": "D"},
        {"q": "How many prime numbers are there between 50 and 100?", "options": ["A. 8", "B. 10", "C. 12", "D. 14"], "ans": "B"},
        {"q": "Binomial expansion (a+b)^4: coefficient of a²b² = ?", "options": ["A. 4", "B. 6", "C. 8", "D. 12"], "ans": "B"},
        {"q": "GCD(252, 198) using Euclidean algorithm?", "options": ["A. 6", "B. 9", "C. 12", "D. 18"], "ans": "D"},
        {"q": "A geometric sequence has a₁=5, r=2. Sum of first 10 terms?", "options": ["A. 5115", "B. 5120", "C. 5125", "D. 5130"], "ans": "A"},
        {"q": "Find min value of f(x) = x² - 6x + 11.", "options": ["A. 0", "B. 2", "C. 3", "D. 4"], "ans": "B"},
        {"q": "p(x) = x³ - 2x² - 5x + 6. p(3) = ?", "options": ["A. 0", "B. 1", "C. 2", "D. 3"], "ans": "A"},
        {"q": "System: 2x+y=8, x-y=1. x+y = ?", "options": ["A. 6", "B. 7", "C. 8", "D. 9"], "ans": "A"},
    ],

    # ══════════════════════════════════════════════════════════════════
    #  LEVEL 10 – Expert: Mixed Advanced Aptitude
    # ══════════════════════════════════════════════════════════════════
    10: [
        {"q": "Integrate ∫(e^x + 1/x)dx.", "options": ["A. e^x + ln|x| + C", "B. e^x + 1 + C", "C. e^x + x + C", "D. xe^x + C"], "ans": "A"},
        {"q": "Number of 5-card hands from 52 cards (C(52,5)) = ?", "options": ["A. 2594",  "B. 2598960", "C. 2600000", "D. 2500000"], "ans": "B"},
        {"q": "If A and B are invertible, (AB)⁻¹ = ?", "options": ["A. A⁻¹B⁻¹", "B. B⁻¹A⁻¹", "C. BA⁻¹", "D. A⁻¹B"], "ans": "B"},
        {"q": "RSA encryption uses which mathematical concept?", "options": ["A. Prime factorisation", "B. Modular arithmetic", "C. Both A & B", "D. Elliptic curves"], "ans": "C"},
        {"q": "Euler's number e ≈ ?", "options": ["A. 2.618", "B. 2.718", "C. 3.141", "D. 1.618"], "ans": "B"},
        {"q": "∑(k=1 to 100) k² = ?", "options": ["A. 333350", "B. 338350", "C. 340200", "D. 350000"], "ans": "B"},
        {"q": "Stirling numbers count what?", "options": ["A. Permutations", "B. Partitions of set", "C. Prime gaps", "D. Tree structures"], "ans": "B"},
        {"q": "P(A)'+ P(B) = 1 when?", "options": ["A. A and B are independent", "B. A and B are complementary", "C. A⊂B", "D. A and B are mutually exclusive"], "ans": "B"},
        {"q": "The golden ratio φ = (1+√5)/2 ≈ ?", "options": ["A. 1.414", "B. 1.618", "C. 1.732", "D. 2.303"], "ans": "B"},
        {"q": "Taylor series of sin(x) = ?", "options": ["A. x - x³/3! + x⁵/5! - ...", "B. 1 - x²/2! + x⁴/4! - ...", "C. x + x³/3! + x⁵/5!", "D. 1 + x + x²/2!"], "ans": "A"},
        {"q": "d²/dx²(x⁴ - 4x³) at x=1?", "options": ["A. -12", "B. -8", "C. 0", "D. 8"], "ans": "B"},
        {"q": "Catalan number C₄ = ?", "options": ["A. 12", "B. 14", "C. 16", "D. 18"], "ans": "B"},
        {"q": "In graph theory, a Hamiltonian path visits each vertex exactly how many times?", "options": ["A. 0", "B. 1", "C. 2", "D. Unlimited"], "ans": "B"},
        {"q": "Bayes spam filter is an example of which ML approach?", "options": ["A. Supervised", "B. Unsupervised", "C. Reinforcement", "D. Semi-supervised"], "ans": "A"},
        {"q": "Dimension of null space + rank = ? (rank-nullity theorem)", "options": ["A. Number of rows", "B. Number of columns", "C. Determinant", "D. Trace"], "ans": "B"},
        {"q": "The recurrence T(n) = 2T(n/2)+n solves to?", "options": ["A. O(n)", "B. O(n log n)", "C. O(n²)", "D. O(log n)"], "ans": "B"},
        {"q": "Chinese Remainder Theorem solves systems of what?", "options": ["A. Quadratic equations", "B. Simultaneous congruences", "C. Differential equations", "D. Polynomial factorisation"], "ans": "B"},
        {"q": "A Markov chain is memoryless. This property is called?", "options": ["A. Stationarity", "B. Ergodicity", "C. Markov property", "D. Chapman-Kolmogorov"], "ans": "C"},
        {"q": "Pigeon-hole: 13 pigeons in 12 holes. At least one hole has ≥ how many?", "options": ["A. 1", "B. 2", "C. 3", "D. 4"], "ans": "B"},
        {"q": "Fermat's Last Theorem states aⁿ+bⁿ=cⁿ has no positive integer solutions for n>?", "options": ["A. 1", "B. 2", "C. 3", "D. 4"], "ans": "B"},
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
#  GAME CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────
POINTS_PER_LEVEL = {
    1: 10, 2: 20, 3: 30, 4: 40, 5: 50,
    6: 60, 7: 70, 8: 80, 9: 90, 10: 100,
}
QUESTIONS_PER_LEVEL = 3  # number of random questions asked per level

# ─────────────────────────────────────────────────────────────────────────────
#  HELPER UTILITIES
# ─────────────────────────────────────────────────────────────────────────────
def clear():
    os.system("cls" if os.name == "nt" else "clear")

def banner():
    print("=" * 65)
    print("      ★  SARTHI-X  APTITUDE  CHALLENGE  ★")
    print("      Levels 1 – 10  |  200 Questions  |  Earn Points!")
    print("=" * 65)

def level_header(level: int, score: int):
    label = [
        "", "Beginner", "Basic", "Elementary", "Intermediate",
        "Proficient", "Advanced", "Expert", "Master",
        "Genius", "Legendary"
    ][level]
    print(f"\n{'─'*65}")
    print(f"  🏆  LEVEL {level}  –  {label}  |  Current Score: {score} pts")
    print(f"{'─'*65}\n")

def ask_question(q_no: int, total: int, question: dict, level: int, score: int) -> bool:
    """Display one question and return True if answered correctly."""
    print(f"  Question {q_no}/{total}  (Level {level}  +{POINTS_PER_LEVEL[level]} pts):\n")
    print(f"  {question['q']}\n")
    for opt in question["options"]:
        print(f"    {opt}")
    print()

    while True:
        ans = input("  Your Answer (A/B/C/D): ").strip().upper()
        if ans in {"A", "B", "C", "D"}:
            break
        print("  ⚠  Please enter A, B, C or D.")

    if ans == question["ans"]:
        print(f"\n  ✅  Correct! +{POINTS_PER_LEVEL[level]} points\n")
        time.sleep(1)
        return True
    else:
        print(f"\n  ❌  Wrong! The correct answer was: {question['ans']}")
        print(f"      ({question['options'][ord(question['ans'])-65]})")
        return False

def game_over_screen(score: int, level_reached: int):
    clear()
    print("\n" + "=" * 65)
    print("                   💀  GAME  OVER  💀")
    print("=" * 65)
    print(f"\n  You reached Level {level_reached}  with a total score of  {score} pts")
    print("\n  Better luck next time! Keep practising. 📚")
    print("=" * 65 + "\n")

def level_complete_screen(level: int, score: int):
    clear()
    print("\n" + "★" * 65)
    print(f"   🎉  LEVEL {level} COMPLETE!  Your score: {score} pts")
    print("★" * 65)
    if level < 10:
        print(f"\n  ⬆   Advancing to Level {level + 1} ...\n")
        time.sleep(2)

def victory_screen(score: int):
    clear()
    print("\n" + "🏅" * 32)
    print("\n   🥇  CONGRATULATIONS! YOU COMPLETED ALL 10 LEVELS! 🥇\n")
    print(f"   FINAL SCORE : {score} points")
    print("\n   You are a TRUE Aptitude Champion! 🎓")
    print("🏅" * 32 + "\n")

def leaderboard_entry(name: str, score: int, level: int):
    """Append score to a simple CSV leaderboard."""
    lb_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "leaderboard.csv")
    write_header = not os.path.exists(lb_path)
    with open(lb_path, "a") as f:
        if write_header:
            f.write("Name,Score,LevelReached,Date\n")
        from datetime import datetime
        f.write(f"{name},{score},{level},{datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
    print(f"\n  📋  Score saved to leaderboard: {lb_path}")

# ─────────────────────────────────────────────────────────────────────────────
#  MAIN GAME LOOP
# ─────────────────────────────────────────────────────────────────────────────
def play():
    clear()
    banner()
    print("\n  Welcome, challenger! Answer randomly selected aptitude")
    print("  questions across 10 levels. One wrong answer – Game Over!")
    print(f"\n  Rules:")
    print(f"    • {QUESTIONS_PER_LEVEL} questions per level")
    print(f"    • Points per correct answer increase each level")
    print(f"    • One wrong answer ends the game immediately")
    print(f"    • Complete all 10 levels for VICTORY!\n")
    print("─" * 65)

    name = input("  Enter your name: ").strip() or "Player"
    print("\n  Press ENTER to start the game...")
    input()

    score = 0
    level_reached = 1

    for level in range(1, 11):
        clear()
        banner()
        level_header(level, score)

        # Pick random questions for this level
        pool = QUESTIONS[level]
        chosen = random.sample(pool, min(QUESTIONS_PER_LEVEL, len(pool)))

        for i, question in enumerate(chosen, 1):
            clear()
            banner()
            level_header(level, score)
            correct = ask_question(i, len(chosen), question, level, score)

            if correct:
                score += POINTS_PER_LEVEL[level]
            else:
                game_over_screen(score, level)
                leaderboard_entry(name, score, level)
                again = input("  Play again? (Y/N): ").strip().upper()
                if again == "Y":
                    play()
                return

        level_reached = level
        level_complete_screen(level, score)

    # Completed all 10 levels
    victory_screen(score)
    leaderboard_entry(name, score, 10)
    again = input("  Play again? (Y/N): ").strip().upper()
    if again == "Y":
        play()

# ─────────────────────────────────────────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    try:
        play()
    except KeyboardInterrupt:
        print("\n\n  Game exited. See you next time! 👋\n")
        sys.exit(0)
