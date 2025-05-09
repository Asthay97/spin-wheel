import React from 'react';
import { Participant } from '../types';

interface WheelSectionProps {
  participant: Participant;
  index: number;
  total: number;
  radius: number;
}

const WheelSection: React.FC<WheelSectionProps> = ({ participant, index, total, radius }) => {
  // Calculate the angle for each section
  const angle = 360 / total;
  // Calculate start and end angles
  const startAngle = index * angle;
  const endAngle = (index + 1) * angle;
  
  // Convert angles to radians
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  // Calculate coordinates for the section path
  const x1 = radius + radius * Math.cos(startRad);
  const y1 = radius + radius * Math.sin(startRad);
  const x2 = radius + radius * Math.cos(endRad);
  const y2 = radius + radius * Math.sin(endRad);
  
  // Create the path for the section
  const largeArcFlag = angle > 180 ? 1 : 0;
  const pathData = [
    `M ${radius},${radius}`,
    `L ${x1},${y1}`,
    `A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`,
    'Z'
  ].join(' ');
  
  // Calculate text position (in the middle of the section)
  const textAngle = startAngle + angle / 2;
  const textRad = (textAngle * Math.PI) / 180;
  const textRadius = radius * 0.75; // Position text at 75% of the radius
  const textX = radius + textRadius * Math.cos(textRad);
  const textY = radius + textRadius * Math.sin(textRad);
  
  // Calculate text rotation
  const textRotation = textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle;
  
  return (
    <g>
      <path
        d={pathData}
        fill={participant.color}
        stroke="#fff"
        strokeWidth="2"
      />
      <text
        x={textX}
        y={textY}
        fill="#fff"
        fontWeight="bold"
        fontSize="14px"
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
        style={{
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
          pointerEvents: 'none',
        }}
      >
        {participant.name}
      </text>
    </g>
  );
};

export default WheelSection;