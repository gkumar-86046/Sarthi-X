""" Subject Quiz Battle: a student-friendly multiple-choice learning game. """


import random

def run_game(title, questions, levels=10, subject_mode=False):
    print(f"\n=== {title.upper()} ===")
    while True:
        if subject_mode:
            subjects = sorted({q["subject"] for q in questions})
            print("\nSubjects:")
            for i, subject in enumerate(subjects, 1):
                print(f"{i}. {subject}")
            print("0. Mixed subjects")
            try:
                s = int(input("Choose subject: "))
                chosen_subject = "Mixed" if s == 0 else subjects[s - 1]
            except (ValueError, IndexError):
                print("Invalid subject.")
                continue
            try:
                level = int(input("Choose level 1-5, or 0 for mixed levels: "))
            except ValueError:
                print("Enter a number.")
                continue
            pool = [q for q in questions if (chosen_subject == "Mixed" or q["subject"] == chosen_subject)
                    and (level == 0 or q["level"] == level)]
        else:
            try:
                level = int(input(f"Choose level 1-{levels}, or 0 for a mixed challenge: "))
            except ValueError:
                print("Enter a number.")
                continue
            if level not in range(0, levels + 1):
                print(f"Choose a number from 0 to {levels}.")
                continue
            pool = [q for q in questions if level == 0 or q["level"] == level]

        if not pool:
            print("No questions are available for that selection yet.")
            continue

        selected = random.sample(pool, min(10, len(pool)))
        score = 0
        player2_score = 0
        mode = "1"
        if subject_mode:
            mode = input("Mode: 1 = Solo, 2 = Two-player battle: ").strip()
            if mode not in {"1", "2"}:
                print("Choose 1 or 2.")
                continue

        for i, q in enumerate(selected, 1):
            print(f"\nQuestion {i}/{len(selected)} | Level {q['level']}" +
                  (f" | {q.get('subject', '')}" if subject_mode else ""))
            print(q["question"])
            for j, option in enumerate(q["options"]):
                print(f"  {chr(65+j)}. {option}")

            if subject_mode and mode == "2":
                answers = []
                for player in ("Player 1", "Player 2"):
                    answer = input(f"{player}, answer A/B/C/D (or Q to quit): ").strip().upper()
                    if answer == "Q":
                        print("Battle ended.")
                        return
                    while answer not in {"A", "B", "C", "D"}:
                        answer = input("Enter A, B, C, or D: ").strip().upper()
                    answers.append(answer)
                for n, answer in enumerate(answers):
                    if answer == q["answer"]:
                        if n == 0:
                            score += 10
                        else:
                            player2_score += 10
                        print(f"Player {n+1}: Correct! +10")
                    else:
                        print(f"Player {n+1}: Not quite.")
                print(f"Answer: {q['answer']}. Learn: {q['explanation']}")
            else:
                answer = input("Your answer (A/B/C/D, or Q to quit): ").strip().upper()
                if answer == "Q":
                    print("Game ended.")
                    break
                while answer not in {"A", "B", "C", "D"}:
                    answer = input("Please enter A, B, C, or D: ").strip().upper()
                if answer == q["answer"]:
                    score += 10
                    print("Correct! +10 points")
                else:
                    print(f"Not quite. Correct answer: {q['answer']}")
                print("Learn: " + q["explanation"])

        print("\n=== FINAL SCORE ===")
        if subject_mode and mode == "2":
            print(f"Player 1: {score}/{len(selected)*10}")
            print(f"Player 2: {player2_score}/{len(selected)*10}")
            if score > player2_score:
                print("Player 1 wins!")
            elif player2_score > score:
                print("Player 2 wins!")
            else:
                print("It's a draw!")
        else:
            print(f"Score: {score}/{len(selected)*10}")
        if input("\nPlay again? (Y/N): ").strip().upper() != "Y":
            print(f"Thanks for playing {title}!")
            break

QUESTIONS = [{'subject': 'Math', 'level': 1, 'question': 'What is 12 × 8?', 'options': ['84', '96', '108', '86'], 'answer': 'B', 'explanation': '12 × 8 = 96.'}, {'subject': 'Math', 'level': 1, 'question': 'What is 144 ÷ 12?', 'options': ['10', '11', '12', '14'], 'answer': 'C', 'explanation': '144 divided by 12 equals 12.'}, {'subject': 'Math', 'level': 2, 'question': 'What is 15% of 200?', 'options': ['15', '20', '30', '35'], 'answer': 'C', 'explanation': '0.15 × 200 = 30.'}, {'subject': 'Math', 'level': 2, 'question': 'Solve: 3x + 5 = 20.', 'options': ['3', '5', '7', '8'], 'answer': 'B', 'explanation': 'Subtract 5 to get 3x = 15, so x = 5.'}, {'subject': 'Math', 'level': 3, 'question': 'What is the area of a 9 cm by 4 cm rectangle?', 'options': ['13 cm²', '26 cm²', '36 cm²', '40 cm²'], 'answer': 'C', 'explanation': 'Area = length × width = 36 cm².'}, {'subject': 'Math', 'level': 3, 'question': 'What is the square root of 225?', 'options': ['12', '13', '15', '25'], 'answer': 'C', 'explanation': '15 × 15 = 225.'}, {'subject': 'Math', 'level': 4, 'question': 'What is the probability of an even number on a fair six-sided die?', 'options': ['1/6', '1/3', '1/2', '2/3'], 'answer': 'C', 'explanation': 'Three of six outcomes are even, so probability is 3/6 = 1/2.'}, {'subject': 'Math', 'level': 4, 'question': 'Simplify: 2(x + 3) − x.', 'options': ['x + 3', 'x + 6', '2x + 6', '3x + 3'], 'answer': 'B', 'explanation': '2x + 6 − x = x + 6.'}, {'subject': 'Math', 'level': 5, 'question': "What is the sum of a triangle's interior angles in Euclidean geometry?", 'options': ['90°', '180°', '270°', '360°'], 'answer': 'B', 'explanation': 'The interior angles sum to 180°.'}, {'subject': 'Math', 'level': 5, 'question': 'If 2x = 3y and y = 4, what is x?', 'options': ['4', '6', '8', '12'], 'answer': 'B', 'explanation': '2x = 12, so x = 6.'}, {'subject': 'Science', 'level': 1, 'question': 'Which planet is known as the Red Planet?', 'options': ['Venus', 'Mars', 'Jupiter', 'Mercury'], 'answer': 'B', 'explanation': 'Mars looks reddish because of iron-rich dust.'}, {'subject': 'Science', 'level': 1, 'question': 'Which organ pumps blood around the body?', 'options': ['Liver', 'Heart', 'Lungs', 'Kidneys'], 'answer': 'B', 'explanation': 'The heart pumps blood.'}, {'subject': 'Science', 'level': 2, 'question': 'What is the chemical formula for water?', 'options': ['CO₂', 'H₂O', 'O₂', 'NaCl'], 'answer': 'B', 'explanation': 'A water molecule contains two hydrogen atoms and one oxygen atom.'}, {'subject': 'Science', 'level': 2, 'question': 'Which force pulls objects toward Earth?', 'options': ['Friction', 'Gravity', 'Magnetism', 'Electricity'], 'answer': 'B', 'explanation': 'Gravity attracts objects with mass.'}, {'subject': 'Science', 'level': 3, 'question': 'Which gas do plants absorb for photosynthesis?', 'options': ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium'], 'answer': 'B', 'explanation': 'Plants use carbon dioxide to make sugars during photosynthesis.'}, {'subject': 'Science', 'level': 3, 'question': 'What is the SI unit of force?', 'options': ['Watt', 'Joule', 'Newton', 'Volt'], 'answer': 'C', 'explanation': 'Force is measured in newtons.'}, {'subject': 'Science', 'level': 4, 'question': "Which organelle produces much of a eukaryotic cell's ATP?", 'options': ['Mitochondrion', 'Ribosome', 'Nucleus', 'Cell wall'], 'answer': 'A', 'explanation': "Mitochondria generate much of the cell's ATP."}, {'subject': 'Science', 'level': 4, 'question': 'Which process changes liquid water into vapour?', 'options': ['Freezing', 'Condensation', 'Evaporation', 'Melting'], 'answer': 'C', 'explanation': 'Evaporation changes liquid water into vapour.'}, {'subject': 'Science', 'level': 5, 'question': "Which equation represents Ohm's law?", 'options': ['V = IR', 'F = ma', 'P = mv', 'E = mc'], 'answer': 'A', 'explanation': "Ohm's law is V = IR under suitable conditions."}, {'subject': 'Science', 'level': 5, 'question': 'What is the derivative of x²?', 'options': ['x', '2x', 'x³', '2'], 'answer': 'B', 'explanation': 'The power rule gives 2x.'}, {'subject': 'English', 'level': 1, 'question': 'Choose the opposite of hot.', 'options': ['Warm', 'Cold', 'Bright', 'Boiling'], 'answer': 'B', 'explanation': 'Cold is the opposite of hot.'}, {'subject': 'English', 'level': 1, 'question': 'Choose the correct spelling.', 'options': ['Frend', 'Freind', 'Friend', 'Friand'], 'answer': 'C', 'explanation': 'Friend is the correct spelling.'}, {'subject': 'English', 'level': 2, 'question': 'Choose a synonym for quick.', 'options': ['Slow', 'Rapid', 'Late', 'Quiet'], 'answer': 'B', 'explanation': 'Rapid means fast.'}, {'subject': 'English', 'level': 2, 'question': 'Complete: They ___ playing football.', 'options': ['is', 'am', 'are', 'was'], 'answer': 'C', 'explanation': 'Are agrees with they.'}, {'subject': 'English', 'level': 3, 'question': 'What does generous mean?', 'options': ['Willing to give or share', 'Always angry', 'Unable to speak', 'Careless'], 'answer': 'A', 'explanation': 'Generous means willing to give or share.'}, {'subject': 'English', 'level': 3, 'question': 'Choose the past tense of go.', 'options': ['Goed', 'Gone', 'Went', 'Going'], 'answer': 'C', 'explanation': 'Went is the simple past tense of go.'}, {'subject': 'English', 'level': 4, 'question': 'Choose the correct sentence.', 'options': ["She don't like tea.", "She doesn't likes tea.", "She doesn't like tea.", 'She not like tea.'], 'answer': 'C', 'explanation': "Use the base verb after doesn't."}, {'subject': 'English', 'level': 4, 'question': 'Choose the comparative form of good.', 'options': ['Gooder', 'More good', 'Best', 'Better'], 'answer': 'D', 'explanation': 'Better is the comparative form.'}, {'subject': 'English', 'level': 5, 'question': 'What does break the ice mean?', 'options': ['Make people comfortable', 'End a friendship', 'Start a fire', 'Break a frozen object'], 'answer': 'A', 'explanation': 'The idiom means to ease tension or begin friendly interaction.'}, {'subject': 'English', 'level': 5, 'question': 'What does meticulous mean?', 'options': ['Careful about details', 'Impatient', 'Confused', 'Loud'], 'answer': 'A', 'explanation': 'Meticulous means paying close attention to details.'}, {'subject': 'Computer', 'level': 1, 'question': 'Which device is used to type text?', 'options': ['Monitor', 'Keyboard', 'Speaker', 'Printer'], 'answer': 'B', 'explanation': 'A keyboard is an input device.'}, {'subject': 'Computer', 'level': 1, 'question': 'What does CPU stand for?', 'options': ['Central Processing Unit', 'Computer Power Utility', 'Control Program User', 'Central Print Unit'], 'answer': 'A', 'explanation': 'CPU stands for Central Processing Unit.'}, {'subject': 'Computer', 'level': 2, 'question': 'Which is an operating system?', 'options': ['Python', 'Windows', 'HTML', 'SQL'], 'answer': 'B', 'explanation': 'Windows is an operating system.'}, {'subject': 'Computer', 'level': 2, 'question': 'Which language structures web page content?', 'options': ['HTML', 'SQL', 'Bash', 'R'], 'answer': 'A', 'explanation': 'HTML structures content on web pages.'}, {'subject': 'Computer', 'level': 3, 'question': 'What does RAM primarily provide?', 'options': ['Long-term storage only', 'Temporary working memory', 'Printed copies', 'Internet by itself'], 'answer': 'B', 'explanation': 'RAM holds data and instructions currently in use.'}, {'subject': 'Computer', 'level': 3, 'question': 'Which data structure follows Last In, First Out?', 'options': ['Queue', 'Stack', 'Graph', 'Table'], 'answer': 'B', 'explanation': 'A stack removes the most recently added item first.'}, {'subject': 'Computer', 'level': 4, 'question': 'Which SQL command retrieves data?', 'options': ['SELECT', 'DELETE', 'DROP', 'UPDATE'], 'answer': 'A', 'explanation': 'SELECT retrieves rows from database tables.'}, {'subject': 'Computer', 'level': 4, 'question': 'What does HTTP status code 404 generally mean?', 'options': ['Success', 'Unauthorized', 'Not Found', 'Server started'], 'answer': 'C', 'explanation': '404 means the requested resource was not found.'}, {'subject': 'Computer', 'level': 5, 'question': 'What is the average-case time complexity of binary search on a sorted array?', 'options': ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 'answer': 'B', 'explanation': 'Binary search halves the search range each step.'}, {'subject': 'Computer', 'level': 5, 'question': 'Which keyword defines a function in Python?', 'options': ['func', 'define', 'def', 'function'], 'answer': 'C', 'explanation': 'Python uses def to define functions.'}]

if __name__ == "__main__":
    run_game('Subject Quiz Battle', QUESTIONS, levels=5, subject_mode=True)
