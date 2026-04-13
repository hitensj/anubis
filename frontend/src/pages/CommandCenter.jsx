import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { api } from '../utils/api';
import AnubisLogo from '../components/AnubisLogo';
import AlertBadge from '../components/AlertBadge';
import { riskColors } from '../utils/riskColors';
import './CommandCenter.css';

// Fallback token for demo if env missing
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY || '';

export default function CommandCenter() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [shipments, setShipments] = useState([]);
  const [chokepoints, setChokepoints] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.getShipments().then(setShipments).catch(console.error);
    api.getChokepoints().then(setChokepoints).catch(console.error);
    api.getNews().then(setNews).catch(console.error);
  }, []);

  const handleChokepointClick = (cp) => {
    navigate(`/network?simulate=${cp.id}`);
  };

  const removeShipment = async (id) => {
    await api.deleteShipment(id);
    setShipments(shipments.filter(s => s.id !== id));
  };

  return (
    <div className="command-center animate-fade-up">
      <div className="map-container">
        <Map
          initialViewState={{ longitude: 35, latitude: 20, zoom: 1.5 }}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        >
          {/* Example of markers - rendering chokepoints */}
          {chokepoints.map(cp => (
            <Marker key={cp.id} longitude={cp.lng} latitude={cp.lat} anchor="bottom">
              <svg 
                width="24" height="24" viewBox="0 0 24 24" 
                fill={cp.current_risk > 70 ? 'var(--red-danger)' : 'var(--gold-divine)'} 
                style={{ cursor: 'pointer', filter: 'drop-shadow(0 0 5px var(--gold-glow))' }}
                onClick={() => handleChokepointClick(cp)}
              >
                <path d="M12 2 L22 20 L2 20 Z" />
              </svg>
            </Marker>
          ))}

          {/* Simple animated routes representation using geojson sources */}
          {shipments.slice(0,5).map(s => {
            if(!s.route || s.route.length < 2) return null;
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
                    'line-color': riskColors[s.risk_category] || '#c9a84c',
                    'line-width': 2,
                    'line-opacity': 0.8,
                    'line-dasharray': [2, 2]
                  }}
                />
              </Source>
            );
          })}
        </Map>
      </div>

      <div className="right-panel">
        <div className="panel-header">
          <div className="panel-header-title">
            <AnubisLogo width={24} height={24} />
            <h2 className="font-cinzel text-gold">ANUBIS</h2>
          </div>
          <div className="clock font-mono">{time}</div>
        </div>

        <div className="panel-content">
          <div className="stats-grid">
            <div className="stone-card metric-card">
              <div className="metric-value font-mono">{shipments.length}</div>
              <div className="metric-label">Active Shipments</div>
            </div>
            <div className="stone-card metric-card">
              <div className="metric-value font-mono text-danger">3</div>
              <div className="metric-label">Disruptions Today</div>
            </div>
            <div className="stone-card metric-card">
              <div className="metric-value font-mono">2</div>
              <div className="metric-label">Routes Rerouted</div>
            </div>
            <div className="stone-card metric-card">
              <div className="metric-value font-mono" style={{ color: 'var(--amber-warning)'}}>72</div>
              <div className="metric-label">Network Risk</div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="font-cinzel text-gold">Active Shipments</h3>
            </div>
            <div className="chokepoint-list" style={{ marginBottom: '2rem' }}>
              {shipments.map(s => (
                <div key={s.id} className="chokepoint-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="status-dot" style={{ backgroundColor: riskColors[s.risk_category] || 'var(--green-safe)' }}></div>
                    <span>{s.origin} &#8594; {s.destination}</span>
                  </div>
                  <button 
                     onClick={() => removeShipment(s.id)}
                     style={{ background: 'transparent', color: 'var(--red-danger)', border: 'none', cursor: 'pointer', fontFamily: 'monospace' }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-cinzel text-gold" style={{ marginBottom: '1rem' }}>Chokepoint Status</h3>
            <div className="chokepoint-list">
              {chokepoints.map(cp => (
                <div key={cp.id} className="chokepoint-item" onClick={() => handleChokepointClick(cp)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="status-dot" style={{ backgroundColor: cp.current_risk > 70 ? 'var(--red-danger)' : (cp.current_risk > 30 ? 'var(--amber-warning)' : 'var(--green-safe)') }}></div>
                    <span>{cp.name}</span>
                  </div>
                  <div className="font-mono text-secondary">{cp.current_risk}/100</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-cinzel text-gold" style={{ marginBottom: '1rem' }}>Live Intelligence</h3>
            <div className="news-feed">
              {news.map((item, i) => (
                <div key={i} className="news-item">
                  <div className="news-time font-mono">{item.time} | {item.source}</div>
                  <div style={{ marginBottom: '0.5rem', lineHeight: 1.4 }}>{item.title}</div>
                  <AlertBadge level={item.severity} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel-footer">
          <button className="new-predict-btn font-cinzel" onClick={() => navigate('/oracle')}>
            New Prediction
          </button>
        </div>
      </div>
    </div>
  );
}
