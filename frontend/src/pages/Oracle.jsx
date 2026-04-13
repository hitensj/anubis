import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import RiskGauge from '../components/RiskGauge';
import AlertBadge from '../components/AlertBadge';
import AnubisLogo from '../components/AnubisLogo';
import './Oracle.css';

const MOCK_STATUSES = [
  "✓ Weather intelligence acquired",
  "✓ Geopolitical scan complete",
  "✓ News feeds analyzed",
  "✓ Cascading impact modeled",
  "✓ Judgment rendered"
];

export default function Oracle() {
  const [formData, setFormData] = useState({
    origin: 'Mumbai', destination: 'Rotterdam', cargo_type: 'Electronics',
    priority: 'Critical', departure_date: '2026-05-01', cargo_value_tier: 'High',
  });
  const [loading, setLoading] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setStatusIdx(0);

    // Fake status progression
    const interval = setInterval(() => {
      setStatusIdx(curr => {
        if (curr >= MOCK_STATUSES.length - 1) {
          clearInterval(interval);
          return curr;
        }
        return curr + 1;
      });
    }, 500);

    try {
      const res = await api.predict(formData);
      // Wait for at least the animation minimum time
      setTimeout(() => {
        setResults(res);
        setLoading(false);
        clearInterval(interval);
      }, 3000);
    } catch (e) {
      console.error(e);
      setLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="oracle-container animate-fade-up">
      <h1 className="font-cinzel text-gold" style={{ marginBottom: '2rem' }}>The Oracle</h1>

      {!loading && !results && (
        <form className="stone-card" style={{ padding: '2rem' }} onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label>Origin City</label>
              <input value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Destination City</label>
              <input value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Cargo Type</label>
              <select value={formData.cargo_type} onChange={e => setFormData({...formData, cargo_type: e.target.value})}>
                <option>Electronics</option><option>Raw Materials</option><option>Pharmaceuticals</option>
              </select>
            </div>
            <div className="input-group">
              <label>Value Tier</label>
              <select value={formData.cargo_value_tier} onChange={e => setFormData({...formData, cargo_value_tier: e.target.value})}>
                <option>Low &lt;$10k</option><option>Medium $10k-$100k</option><option>High &gt;$100k</option>
              </select>
            </div>
          </div>
          <button type="submit" className="consult-btn stone-card">
            <AnubisLogo width={24} height={24} />
            Consult the Oracle
          </button>
        </form>
      )}

      {loading && (
        <div className="loading-container animate-fade-up">
          <AnubisLogo width={80} height={100} animated={true} drawProgress={1} />
          <div className="status-lines">
            {MOCK_STATUSES.slice(0, statusIdx + 1).map((s, i) => (
              <div key={i} className="status-line">{s}</div>
            ))}
          </div>
        </div>
      )}

      {results && !loading && (
        <motion.div 
          className="results-panel"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Section 1: Verdict */}
          <div className="stone-card" style={{ padding: '2rem' }}>
            <h2 className="font-cinzel text-gold" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>The Verdict</h2>
            <div className="verdict-section">
              <RiskGauge score={results.risk_score} size={150} />
              <div className="judgment-text">
                "{results.oracle_judgment}"
              </div>
            </div>
          </div>

          {/* Section 2: Factors */}
          <div className="stone-card" style={{ padding: '2rem' }}>
            <h3 className="font-cinzel text-gold" style={{ marginBottom: '1.5rem' }}>Intelligence Breakdown</h3>
            <div className="factors-section">
              {Object.entries(results.contributing_factors).map(([key, value]) => (
                <div className="factor-row" key={key}>
                  <div style={{ textTransform: 'capitalize' }}>{key}</div>
                  <div className="factor-bar-bg">
                    <div className="factor-bar-fill" style={{ width: `${value * 10}%` }}></div>
                  </div>
                  <div>{value}/10</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Alternatives */}
          <div>
            <h3 className="font-cinzel text-gold" style={{ marginBottom: '1rem' }}>The Oracle Recommends</h3>
            <div className="alt-routes-grid">
              {results.alternate_routes.map(r => (
                <div key={r.id} className={`stone-card route-card ${r.recommended ? 'recommended' : ''}`}>
                  {r.recommended && <AlertBadge level="LOW" />} 
                  {!r.recommended && <AlertBadge level="HIGH" />}
                  <h4 className="font-body" style={{ color: 'var(--text-primary)' }}>{r.name}</h4>
                  <div className="font-mono text-dim" style={{ fontSize: '0.8rem' }}>
                    Dist: {r.dist}km | Time: {r.days}d
                  </div>
                  <div style={{ color: 'var(--nile-bright)', fontSize: '0.9rem' }}>
                    -{r.risk_reduction}% Risk Reduction
                  </div>
                  <button style={{ marginTop: 'auto' }} onClick={async () => {
                    const newShipment = {
                      origin: formData.origin,
                      destination: formData.destination,
                      cargo_type: formData.cargo_type,
                      priority: formData.priority,
                      departure_date: formData.departure_date,
                      cargo_value_tier: formData.cargo_value_tier,
                      risk_score: results.risk_score - r.risk_reduction,
                      risk_category: results.risk_category,
                      route: [
                         { lat: 20 + Math.random()*10, lng: 70 + Math.random()*10 },
                         { lat: 15 + Math.random()*10, lng: 60 + Math.random()*10 }
                      ]
                    };
                    await api.createShipment(newShipment);
                    alert("Route securely placed under Anubis's watch.");
                  }}>
                    Apply Route
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
