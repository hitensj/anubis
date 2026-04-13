import React, { useEffect, useState } from 'react';

export default function RiskGauge({ score = 0, size = 200 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to final
    const duration = 1500;
    const start = performance.now();

    const animate = (time) => {
      let progress = (time - start) / duration;
      if (progress > 1) progress = 1;
      // cubic ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * ease));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  // Color mapping
  let color = "var(--nile-teal)";
  let category = "LOW";
  let glow = "var(--nile-glow)";
  if (score > 30) { color = "var(--gold-divine)"; category = "MEDIUM"; glow = "var(--gold-glow)"; }
  if (score > 60) { color = "var(--amber-warning)"; category = "HIGH"; glow = "rgba(224, 123, 32, 0.3)"; }
  if (score > 80) { color = "var(--red-danger)"; category = "CRITICAL"; glow = "rgba(192, 57, 43, 0.4)"; }

  // SVG dimensions
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto', filter: `drop-shadow(0 0 10px ${glow})` }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle 
          cx={size/2} cy={size/2} r={radius} 
          fill="none" 
          stroke="var(--bg-papyrus)" 
          strokeWidth={strokeWidth} 
        />
        {/* Fill track */}
        <circle 
          cx={size/2} cy={size/2} r={radius} 
          fill="none" 
          stroke={color} 
          strokeWidth={strokeWidth} 
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
        {/* Inner ring for "Eye of Horus" feel */}
        <circle 
          cx={size/2} cy={size/2} r={radius - 15} 
          fill="none" 
          stroke="var(--gold-dim)" 
          strokeWidth="1" 
          strokeDasharray="4 4"
        />
      </svg>
      {/* Absolute center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <div className="font-mono" style={{ fontSize: '3rem', color: 'var(--text-primary)', lineHeight: 1 }}>
          {animatedScore}
        </div>
        <div className="font-cinzel" style={{ fontSize: '1rem', color, fontWeight: 'bold', marginTop: '0.5rem' }}>
          {category}
        </div>
      </div>
    </div>
  );
}
