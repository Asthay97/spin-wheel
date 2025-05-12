import { Participant } from '../types';

// Generate a random number between min and max
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Calculate the rotation angle based on the selected winner
export function calculateWinnerRotation(participants, winnerIndex, totalSpins = 5) {
  const anglePerParticipant = 360 / participants.length;
  const winnerCenterAngle = (winnerIndex + 0.5) * anglePerParticipant;

  const desiredPointerAngle = 90; // top position
  const offsetToTop = desiredPointerAngle - winnerCenterAngle;

  const totalRotation = totalSpins * 360 + offsetToTop;

  return totalRotation;
}


// Easing function for realistic spinning (ease-out)
export const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};