import React, { useEffect, useRef } from 'react';

interface SpinningWheelProps {
  items: string[];
  onComplete: (item: string) => void;
  isSpinning: boolean;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ items, onComplete, isSpinning }) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];

  useEffect(() => {
    if (isSpinning && wheelRef.current) {
      const selectedItem = items[Math.floor(Math.random() * items.length)];
      const extraSpins = 5;
      const baseRotation = extraSpins * 360;
      const itemRotation = (360 / items.length) * items.indexOf(selectedItem);
      const totalRotation = baseRotation + itemRotation;

      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;

      setTimeout(() => {
        onComplete(selectedItem);
      }, 5000);
    }
  }, [isSpinning, items, onComplete]);

  if (items.length === 0) {
    return (
      <div className="w-64 h-64 rounded-full bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Add items to spin</p>
      </div>
    );
  }

  const itemAngle = 360 / items.length;

  return (
    <div className="relative w-64 h-64">
      <div
        ref={wheelRef}
        className="absolute w-full h-full rounded-full overflow-hidden transition-transform duration-5000 ease-out"
        style={{
          transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.21, 0.99)' : 'none',
          transform: 'rotate(0deg)',
        }}
      >
        {items.map((item, index) => (
          <div
            key={item}
            className="absolute w-full h-full origin-center"
            style={{
              transform: `rotate(${index * itemAngle}deg)`,
            }}
          >
            <div
              className="absolute w-1/2 h-full origin-right"
              style={{
                right: '50%',
                backgroundColor: colors[index % colors.length],
                transform: 'rotate(0deg)',
              }}
            >
              <span
                className="absolute whitespace-nowrap text-sm font-bold"
                style={{
                  left: '100%',
                  top: '50%',
                  transform: `rotate(${90 + itemAngle / 2}deg) translate(-50%, -50%)`,
                }}
              >
                {item}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div
        className="absolute w-4 h-6 bg-red-500"
        style={{
          top: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        }}
      />
    </div>
  );
};

export default SpinningWheel;