""" General Knowledge Explorer: a student-friendly multiple-choice learning game. """


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

QUESTIONS = [{'level': 1, 'question': 'What is the capital of India?', 'options': ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'], 'answer': 'B', 'explanation': 'New Delhi is the capital of India.'}, {'level': 1, 'question': 'How many days are there in a week?', 'options': ['5', '6', '7', '8'], 'answer': 'C', 'explanation': 'A week has seven days.'}, {'level': 1, 'question': "Which is Earth's largest ocean?", 'options': ['Atlantic', 'Indian', 'Arctic', 'Pacific'], 'answer': 'D', 'explanation': 'The Pacific Ocean is the largest.'}, {'level': 1, 'question': "Which is India's national animal?", 'options': ['Bengal tiger', 'Lion', 'Elephant', 'Peacock'], 'answer': 'A', 'explanation': "The Bengal tiger is India's national animal."}, {'level': 1, 'question': 'Which Indian festival is widely called the festival of lights?', 'options': ['Holi', 'Diwali', 'Pongal', 'Baisakhi'], 'answer': 'B', 'explanation': 'Diwali is commonly called the festival of lights.'}, {'level': 2, 'question': 'Which planet is largest in the Solar System?', 'options': ['Earth', 'Saturn', 'Jupiter', 'Mars'], 'answer': 'C', 'explanation': 'Jupiter is the largest planet.'}, {'level': 2, 'question': 'What is the currency of Japan?', 'options': ['Won', 'Yuan', 'Yen', 'Rupee'], 'answer': 'C', 'explanation': 'Japan uses the yen.'}, {'level': 2, 'question': 'How many colours are traditionally named in a rainbow?', 'options': ['5', '6', '7', '8'], 'answer': 'C', 'explanation': 'The traditional list names seven colours.'}, {'level': 2, 'question': 'Which is commonly considered the smallest continent?', 'options': ['Europe', 'Australia', 'South America', 'Antarctica'], 'answer': 'B', 'explanation': 'Australia is commonly considered the smallest continent.'}, {'level': 2, 'question': 'Which sport uses a shuttlecock?', 'options': ['Tennis', 'Badminton', 'Cricket', 'Hockey'], 'answer': 'B', 'explanation': 'Badminton is played with a shuttlecock.'}, {'level': 3, 'question': "Who wrote India's national anthem, Jana Gana Mana?", 'options': ['Bankim Chandra Chattopadhyay', 'Rabindranath Tagore', 'Sarojini Naidu', 'Subramania Bharati'], 'answer': 'B', 'explanation': 'Rabindranath Tagore wrote Jana Gana Mana.'}, {'level': 3, 'question': 'Which Indian city is known as the Pink City?', 'options': ['Jaipur', 'Lucknow', 'Bhopal', 'Surat'], 'answer': 'A', 'explanation': 'Jaipur is widely known as the Pink City.'}, {'level': 3, 'question': 'What is the largest mammal on Earth?', 'options': ['African elephant', 'Blue whale', 'Giraffe', 'Orca'], 'answer': 'B', 'explanation': 'The blue whale is the largest known animal.'}, {'level': 3, 'question': 'Which instrument measures temperature?', 'options': ['Barometer', 'Thermometer', 'Compass', 'Altimeter'], 'answer': 'B', 'explanation': 'A thermometer measures temperature.'}, {'level': 3, 'question': "Alappuzha's famous backwaters are in which state?", 'options': ['Kerala', 'Punjab', 'Gujarat', 'Bihar'], 'answer': 'A', 'explanation': 'Alappuzha is in Kerala.'}, {'level': 4, 'question': 'In which year did India become independent?', 'options': ['1942', '1945', '1947', '1950'], 'answer': 'C', 'explanation': 'India became independent on 15 August 1947.'}, {'level': 4, 'question': 'Which mountain has the highest elevation above sea level?', 'options': ['K2', 'Kangchenjunga', 'Mount Everest', 'Makalu'], 'answer': 'C', 'explanation': 'Mount Everest has the highest elevation above sea level.'}, {'level': 4, 'question': 'Which strait lies between southeastern India and northern Sri Lanka?', 'options': ['Palk Strait', 'Bering Strait', 'English Channel', 'Gibraltar Strait'], 'answer': 'A', 'explanation': 'The Palk Strait separates southeastern India and northern Sri Lanka.'}, {'level': 4, 'question': 'Which organisation publishes the World Economic Outlook?', 'options': ['UNICEF', 'IMF', 'WHO', 'UNESCO'], 'answer': 'B', 'explanation': 'The International Monetary Fund publishes it.'}, {'level': 4, 'question': 'Which language generally has the most native speakers worldwide?', 'options': ['English', 'Mandarin Chinese', 'Spanish', 'Hindi'], 'answer': 'B', 'explanation': 'Mandarin Chinese is generally estimated to have the most native speakers.'}, {'level': 5, 'question': 'Who was the first person to walk on the Moon?', 'options': ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'], 'answer': 'C', 'explanation': 'Neil Armstrong first stepped onto the Moon in July 1969.'}, {'level': 5, 'question': 'What is the chemical symbol for gold?', 'options': ['Ag', 'Au', 'Gd', 'Go'], 'answer': 'B', 'explanation': "Gold's chemical symbol is Au."}, {'level': 5, 'question': 'Which country gifted the Statue of Liberty to the United States?', 'options': ['France', 'Italy', 'Canada', 'Spain'], 'answer': 'A', 'explanation': 'France gifted the Statue of Liberty to the United States.'}, {'level': 5, 'question': 'Which is the longest river flowing entirely within India?', 'options': ['Ganga', 'Godavari', 'Yamuna', 'Narmada'], 'answer': 'B', 'explanation': 'The Godavari is commonly described as the longest river flowing entirely within India.'}, {'level': 5, 'question': 'Which scientist discovered the Raman effect?', 'options': ['Homi Bhabha', 'C. V. Raman', 'Vikram Sarabhai', 'S. N. Bose'], 'answer': 'B', 'explanation': 'C. V. Raman discovered the Raman effect.'}, {'level': 6, 'question': 'Where is the headquarters of the United Nations?', 'options': ['Geneva', 'Paris', 'New York City', 'Vienna'], 'answer': 'C', 'explanation': 'The UN headquarters is in New York City.'}, {'level': 6, 'question': 'Which classical dance form is associated with Tamil Nadu?', 'options': ['Kathak', 'Bharatanatyam', 'Kathakali', 'Sattriya'], 'answer': 'B', 'explanation': 'Bharatanatyam is associated with Tamil Nadu.'}, {'level': 6, 'question': 'What is the main role of the Reserve Bank of India?', 'options': ['School exams', 'Central banking and monetary policy', 'Railways', 'National parks'], 'answer': 'B', 'explanation': "The RBI is India's central bank."}, {'level': 6, 'question': 'Which treaty established the European Union?', 'options': ['Treaty of Versailles', 'Treaty of Maastricht', 'Treaty of Tordesillas', 'Treaty of Utrecht'], 'answer': 'B', 'explanation': 'The Maastricht Treaty established the European Union.'}, {'level': 6, 'question': 'Which organisation leads the Olympic Movement?', 'options': ['FIFA', 'International Olympic Committee', 'ICC', 'UNESCO'], 'answer': 'B', 'explanation': 'The International Olympic Committee leads the Olympic Movement.'}, {'level': 7, 'question': "Which is the world's largest hot desert?", 'options': ['Gobi', 'Sahara', 'Arabian Desert', 'Kalahari'], 'answer': 'B', 'explanation': 'The Sahara is the largest hot desert.'}, {'level': 7, 'question': 'What does GDP stand for?', 'options': ['Gross Domestic Product', 'General Development Plan', 'Global Demand Price', 'Gross Distribution Process'], 'answer': 'A', 'explanation': 'GDP stands for Gross Domestic Product.'}, {'level': 7, 'question': "Which Indian mission landed near the Moon's south polar region in 2023?", 'options': ['Chandrayaan-1', 'Mangalyaan', 'Chandrayaan-3', 'Aditya-L1'], 'answer': 'C', 'explanation': 'Chandrayaan-3 landed on the Moon in August 2023.'}, {'level': 7, 'question': 'What is a sustained rise in the general price level called?', 'options': ['Deflation', 'Inflation', 'Recession', 'Depreciation'], 'answer': 'B', 'explanation': 'Inflation is a sustained increase in the general price level.'}, {'level': 7, 'question': 'Which is the headquarters city of ISRO?', 'options': ['Hyderabad', 'Bengaluru', 'Pune', 'Ahmedabad'], 'answer': 'B', 'explanation': 'ISRO headquarters is in Bengaluru.'}, {'level': 8, 'question': 'Which Indian constitutional article concerns equality before law?', 'options': ['Article 14', 'Article 19', 'Article 21A', 'Article 32'], 'answer': 'A', 'explanation': 'Article 14 provides equality before law and equal protection of laws.'}, {'level': 8, 'question': 'Who formulated the laws of planetary motion?', 'options': ['Galileo', 'Johannes Kepler', 'Isaac Newton', 'Edwin Hubble'], 'answer': 'B', 'explanation': 'Johannes Kepler formulated the laws of planetary motion.'}, {'level': 8, 'question': 'Which strait connects the Persian Gulf to the Gulf of Oman?', 'options': ['Malacca', 'Hormuz', 'Dover', 'Bosporus'], 'answer': 'B', 'explanation': 'The Strait of Hormuz connects these bodies of water.'}, {'level': 8, 'question': "Which Nobel Prize category was added later and was not among Alfred Nobel's original prizes?", 'options': ['Physics', 'Chemistry', 'Economic Sciences', 'Medicine'], 'answer': 'C', 'explanation': 'The Economic Sciences prize was established in 1968.'}, {'level': 8, 'question': "Which city is known as India's Silicon Valley?", 'options': ['Bengaluru', 'Jaipur', 'Patna', 'Agra'], 'answer': 'A', 'explanation': "Bengaluru is widely known as India's Silicon Valley."}, {'level': 9, 'question': 'Which index tracks 30 major companies listed on the Bombay Stock Exchange?', 'options': ['Nifty 50', 'BSE Sensex', 'Nikkei 225', 'Dow Jones Transportation Average'], 'answer': 'B', 'explanation': 'The BSE Sensex tracks 30 major BSE-listed companies.'}, {'level': 9, 'question': 'Which agreement is a major international climate treaty?', 'options': ['Paris Agreement', 'Treaty of Utrecht', 'Treaty of Tordesillas', 'Treaty of Brest-Litovsk'], 'answer': 'A', 'explanation': 'The Paris Agreement is a major international climate treaty.'}, {'level': 9, 'question': 'Which branch of government interprets laws and settles legal disputes?', 'options': ['Executive', 'Legislature', 'Judiciary', 'Civil service'], 'answer': 'C', 'explanation': 'The judiciary interprets and applies laws in disputes.'}, {'level': 9, 'question': 'Which data structure follows Last In, First Out?', 'options': ['Queue', 'Stack', 'Tree', 'Graph'], 'answer': 'B', 'explanation': 'A stack removes the most recently added item first.'}, {'level': 9, 'question': 'What is the SI unit of thermodynamic temperature?', 'options': ['Celsius', 'Kelvin', 'Fahrenheit', 'Joule'], 'answer': 'B', 'explanation': 'Kelvin is the SI base unit of thermodynamic temperature.'}, {'level': 10, 'question': 'Which institution sets monetary policy in India?', 'options': ['SEBI', 'Reserve Bank of India', 'NITI Aayog', 'Finance Commission'], 'answer': 'B', 'explanation': "The RBI's Monetary Policy Committee makes key monetary policy decisions."}, {'level': 10, 'question': 'What does DNS primarily do on the internet?', 'options': ['Encrypt every file', 'Resolve domain names to IP addresses', 'Supply electricity', 'Compress video'], 'answer': 'B', 'explanation': 'DNS resolves domain names to IP addresses and other records.'}, {'level': 10, 'question': 'Which statistical measure is the square root of variance?', 'options': ['Median', 'Standard deviation', 'Mode', 'Interquartile range'], 'answer': 'B', 'explanation': 'Standard deviation is the square root of variance.'}, {'level': 10, 'question': 'Which court prosecutes individuals for genocide and certain other international crimes within its jurisdiction?', 'options': ['International Court of Justice', 'International Criminal Court', 'European Court of Human Rights', 'Permanent Court of Arbitration'], 'answer': 'B', 'explanation': 'The International Criminal Court prosecutes individuals for specified crimes within its jurisdiction.'}, {'level': 10, 'question': 'What does UNESCO primarily focus on?', 'options': ['Education, science and culture', 'International banking', 'Global postal services', 'Oil production'], 'answer': 'A', 'explanation': 'UNESCO works in education, science, culture and related fields.'}]

if __name__ == "__main__":
    run_game('General Knowledge Explorer', QUESTIONS, levels=10, subject_mode=False)
