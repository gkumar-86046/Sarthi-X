""" Science Explorer: a student-friendly multiple-choice learning game. """


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

QUESTIONS = [{'level': 1, 'question': 'Which part of a plant usually absorbs water from soil?', 'options': ['Leaf', 'Root', 'Flower', 'Fruit'], 'answer': 'B', 'explanation': 'Roots absorb water and minerals from the soil.'}, {'level': 1, 'question': 'Which star is closest to Earth?', 'options': ['Sirius', 'Polaris', 'The Sun', 'Vega'], 'answer': 'C', 'explanation': 'The Sun is the star closest to Earth.'}, {'level': 1, 'question': 'Which sense organ helps us hear?', 'options': ['Eyes', 'Ears', 'Nose', 'Tongue'], 'answer': 'B', 'explanation': 'Our ears detect sound.'}, {'level': 1, 'question': 'Which gas do humans need for cellular respiration?', 'options': ['Oxygen', 'Helium', 'Hydrogen', 'Neon'], 'answer': 'A', 'explanation': 'Humans use oxygen for cellular respiration.'}, {'level': 1, 'question': 'Which of these is a living thing?', 'options': ['Rock', 'Chair', 'Tree', 'Glass'], 'answer': 'C', 'explanation': 'A tree grows and carries out life processes.'}, {'level': 2, 'question': 'At normal atmospheric pressure, water freezes at what temperature?', 'options': ['0°C', '10°C', '50°C', '100°C'], 'answer': 'A', 'explanation': 'Pure water freezes at 0°C under standard atmospheric pressure.'}, {'level': 2, 'question': 'Which planet is known as the Red Planet?', 'options': ['Venus', 'Mars', 'Jupiter', 'Neptune'], 'answer': 'B', 'explanation': 'Iron-rich dust gives Mars its reddish appearance.'}, {'level': 2, 'question': 'Which force pulls objects toward Earth?', 'options': ['Friction', 'Magnetism', 'Gravity', 'Electricity'], 'answer': 'C', 'explanation': 'Gravity attracts objects with mass.'}, {'level': 2, 'question': 'Which material is attracted to a magnet?', 'options': ['Iron', 'Wood', 'Paper', 'Rubber'], 'answer': 'A', 'explanation': 'Iron is a magnetic material.'}, {'level': 2, 'question': "What is the main source of energy for Earth's climate system?", 'options': ['Moon', 'Sun', 'Volcanoes', 'Tides'], 'answer': 'B', 'explanation': "Most energy driving Earth's climate comes from the Sun."}, {'level': 3, 'question': 'What is the chemical formula for water?', 'options': ['CO₂', 'O₂', 'H₂O', 'NaCl'], 'answer': 'C', 'explanation': 'A water molecule contains two hydrogen atoms and one oxygen atom.'}, {'level': 3, 'question': 'Which organ pumps blood around the body?', 'options': ['Lungs', 'Heart', 'Kidneys', 'Stomach'], 'answer': 'B', 'explanation': 'The heart pumps blood through the circulatory system.'}, {'level': 3, 'question': 'Which gas do plants absorb during photosynthesis?', 'options': ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], 'answer': 'C', 'explanation': 'Plants use carbon dioxide, water, and light to make sugars.'}, {'level': 3, 'question': 'What is the SI unit of force?', 'options': ['Joule', 'Watt', 'Newton', 'Pascal'], 'answer': 'C', 'explanation': 'Force is measured in newtons.'}, {'level': 3, 'question': 'Which state of matter has fixed volume but no fixed shape?', 'options': ['Solid', 'Liquid', 'Gas', 'Vacuum'], 'answer': 'B', 'explanation': 'A liquid takes the shape of its container but keeps a nearly fixed volume.'}, {'level': 4, 'question': 'Which blood cells mainly help fight infections?', 'options': ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma'], 'answer': 'B', 'explanation': 'White blood cells are key parts of the immune system.'}, {'level': 4, 'question': 'What changes liquid water into water vapour?', 'options': ['Freezing', 'Condensation', 'Evaporation', 'Melting'], 'answer': 'C', 'explanation': 'Evaporation changes liquid into gas at its surface.'}, {'level': 4, 'question': 'Which part of a eukaryotic cell contains most genetic material?', 'options': ['Nucleus', 'Cell wall', 'Cytoplasm', 'Ribosome'], 'answer': 'A', 'explanation': 'Most eukaryotic DNA is located in the nucleus.'}, {'level': 4, 'question': 'A rigid bar turning around a fixed point is a…', 'options': ['Pulley', 'Lever', 'Wedge', 'Screw'], 'answer': 'B', 'explanation': 'A lever pivots around a fulcrum.'}, {'level': 4, 'question': 'Which vitamin can skin produce after suitable sunlight exposure?', 'options': ['A', 'B12', 'C', 'D'], 'answer': 'D', 'explanation': 'UVB exposure helps skin synthesize vitamin D.'}, {'level': 5, 'question': 'What is the pH of a neutral aqueous solution at about 25°C?', 'options': ['1', '5', '7', '14'], 'answer': 'C', 'explanation': 'At about 25°C, a neutral aqueous solution has pH 7.'}, {'level': 5, 'question': 'Which planet has the largest diameter in our Solar System?', 'options': ['Earth', 'Saturn', 'Jupiter', 'Uranus'], 'answer': 'C', 'explanation': 'Jupiter is the largest planet in the Solar System.'}, {'level': 5, 'question': 'What is the process plants use to make food with light?', 'options': ['Respiration', 'Photosynthesis', 'Fermentation', 'Digestion'], 'answer': 'B', 'explanation': 'Photosynthesis uses light energy to make sugars.'}, {'level': 5, 'question': 'Which particle has a negative electric charge?', 'options': ['Proton', 'Neutron', 'Electron', 'Nucleus'], 'answer': 'C', 'explanation': 'Electrons carry a negative electric charge.'}, {'level': 5, 'question': "Which organelle produces much of a eukaryotic cell's ATP?", 'options': ['Golgi apparatus', 'Mitochondrion', 'Lysosome', 'Nucleolus'], 'answer': 'B', 'explanation': 'Mitochondria produce much of the ATP used by cells.'}, {'level': 6, 'question': 'Which law is commonly written F = ma?', 'options': ["Newton's first law", "Newton's second law", "Newton's third law", "Ohm's law"], 'answer': 'B', 'explanation': "Newton's second law relates force, mass, and acceleration."}, {'level': 6, 'question': 'Which rock type forms when magma cools?', 'options': ['Sedimentary', 'Metamorphic', 'Igneous', 'Fossil'], 'answer': 'C', 'explanation': 'Igneous rocks form when molten rock cools and solidifies.'}, {'level': 6, 'question': 'What is the basic unit of heredity?', 'options': ['Gene', 'Organ', 'Tissue', 'Enzyme'], 'answer': 'A', 'explanation': 'A gene is a DNA sequence contributing to a functional product or trait.'}, {'level': 6, 'question': 'Which instrument measures atmospheric pressure?', 'options': ['Thermometer', 'Barometer', 'Ammeter', 'Hygrometer'], 'answer': 'B', 'explanation': 'A barometer measures atmospheric pressure.'}, {'level': 6, 'question': 'What is the approximate speed of light in a vacuum?', 'options': ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], 'answer': 'B', 'explanation': 'Light travels at about 3 × 10⁸ metres per second in a vacuum.'}, {'level': 7, 'question': 'Which molecule carries genetic instructions in most organisms?', 'options': ['DNA', 'Starch', 'Chlorophyll', 'Haemoglobin'], 'answer': 'A', 'explanation': 'DNA stores hereditary information in most organisms.'}, {'level': 7, 'question': 'In a series circuit, what is the same through every component?', 'options': ['Voltage', 'Current', 'Resistance', 'Power'], 'answer': 'B', 'explanation': 'A series circuit has one path, so current is the same through each component.'}, {'level': 7, 'question': 'Which atmospheric layer contains most weather events?', 'options': ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'], 'answer': 'A', 'explanation': 'Most weather occurs in the troposphere.'}, {'level': 7, 'question': 'What is change in inherited traits over generations called?', 'options': ['Digestion', 'Evolution', 'Diffusion', 'Combustion'], 'answer': 'B', 'explanation': 'Evolution is change in heritable characteristics across generations.'}, {'level': 7, 'question': 'Which bond involves sharing electron pairs?', 'options': ['Ionic', 'Covalent', 'Gravitational', 'Magnetic'], 'answer': 'B', 'explanation': 'Covalent bonds involve shared electron pairs.'}, {'level': 8, 'question': 'What is the SI unit of electrical resistance?', 'options': ['Volt', 'Ampere', 'Ohm', 'Coulomb'], 'answer': 'C', 'explanation': 'Electrical resistance is measured in ohms.'}, {'level': 8, 'question': 'Which vessels carry blood away from the heart?', 'options': ['Veins', 'Arteries', 'Lymph vessels', 'Ureters'], 'answer': 'B', 'explanation': 'Arteries carry blood away from the heart.'}, {'level': 8, 'question': 'Which brain part helps coordinate balance and movement?', 'options': ['Cerebellum', 'Hypothalamus', 'Optic nerve', 'Pituitary'], 'answer': 'A', 'explanation': 'The cerebellum helps coordinate balance and movement.'}, {'level': 8, 'question': 'Which process releases energy from glucose in cells?', 'options': ['Cellular respiration', 'Transpiration', 'Osmosis', 'Pollination'], 'answer': 'A', 'explanation': 'Cellular respiration transfers energy from glucose into ATP.'}, {'level': 8, 'question': "Which equation represents Ohm's law?", 'options': ['V = IR', 'P = mv', 'F = ma²', 'E = mc'], 'answer': 'A', 'explanation': 'For an ohmic conductor under suitable conditions, V = IR.'}, {'level': 9, 'question': 'What is the oxidation number of oxygen in most compounds?', 'options': ['+1', '−2', '+2', '0 always'], 'answer': 'B', 'explanation': 'Oxygen is usually −2, with known exceptions.'}, {'level': 9, 'question': 'Which cell division generally produces two genetically similar daughter cells?', 'options': ['Meiosis', 'Mitosis', 'Fertilisation', 'Mutation'], 'answer': 'B', 'explanation': 'Mitosis generally produces two daughter cells with the same chromosome number.'}, {'level': 9, 'question': 'If speed doubles and mass stays the same, kinetic energy becomes…', 'options': ['Twice', 'Three times', 'Four times', 'Unchanged'], 'answer': 'C', 'explanation': 'Kinetic energy is proportional to speed squared.'}, {'level': 9, 'question': "Which gas is most abundant in Earth's dry atmosphere?", 'options': ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'], 'answer': 'C', 'explanation': 'Nitrogen makes up about 78% of dry air.'}, {'level': 9, 'question': 'What is the SI base unit of thermodynamic temperature?', 'options': ['Celsius', 'Kelvin', 'Fahrenheit', 'Joule'], 'answer': 'B', 'explanation': 'The kelvin is the SI base unit of thermodynamic temperature.'}, {'level': 10, 'question': 'Which principle relates buoyant force to displaced fluid?', 'options': ["Pascal's", "Archimedes'", "Bernoulli's", "Hooke's"], 'answer': 'B', 'explanation': "Archimedes' principle relates buoyant force to the weight of displaced fluid."}, {'level': 10, 'question': 'Which enzyme synthesizes RNA from a DNA template?', 'options': ['DNA ligase', 'RNA polymerase', 'Amylase', 'Pepsin'], 'answer': 'B', 'explanation': 'RNA polymerase synthesizes RNA using a DNA template.'}, {'level': 10, 'question': 'What is the derivative of x² with respect to x?', 'options': ['x', '2x', 'x³', '2'], 'answer': 'B', 'explanation': 'By the power rule, the derivative of x² is 2x.'}, {'level': 10, 'question': 'Which radiation has the shortest wavelength here?', 'options': ['Radio waves', 'Microwaves', 'Visible light', 'Gamma rays'], 'answer': 'D', 'explanation': 'Gamma rays have shorter wavelengths than the other options.'}, {'level': 10, 'question': 'Which law describes entropy increase in spontaneous processes for an isolated system?', 'options': ['First law', 'Second law', "Hooke's law", "Coulomb's law"], 'answer': 'B', 'explanation': 'The second law of thermodynamics describes entropy and process direction.'}]

if __name__ == "__main__":
    run_game('Science Explorer', QUESTIONS, levels=10, subject_mode=False)
