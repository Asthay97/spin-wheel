import React, { useRef, useEffect } from 'react';
import WheelSection from './WheelSection';
import WheelMarker from './WheelMarker';
import { Participant } from '../types';
import { easeOutCubic } from '../utils/animations';

interface WheelProps {
  participants: Participant[];
  isSpinning: boolean;
  rotation: number;
  spinDuration: number;
  onSpinComplete: (winner?: Participant) => void;
}

const Wheel: React.FC<WheelProps> = ({
  participants,
  isSpinning,
  rotation,
  spinDuration,
  onSpinComplete
}) => {
  const wheelRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const currentRotationRef = useRef<number>(0);

  const size = 300;
  const radius = size / 2;

  useEffect(() => {
    if (isSpinning && wheelRef.current) {
      startTimeRef.current = null;

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsedTime = timestamp - startTimeRef.current;
        const progress = Math.min(elapsedTime / spinDuration, 1);
        const easedProgress = easeOutCubic(progress);

        currentRotationRef.current = rotation * easedProgress;

        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${currentRotationRef.current}deg)`;
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Determine winner
          const finalRotation = currentRotationRef.current % 360;
          const normalizedAngle = (360 - finalRotation + 90) % 360; // 90° marker at top
          const anglePerParticipant = 360 / participants.length;
          const winningIndex = Math.floor(normalizedAngle / anglePerParticipant);
          const winner = participants[winningIndex];
          onSpinComplete(winner);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isSpinning, rotation, spinDuration, onSpinComplete, participants]);

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative">
        <svg
          ref={wheelRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transition-transform"
          style={{ transformOrigin: 'center' }}
        >
          {participants.map((participant, index) => (
            <WheelSection
              key={participant.id}
              participant={participant}
              index={index}
              total={participants.length}
              radius={radius}
            />
          ))}
          <circle
            cx={radius}
            cy={radius}
            r={radius * 0.05}
            fill="#fff"
            stroke="#000"
            strokeWidth="2"
          />
        </svg>
        <WheelMarker radius={radius} />
      </div>
    </div>
  );
};

export default Wheel;
