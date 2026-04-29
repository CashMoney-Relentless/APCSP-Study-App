// Centralized scoring rules so every mode awards points consistently.

export const POINTS = {
  CORRECT: 100,
  HARD_BONUS: 50,
  STREAK_3_BONUS: 50,
  STREAK_5_BONUS: 100,
  GAME_BONUS: 25,
  DAILY_CHALLENGE_BONUS: 250,
};

/**
 * Score a single answer.
 *   prevStreak: current streak before this answer
 * Returns:
 *   { earned, nextStreak, breakdown }
 *   breakdown is an array of { label, value } pieces for display.
 */
export function scoreAnswer({ isCorrect, difficulty, prevStreak }) {
  const breakdown = [];
  if (!isCorrect) return { earned: 0, nextStreak: 0, breakdown };

  let earned = POINTS.CORRECT;
  breakdown.push({ label: 'correct', value: POINTS.CORRECT });

  if (difficulty === 'hard') {
    earned += POINTS.HARD_BONUS;
    breakdown.push({ label: 'hard bonus', value: POINTS.HARD_BONUS });
  }

  const nextStreak = prevStreak + 1;
  if (nextStreak > 0 && nextStreak % 5 === 0) {
    earned += POINTS.STREAK_5_BONUS;
    breakdown.push({ label: '5-streak', value: POINTS.STREAK_5_BONUS });
  } else if (nextStreak > 0 && nextStreak % 3 === 0) {
    earned += POINTS.STREAK_3_BONUS;
    breakdown.push({ label: '3-streak', value: POINTS.STREAK_3_BONUS });
  }

  return { earned, nextStreak, breakdown };
}

/**
 * Game points: gameBonus + correct base. Used by mini games for parity.
 */
export function scoreGameTick({ isCorrect, prevStreak }) {
  const breakdown = [];
  if (!isCorrect) return { earned: 0, nextStreak: 0, breakdown };
  let earned = POINTS.CORRECT + POINTS.GAME_BONUS;
  breakdown.push({ label: 'correct', value: POINTS.CORRECT });
  breakdown.push({ label: 'game bonus', value: POINTS.GAME_BONUS });
  const nextStreak = prevStreak + 1;
  if (nextStreak > 0 && nextStreak % 5 === 0) {
    earned += POINTS.STREAK_5_BONUS;
    breakdown.push({ label: '5-streak', value: POINTS.STREAK_5_BONUS });
  } else if (nextStreak > 0 && nextStreak % 3 === 0) {
    earned += POINTS.STREAK_3_BONUS;
    breakdown.push({ label: '3-streak', value: POINTS.STREAK_3_BONUS });
  }
  return { earned, nextStreak, breakdown };
}

export function gradeFor(accuracy) {
  if (accuracy >= 90) return { label: 'Mastery', tone: 'mastery' };
  if (accuracy >= 75) return { label: 'Strong', tone: 'strong' };
  if (accuracy >= 60) return { label: 'Developing', tone: 'developing' };
  return { label: 'Needs Review', tone: 'review' };
}
