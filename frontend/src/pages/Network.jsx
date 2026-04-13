import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import AlertBadge from '../components/AlertBadge';

// Fallback token
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY || '';

export default function Network() {
  const [searchParams] = useSearchParams();
  const initialSimulate = searchParams.get('simulate');
  
  const [shipments, setShipments] = useState([]);
  const [chokepoints, setChokepoints] = useState([]);
  const [impactData, setImpactData] = useState(null);
  const [simulatedCp, setSimulatedCp] = useState(null);
  
  // Animation state for ripple effect
  const [rippleActive, setRippleActive] = useState(false);

  useEffect(() => {
    api.getShipments().then(setShipments).catch(console.error);
    api.getChokepoints().then(cps => {
      setChokepoints(cps);
      if (initialSimulate) {
        const cp = cps.find(c => c.id === initialSimulate);
        if (cp) handleSimulate(cp);
      }
    }).catch(console.error);
  }, [initialSimulate]);

  const handleSimulate = async (cp) => {
    setSimulatedCp(cp);
    setRippleActive(true);
    setImpactData(null);
    try {
      const data = await api.simulateCascade(cp.id);
      setTimeout(() => setImpactData(data), 1000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="page-container" style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Map
        initialViewState={{ longitude: simulatedCp?.lng || 15, latitude: simulatedCp?.lat || 20, zoom: 2.5 }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      >
        {chokepoints.map(cp => (
          <Marker key={cp.id} longitude={cp.lng} latitude={cp.lat} anchor="center">
            <div 
              onClick={() => handleSimulate(cp)}
              style={{
                width: '16px', height: '16px', borderRadius: '50%',
                backgroundColor: simulatedCp?.id === cp.id ? 'var(--red-danger)' : 'var(--gold-divine)',
                border: '2px solid var(--bg-void)',
                cursor: 'pointer',
                boxShadow: simulatedCp?.id === cp.id ? '0 0 20px 5px rgba(192,57,43,0.8)' : '0 0 10px var(--gold-glow)'
              }}
            >
              {rippleActive && simulatedCp?.id === cp.id && (
                <div style={{
                  position: 'absolute', inset: -15, borderRadius: '50%',
                  border: '2px solid var(--red-danger)',
                  animation: 'ripple 1.5s linear infinite'
                }} />
              )}
            </div>
          </Marker>
        ))}

        {shipments.map(s => {
          if(!s.route || s.route.length < 2) return null;
          const isAffected = rippleActive && simulatedCp;
          // Randomly show some routes as red when simulated
          const color = (isAffected && Math.random() > 0.6) ? 'var(--red-danger)' : 'var(--gold-dim)';
          const geojson = {
            type: 'Feature', properties: {},
            geometry: { type: 'LineString', coordinates: s.route.map(r => [r.lng, r.lat]) }
          };
          return (
            <Source key={s.id} id={`route-${s.id}`} type="geojson" data={geojson}>
              <Layer
                id={`line-${s.id}`}
                type="line"
                paint={{
                  'line-color': color,
                  'line-width': color === 'var(--red-danger)' ? 3 : 1,
                  'line-opacity': 0.8
                }}
              />
            </Source>
          );
        })}
      </Map>

      {/* Floating Panel */}
      {impactData && simulatedCp && (
        <motion.div 
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="stone-card"
          style={{ position: 'absolute', top: '2rem', right: '2rem', width: '350px', padding: '1.5rem', zIndex: 10 }}
        >
          <h2 className="font-cinzel text-gold" style={{ marginBottom: '1rem' }}>Cascade Impact</h2>
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-stone)'}}>
            <h4 className="font-body text-primary">{simulatedCp.name}</h4>
            <div className="font-mono text-dim" style={{ fontSize: '0.8rem' }}>Epicenter</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Severity:</span>
              <AlertBadge level={impactData.severity === 'SEVERE' ? 'CRITICAL' : 'HIGH'} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Shipments Affected:</span>
              <span className="font-mono text-danger" style={{ fontWeight: 'bold' }}>{impactData.affected_shipments}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Network Delay:</span>
              <span className="font-mono">{impactData.network_delay_hours}h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-secondary">Value at Risk:</span>
              <span className="font-mono">${(impactData.cargo_value_risk / 1000000).toFixed(1)}M</span>
            </div>
          </div>

          <button className="consult-btn stone-card" onClick={() => setImpactData(null)}>Acknowledge</button>
        </motion.div>
      )}

      {/* Ripple Animation CSS inline */}
      <style>{`
        @keyframes ripple {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
