// Mock API response structure for Sarathi-X Game Zone
export const mockGameZoneData = {
  studentProfile: {
    studentName: "Alex Vance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    classLevel: "Class 8",
    board: "CBSE",
    subject: "Mathematics & Reasoning",
    adaptiveLevel: "Adaptive Level 3",
    xpPoints: 3450,
    streakDays: 7,
    energyLives: 5,
    maxLives: 5
  },
  continueMission: {
    id: "magic-number",
    gameName: "Magic Number Aptitude Arena",
    missionTitle: "Master 10 Levels & 3-Second Mental Shortcuts",
    skill: "Quantitative Aptitude & Speed Tricks",
    progress: 75,
    difficulty: "Adaptive Levels 1-10",
    rewardXP: 350,
    estimatedMinutes: 5,
    planetColor: "purple",
    status: "Continue"
  },
  recommendedGames: [
    {
      id: "equation-galaxy",
      recommendationType: "Best Next Game",
      gameName: "Equation Galaxy",
      skill: "Linear Equations",
      reason: "Matches your next syllabus milestone",
      xpReward: 250
    },
    {
      id: "aptitude-arena",
      recommendationType: "Weak-Skill Practice",
      gameName: "Aptitude Arena",
      skill: "Ratio & Proportion",
      reason: "Focus area identified from recent accuracy (62%)",
      xpReward: 300
    },
    {
      id: "logic-lab",
      recommendationType: "Daily Logical Challenge",
      gameName: "Logic Lab",
      skill: "Syllogism & Deductive Reasoning",
      reason: "Boosts critical thinking & daily streak",
      xpReward: 200
    }
  ],
  authorizedModules: [
    {
      id: "magic-number",
      name: "Magic Number Aptitude Arena",
      category: "Aptitude",
      description: "Solve rapid numerical challenges, master 3-second Vedic & Aptitude shortcuts, and benchmark your Cognitive Aptitude Level & IQ.",
      assignedSkill: "Mental Math, Speed & Vedic Tricks",
      mastery: 88,
      availableMissions: 10,
      xpReward: 350,
      estimatedMinutes: 5,
      status: "Recommended",
      allowedModes: ["Learn Tricks", "Speed Arena", "Olympiad Challenge"],
      icon: "Zap",
      colorTheme: "#f59e0b",
      missions: [
        { id: 1, title: "Level 1: Arithmetic Blitz", status: "completed", xp: 50 },
        { id: 2, title: "Level 2: Fractions & Percentages", status: "completed", xp: 75 },
        { id: 3, title: "Level 3: Speed, Trains & Ratios", status: "active", xp: 100 },
        { id: 4, title: "Level 4: Algebra & Probability", status: "locked", xp: 125 }
      ]
    },
    {
      id: "science-explorer",
      name: "Science Explorer",
      category: "Science",
      description: "Explore physics, chemistry, biology, and astronomy with instant conceptual flash-tips across 10 progressive tiers.",
      assignedSkill: "Physics, Chemistry & Biology",
      mastery: 85,
      availableMissions: 10,
      xpReward: 350,
      estimatedMinutes: 5,
      status: "Recommended",
      allowedModes: ["Learn", "Practice", "Speed Arena"],
      icon: "Atom",
      colorTheme: "#10b981",
      missions: [
        { id: 1, title: "Tier 1: Living Systems & Plants", status: "active", xp: 50 },
        { id: 2, title: "Tier 2: Matter, Forces & Energy", status: "active", xp: 75 },
        { id: 3, title: "Tier 3: Molecular Chemistry", status: "locked", xp: 100 }
      ]
    },
    {
      id: "gk-explorer",
      name: "General Knowledge Explorer",
      category: "General Knowledge",
      description: "Journey through world civilizations, geography, scientific milestones, and civics with mnemonic memory hooks.",
      assignedSkill: "World History, Geography & Civics",
      mastery: 80,
      availableMissions: 10,
      xpReward: 320,
      estimatedMinutes: 5,
      status: "Recommended",
      allowedModes: ["Learn", "Practice", "Speed Arena"],
      icon: "Compass",
      colorTheme: "#06b6d4",
      missions: [
        { id: 1, title: "Tier 1: Capitals & Geography", status: "active", xp: 50 },
        { id: 2, title: "Tier 2: Ancient Civilizations", status: "locked", xp: 75 }
      ]
    },
    {
      id: "word-master",
      name: "Word Master",
      category: "Verbal Reasoning",
      description: "Elevate your vocabulary, master antonyms, conquer grammatical nuances, and decode word analogies.",
      assignedSkill: "English, Vocabulary & Grammar",
      mastery: 78,
      availableMissions: 10,
      xpReward: 300,
      estimatedMinutes: 5,
      status: "Recommended",
      allowedModes: ["Learn", "Practice", "Speed Arena"],
      icon: "BookOpen",
      colorTheme: "#8b5cf6",
      missions: [
        { id: 1, title: "Tier 1: Antonym & Root Master", status: "active", xp: 50 },
        { id: 2, title: "Tier 2: Idiomatic Expressions", status: "locked", xp: 75 }
      ]
    },
    {
      id: "subject-battle",
      name: "Subject Quiz Battle",
      category: "Aptitude",
      description: "Test yourself across Mathematics, Science, English, and General Knowledge in rapid multi-subject battle rounds.",
      assignedSkill: "Multi-Disciplinary Speed Trivia",
      mastery: 84,
      availableMissions: 10,
      xpReward: 400,
      estimatedMinutes: 6,
      status: "Recommended",
      allowedModes: ["Solo Battle", "Timed Challenge"],
      icon: "Swords",
      colorTheme: "#ef4444",
      missions: [
        { id: 1, title: "Round 1: Cross-Disciplinary Blitz", status: "active", xp: 80 },
        { id: 2, title: "Round 2: Rapid Calculation Clash", status: "locked", xp: 100 }
      ]
    },
    {
      id: "number-nova",
      name: "Number Nova",
      category: "Mathematics",
      description: "Master number systems, fractions, decimals, and rapid mental calculation.",
      assignedSkill: "Fractions & Decimals",
      mastery: 82,
      availableMissions: 4,
      xpReward: 200,
      estimatedMinutes: 6,
      status: "Recommended", // Recommended | Continue | New | Practice | Revision | Locked
      allowedModes: ["Learn", "Practice", "Timed"],
      icon: "Sparkles",
      colorTheme: "#3b82f6",
      missions: [
        { id: 1, title: "Fraction Fusion", status: "completed", xp: 50 },
        { id: 2, title: "Decimal Orbit", status: "active", xp: 75 },
        { id: 3, title: "Percentage Blitz", status: "locked", xp: 75 }
      ]
    },
    {
      id: "equation-galaxy",
      name: "Equation Galaxy",
      category: "Mathematics",
      description: "Balance equations, solve variables, and repair space bridges using algebra.",
      assignedSkill: "Linear Equations",
      mastery: 65,
      availableMissions: 5,
      xpReward: 250,
      estimatedMinutes: 8,
      status: "Continue",
      allowedModes: ["Learn", "Practice", "Challenge", "Boss Mission"],
      icon: "Atom",
      colorTheme: "#06b6d4",
      missions: [
        { id: 1, title: "Variable Discovery", status: "completed", xp: 60 },
        { id: 2, title: "Repair the Energy Bridge", status: "active", xp: 90 },
        { id: 3, title: "Algebraic Core Defense", status: "locked", xp: 100 }
      ]
    },
    {
      id: "geometry-orbit",
      name: "Geometry Orbit",
      category: "Mathematics",
      description: "Scan angles, calculate perimeter & area, and construct 3D geometric architectures.",
      assignedSkill: "Angles & Area Calculation",
      mastery: 40,
      availableMissions: 3,
      xpReward: 220,
      estimatedMinutes: 7,
      status: "New",
      allowedModes: ["Learn", "Practice"],
      icon: "Compass",
      colorTheme: "#8b5cf6",
      missions: [
        { id: 1, title: "Angle Scanner Alpha", status: "active", xp: 70 },
        { id: 2, title: "Area Architect", status: "locked", xp: 80 }
      ]
    },
    {
      id: "pattern-planet",
      name: "Pattern Planet",
      category: "Logical Reasoning",
      description: "Decode numerical sequences, visual patterns, and missing symbol challenges.",
      assignedSkill: "Visual & Sequence Recognition",
      mastery: 90,
      availableMissions: 6,
      xpReward: 180,
      estimatedMinutes: 5,
      status: "Revision",
      allowedModes: ["Practice", "Timed", "Revision"],
      icon: "Activity",
      colorTheme: "#ec4899",
      missions: [
        { id: 1, title: "Sequence Pathfinder", status: "completed", xp: 60 },
        { id: 2, title: "Symbol Matrix", status: "completed", xp: 60 },
        { id: 3, title: "Odd One Out Sprint", status: "active", xp: 60 }
      ]
    },
    {
      id: "logic-lab",
      name: "Logic Lab",
      category: "Logical Reasoning",
      description: "Solve truth-and-lie riddles, blood relations, and syllogistic deduction puzzles.",
      assignedSkill: "Deductive & Syllogism Reasoning",
      mastery: 75,
      availableMissions: 4,
      xpReward: 210,
      estimatedMinutes: 6,
      status: "Recommended",
      allowedModes: ["Practice", "Challenge", "Boss Mission"],
      icon: "Brain",
      colorTheme: "#a855f7",
      missions: [
        { id: 1, title: "Detective Mission: The Lost Signal", status: "active", xp: 80 },
        { id: 2, title: "Relation Mapper", status: "locked", xp: 70 }
      ]
    },
    {
      id: "aptitude-arena",
      name: "Aptitude Arena",
      category: "Aptitude",
      description: "Simulate real business trades, speed-distance train races, and profit/loss calculations.",
      assignedSkill: "Ratio, Proportion & Speed",
      mastery: 62,
      availableMissions: 4,
      xpReward: 300,
      estimatedMinutes: 10,
      status: "Practice",
      allowedModes: ["Learn", "Practice", "Timed"],
      icon: "TrendingUp",
      colorTheme: "#f59e0b",
      missions: [
        { id: 1, title: "Marketplace Challenge", status: "active", xp: 100 },
        { id: 2, title: "Train Speed Simulator", status: "locked", xp: 100 }
      ]
    },
    {
      id: "data-dimension",
      name: "Data Dimension",
      category: "Aptitude",
      description: "Decode bar graphs, pie charts, and line statistics in an information command center.",
      assignedSkill: "Graph & Chart Interpretation",
      mastery: 55,
      availableMissions: 3,
      xpReward: 240,
      estimatedMinutes: 8,
      status: "New",
      allowedModes: ["Learn", "Practice"],
      icon: "BarChart3",
      colorTheme: "#10b981",
      missions: [
        { id: 1, title: "Chart Decoder Alpha", status: "active", xp: 80 }
      ]
    },
    {
      id: "memory-matrix",
      name: "Memory Matrix",
      category: "Memory",
      description: "Train working memory, visual grid recall, and rapid number span retention.",
      assignedSkill: "Visual Working Memory",
      mastery: 88,
      availableMissions: 5,
      xpReward: 190,
      estimatedMinutes: 5,
      status: "Recommended",
      allowedModes: ["Timed", "Challenge"],
      icon: "Grid",
      colorTheme: "#6366f1",
      missions: [
        { id: 1, title: "Flash Number Recall", status: "active", xp: 95 }
      ]
    },
    {
      id: "spatial-universe",
      name: "Spatial Universe",
      category: "Problem Solving",
      description: "Rotate 3D polyhedrons, scan mirror images, fold paper patterns, and solve dice grids.",
      assignedSkill: "3D Spatial Rotation & Folding",
      mastery: 48,
      availableMissions: 2,
      xpReward: 260,
      estimatedMinutes: 9,
      status: "Practice",
      allowedModes: ["Practice", "Challenge"],
      icon: "Box",
      colorTheme: "#3b82f6",
      missions: [
        { id: 1, title: "Cube Assembly Protocol", status: "active", xp: 130 }
      ]
    },
    {
      id: "coding-quest",
      name: "Coding Quest",
      category: "Problem Solving",
      description: "Build logic flowcharts, sequence robot navigation loops, and debug code algorithms.",
      assignedSkill: "Computational Thinking & Loops",
      mastery: 70,
      availableMissions: 4,
      xpReward: 280,
      estimatedMinutes: 9,
      status: "Continue",
      allowedModes: ["Learn", "Practice", "Challenge"],
      icon: "Code2",
      colorTheme: "#06b6d4",
      missions: [
        { id: 1, title: "Robot Navigation Loop", status: "active", xp: 140 }
      ]
    },
    {
      id: "puzzle-chamber",
      name: "Puzzle Chamber",
      category: "Problem Solving",
      description: "Unlock secret vaults with Mini Sudoku, constraint grids, and mathematical riddles.",
      assignedSkill: "Constraint Logic & Grid Sudoku",
      mastery: 30,
      availableMissions: 0,
      xpReward: 320,
      estimatedMinutes: 12,
      status: "Locked",
      allowedModes: ["Locked"],
      prerequisite: "Complete Linear Equations Mastery 70%",
      unlockCondition: "Achieve 70% Mastery in Equation Galaxy to unlock the Vault.",
      icon: "Lock",
      colorTheme: "#64748b",
      missions: []
    },
    {
      id: "real-world-mission",
      name: "Real-World Mission",
      category: "Problem Solving",
      description: "Manage space colony budgets, plan planetary travel routes, and solve life situations.",
      assignedSkill: "Resource Management & Financial Math",
      mastery: 20,
      availableMissions: 0,
      xpReward: 350,
      estimatedMinutes: 15,
      status: "Locked",
      allowedModes: ["Locked"],
      prerequisite: "Complete Ratio & Proportion Mastery 75%",
      unlockCondition: "Achieve 75% Mastery in Aptitude Arena to unlock Colony Operations.",
      icon: "ShieldAlert",
      colorTheme: "#64748b",
      missions: []
    }
  ],
  dailyChallenge: {
    title: "Decode the Alien Pattern",
    skill: "Pattern Recognition & Sequence Logic",
    questionCount: 10,
    timeLimitMinutes: 5,
    xpReward: 300,
    participantsCount: 420,
    status: "available" // available | completed
  },
  progressSummary: {
    gamesPlayed: 28,
    missionsCompleted: 19,
    currentAccuracyPercent: 84,
    bestSkill: "Visual Pattern Recognition (90%)",
    weakestSkill: "Ratio & Proportion (62%)",
    totalXP: 3450,
    currentRank: "#4 in Class 8 (CBSE)"
  }
};
