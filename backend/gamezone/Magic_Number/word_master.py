""" Word Master: a student-friendly multiple-choice learning game. """


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

QUESTIONS = [{'level': 1, 'question': "Choose the opposite of 'hot'.", 'options': ['Warm', 'Cold', 'Boiling', 'Bright'], 'answer': 'B', 'explanation': 'Cold is the opposite of hot.'}, {'level': 1, 'question': 'Choose the correct spelling.', 'options': ['Frend', 'Freind', 'Friend', 'Friand'], 'answer': 'C', 'explanation': 'The correct spelling is friend.'}, {'level': 1, 'question': 'Which word names a person, place, animal, thing, or idea?', 'options': ['Noun', 'Verb', 'Adverb', 'Preposition'], 'answer': 'A', 'explanation': 'A noun names a person, place, thing, animal, or idea.'}, {'level': 1, 'question': "Choose the plural of 'child'.", 'options': ['Childs', 'Childes', 'Children', 'Childrens'], 'answer': 'C', 'explanation': 'The standard plural of child is children.'}, {'level': 1, 'question': 'Complete: I ___ happy.', 'options': ['am', 'is', 'are', 'be'], 'answer': 'A', 'explanation': 'Use am with I in the present tense.'}, {'level': 2, 'question': "Choose a synonym for 'quick'.", 'options': ['Slow', 'Rapid', 'Late', 'Quiet'], 'answer': 'B', 'explanation': 'Rapid means fast or quick.'}, {'level': 2, 'question': 'Choose the correct spelling.', 'options': ['Beautifull', 'Beutiful', 'Beautiful', 'Beautyfull'], 'answer': 'C', 'explanation': 'The correct spelling is beautiful.'}, {'level': 2, 'question': 'Complete: She ate ___ apple.', 'options': ['a', 'an', 'the only', 'no article is possible'], 'answer': 'B', 'explanation': 'Use an before a vowel sound; apple begins with one.'}, {'level': 2, 'question': "Identify the verb: 'Birds fly high.'", 'options': ['Birds', 'Fly', 'High', 'The'], 'answer': 'B', 'explanation': 'Fly describes the action.'}, {'level': 2, 'question': "Choose the past tense of 'go'.", 'options': ['Goed', 'Gone', 'Went', 'Going'], 'answer': 'C', 'explanation': 'The simple past tense of go is went.'}, {'level': 3, 'question': "Choose an antonym for 'ancient'.", 'options': ['Old', 'Historic', 'Modern', 'Antique'], 'answer': 'C', 'explanation': 'Modern is an antonym of ancient.'}, {'level': 3, 'question': 'Choose the correctly punctuated sentence.', 'options': ['where are you.', 'Where are you?', 'Where are you,', 'where are you!?'], 'answer': 'B', 'explanation': 'A direct question starts with a capital and ends with a question mark.'}, {'level': 3, 'question': 'Complete: They ___ playing football.', 'options': ['is', 'am', 'are', 'was'], 'answer': 'C', 'explanation': 'Are agrees with the subject they.'}, {'level': 3, 'question': "What does 'generous' mean?", 'options': ['Willing to give or share', 'Always angry', 'Unable to speak', 'Very careless'], 'answer': 'A', 'explanation': 'Generous means willing to give or share.'}, {'level': 3, 'question': "Choose the plural of 'mouse' for the animal.", 'options': ['Mouses', 'Mice', 'Mousees', 'Meese'], 'answer': 'B', 'explanation': 'The usual plural of mouse is mice.'}, {'level': 4, 'question': 'Choose the correct sentence.', 'options': ["She don't like tea.", "She doesn't likes tea.", "She doesn't like tea.", 'She not like tea.'], 'answer': 'C', 'explanation': "Use the base verb after doesn't."}, {'level': 4, 'question': "Choose a synonym for 'cautious'.", 'options': ['Careful', 'Reckless', 'Sleepy', 'Noisy'], 'answer': 'A', 'explanation': 'Cautious means careful to avoid danger or mistakes.'}, {'level': 4, 'question': "Identify the adjective: 'The bright moon shone.'", 'options': ['The', 'Bright', 'Moon', 'Shone'], 'answer': 'B', 'explanation': 'Bright describes the noun moon.'}, {'level': 4, 'question': "Choose the comparative form of 'good'.", 'options': ['Gooder', 'More good', 'Best', 'Better'], 'answer': 'D', 'explanation': 'The comparative form of good is better.'}, {'level': 4, 'question': 'Complete: If I ___ enough time, I would learn French.', 'options': ['have', 'had', 'will have', 'am having'], 'answer': 'B', 'explanation': 'This hypothetical conditional uses if I had.'}, {'level': 5, 'question': "What does 'break the ice' usually mean?", 'options': ['Break a frozen object', 'Make people feel more comfortable', 'End a friendship', 'Start a fire'], 'answer': 'B', 'explanation': 'The idiom means to ease tension or begin friendly interaction.'}, {'level': 5, 'question': 'Complete: The students left ___ books on the desk.', 'options': ['there', 'their', "they're", 'them'], 'answer': 'B', 'explanation': 'Their shows possession.'}, {'level': 5, 'question': "Identify the adverb: 'She spoke softly.'", 'options': ['She', 'Spoke', 'Softly', 'None'], 'answer': 'C', 'explanation': 'Softly describes how she spoke.'}, {'level': 5, 'question': "Choose the passive form of 'The chef cooked the meal.'", 'options': ['The meal cooked the chef.', 'The meal was cooked by the chef.', 'The chef was cooked by the meal.', 'The meal is cooking the chef.'], 'answer': 'B', 'explanation': 'The object becomes the subject in the passive sentence.'}, {'level': 5, 'question': 'Choose the correct spelling.', 'options': ['Necessary', 'Neccessary', 'Necesary', 'Necessery'], 'answer': 'A', 'explanation': 'The correct spelling is necessary.'}, {'level': 6, 'question': "Choose the meaning of 'reluctant'.", 'options': ['Eager', 'Unwilling or hesitant', 'Certain', 'Cheerful'], 'answer': 'B', 'explanation': 'Reluctant means unwilling or hesitant.'}, {'level': 6, 'question': 'Complete: Neither of the answers ___ correct.', 'options': ['are', 'were', 'is', 'have'], 'answer': 'C', 'explanation': 'In formal standard English, neither is usually singular here.'}, {'level': 6, 'question': "Choose the correct use of 'affect'.", 'options': ['The rain may affect our plans.', 'The affect was kind.', 'I bought an affect.', 'She affect yesterday.'], 'answer': 'A', 'explanation': 'Affect is commonly a verb meaning to influence.'}, {'level': 6, 'question': "Choose the reported speech: He said, 'I am tired.'", 'options': ['He said that I am tired.', 'He said that he was tired.', 'He says he tired.', 'He said that he is tiring.'], 'answer': 'B', 'explanation': 'In reported speech, am commonly changes to was and I to he.'}, {'level': 6, 'question': "What is the plural of 'analysis'?", 'options': ['Analysises', 'Analyses', 'Analysis', 'Analysi'], 'answer': 'B', 'explanation': 'The plural of analysis is analyses.'}, {'level': 7, 'question': "What does 'meticulous' mean?", 'options': ['Very careful about details', 'Extremely impatient', 'Easily confused', 'Unusually loud'], 'answer': 'A', 'explanation': 'Meticulous means showing great attention to detail.'}, {'level': 7, 'question': 'Choose the correct phrase.', 'options': ['Between you and I', 'Between you and me', 'Between I and you', 'Between me and he'], 'answer': 'B', 'explanation': 'A preposition takes the object pronoun me.'}, {'level': 7, 'question': "What does 'ambiguous' mean?", 'options': ['Open to more than one interpretation', 'Completely certain', 'Very expensive', 'Easy to measure'], 'answer': 'A', 'explanation': 'Ambiguous language can be understood in more than one way.'}, {'level': 7, 'question': 'Complete: If she had studied, she ___ the test.', 'options': ['will pass', 'would pass', 'would have passed', 'passed tomorrow'], 'answer': 'C', 'explanation': 'The third conditional uses would have plus a past participle.'}, {'level': 7, 'question': 'Choose the correct spelling.', 'options': ['Accommodate', 'Acommodate', 'Accomodate', 'Acomodate'], 'answer': 'A', 'explanation': "Accommodate has two c's and two m's."}, {'level': 8, 'question': "Choose the meaning of 'pragmatic'.", 'options': ['Practical and focused on what works', 'Based only on dreams', 'Hostile without reason', 'Impossible to explain'], 'answer': 'A', 'explanation': 'Pragmatic means dealing with situations practically.'}, {'level': 8, 'question': 'Choose the correct sentence.', 'options': ['Less people attended.', 'Fewer people attended.', 'Fewest people attended than before.', 'Much people attended.'], 'answer': 'B', 'explanation': 'Fewer is normally used with countable plural nouns.'}, {'level': 8, 'question': "What does 'ubiquitous' mean?", 'options': ['Found everywhere', 'Rarely seen', 'Easily broken', 'Highly secret'], 'answer': 'A', 'explanation': 'Ubiquitous means present or found everywhere.'}, {'level': 8, 'question': 'The new policy will ___ every department.', 'options': ['effect', 'affect', 'effects', 'affects'], 'answer': 'B', 'explanation': 'Affect is the verb meaning to influence.'}, {'level': 8, 'question': 'Which sentence is in the present perfect tense?', 'options': ['I finished yesterday.', 'I have finished the work.', 'I will finish soon.', 'I am finishing now.'], 'answer': 'B', 'explanation': 'Present perfect uses have or has plus a past participle.'}, {'level': 9, 'question': "What does 'ephemeral' mean?", 'options': ['Lasting a very short time', 'Extremely reliable', 'Difficult to move', 'Easy to predict'], 'answer': 'A', 'explanation': 'Ephemeral means short-lived.'}, {'level': 9, 'question': 'Choose the correctly punctuated sentence.', 'options': ['I was tired; I went to bed early.', 'I was; tired I went to bed early.', 'I was tired I; went to bed early.', 'I; was tired, I went to bed early.'], 'answer': 'A', 'explanation': 'A semicolon can join closely related independent clauses.'}, {'level': 9, 'question': "What does 'infer' mean?", 'options': ['Reach a conclusion from evidence', 'Copy a sentence exactly', 'Erase a record', 'Disagree automatically'], 'answer': 'A', 'explanation': 'To infer is to draw a conclusion from evidence or reasoning.'}, {'level': 9, 'question': 'Choose the correct phrase.', 'options': ['A criteria', 'Several criterion', 'One criterion', 'Much criteria'], 'answer': 'C', 'explanation': 'Criterion is singular; criteria is plural.'}, {'level': 9, 'question': 'Which word means to make something less severe?', 'options': ['Exacerbate', 'Mitigate', 'Aggravate', 'Prolong'], 'answer': 'B', 'explanation': 'Mitigate means to make something less harmful or severe.'}, {'level': 10, 'question': "What does 'equivocal' mean?", 'options': ['Open to more than one interpretation', 'Unquestionably true', 'Brief and direct', 'Emotionally calm'], 'answer': 'A', 'explanation': 'Equivocal means ambiguous or open to multiple interpretations.'}, {'level': 10, 'question': 'Choose the correct sentence in formal English.', 'options': ['Whom is coming today?', 'Whom did you invite?', 'Whom wrote this note?', 'Whom wants to leave?'], 'answer': 'B', 'explanation': 'Whom is the object of the verb invite.'}, {'level': 10, 'question': "What does 'corroborate' mean?", 'options': ['Support with additional evidence', 'Deliberately hide', 'Contradict without evidence', 'Make less precise'], 'answer': 'A', 'explanation': 'Corroborate means to confirm or support a statement with evidence.'}, {'level': 10, 'question': 'Choose the correctly punctuated sentence.', 'options': ["Its raining, bring you're coat.", "It's raining; bring your coat.", "Its' raining bring your coat.", "It's raining bring you're coat."], 'answer': 'B', 'explanation': "It's means it is; your shows possession, and the semicolon separates clauses."}, {'level': 10, 'question': "What is a 'nuance'?", 'options': ['A subtle difference in meaning or expression', 'A mathematical proof', 'A loud argument', 'A fixed legal punishment'], 'answer': 'A', 'explanation': 'A nuance is a subtle distinction or variation.'}]

if __name__ == "__main__":
    run_game('Word Master', QUESTIONS, levels=10, subject_mode=False)
