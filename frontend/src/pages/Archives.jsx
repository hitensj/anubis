import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AlertBadge from '../components/AlertBadge';
import { riskColors } from '../utils/riskColors';
import './Archives.css';

export default function Archives() {
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.getAlerts().then(setAlerts).catch(console.error);
    api.getAnalytics().then(setAnalytics).catch(console.error);
  }, []);

  return (
    <div className="archives-container animate-fade-up">
      <h1 className="font-cinzel text-gold" style={{ marginBottom: '2rem' }}>The Archives</h1>
      
      <div className="archives-content">
        <div className="table-section">
          <div className="stone-card filters-bar">
            <input type="text" placeholder="Search by ID..." style={{ flex: 1 }} />
            <select style={{ flex: 1 }}><option>All Risk Levels</option></select>
            <button>Filter</button>
          </div>
          
          <div className="stone-card" style={{ flexGrow: 1, overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Shipment ID</th>
                  <th>Route</th>
                  <th>Risk Score</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a, i) => (
                  <tr key={i}>
                    <td>{new Date(a.timestamp).toLocaleDateString()}</td>
                    <td>{a.shipment_id}</td>
                    <td className="font-body">{a.route}</td>
                    <td>{a.risk_score}</td>
                    <td><AlertBadge level={a.risk_category} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-section">
          {analytics && (
            <>
              <div className="stone-card chart-card">
                <h3 className="font-cinzel text-gold chart-title">Disruptions by Level</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={analytics.disruptions_by_level} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                      {analytics.disruptions_by_level.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={riskColors[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-stone)', borderColor: 'var(--border-gold)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="stone-card chart-card">
                <h3 className="font-cinzel text-gold chart-title">Events Over Time</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={analytics.events_over_time}>
                    <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                    <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-stone)', borderColor: 'var(--border-gold)' }} />
                    <Area type="monotone" dataKey="events" stroke="var(--gold-divine)" fill="var(--gold-glow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
