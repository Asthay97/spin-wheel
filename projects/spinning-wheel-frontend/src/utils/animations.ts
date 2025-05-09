import { Participant } from '../types';

// Generate a random number between min and max
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Calculate the rotation angle based on the selected winner
export const calculateWinnerRotation = (
  participants: Participant[],
  selectedWinnerIndex: number
): number => {
  const minRotation = 1800; // 5 full rotations
  const sectionSize = 360 / participants.length;

  // Align the winner segment to the top (0°), which is where the pointer is
  const winnerOffset = selectedWinnerIndex * sectionSize + sectionSize / 2;

  // Add randomness within the segment
  const randomOffset = getRandomNumber(-sectionSize / 4, sectionSize / 4);

  const finalRotation = minRotation + winnerOffset + randomOffset;

  return finalRotation;
};


// Easing function for realistic spinning (ease-out)
export const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};