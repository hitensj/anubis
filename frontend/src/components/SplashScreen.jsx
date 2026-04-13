import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import AnubisLogo from './AnubisLogo';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const [drawProgress, setDrawProgress] = useState(0);

  const messages = [
    "Connecting to intelligence feeds...",
    "Calibrating route matrix...",
    "Awakening Anubis..."
  ];

  useEffect(() => {
    // Phase timings:
    // 0-1.5s: Draw Logo
    // 1.5s: Show 'ANUBIS'
    // 2.2s: Show 'Supply Intelligence System'
    // 2.7s: Show Line
    // 2.9s: Show Text Loop
    // 3.5s: Trigger fadeout via internal state? Let App handle unmount with CSS.
    
    let drawInterval = setInterval(() => {
      setDrawProgress(p => Math.min(1, p + (0.015 * 1.5)));
    }, 16);

    setTimeout(() => setPhase(1), 1500);
    setTimeout(() => setPhase(2), 2200);
    setTimeout(() => setPhase(3), 2700);
    
    setTimeout(() => {
      setPhase(4);
      let mIdx = 0;
      const mInt = setInterval(() => {
        if(mIdx < messages.length) {
          setLoadingText(messages[mIdx]);
          mIdx++;
        }
      }, 300);
      return () => clearInterval(mInt);
    }, 2900);

    const completeTimeout = setTimeout(() => {
      setPhase(5); // trigger fade
      setTimeout(onComplete, 800); // 0.8s fade
    }, 3500);

    return () => {
      clearInterval(drawInterval);
      clearTimeout(completeTimeout);
    };
  }, []);

  return (
    <div className={`splash-container ${phase === 5 ? 'fade-out' : ''}`}>
      <div className="particles-layer">
        {/* Simple CSS particles simulated via array */}
        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 3}s`
          }}/>
        ))}
      </div>
      
      <div className="splash-center">
        <div className="logo-wrapper">
          <AnubisLogo width={120} height={140} animated={true} drawProgress={drawProgress} />
        </div>
        
        <h1 className="splash-title font-cinzel">
          {"ANUBIS".split('').map((char, i) => (
            <span key={i} className={phase >= 1 ? 'letter-in' : 'letter-hidden'} style={{ animationDelay: `${i * 0.1}s` }}>
              {char}
            </span>
          ))}
        </h1>

        <div className={`splash-subtitle font-cinzel ${phase >= 2 ? 'fade-in' : 'hidden'}`}>
          Supply Intelligence System
        </div>

        <div className={`splash-line ${phase >= 3 ? 'sweep-in' : 'hidden'}`}></div>

        <div className={`splash-loading font-mono ${phase >= 4 ? 'fade-in' : 'hidden'}`}>
          {loadingText}<span className="blink">_</span>
        </div>
      </div>
      
      <button className="skip-btn font-cinzel" onClick={onComplete}>SKIP</button>
    </div>
  );
}
