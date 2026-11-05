import { MASTER_METHODS_AND_TRICKS } from './allLevelsData';

/**
 * Fallback questions and tricks bank for Magic Number Arena
 * Ensures instant 100% offline playability across all 10 levels even if network / backend is restarting.
 */

export const FALLBACK_QUESTIONS = MASTER_METHODS_AND_TRICKS;

export const FALLBACK_TRICKS = [
  {
    id: "trick-11-mult",
    title: "The 11-Multiplication Lightning Rule",
    category: "Mental Arithmetic",
    formula: "ab × 11 = a | (a + b) | b",
    description: "To multiply any 2-digit number by 11, split the two digits and place their sum in between.",
    example: "45 × 11 → Put 4 and 5 apart: 4 _ 5. Add 4 + 5 = 9. Answer = 495!",
    carryExample: "78 × 11 → 7 _ 8. 7 + 8 = 15. Carry the 1 to 7: (7+1) 5 8 = 858."
  },
  {
    id: "trick-square-5",
    title: "Instant Squaring for Numbers Ending in 5",
    category: "Vedic Squares",
    formula: "(N5)² = [N × (N + 1)] 25",
    description: "Multiply the first digit(s) N by (N + 1), then simply suffix 25 to the result.",
    example: "75² → N = 7. 7 × (7 + 1) = 7 × 8 = 56. Suffix 25 → 5,625 in 1 second!",
    carryExample: "115² → N = 11. 11 × 12 = 132. Suffix 25 → 13,225!"
  },
  {
    id: "trick-percent-split",
    title: "The Universal Percentage Splitter",
    category: "Percentages & Business",
    formula: "X% of Y = (10% + 5% + 1%) combinations",
    description: "Break complicated percentages into base building blocks: 10% (move decimal 1 place left), 1% (move decimal 2 places left), and 5% (half of 10%).",
    example: "15% of 320: 10% = 32. 5% = half of 32 = 16. Total = 32 + 16 = 48!",
    carryExample: "18% of 250: 20% (25 × 2 = 50) minus 2% (2.5 × 2 = 5) = 45!"
  },
  {
    id: "trick-cross-alligation",
    title: "The Cross-Alligation Matrix",
    category: "Mixtures & Weighted Averages",
    formula: "Ratio = (Dearer Price - Mean) : (Mean - Cheaper Price)",
    description: "Cross subtract the mean mixture price from the ingredient prices to find mixing proportions in 2 seconds.",
    example: "Mix ₹40/kg and ₹60/kg rice to get ₹52/kg: 60 - 52 = 8; 52 - 40 = 12. Ratio = 8:12 = 2:3!",
    carryExample: "Mix 10% acid and 40% acid for 25% acid: 40 - 25 = 15; 25 - 10 = 15. Ratio = 1:1!"
  },
  {
    id: "trick-train-speed",
    title: "The 18/5 Kinematic Speed Factor",
    category: "Speed & Kinematics",
    formula: "1 m/s = 18/5 km/h = 3.6 km/h",
    description: "Use 5 m/s = 18 km/h as a base ruler. Every multiple of 18 km/h is 5 m/s.",
    example: "A train at 72 km/h: Since 72 is 4 × 18, its speed is directly 4 × 5 = 20 m/s!",
    carryExample: "To convert 25 m/s to km/h: 25 is 5 × 5, so 5 × 18 = 90 km/h."
  }
];

export const evaluateLocalAptitude = (score, accuracy, avgTime) => {
  let title = "Novice Reckoner";
  let badge = "🌱";
  let percentile = "Baseline";
  let description = "Building essential numerical intuition and arithmetic fluency.";

  if (score >= 180) {
    title = "Grandmaster Prodigy";
    badge = "🌌";
    percentile = "Top 1%";
    description = "Elite Olympiad-grade mental agility. Lightning-fast numerical deduction.";
  } else if (score >= 120) {
    title = "Elite Problem Solver";
    badge = "⚡";
    percentile = "Top 5%";
    description = "Mastery over complex multi-step word problems, speed ratios, and combinatorics.";
  } else if (score >= 70) {
    title = "Tactical Calculator";
    badge = "🎯";
    percentile = "Top 15%";
    description = "High proficiency in mental shortcuts, algebraic substitutions, and percentage splits.";
  } else if (score >= 30) {
    title = "Pattern Analyst";
    badge = "🧩";
    percentile = "Top 35%";
    description = "Strong foundational number sense, arithmetic speed, and ratio comprehension.";
  }

  const iq = 100 + Math.min(35, Math.round(score / 5)) + (accuracy > 80 ? 5 : 0);

  return {
    score,
    totalQuestions: 6,
    correctAnswers: Math.round((accuracy / 100) * 6),
    accuracy: Math.round(accuracy),
    timeSpentSeconds: 30,
    avgTimePerQuestion: avgTime,
    aptitudeLevel: title,
    badge,
    description,
    percentile,
    estimatedIq: iq,
    radar: {
      numerical_agility: Math.min(100, Math.round(accuracy * 0.9)),
      calculation_speed: Math.max(20, Math.min(100, Math.round(100 - avgTime * 5))),
      logical_rigor: Math.min(100, Math.round(accuracy * 0.95)),
      trick_mastery: Math.min(100, Math.round(score * 1.5))
    }
  };
};
