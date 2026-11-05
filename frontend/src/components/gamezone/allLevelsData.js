/**
 * allLevelsData.js  –  Master Registry of All 10 Levels, Step-by-Step Methods,
 * 3-Second Magic Tricks, and Formulas for the Game Dashboard Window.
 */

export const LEVELS_METADATA = [
  {
    level: 1,
    title: "Level 1: Rapid Arithmetic Blitz",
    badge: "🌱",
    category: "Foundational Math",
    difficulty: "Beginner",
    pointsPerQ: 10,
    skills: ["Mental Addition", "Rapid Multiplication", "Quarter Halving", "Power Squares"],
    description: "Build lightning-fast reflexes for addition, multiplication tables, and doubling/halving.",
    sampleTrick: "Round to nearest 10, then add/subtract difference in 1 second."
  },
  {
    level: 2,
    title: "Level 2: Fractions & Percentages",
    badge: "🧩",
    category: "Commercial Foundations",
    difficulty: "Easy",
    pointsPerQ: 15,
    skills: ["Percentage Splits (10% + 5%)", "Unitary Rates", "Butterfly Fractions", "Simple Interest"],
    description: "Eliminate long percentage formulas with the universal 10% and 1% mental split method.",
    sampleTrick: "To find 15% of any number: take 10% (move decimal) + half of that."
  },
  {
    level: 3,
    title: "Level 3: Speed, Trains & Ratios",
    badge: "🎯",
    category: "Kinematics & Ratios",
    difficulty: "Intermediate",
    pointsPerQ: 20,
    skills: ["Train Speed (5/18 factor)", "2-Year Compound Interest", "Ratio Gap Method", "Pipes Product-Over-Sum"],
    description: "Master real-world train passing problems, compound interest shortcuts, and pipe filling rates.",
    sampleTrick: "Multiply km/h by 5/18 to get m/s without long division."
  },
  {
    level: 4,
    title: "Level 4: Algebra, Geometry & Probability",
    badge: "⚡",
    category: "Deductive Quantitative",
    difficulty: "Intermediate+",
    pointsPerQ: 25,
    skills: ["Direct Algebra Isolation", "Pythagorean Triplet Shortcut", "11-Divisibility in Circles", "Binary Coin Outcomes"],
    description: "Solve right triangles and circle perimeters instantly using triplet patterns and divisibility.",
    sampleTrick: "Any circle perimeter or area problem with π must be a multiple of 11."
  },
  {
    level: 5,
    title: "Level 5: Profit Markups & Average Speed",
    badge: "🔥",
    category: "Commercial Aptitude",
    difficulty: "Advanced",
    pointsPerQ: 30,
    skills: ["Successive Markup/Discount", "Harmonic Average Speed", "Factorials & Permutations"],
    description: "Calculate net profit with markup discounts in 2 seconds and compute round-trip average speeds.",
    sampleTrick: "Average speed for equal distances is always 2xy / (x + y)."
  },
  {
    level: 6,
    title: "Level 6: Clock Angles & Man-Days",
    badge: "⏳",
    category: "Logic & Work",
    difficulty: "Advanced",
    pointsPerQ: 35,
    skills: ["Clock Hour-Minute Angles", "Constant Man-Days (M1×D1 = M2×D2)", "Sequence Multipliers"],
    description: "Determine exact degree angles on analog clock faces and compute variable crew work completion.",
    sampleTrick: "Angle at hour H and minute M is |30H - 5.5M|."
  },
  {
    level: 7,
    title: "Level 7: Mixtures, Alligations & Calendar",
    badge: "🧪",
    category: "Analytical Reasoning",
    difficulty: "Expert",
    pointsPerQ: 40,
    skills: ["Cross Alligation Matrix", "Odd Days mod 7", "Weighted Averages"],
    description: "Solve complex mixture ratios with the 2-second cross-subtraction alligation method.",
    sampleTrick: "Ratio of cheaper to dearer = (Dearer Price - Mean) : (Mean - Cheaper Price)."
  },
  {
    level: 8,
    title: "Level 8: Boats, Streams & Odd Series",
    badge: "⛵",
    category: "Advanced Motion",
    difficulty: "Expert",
    pointsPerQ: 45,
    skills: ["Current Speed Half-Difference", "Sum of Odd Integers (n² rule)", "Relative Motion"],
    description: "Solve upstream and downstream current vectors and calculate series sums in one step.",
    sampleTrick: "Sum of first n odd integers is always exactly n²."
  },
  {
    level: 9,
    title: "Level 9: 3D Mensuration & Matrices",
    badge: "📐",
    category: "Spatial Aptitude",
    difficulty: "Master",
    pointsPerQ: 50,
    skills: ["Cube Diagonal-to-Surface Area", "Combinatorial Handshakes n(n-1)/2", "Matrix Determinants"],
    description: "Decode 3D spatial solids and combinatorial graph connections using scalar shortcuts.",
    sampleTrick: "Handshakes among N people = N(N - 1) / 2."
  },
  {
    level: 10,
    title: "Level 10: Grandmaster Cryptarithms",
    badge: "🌌",
    category: "Olympiad / High IQ",
    difficulty: "Grandmaster",
    pointsPerQ: 60,
    skills: ["Alphabetic Cryptarithms", "Modular Exponent Cycles", "Prime Residues"],
    description: "Crack alphanumeric digit puzzles and modular exponentiation patterns used in top competitive exams.",
    sampleTrick: "Repdigit BBB = 111 × B = 37 × 3B; always search for multiples of 37!"
  }
];

export const MASTER_METHODS_AND_TRICKS = {
  1: [
    {
      id: "m1_1",
      topic: "Mental Arithmetic",
      prompt: "What is 15 + 27?",
      options: ["A. 40", "B. 42", "C. 41", "D. 43"],
      answer: "B",
      answer_text: "42",
      points: 10,
      method: "Step 1: Deconstruct into tens and units: (10 + 20) = 30. Step 2: Add units: 5 + 7 = 12. Step 3: Total = 30 + 12 = 42.",
      trick: "⚡ Magic Trick: Round 27 to 30 (add 3). 15 + 30 = 45. Now subtract the 3: 45 - 3 = 42 in 1 second flat!"
    },
    {
      id: "m1_2",
      topic: "Rapid Multiplication",
      prompt: "What is 8 × 7?",
      options: ["A. 54", "B. 56", "C. 58", "D. 52"],
      answer: "B",
      answer_text: "56",
      points: 10,
      method: "Direct product: 8 sets of 7 items = 56.",
      trick: "⚡ Magic Trick: 5678 sequence mnemonic: 5, 6, 7, 8 → 56 = 7 × 8!"
    },
    {
      id: "m1_3",
      topic: "Division Blitz",
      prompt: "What is 100 ÷ 4?",
      options: ["A. 20", "B. 30", "C. 25", "D. 28"],
      answer: "C",
      answer_text: "25",
      points: 10,
      method: "Partition 100 into 4 equal quarters: 100 / 4 = 25.",
      trick: "⚡ Magic Trick: Halve it twice! Half of 100 = 50. Half of 50 = 25."
    },
    {
      id: "m1_4",
      topic: "Mental Percentages",
      prompt: "What is 50% of 80?",
      options: ["A. 40", "B. 30", "C. 45", "D. 35"],
      answer: "A",
      answer_text: "40",
      points: 10,
      method: "50% is equivalent to multiplying by 1/2: 80 × 0.5 = 40.",
      trick: "⚡ Magic Trick: 50% simply means divide by 2! Half of 80 is 40."
    },
    {
      id: "m1_5",
      topic: "Power & Exponents",
      prompt: "What is 6² (6 squared)?",
      options: ["A. 12", "B. 36", "C. 30", "D. 42"],
      answer: "B",
      answer_text: "36",
      points: 10,
      method: "Square of an integer: 6 × 6 = 36.",
      trick: "⚡ Magic Trick: Squares of numbers ending in 6 always end in 6; eliminates odd numbers instantly!"
    },
    {
      id: "m1_6",
      topic: "Sequence Recognition",
      prompt: "What comes next in the sequence: 2, 4, 8, 16, ___?",
      options: ["A. 24", "B. 32", "C. 28", "D. 30"],
      answer: "B",
      answer_text: "32",
      points: 10,
      method: "Geometric progression with common ratio r = 2. Next term = 16 × 2 = 32.",
      trick: "⚡ Magic Trick: Binary powers: 2^1, 2^2, 2^3, 2^4, 2^5 = 32!"
    }
  ],
  2: [
    {
      id: "m2_1",
      topic: "Commercial Discount",
      prompt: "A branded shirt costs ₹500. A 20% discount is applied. What is the final price?",
      options: ["A. ₹350", "B. ₹400", "C. ₹420", "D. ₹450"],
      answer: "B",
      answer_text: "₹400",
      points: 15,
      method: "Discount = 20% of ₹500 = ₹100. Final Price = ₹500 - ₹100 = ₹400.",
      trick: "⚡ Magic Trick: 10% of 500 = ₹50. Double it: 20% = ₹100. 500 - 100 = ₹400 in 2 seconds!"
    },
    {
      id: "m2_2",
      topic: "Unitary Method",
      prompt: "If 5 pens cost ₹35, what is the cost of 8 pens?",
      options: ["A. ₹54", "B. ₹56", "C. ₹58", "D. ₹60"],
      answer: "B",
      answer_text: "₹56",
      points: 15,
      method: "Cost of 1 pen = 35 / 5 = ₹7. Cost of 8 pens = 8 × 7 = ₹56.",
      trick: "⚡ Magic Trick: Unit rate = 35/5 = 7. 8 × 7 = 56 using the 5678 mnemonic."
    },
    {
      id: "m2_3",
      topic: "Fraction Addition",
      prompt: "What is 2/3 + 1/4?",
      options: ["A. 3/7", "B. 11/12", "C. 7/12", "D. 5/12"],
      answer: "B",
      answer_text: "11/12",
      points: 15,
      method: "LCM of denominators 3 and 4 is 12. 8/12 + 3/12 = 11/12.",
      trick: "⚡ Magic Trick: Butterfly cross: (2×4) + (3×1) = 8 + 3 = 11 (numerator). 3×4 = 12 (denominator) → 11/12!"
    },
    {
      id: "m2_4",
      topic: "Kinematics Speed",
      prompt: "A car covers 240 km in 4 hours. What is its speed in km/h?",
      options: ["A. 50 km/h", "B. 55 km/h", "C. 60 km/h", "D. 65 km/h"],
      answer: "C",
      answer_text: "60 km/h",
      points: 15,
      method: "Speed = Distance / Time = 240 / 4 = 60 km/h.",
      trick: "⚡ Magic Trick: Halve twice! 240 / 2 = 120; 120 / 2 = 60 km/h."
    },
    {
      id: "m2_5",
      topic: "Simple Interest",
      prompt: "Simple Interest: Principal = ₹1,000, Rate = 5% p.a., Time = 2 years. SI = ?",
      options: ["A. ₹50", "B. ₹100", "C. ₹150", "D. ₹200"],
      answer: "B",
      answer_text: "₹100",
      points: 15,
      method: "SI = (P × R × T) / 100 = (1000 × 5 × 2) / 100 = ₹100.",
      trick: "⚡ Magic Trick: Net percentage = 5% × 2 = 10%. 10% of 1,000 is simply ₹100!"
    }
  ],
  3: [
    {
      id: "m3_1",
      topic: "Train Speed & Conversion",
      prompt: "A 300-meter long train passes a telephone pole in 15 seconds. What is its speed in km/h?",
      options: ["A. 60 km/h", "B. 66 km/h", "C. 72 km/h", "D. 78 km/h"],
      answer: "C",
      answer_text: "72 km/h",
      points: 20,
      method: "Speed = 300m / 15s = 20 m/s. Convert to km/h: 20 × (18/5) = 4 × 18 = 72 km/h.",
      trick: "⚡ Magic Trick: 20 m/s is 4 × 5 m/s. Since 5 m/s = 18 km/h, multiply 4 × 18 = 72 km/h without fractions!"
    },
    {
      id: "m3_2",
      topic: "Compound Interest Shortcut",
      prompt: "Find the Compound Interest on ₹2,000 at 10% per annum for 2 years.",
      options: ["A. ₹400", "B. ₹420", "C. ₹440", "D. ₹450"],
      answer: "B",
      answer_text: "₹420",
      points: 20,
      method: "Amount = 2000 × (1.10)² = 2000 × 1.21 = ₹2,420. CI = ₹2,420 - ₹2,000 = ₹420.",
      trick: "⚡ Magic Trick: Successive percentage: 10 + 10 + (10×10)/100 = 21%. 21% of 2,000 = 21 × 20 = ₹420!"
    },
    {
      id: "m3_3",
      topic: "Ratio Gap Method",
      prompt: "Two numbers are in ratio 4:7 and differ by 18. What is the smaller number?",
      options: ["A. 20", "B. 22", "C. 24", "D. 28"],
      answer: "C",
      answer_text: "24",
      points: 20,
      method: "7x - 4x = 3x = 18 => x = 6. Smaller number = 4 × 6 = 24.",
      trick: "⚡ Magic Trick: Ratio gap = 7 - 4 = 3 units. 3 units = 18 => 1 unit = 6. Smaller = 4 × 6 = 24 in 2 seconds!"
    },
    {
      id: "m3_4",
      topic: "Pipes Product-Over-Sum",
      prompt: "Pipe A fills a tank in 6h, Pipe B in 8h. How long together?",
      options: ["A. 3.2 hrs", "B. 3.4 hrs", "C. 3.43 hrs", "D. 3.6 hrs"],
      answer: "C",
      answer_text: "3.43 hrs",
      points: 20,
      method: "Combined rate = 1/6 + 1/8 = 7/24. Time = 24/7 ≈ 3.43 hours.",
      trick: "⚡ Magic Trick: Product over Sum: (6 × 8) / (6 + 8) = 48 / 14 = 24 / 7 ≈ 3.43 hours!"
    }
  ],
  4: [
    {
      id: "m4_1",
      topic: "Probability Fraction",
      prompt: "A bag has 3 Red, 2 Blue, and 5 Green balls. Probability of picking a Red ball?",
      options: ["A. 1/5", "B. 3/10", "C. 2/5", "D. 1/2"],
      answer: "B",
      answer_text: "3/10",
      points: 25,
      method: "Total balls = 3 + 2 + 5 = 10. Favorable = 3 Red. Probability = 3 / 10.",
      trick: "⚡ Magic Trick: Sum denominator first: 3 + 2 + 5 = 10. Direct probability = 3/10 (30%)!"
    },
    {
      id: "m4_2",
      topic: "Circle Perimeter Multiplier",
      prompt: "Circumference of a circle with radius 14 cm? (π = 22/7)",
      options: ["A. 78 cm", "B. 84 cm", "C. 88 cm", "D. 92 cm"],
      answer: "C",
      answer_text: "88 cm",
      points: 25,
      method: "Circumference = 2 × (22/7) × 14 = 2 × 22 × 2 = 88 cm.",
      trick: "⚡ Magic Trick: π contains 22 = 2 × 11. The answer must be a multiple of 11. 88 is the only multiple of 11!"
    },
    {
      id: "m4_3",
      topic: "Instant Profit Percentage",
      prompt: "An item costs ₹200 and sells for ₹250. What is the profit percentage?",
      options: ["A. 20%", "B. 25%", "C. 30%", "D. 35%"],
      answer: "B",
      answer_text: "25%",
      points: 25,
      method: "Profit = ₹50. Profit % = (50 / 200) × 100 = 25%.",
      trick: "⚡ Magic Trick: 50 is one-quarter (1/4) of 200. 1/4 is 25% in 1 second!"
    },
    {
      id: "m4_4",
      topic: "Simple Interest Speed Rule",
      prompt: "Find simple interest on ₹1,000 at 5% per year for 2 years.",
      options: ["A. ₹50", "B. ₹80", "C. ₹100", "D. ₹120"],
      answer: "C",
      answer_text: "₹100",
      points: 25,
      method: "SI = (P × R × T) / 100 = (1000 × 5 × 2) / 100 = ₹100.",
      trick: "⚡ Magic Trick: Effective rate = 5% × 2 years = 10%. 10% of 1000 = ₹100 without paper!"
    }
  ],
  5: [
    {
      id: "m5_1",
      topic: "Markup & Discount Shortcut",
      prompt: "A trader marks goods 40% above CP and gives a 20% discount. What is his net Profit %?",
      options: ["A. 10%", "B. 12%", "C. 15%", "D. 20%"],
      answer: "B",
      answer_text: "12%",
      points: 30,
      method: "CP = 100 → MP = 140. Discount = 20% of 140 = 28. SP = 140 - 28 = 112. Profit = 12%.",
      trick: "⚡ Magic Trick: Formula: a - b - (ab/100) = 40 - 20 - (40×20/100) = 20 - 8 = 12% in 2 seconds!"
    },
    {
      id: "m5_2",
      topic: "Harmonic Average Speed",
      prompt: "A cyclist rides from A to B at 20 km/h and returns at 30 km/h. Average speed?",
      options: ["A. 24 km/h", "B. 25 km/h", "C. 26 km/h", "D. 27 km/h"],
      answer: "A",
      answer_text: "24 km/h",
      points: 30,
      method: "Avg Speed = 2xy / (x + y) = (2 × 20 × 30) / (20 + 30) = 1200 / 50 = 24 km/h.",
      trick: "⚡ Magic Trick: Never average speeds (25 is wrong!). Use 2xy/(x+y): 1200/50 = 24 km/h."
    },
    {
      id: "m5_3",
      topic: "Algebra Isolation Shortcut",
      prompt: "If 2x + 5 = 17, find the value of x.",
      options: ["A. 5", "B. 6", "C. 7", "D. 8"],
      answer: "B",
      answer_text: "6",
      points: 30,
      method: "2x = 17 - 5 = 12. x = 12 / 2 = 6.",
      trick: "⚡ Magic Trick: Reverse operations: (17 - 5) / 2 = 12 / 2 = 6 in 1 second!"
    },
    {
      id: "m5_4",
      topic: "Triangle Area Halving",
      prompt: "What is the area of a triangle with base 10 cm and height 6 cm?",
      options: ["A. 20 cm²", "B. 30 cm²", "C. 35 cm²", "D. 60 cm²"],
      answer: "B",
      answer_text: "30 cm²",
      points: 30,
      method: "Area = (1/2) × base × height = (1/2) × 10 × 6 = 30 cm².",
      trick: "⚡ Magic Trick: Halve either base or height first: 5 × 6 = 30 cm² instantly!"
    }
  ],
  6: [
    {
      id: "m6_1",
      topic: "Clock Hands Angle Formula",
      prompt: "What is the angle between hour and minute hands at 3:30?",
      options: ["A. 70°", "B. 75°", "C. 80°", "D. 90°"],
      answer: "B",
      answer_text: "75°",
      points: 35,
      method: "Angle = |30H - 5.5M| = |30(3) - 5.5(30)| = |90 - 165| = 75°.",
      trick: "⚡ Magic Trick: At :30, the hour hand moved 15° ahead of 3. Distance from 4 to 6 is 60°. 60° + 15° = 75°!"
    },
    {
      id: "m6_2",
      topic: "Constant Man-Days",
      prompt: "12 men can complete work in 8 days. How many men to finish in 6 days?",
      options: ["A. 14", "B. 16", "C. 18", "D. 20"],
      answer: "B",
      answer_text: "16",
      points: 35,
      method: "M1 × D1 = M2 × D2 => 12 × 8 = 96 man-days. 96 / 6 = 16 men.",
      trick: "⚡ Magic Trick: 12 × 8 = 96. Divide directly by 6: 96 / 6 = 16 men!"
    },
    {
      id: "m6_3",
      topic: "Work Joint Reciprocal",
      prompt: "A finishes a job in 4 days and B in 12 days. How long working together?",
      options: ["A. 2.5 days", "B. 3 days", "C. 3.5 days", "D. 4 days"],
      answer: "B",
      answer_text: "3 days",
      points: 35,
      method: "1/4 + 1/12 = 3/12 + 1/12 = 4/12 = 1/3. Combined time = 3 days.",
      trick: "⚡ Magic Trick: Product over Sum: (4 × 12) / (4 + 12) = 48 / 16 = 3 days in 2 seconds!"
    },
    {
      id: "m6_4",
      topic: "Quadratic Differences Series",
      prompt: "Find the next number in sequence: 2, 6, 12, 20, 30, __.",
      options: ["A. 38", "B. 40", "C. 42", "D. 44"],
      answer: "C",
      answer_text: "42",
      points: 35,
      method: "Differences: +4, +6, +8, +10. Next difference is +12. 30 + 12 = 42.",
      trick: "⚡ Magic Trick: Notice the n(n+1) pattern: 1×2, 2×3, 3×4, 4×5, 5×6, next is 6×7 = 42!"
    }
  ],
  7: [
    {
      id: "m7_1",
      topic: "Cross Alligation Rule",
      prompt: "In what ratio must rice at ₹40/kg be mixed with rice at ₹60/kg for ₹52/kg?",
      options: ["A. 2:3", "B. 3:2", "C. 1:2", "D. 4:5"],
      answer: "A",
      answer_text: "2:3",
      points: 40,
      method: "Alligation: (60 - 52) : (52 - 40) = 8 : 12 = 2 : 3.",
      trick: "⚡ Magic Trick: Cross differences: 60 - 52 = 8; 52 - 40 = 12. Ratio is 8:12 = 2:3 in 2 seconds!"
    },
    {
      id: "m7_2",
      topic: "Calendar Modulo 7",
      prompt: "If today is Monday, what day will it be after 61 days?",
      options: ["A. Friday", "B. Saturday", "C. Sunday", "D. Thursday"],
      answer: "B",
      answer_text: "Saturday",
      points: 40,
      method: "61 mod 7 = 5 odd days. Monday + 5 days = Saturday.",
      trick: "⚡ Magic Trick: 63 is a multiple of 7. 61 is 2 days before 63. Monday - 2 days = Saturday!"
    },
    {
      id: "m7_3",
      topic: "Letter Coding Alphabet Shift",
      prompt: "If CAT is coded as DBU (+1 shift), DOG is coded as what?",
      options: ["A. CNG", "B. EPH", "C. EOG", "D. FPH"],
      answer: "B",
      answer_text: "EPH",
      points: 40,
      method: "D + 1 = E, O + 1 = P, G + 1 = H. Coded word = EPH.",
      trick: "⚡ Magic Trick: Check first letter: D + 1 = E eliminates choices A and D instantly!"
    }
  ],
  8: [
    {
      id: "m8_1",
      topic: "Boats Half-Difference",
      prompt: "Boat goes 36 km downstream in 2h and 36 km upstream in 3h. Current speed?",
      options: ["A. 2 km/h", "B. 3 km/h", "C. 4 km/h", "D. 5 km/h"],
      answer: "B",
      answer_text: "3 km/h",
      points: 45,
      method: "Downstream = 18 km/h, Upstream = 12 km/h. Current = (18 - 12)/2 = 3 km/h.",
      trick: "⚡ Magic Trick: Current speed is half the difference between rates: (18 - 12)/2 = 3 km/h!"
    },
    {
      id: "m8_2",
      topic: "Odd Number Series Sum",
      prompt: "Sum of all odd integers from 1 to 49 inclusive?",
      options: ["A. 625", "B. 576", "C. 600", "D. 650"],
      answer: "A",
      answer_text: "625",
      points: 45,
      method: "Number of terms n = (49 + 1)/2 = 25. Sum = n² = 25² = 625.",
      trick: "⚡ Magic Trick: Sum of first n odd integers is always n²! 25² = 625 using 5-squaring trick (2×3=6, suffix 25)."
    },
    {
      id: "m8_3",
      topic: "Sum & Difference Splitter",
      prompt: "The sum of two numbers is 50 and their difference is 10. Find the larger number.",
      options: ["A. 25", "B. 30", "C. 35", "D. 40"],
      answer: "B",
      answer_text: "30",
      points: 45,
      method: "x + y = 50, x - y = 10. Adding: 2x = 60 => x = 30.",
      trick: "⚡ Magic Trick: Larger number is always (Sum + Diff) / 2 = 60 / 2 = 30!"
    }
  ],
  9: [
    {
      id: "m9_1",
      topic: "Cube Diagonal Spatial Shortcut",
      prompt: "Diagonal of a cube is 6√3 cm. What is the total surface area?",
      options: ["A. 144 cm²", "B. 180 cm²", "C. 216 cm²", "D. 240 cm²"],
      answer: "C",
      answer_text: "216 cm²",
      points: 50,
      method: "Cube diagonal = a√3 => a = 6 cm. Surface area = 6a² = 6 × 36 = 216 cm².",
      trick: "⚡ Magic Trick: Side length is directly the coefficient of √3: a = 6. TSA = 6 × 6² = 6³ = 216!"
    },
    {
      id: "m9_2",
      topic: "Handshake Combinatorics",
      prompt: "12 participants shake hands with every other person once. Total handshakes?",
      options: ["A. 55", "B. 66", "C. 72", "D. 132"],
      answer: "B",
      answer_text: "66",
      points: 50,
      method: "Handshakes = n(n - 1) / 2 = 12 × 11 / 2 = 6 × 11 = 66.",
      trick: "⚡ Magic Trick: 12 × 11 / 2 = 6 × 11 = 66 in 1 second!"
    },
    {
      id: "m9_3",
      topic: "Net Percentage Reversal",
      prompt: "A price rises by 25% and then falls by 20%. Compared to original, final price is:",
      options: ["A. 5% higher", "B. Unchanged", "C. 5% lower", "D. 10% higher"],
      answer: "B",
      answer_text: "Unchanged",
      points: 50,
      method: "100 × 1.25 = 125. 125 × 0.80 = 100. Price returns to exact original.",
      trick: "⚡ Magic Trick: Net change: 25 - 20 - (25 × 20 / 100) = 5 - 5 = 0% (Unchanged)!"
    }
  ],
  10: [
    {
      id: "m10_1",
      topic: "Grandmaster Cryptarithm",
      prompt: "If AB × 6 = BBB (distinct non-zero digits), find A + B.",
      options: ["A. 9", "B. 11", "C. 12", "D. 14"],
      answer: "B",
      answer_text: "11",
      points: 60,
      method: "BBB = 111 × B = 37 × 3 × B. AB × 6 = 111 × B => 2 × AB = 37 × B. So AB = 74, B = 4, A = 7. A + B = 11.",
      trick: "⚡ Magic Trick: Repdigit BBB is always divisible by 37. The only compatible 2-digit multiple is 74 (74×6 = 444!). A=7, B=4, 7+4 = 11!"
    },
    {
      id: "m10_2",
      topic: "Modular Exponent Remainder",
      prompt: "What is the remainder when 2^100 is divided by 7?",
      options: ["A. 1", "B. 2", "C. 4", "D. 6"],
      answer: "B",
      answer_text: "2",
      points: 60,
      method: "2³ = 8 ≡ 1 (mod 7). 100 = 3 × 33 + 1. 2^100 ≡ (1)³³ × 2^1 = 2.",
      trick: "⚡ Magic Trick: Cycle of 2 mod 7 is 3 (2, 4, 1). 100 mod 3 = 1. Answer is 2^1 = 2!"
    },
    {
      id: "m10_3",
      topic: "Successive Discount Shortcut",
      prompt: "A 20% discount followed by another 10% discount is equivalent to single discount:",
      options: ["A. 28%", "B. 30%", "C. 25%", "D. 32%"],
      answer: "A",
      answer_text: "28%",
      points: 60,
      method: "100 × 0.8 × 0.9 = 72. Total discount = 100 - 72 = 28%.",
      trick: "⚡ Magic Trick: a + b - (ab / 100) = 20 + 10 - 2 = 28% in 2 seconds!"
    },
    {
      id: "m10_4",
      topic: "Symmetric Profit & Loss Rule",
      prompt: "Two items sold at ₹600 each, one at 20% profit, one at 20% loss. Overall result?",
      options: ["A. No profit or loss", "B. 4% profit", "C. 4% loss", "D. 2% loss"],
      answer: "C",
      answer_text: "4% loss",
      points: 60,
      method: "CP1 = 500, CP2 = 750. Total CP = 1250, Total SP = 1200. Loss = 50 / 1250 = 4%.",
      trick: "⚡ Magic Trick: Equal SP with profit% = loss% = x: always a loss of (x/10)² % = (20/10)² = 4% loss!"
    }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// Science Explorer Roadmap & Methods
// ─────────────────────────────────────────────────────────────────────────────
export const SCIENCE_ROADMAP = [
  { level: 1, title: "Level 1: Living Systems & Plants", badge: "🌱", category: "Biology", difficulty: "Foundational", pointsPerQ: 10, skills: ["Plant Anatomy", "Photosynthesis Basics", "Sensory Organs"], description: "Understand root absorption, cellular respiration basics, and living organisms.", sampleTrick: "Roots = absorption route for water & minerals!" },
  { level: 2, title: "Level 2: Matter, Forces & Energy", badge: "⚡", category: "Physics", difficulty: "Foundational+", pointsPerQ: 15, skills: ["Gravity", "Magnetism", "Freezing Points"], description: "Explore state changes, planetary gravity, and magnetic forces.", sampleTrick: "Gravity acts uniformly on all mass toward planetary centers." },
  { level: 3, title: "Level 3: Molecular Chemistry", badge: "🔬", category: "Chemistry", difficulty: "Intermediate", pointsPerQ: 20, skills: ["Chemical Formulas", "Newtons SI Unit", "Heart Circulation"], description: "Master molecular bonds, circulatory pumping, and force units.", sampleTrick: "H2O = 2 Hydrogen + 1 Oxygen!" },
  { level: 4, title: "Level 4: Human Physiology", badge: "🧬", category: "Biology", difficulty: "Intermediate", pointsPerQ: 25, skills: ["White Blood Cells", "Evaporation", "Cell Nucleus"], description: "Immune defense, phase change thermodynamics, and eukaryotic cell structures.", sampleTrick: "White blood cells = warriors of the immune system." },
  { level: 5, title: "Level 5: Energy Transformations", badge: "⚛️", category: "Physics", difficulty: "Intermediate+", pointsPerQ: 30, skills: ["Kinetic to Potential", "Refraction", "Electrolysis"], description: "Light refraction, energy conservation, and chemical separation.", sampleTrick: "Energy is never created or destroyed, only transferred." },
  { level: 6, title: "Level 6: Astronomy & Cosmic Laws", badge: "🔭", category: "Space", difficulty: "Advanced", pointsPerQ: 35, skills: ["Planetary Orbits", "Speed of Light", "Solar Nuclear Fusion"], description: "Cosmic velocities, planetary gravity, and stellar fusion cycles.", sampleTrick: "Speed of light in vacuum = 3 × 10⁸ m/s!" },
  { level: 7, title: "Level 7: Genetics & Evolution", badge: "🧬", category: "Genetics", difficulty: "Advanced+", pointsPerQ: 40, skills: ["DNA Double Helix", "Natural Selection", "Troposphere Weather"], description: "Hereditary transmission, chemical covalent bonds, and atmospheric layers.", sampleTrick: "DNA stores the primary biological blueprint for all life." },
  { level: 8, title: "Level 8: Electromagnetism & Circuits", badge: "⚡", category: "Physics", difficulty: "Expert", pointsPerQ: 45, skills: ["Ohm's Law (V=IR)", "Resistance (Ohms)", "Arteries vs Veins"], description: "Circuit equations, internal resistance, and cardiovascular transport vectors.", sampleTrick: "V = IR: Voltage is directly proportional to current!" },
  { level: 9, title: "Level 9: Cellular Respiration & ATP", badge: "🔬", category: "Biochemistry", difficulty: "Expert+", pointsPerQ: 50, skills: ["Mitosis vs Meiosis", "Kinetic Energy v²", "Nitrogen Atmosphere"], description: "Cellular energy transfer, kinetic energy squaring, and atmospheric gas fractions.", sampleTrick: "Kinetic energy doubles speed => quadruples energy (v²)!" },
  { level: 10, title: "Level 10: Thermodynamics & Quantum", badge: "🌌", category: "Advanced Physics", difficulty: "Grandmaster", pointsPerQ: 60, skills: ["Archimedes Principle", "Second Law of Thermodynamics", "Gamma Radiation"], description: "Buoyancy displacement, entropy increase, and shortest electromagnetic wavelengths.", sampleTrick: "Archimedes: Buoyant force = weight of displaced fluid!" }
];

export const SCIENCE_METHODS_AND_TRICKS = {
  1: [
    { id: "s1_1", topic: "Plant Biology", prompt: "Which part of a plant usually absorbs water from soil?", options: ["Leaf", "Root", "Flower", "Fruit"], answer: "B", answer_text: "Root", method: "Roots anchor the plant and absorb moisture/nutrients through root hairs.", trick: "⚡ Flash-Tip: Roots = direct route for water absorption!" },
    { id: "s1_2", topic: "Astronomy", prompt: "Which star is closest to Earth?", options: ["Sirius", "Polaris", "The Sun", "Vega"], answer: "C", answer_text: "The Sun", method: "The Sun is at ~150 million km, making it our nearest stellar neighbor.", trick: "⚡ Flash-Tip: The Sun is our home star!" },
    { id: "s1_3", topic: "Cellular Respiration", prompt: "Which gas do humans need for cellular respiration?", options: ["Oxygen", "Helium", "Hydrogen", "Neon"], answer: "A", answer_text: "Oxygen", method: "Aerobic cellular respiration requires O2 to produce ATP.", trick: "⚡ Flash-Tip: O2 is the vital terminal electron acceptor!" }
  ],
  2: [
    { id: "s2_1", topic: "Thermodynamics", prompt: "At normal atmospheric pressure, water freezes at what temperature?", options: ["0°C", "10°C", "50°C", "100°C"], answer: "A", answer_text: "0°C", method: "Standard freezing point of pure water at 1 atm is 0°C (273.15 K).", trick: "⚡ Flash-Tip: 0°C freezes, 100°C boils!" },
    { id: "s2_2", topic: "Solar System", prompt: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Neptune"], answer: "B", answer_text: "Mars", method: "Iron oxide (rust) on Mars gives it a distinct reddish appearance.", trick: "⚡ Flash-Tip: Mars = Iron rust = Red planet!" }
  ],
  3: [
    { id: "s3_1", topic: "Chemistry", prompt: "What is the chemical formula for water?", options: ["CO₂", "O₂", "H₂O", "NaCl"], answer: "C", answer_text: "H₂O", method: "Water consists of 2 hydrogen atoms covalently bonded to 1 oxygen atom.", trick: "⚡ Flash-Tip: H2O = 2 Hydrogen + 1 Oxygen!" }
  ],
  8: [
    { id: "s8_1", topic: "Electromagnetism", prompt: "Which equation represents Ohm's Law?", options: ["V = IR", "P = mv", "F = ma²", "E = mc"], answer: "A", answer_text: "V = IR", method: "Voltage across an ohmic conductor equals Current (I) times Resistance (R).", trick: "⚡ Flash-Tip: V = I × R triangle makes solving instant!" }
  ],
  10: [
    { id: "s10_1", topic: "Fluid Mechanics", prompt: "Which principle relates buoyant force to displaced fluid?", options: ["Pascal's", "Archimedes'", "Bernoulli's", "Hooke's"], answer: "B", answer_text: "Archimedes'", method: "Archimedes' principle states buoyant force equals weight of fluid displaced.", trick: "⚡ Flash-Tip: Displaced fluid weight = Upward buoyant force!" }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// General Knowledge Explorer Roadmap & Methods
// ─────────────────────────────────────────────────────────────────────────────
export const GK_ROADMAP = [
  { level: 1, title: "Level 1: World Geography & Capitals", badge: "🌍", category: "Geography", difficulty: "Foundational", pointsPerQ: 10, skills: ["National Capitals", "Continent Mapping", "Cultural Landmarks"], description: "Identify prominent world capitals, major landmasses, and historic landmarks.", sampleTrick: "New Delhi is India's capital; Canberra for Australia!" },
  { level: 2, title: "Level 2: Major Oceans & Continents", badge: "🌊", category: "Geography", difficulty: "Foundational+", pointsPerQ: 15, skills: ["Pacific Ocean", "Mount Everest", "Nile River"], description: "Explore the highest peaks, longest river systems, and oceanic depths.", sampleTrick: "Pacific is both the largest and deepest ocean on Earth." },
  { level: 3, title: "Level 3: Ancient Civilizations", badge: "🏛️", category: "History", difficulty: "Intermediate", pointsPerQ: 20, skills: ["Indus Valley", "Mesopotamia", "Pyramids of Giza"], description: "Uncover architectural marvels and early urban trade routes.", sampleTrick: "Mesopotamia lies between Tigris and Euphrates rivers." },
  { level: 4, title: "Level 4: Revolutionary Inventions", badge: "💡", category: "Science & History", difficulty: "Intermediate", pointsPerQ: 25, skills: ["Printing Press", "Steam Engine", "Telephone"], description: "Key technological breakthroughs that transformed global civilization.", sampleTrick: "Gutenberg introduced movable-type printing press around 1440." },
  { level: 5, title: "Level 5: World Currencies & Trade", badge: "💰", category: "Economics", difficulty: "Intermediate+", pointsPerQ: 30, skills: ["Yen", "Pound Sterling", "Silk Road"], description: "Global financial networks, currencies, and historic maritime trade.", sampleTrick: "Japan uses Yen (¥), UK uses Pound Sterling (£)." },
  { level: 6, title: "Level 6: Constitutional Governance", badge: "📜", category: "Civics", difficulty: "Advanced", pointsPerQ: 35, skills: ["Preamble", "Fundamental Rights", "Parliaments"], description: "Democratic governance models, constitutional provisions, and civic rights.", sampleTrick: "Indian Constitution is the longest written national constitution." },
  { level: 7, title: "Level 7: International Treaties", badge: "🌐", category: "Global Affairs", difficulty: "Advanced+", pointsPerQ: 40, skills: ["United Nations", "Geneva Conventions", "Paris Accord"], description: "Global peace architectures, human rights declarations, and climate treaties.", sampleTrick: "UN was officially founded on 24 October 1945." },
  { level: 8, title: "Level 8: Scientific Nobel Laureates", badge: "🏅", category: "Milestones", difficulty: "Expert", pointsPerQ: 45, skills: ["Marie Curie", "Einstein", "C.V. Raman"], description: "Pioneering discoveries recognized with the Nobel Prize.", sampleTrick: "Marie Curie is the only person to win Nobel prizes in two different sciences!" },
  { level: 9, title: "Level 9: Heritage & Monuments", badge: "🏰", category: "Culture", difficulty: "Expert+", pointsPerQ: 50, skills: ["UNESCO Sites", "Seven Wonders", "Ajanta Caves"], description: "World heritage sites and architectural legacies across continents.", sampleTrick: "UNESCO preserves world cultural and natural heritage." },
  { level: 10, title: "Level 10: Grandmaster World Trivia", badge: "🌌", category: "High IQ Trivia", difficulty: "Grandmaster", pointsPerQ: 60, skills: ["Treaty of Versailles", "Space Missions", "Antarctic Treaty"], description: "Complex geopolitical history, space exploration milestones, and international law.", sampleTrick: "Yuri Gagarin became the first human in space in 1961." }
];

export const GK_METHODS_AND_TRICKS = {
  1: [
    { id: "gk1_1", topic: "Capitals", prompt: "What is the capital of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], answer: "B", answer_text: "New Delhi", method: "New Delhi was inaugurated as the capital of India in 1931.", trick: "⚡ Capital Hook: New Delhi is the seat of the Government of India!" },
    { id: "gk1_2", topic: "Geography", prompt: "Which is the largest continent by area?", options: ["Africa", "Asia", "Europe", "North America"], answer: "B", answer_text: "Asia", method: "Asia covers ~30% of Earth's total land area with over 4.5 billion people.", trick: "⚡ Fact Hook: Asia is #1 in both land area and population!" }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Roadmap & Methods Selector for ANY Game
// ─────────────────────────────────────────────────────────────────────────────
export const getGameRoadmap = (gameId = 'magic-number') => {
  if (gameId === 'science-explorer') return SCIENCE_ROADMAP;
  if (gameId === 'gk-explorer') return GK_ROADMAP;
  return LEVELS_METADATA;
};

export const getGameMethodsAndTricks = (gameId = 'magic-number') => {
  if (gameId === 'science-explorer') return SCIENCE_METHODS_AND_TRICKS;
  if (gameId === 'gk-explorer') return GK_METHODS_AND_TRICKS;
  return MASTER_METHODS_AND_TRICKS;
};


