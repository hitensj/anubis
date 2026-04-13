import React from 'react';

// Central reusable SVG for Anubis Logo
export default function AnubisLogo({ width = 32, height = 32, animated = false, drawProgress = 1 }) {
  const isDrawMode = animated;
  const strokeColor = "var(--gold-divine)";

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 120 140" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* Network Nodes in negative space / base */}
      <circle cx="60" cy="120" r="4" stroke={strokeColor} strokeWidth="1.5" />
      <circle cx="30" cy="130" r="4" stroke={strokeColor} strokeWidth="1.5" />
      <circle cx="90" cy="130" r="4" stroke={strokeColor} strokeWidth="1.5" />
      
      {/* Network connections */}
      <path d="M60 116 L60 100" stroke={strokeColor} strokeWidth="1.5" />
      <path d="M60 120 L30 130" stroke={strokeColor} strokeWidth="1.5" />
      <path d="M60 120 L90 130" stroke={strokeColor} strokeWidth="1.5" />

      {/* Jackal Head Silhouette */}
      <path 
        d="M60 100 L40 70 L30 30 L45 50 L60 20 L75 50 L90 30 L80 70 Z M60 20 L60 60" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinejoin="round"
        strokeDasharray={isDrawMode ? 400 : 0}
        strokeDashoffset={isDrawMode ? 400 * (1 - drawProgress) : 0}
        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
      />
      
      {/* Glowing Diamond Eye */}
      <polygon 
        points="60,65 65,75 60,85 55,75" 
        fill={isDrawMode && drawProgress < 0.8 ? "none" : strokeColor}
        style={{ filter: "drop-shadow(0 0 8px var(--gold-glow))" }}
      />
    </svg>
  );
}
