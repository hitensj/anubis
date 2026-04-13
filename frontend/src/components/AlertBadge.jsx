import React from 'react';
import { riskColors, bgRiskColors } from '../utils/riskColors';

export default function AlertBadge({ level }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.6rem',
      borderRadius: '2px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      letterSpacing: '1px',
      fontFamily: 'var(--font-heading)',
      color: riskColors[level] || 'var(--text-secondary)',
      backgroundColor: bgRiskColors[level] || 'var(--bg-stone)',
      border: `1px solid ${riskColors[level] || 'var(--border-stone)'}`,
      boxShadow: `0 0 8px ${bgRiskColors[level] || 'transparent'}`
    }}>
      {level}
    </span>
  );
}
