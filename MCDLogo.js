import React from 'react';
import './MCDLogo.css';

const MCDLogo = ({ size = 60 }) => {
  return (
    <div className="mcd-logo" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="mcd-logo-svg"
        shapeRendering="geometricPrecision"
        textRendering="optimizeLegibility"
      >
        {/* Outer Golden Circle */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="#FFB800" strokeWidth="4" />
        
        {/* Blue Band with Text Area */}
        <circle cx="100" cy="100" r="85" fill="#1e3a8a" />
        
        {/* Hindi Text Area (Top) */}
        <text
          x="100"
          y="75"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          दिल्ली नगर निगम
        </text>
        
        {/* English Text (Left) */}
        <text
          x="30"
          y="100"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          transform="rotate(-90 30 100)"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          MUNICIPAL
        </text>
        
        {/* English Text (Right) */}
        <text
          x="170"
          y="100"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          transform="rotate(90 170 100)"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          CORPORATION OF DELHI
        </text>
        
        {/* Shield - Upper Green Section */}
        <path
          d="M 60 100 L 100 60 L 140 100 L 140 130 L 100 150 L 60 130 Z"
          fill="#10b981"
        />
        
        {/* Qutub Minar (Simplified) */}
        <rect x="95" y="80" width="10" height="25" fill="#FFB800" />
        <rect x="97" y="75" width="6" height="5" fill="#FFB800" />
        
        {/* Red Fort (Left) */}
        <rect x="70" y="90" width="15" height="12" fill="#dc2626" />
        <circle cx="77.5" cy="88" r="2" fill="#FFB800" />
        
        {/* Town Hall (Right) */}
        <rect x="115" y="90" width="15" height="12" fill="#dc2626" />
        <rect x="120" y="88" width="5" height="4" fill="#FFB800" />
        
        {/* Shield - Lower Red Section */}
        <path
          d="M 60 130 L 100 150 L 140 130 L 140 160 L 100 170 L 60 160 Z"
          fill="#dc2626"
        />
        
        {/* Book with Gears (Left) */}
        <rect x="70" y="140" width="12" height="8" fill="#FFB800" />
        <circle cx="73" cy="144" r="2" fill="#1e3a8a" />
        <circle cx="79" cy="144" r="2" fill="#1e3a8a" />
        
        {/* Waves (Right) */}
        <path
          d="M 118 142 Q 120 140, 122 142 T 126 142 T 130 142"
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="2"
        />
        <path
          d="M 118 146 Q 120 144, 122 146 T 126 146 T 130 146"
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="2"
        />
        
        {/* Lower Banner */}
        <rect x="50" y="175" width="100" height="15" rx="2" fill="#1e3a8a" stroke="#FFB800" strokeWidth="1" />
        <text
          x="100"
          y="186"
          textAnchor="middle"
          fill="white"
          fontSize="8"
          fontFamily="Arial, sans-serif"
          style={{ textRendering: 'optimizeLegibility' }}
        >
          तमसो मा ज्योतिर्गमय
        </text>
      </svg>
    </div>
  );
};

export default MCDLogo;

