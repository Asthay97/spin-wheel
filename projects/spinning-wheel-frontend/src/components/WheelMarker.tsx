import React from 'react';

interface WheelMarkerProps {
  radius: number;
}

const WheelMarker: React.FC<WheelMarkerProps> = ({ radius }) => {
  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
      <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg" />
    </div>
  );
};

export default WheelMarker;