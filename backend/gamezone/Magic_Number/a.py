"""
APTITUDE CHALLENGE — 200-QUESTION EDITION
-----------------------------------------
• 10 levels, with 20 questions in each level (200 questions total).
• One random question is selected from each level.
• Correct answer: +10 points.
• Incorrect answer: Game Over immediately.
• Maximum score: 100 points.
• Run: python aptitude_game.py

The 200-question bank is built into this file. Questions are generated from
fixed, checked templates so the program does not need an internet connection
or any extra packages.
"""

import random

POINTS_PER_QUESTION = 10
TOTAL_LEVELS = 10
QUESTIONS_PER_LEVEL = 20


def make_question(level, number, prompt, correct, wrong_answers):
    """Build a four-option MCQ with the correct answer shuffled into place."""
    options = [str(correct)]
    for answer in wrong_answers:
        answer = str(answer)
        if answer not in options and answer != str(correct):
            options.append(answer)
        if len(options) == 4:
            break

    # Fill any missing distractors safely, if needed.
    candidate = 1
    while len(options) < 4:
        candidate_text = str(candidate)
        if candidate_text not in options:
            options.append(candidate_text)
        candidate += 1

    random.shuffle(options)
    correct_letter = "ABCD"[options.index(str(correct))]
    return {
        "level": level,
        "number": number,
        "question": prompt,
        "options": options,
        "answer": correct_letter,
        "answer_text": str(correct),
    }


def build_question_bank():
    """Return 200 MCQs: 20 questions for each of 10 difficulty levels."""
    bank = {level: [] for level in range(1, TOTAL_LEVELS + 1)}

    # LEVEL 1 — Basic arithmetic
    data = [
        ("What is 12 + 8?", 20, [18, 22, 24]),
        ("What is 35 - 17?", 18, [16, 19, 20]),
        ("What is 6 × 7?", 42, [36, 48, 49]),
        ("What is 81 ÷ 9?", 9, [8, 7, 6]),
        ("What is 15 + 26?", 41, [39, 40, 42]),
        ("What is 50 - 28?", 22, [20, 21, 24]),
        ("What is 9 × 5?", 45, [40, 35, 50]),
        ("What is 72 ÷ 8?", 9, [8, 10, 12]),
        ("What is 14 + 19?", 33, [31, 32, 34]),
        ("What is 100 - 46?", 54, [52, 53, 56]),
        ("What is 11 × 4?", 44, [40, 42, 48]),
        ("What is 63 ÷ 7?", 9, [7, 8, 6]),
        ("What is 27 + 18?", 45, [43, 44, 46]),
        ("What is 90 - 35?", 55, [45, 50, 65]),
        ("What is 8 × 8?", 64, [56, 62, 72]),
        ("What is 56 ÷ 7?", 8, [6, 7, 9]),
        ("What is 32 + 29?", 61, [59, 60, 62]),
        ("What is 75 - 39?", 36, [34, 35, 37]),
        ("What is 12 × 3?", 36, [30, 33, 39]),
        ("What is 96 ÷ 12?", 8, [6, 7, 9]),
    ]
    for i, (q, a, w) in enumerate(data, 1):
        bank[1].append(make_question(1, i, q, a, w))

    # LEVEL 2 — Fractions, percentages, averages
    data = [
        ("What is 25% of 200?", 50, [25, 40, 75]),
        ("What is 10% of 450?", 45, [40, 50, 55]),
        ("What is 3/4 of 80?", 60, [20, 40, 70]),
        ("What is the average of 10, 20 and 30?", 20, [15, 25, 30]),
        ("A price of ₹500 is reduced by 20%. What is the new price?", 400, [350, 420, 450]),
        ("What is 15% of 300?", 45, [30, 40, 60]),
        ("What is 2/5 of 100?", 40, [20, 25, 50]),
        ("Find the average of 12, 18, 24 and 30.", 21, [18, 20, 22]),
        ("A number rises from 80 to 100. What is the percentage increase?", 25, [20, 22, 30]),
        ("What is 35% of 200?", 70, [60, 65, 75]),
        ("Simplify 18/24.", "3/4", ["2/3", "4/5", "5/6"]),
        ("What is 60% of 150?", 90, [80, 85, 100]),
        ("The average of 6 and 14 is what?", 10, [8, 9, 12]),
        ("What is 1/8 of 64?", 8, [6, 7, 9]),
        ("A ₹800 item gets a 10% discount. How much is the discount?", 80, [40, 60, 100]),
        ("What is 40% of 90?", 36, [30, 32, 40]),
        ("What is 5/6 of 72?", 60, [48, 54, 66]),
        ("The average of 5, 7, 9 and 11 is what?", 8, [7, 8.5, 9]),
        ("A value decreases from 120 to 90. What is the percentage decrease?", 25, [20, 30, 35]),
        ("What is 12.5% of 160?", 20, [16, 18, 24]),
    ]
    for i, (q, a, w) in enumerate(data, 1):
        bank[2].append(make_question(2, i, q, a, w))

    # LEVEL 3 — Ratios, proportion and number patterns
    data = [
        ("Divide 60 in the ratio 2:3. What is the smaller part?", 24, [20, 30, 36]),
        ("If 4 pens cost ₹40, what do 7 pens cost at the same rate?", 70, [60, 75, 80]),
        ("Find the next number: 2, 4, 6, 8, __.", 10, [9, 11, 12]),
        ("Find the next number: 3, 6, 12, 24, __.", 48, [36, 42, 50]),
        ("Simplify the ratio 15:25.", "3:5", ["5:3", "2:5", "3:4"]),
        ("If x:12 = 3:4, what is x?", 9, [8, 10, 12]),
        ("Find the next number: 5, 10, 15, 20, __.", 25, [22, 24, 30]),
        ("A map scale is 1 cm to 5 km. What distance does 4 cm represent?", 20, [15, 25, 30]),
        ("If 6 workers make 30 items, how many items do 2 workers make at the same rate?", 10, [5, 12, 15]),
        ("Find the next number: 1, 4, 9, 16, __.", 25, [20, 24, 36]),
        ("The ratio of boys to girls is 3:2 in a group of 25. How many boys are there?", 15, [10, 12, 18]),
        ("If 5 kg of rice costs ₹250, what is the cost of 8 kg?", 400, [350, 375, 450]),
        ("Find the next number: 7, 14, 28, 56, __.", 112, [84, 98, 120]),
        ("If 2:5 = x:20, find x.", 8, [6, 10, 12]),
        ("A recipe uses flour and sugar in ratio 4:1. If flour is 800 g, how much sugar is needed?", 200, [100, 160, 250]),
        ("Find the next number: 11, 22, 33, 44, __.", 55, [50, 54, 66]),
        ("If 9 machines make 90 parts, how many parts do 4 machines make at the same rate?", 40, [30, 36, 45]),
        ("Simplify the ratio 42:56.", "3:4", ["4:3", "6:7", "2:3"]),
        ("Find the next number: 81, 27, 9, 3, __.", 1, [0, 2, 6]),
        ("If 12 oranges cost ₹96, what is the cost of 5 oranges?", 40, [35, 45, 48]),
    ]
    for i, (q, a, w) in enumerate(data, 1):
        bank[3].append(make_question(3, i, q, a, w))

    # LEVEL 4 — Profit, loss, simple interest and speed
    data = [
        ("An item costs ₹200 and sells for ₹250. What is the profit?", 50, [25, 40, 60]),
        ("A product bought for ₹400 is sold for ₹360. What is the loss percentage?", 10, [8, 12, 15]),
        ("Find simple interest on ₹1,000 at 5% per year for 2 years.", 100, [50, 75, 150]),
        ("A car travels 150 km in 3 hours. What is its average speed?", "50 km/h", ["45 km/h", "55 km/h", "60 km/h"]),
        ("A product bought for ₹500 is sold for ₹600. What is the profit percentage?", 20, [10, 15, 25]),
        ("Find simple interest on ₹2,000 at 4% per year for 3 years.", 240, [200, 220, 260]),
        ("A cyclist travels 60 km in 4 hours. What is the speed?", "15 km/h", ["12 km/h", "16 km/h", "20 km/h"]),
        ("An item sells for ₹720 after a 10% discount. What was its marked price?", 800, [750, 780, 900]),
        ("A trader buys for ₹800 and sells for ₹760. What is the loss?", 40, [30, 35, 50]),
        ("How far does a train travel at 60 km/h in 2.5 hours?", "150 km", ["120 km", "140 km", "180 km"]),
        ("Find simple interest on ₹5,000 at 6% per year for 1 year.", 300, [250, 350, 400]),
        ("An item bought for ₹250 sells for ₹300. Find profit percentage.", 20, [15, 18, 25]),
        ("A bus covers 210 km in 3.5 hours. Find its average speed.", "60 km/h", ["50 km/h", "55 km/h", "70 km/h"]),
        ("A ₹1,200 item is discounted by 25%. What is the sale price?", 900, [800, 950, 1_000]),
        ("An item is sold for ₹540 at a 10% loss. Find its cost price.", 600, [580, 590, 620]),
        ("Find simple interest on ₹3,000 at 8% per year for 2 years.", 480, [400, 450, 500]),
        ("How long does it take to travel 180 km at 45 km/h?", "4 hours", ["3 hours", "5 hours", "6 hours"]),
        ("A product costs ₹700 and sells for ₹840. Find profit percentage.", 20, [15, 18, 25]),
        ("A runner covers 400 m in 50 seconds. What is the speed in m/s?", 8, [6, 7, 10]),
        ("A sum of ₹1,500 earns ₹150 simple interest in 2 years. What is the annual rate?", 5, [4, 6, 10]),
    ]
    for i, (q, a, w) in enumerate(data, 1):
        bank[4].append(make_question(4, i, q, a, w))

    # LEVEL 5 — Algebra and geometry
    data = [
        ("If x + 7 = 19, find x.", 12, [10, 11, 13]),
        ("If 3x = 27, find x.", 9, [6, 8, 12]),
        ("What is the perimeter of a square with side 6 cm?", "24 cm", ["12 cm", "18 cm", "36 cm"]),
        ("What is the area of a rectangle 8 cm long and 5 cm wide?", "40 cm²", ["13 cm²", "26 cm²", "45 cm²"]),
        ("If 2x + 5 = 17, find x.", 6, [5, 7, 8]),
        ("What is the area of a triangle with base 10 cm and height 6 cm?", "30 cm²", ["16 cm²", "60 cm²", "36 cm²"]),
        ("If x - 9 = 14, find x.", 23, [21, 22, 24]),
        ("What is the circumference of a circle with radius 7 cm? Use π = 22/7.", "44 cm", ["22 cm", "49 cm", "154 cm"]),
        ("Solve: 5x = 60.", 12, [10, 11, 15]),
        ("What is the volume of a cube with side 3 cm?", "27 cm³", ["9 cm³", "18 cm³", "36 cm³"]),
        ("If x/4 = 6, find x.", 24, [10, 20, 28]),
        ("A rectangle has area 54 cm² and length 9 cm. What is its width?", "6 cm", ["5 cm", "7 cm", "8 cm"]),
        ("Solve: 4x - 3 = 21.", 6, [5, 7, 8]),
        ("What is the sum of the interior angles of a triangle?", "180°", ["90°", "270°", "360°"]),
        ("If x + 2x = 33, find x.", 11, [9, 10, 12]),
        ("What is the area of a square with side 9 cm?", "81 cm²", ["18 cm²", "36 cm²", "72 cm²"]),
        ("Solve: 2(x + 3) = 18.", 6, [5, 7, 9]),
        ("A right angle measures how many degrees?", 90, [45, 60, 180]),
        ("If 7x + 1 = 50, find x.", 7, [6, 8, 9]),
        ("What is the volume of a cuboid 4 cm × 3 cm × 5 cm?", "60 cm³", ["12 cm³", "20 cm³", "45 cm³"]),
    ]
    for i, (q, a, w) in enumerate(data, 1):
        bank[5].append(make_question(5, i, q, a, w))

    # LEVEL 6 — Work, time, probability and sequences
    data = [
        ("A can finish a job in 6 days. What fraction of the job does A finish in 1 day?", "1/6", ["1/3", "1/5", "1/8"]),
        ("A fair coin is tossed once. What is the probability of heads?", "1/2", ["1/3", "1/4", "1"]),
        ("Find the next number: 2, 6, 12, 20, 30, __.", 42, [36, 40, 44]),
        ("A can do a job in 10 days. How much of the job is done in 5 days at a constant rate?", "1/2", ["1/3", "2/3", "1/5"]),
        ("A die is rolled. What is the probability of getting a 6?", "1/6", ["1/2", "1/3", "1/5"]),
        ("Find the next number: 4, 9, 16, 25, __.", 36, [30, 35, 49]),
        ("A completes a job in 12 days. How many days would 2 equally fast workers take together?", 6, [4, 8, 10]),
        ("A bag has 3 red and 2 blue balls. What is the probability of drawing a blue ball?", "2/5", ["1/5", "3/5", "1/2"]),
        ("Find the next number: 1, 1, 2, 3, 5, 8, __.", 13, [11, 12, 15]),
        ("If 4 workers take 9 days, how many worker-days are needed for the job?", 36, [13, 32, 40]),
        ("A die is rolled. What is the probability of getting an even number?", "1/2", ["1/6", "1/3", "2/3"]),
        ("Find the next number: 3, 8, 15, 24, 35, __.", 48, [45, 46, 50]),
        ("A does a job in 8 days and B in 8 days. How long together?", 4, [2, 6, 8]),
        ("A box has 4 green and 6 yellow balls. Probability of green?", "2/5", ["1/5", "3/5", "1/2"]),
        ("Find the next number: 64, 32, 16, 8, __.", 4, [2, 6, 12]),
        ("A can finish a task in 15 days. What fraction remains after 5 days?", "2/3", ["1/3", "1/2", "3/4"]),
        ("A card is drawn from a standard 52-card deck. Probability it is an ace?", "1/13", ["1/4", "1/26", "4/13"]),
        ("Find the next number: 10, 13, 19, 28, 40, __.", 55, [50, 52, 60]),
        ("A can do a job in 4 days and B in 12 days. How long together?", 3, [4, 6, 8]),
        ("A bag has 5 white and 5 black balls. Probability of drawing a white ball?", "1/2", ["1/5", "1/4", "2/5"]),
    ]
    for i, (q, a, w) in enumerate(data, 1):
        bank[6].append(make_question(6, i, q, a, w))

    # LEVEL 7 — Logical reasoning and word problems
    data = [
        ("All roses are flowers. Which statement must be true?", "All roses are flowers", ["All flowers are roses", "No roses are flowers", "All flowers are red"]),
        ("If today is Monday, what day will it be 10 days later?", "Thursday", ["Tuesday", "Wednesday", "Friday"]),
        ("Choose the odd one out: 2, 3, 5, 9, 11.", 9, [2, 5, 11]),
        ("Complete the analogy: Book is to reading as fork is to __.", "eating", ["writing", "walking", "sleeping"]),
        ("If A is taller than B and B is taller than C, who is shortest?", "C", ["A", "B", "Cannot tell"]),
        ("How many months have 28 days?", 12, [1, 2, 11]),
        ("Find the odd one out: square, triangle, circle, carrot.", "carrot", ["square", "triangle", "circle"]),
        ("If CAT is coded as DBU (each letter moves forward by one), DOG is coded as what?", "EPH", ["CNG", "EOG", "FPH"]),
        ("A clock shows 3:00. What is the angle between its hands?", "90°", ["0°", "45°", "180°"]),
        ("Which number does not belong: 16, 25, 36, 48, 49?", 48, [16, 36, 49]),
        ("If all laptops are devices and some devices are expensive, must all laptops be expensive?", "No", ["Yes", "Only on weekdays", "Cannot define a laptop"]),
        ("A person faces north, turns right, then right again. Which direction are they facing?", "South", ["North", "East", "West"]),
        ("Complete the series: A, C, E, G, __.", "I", ["H", "J", "K"]),
        ("If 1 January is a Tuesday, what day is 8 January?", "Tuesday", ["Monday", "Wednesday", "Thursday"]),
        ("Which is the odd one out: 8, 27, 64, 100, 125?", 100, [8, 27, 64]),
        ("Complete the analogy: Bird is to nest as bee is to __.", "hive", ["web", "den", "stable"]),
        ("A is the brother of B. B is the sister of C. How is A related to C?", "Brother", ["Sister", "Father", "Uncle"]),
        ("Which word cannot be formed from the letters in LISTEN?", "SILENTLY", ["TIN", "LINE", "SENT"]),
        ("If you overtake the person in second place in a race, what place are you in?", "Second", ["First", "Third", "Last"]),
        ("Complete the series: Z, X, V, T, __.", "R", ["S", "Q", "P"]),
    ]
    for i, (q, a, w) in enumerate(data, 1):
        bank[7].append(make_question(7, i, q, a, w))

    # LEVEL 8 — Mixed aptitude
    data = [
        ("A number is increased by 20% and becomes 120. What was the original number?", 100, [90, 96, 110]),
        ("The sum of two numbers is 50 and their difference is 10. What is the larger number?", 30, [20, 25, 35]),
        ("A train 120 m long passes a pole in 6 seconds. What is its speed?", "20 m/s", ["15 m/s", "18 m/s", "24 m/s"]),
        ("If 40% of a number is 72, what is the number?", 180, [160, 170, 200]),
        ("A shopkeeper marks an item at ₹1,000 and gives 10% discount. What is the selling price?", 900, [800, 950, 990]),
        ("The ratio of two numbers is 5:7 and their sum is 96. What is the smaller number?", 40, [35, 42, 56]),
        ("A boat travels 30 km downstream in 2 hours. What is its downstream speed?", "15 km/h", ["10 km/h", "12 km/h", "18 km/h"]),
        ("The average of five numbers is 18. Their total is what?", 90, [80, 85, 95]),
        ("A number divided by 5 gives 13. What is the number?", 65, [55, 60, 70]),
        ("If 12% of x is 36, find x.", 300, [250, 280, 320]),
        ("A car uses 8 litres for 100 km. How many litres for 250 km at the same rate?", 20, [16, 18, 25]),
        ("Two angles of a triangle are 45° and 65°. Find the third angle.", "70°", ["60°", "80°", "90°"]),
        ("A sum doubles in 8 years at simple interest. What is the annual interest rate?", "12.5%", ["10%", "15%", "20%"]),
        ("If 3 notebooks cost ₹ ninety, what is the cost of 8 notebooks?", "₹240", ["₹180", "₹210", "₹270"]),
        ("A person walks 5 km north and then 12 km east. How far are they from the starting point?", "13 km", ["12 km", "15 km", "17 km"]),
        ("A 30% discount on ₹600 is how much?", 180, [120, 150, 200]),
        ("If 2x + 3 = 19, find x.", 8, [6, 7, 9]),
        ("A tank is 3/5 full. If its capacity is 200 litres, how much water is in it?", "120 litres", ["80 litres", "100 litres", "150 litres"]),
        ("A number is 25% less than 80. What is it?", 60, [55, 65, 70]),
        ("A worker earns ₹900 for 6 days. At the same rate, how much for 10 days?", 1500, [1200, 1350, 1800]),
    ]
    for i, (q, a, w) in enumerate(data, 1):
        bank[8].append(make_question(8, i, q, a, w))

    # LEVEL 9 — Advanced arithmetic and reasoning
    data = [
        ("A and B can complete a job in 12 days together. A alone takes 20 days. How long does B alone take?", 30, [24, 28, 36]),
        ("A price rises by 25% and then falls by 20%. Compared with the original, the final price is:", "unchanged", ["5% higher", "5% lower", "10% higher"]),
        ("The HCF of 36 and 48 is what?", 12, [6, 8, 18]),
        ("The LCM of 8 and 12 is what?", 24, [16, 20, 36]),
        ("A train travels 240 km at 80 km/h. How long does it take?", "3 hours", ["2 hours", "4 hours", "5 hours"]),
        ("If x:y = 4:7 and y = 35, find x.", 20, [15, 25, 28]),
        ("A sum earns ₹600 simple interest at 5% per year in 3 years. Find the principal.", 4000, [3000, 3500, 4500]),
        ("The average of 8 numbers is 14. If one number 21 is removed, what is the average of the remaining 7?", 13, [12, 14, 15]),
        ("A seller makes 25% profit on cost price ₹800. Find the selling price.", 1000, [900, 950, 1_100]),
        ("A can do a job in 18 days and B in 9 days. How long together?", 6, [5, 7, 9]),
        ("The roots of x² = 49 are:", "7 and -7", ["7 only", "-7 only", "49 and -49"]),
        ("A number leaves remainder 2 when divided by 5. Which could be the number?", 17, [15, 16, 20]),
        ("If 15 workers finish a job in 12 days, how many days will 10 workers take at the same rate?", 18, [15, 16, 20]),
        ("A box contains 4 red, 5 blue and 1 green ball. Probability of not drawing blue?", "1/2", ["1/5", "2/5", "3/5"]),
        ("The difference between compound interest and simple interest on ₹1,000 for 2 years at 10% per year is:", 10, [5, 20, 100]),
        ("If 3/7 of a number is 24, find the number.", 56, [49, 63, 72]),
        ("A car's speed increases from 50 km/h to 60 km/h. What is the percentage increase?", 20, [10, 15, 25]),
        ("The perimeter of a rectangle is 50 cm and its length is 15 cm. Find its width.", "10 cm", ["5 cm", "12 cm", "20 cm"]),
        ("If 2⁵ = x, what is x?", 32, [16, 25, 64]),
        ("A person spends 70% of ₹2,000. How much remains?", "₹600", ["₹400", "₹700", "₹800"]),
    ]
    for i, (q, a, w) in enumerate(data, 1):
        bank[9].append(make_question(9, i, q, a, w))

    # LEVEL 10 — Challenge round
    data = [
        ("A can complete a job in 12 days, B in 18 days. How long do they take together?", "7.2 days", ["6 days", "8 days", "9 days"]),
        ("A 20% discount followed by another 10% discount is equivalent to what single discount?", "28%", ["30%", "25%", "32%"]),
        ("A two-digit number has digits summing to 9. Reversing its digits increases it by 27. What is the original number?", 36, [45, 54, 63]),
        ("The mean of 6 numbers is 15. Five numbers total 68. What is the sixth number?", 22, [20, 21, 23]),
        ("A train 180 m long passes a 220 m platform in 20 seconds. Find its speed.", "20 m/s", ["18 m/s", "22 m/s", "25 m/s"]),
        ("If x + y = 12 and x - y = 4, find x.", 8, [6, 7, 10]),
        ("A sum amounts to ₹1,320 after 2 years at 10% simple interest per year. Find the principal.", 1100, [1000, 1200, 1250]),
        ("A mixture has milk and water in ratio 5:2. In 28 litres, how much is water?", "8 litres", ["5 litres", "10 litres", "20 litres"]),
        ("A number is first multiplied by 3, then 8 is added, giving 35. Find the number.", 9, [7, 8, 11]),
        ("A can finish a job in 10 days, B in 15 days. They work together for 3 days. What fraction of the job remains?", "1/2", ["1/3", "2/5", "3/5"]),
        ("The probability of an event is 0.35. What is the probability it does not occur?", 0.65, [0.35, 0.55, 0.75]),
        ("If the radius of a circle doubles, its area becomes how many times the original?", 4, [2, 3, 6]),
        ("A sum of money doubles in 5 years at simple interest. What is the annual rate?", "20%", ["10%", "15%", "25%"]),
        ("A shopkeeper sells two items for ₹600 each, one at 20% profit and one at 20% loss. Overall result?", "4% loss", ["No profit or loss", "4% profit", "2% loss"]),
        ("If 4x - 7 = 2x + 9, find x.", 8, [6, 7, 9]),
        ("The LCM of 15, 20 and 30 is what?", 60, [30, 45, 90]),
        ("A person travels equal distances at 30 km/h and 60 km/h. What is the average speed for the whole journey?", "40 km/h", ["45 km/h", "35 km/h", "50 km/h"]),
        ("A number increases by 10% and then by 10% again. What is the total percentage increase?", "21%", ["20%", "19%", "22%"]),
        ("If 5 machines produce 500 units in 4 hours, how many units do 8 machines produce in 3 hours at the same rate?", 600, [500, 550, 650]),
        ("A bag contains 3 red and 7 blue balls. Two balls are drawn without replacement. What is the probability both are red?", "1/15", ["1/10", "1/5", "2/15"]),
    ]
    # Correct one accidentally malformed distractor in the speed question by replacing it.
    for i, (q, a, w) in enumerate(data, 1):
        w = [x for x in w if x != "ตรง え"]
        bank[10].append(make_question(10, i, q, a, w))

    # Validate total count and per-level count.
    assert sum(len(items) for items in bank.values()) == 200
    assert all(len(items) == QUESTIONS_PER_LEVEL for items in bank.values())
    return bank


def ask_question(question, score):
    """Display an MCQ and return the updated score and whether it was correct."""
    print("\n" + "-" * 64)
    print(f"LEVEL {question['level']}  |  Question {question['number']}")
    print(question["question"])
    for index, option in enumerate(question["options"]):
        print(f"  {'ABCD'[index]}. {option}")

    while True:
        answer = input("Your answer (A/B/C/D): ").strip().upper()
        if answer in {"A", "B", "C", "D"}:
            break
        print("Please enter only A, B, C, or D.")

    if answer == question["answer"]:
        score += POINTS_PER_QUESTION
        print(f"Correct! +{POINTS_PER_QUESTION} points. Current score: {score}")
        return score, True

    print("Incorrect answer!")
    print(f"Correct answer: {question['answer']}. {question['answer_text']}")
    print("GAME OVER — one wrong answer ends the game.")
    return score, False


def play_game(bank):
    print("\n" + "=" * 64)
    print("                 APTITUDE CHALLENGE")
    print("=" * 64)
    name = input("Enter your name: ").strip() or "Student"
    print(f"\nWelcome, {name}!")
    print("There are 10 levels. One random question is selected per level.")
    print("Correct answer = +10 points. One wrong answer ends the game.")
    print("Maximum score: 100 points.")

    score = 0
    for level in range(1, TOTAL_LEVELS + 1):
        question = random.choice(bank[level])
        score, correct = ask_question(question, score)
        if not correct:
            break
        if level < TOTAL_LEVELS:
            input("Press Enter to continue to the next level...")

    print("\n" + "=" * 64)
    print(f"Player: {name}")
    print(f"Final score: {score}/{TOTAL_LEVELS * POINTS_PER_QUESTION}")
    print("=" * 64)
    return score


def main():
    bank = build_question_bank()
    print(f"Loaded {sum(len(items) for items in bank.values())} questions.")
    while True:
        play_game(bank)
        again = input("\nPlay again? (Y/N): ").strip().upper()
        if again != "Y":
            print("Thanks for playing. Goodbye!")
            break


if __name__ == "__main__":
    main()
