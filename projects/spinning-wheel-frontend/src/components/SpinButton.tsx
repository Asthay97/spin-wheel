import React from 'react';
import { RotateCw } from 'lucide-react';

interface SpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSpinning: boolean;
}

const SpinButton: React.FC<SpinButtonProps> = ({ onClick, disabled, isSpinning }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        mt-8 px-10 py-4 rounded-full font-medium text-base
        flex items-center justify-center gap-3
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        shadow-lg hover:shadow-xl
        ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            : isSpinning
            ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-300'
        }
      `}
    >
      <RotateCw
        size={20}
        className={`transition-transform ${isSpinning ? 'animate-spin' : ''}`}
      />
      <span className="font-semibold">
        {isSpinning ? 'Processing...' : 'Start Selection'}
      </span>
    </button>
  );
};

export default SpinButton;