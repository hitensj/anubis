import React from 'react';
import { NavLink } from 'react-router-dom';
import AnubisLogo from './AnubisLogo';
import './Sidebar.css';

export default function Sidebar() {
  const navItems = [
    { path: '/', label: 'Command Center', icon: '👁️' },
    { path: '/oracle', label: 'The Oracle', icon: '⚖️' },
    { path: '/archives', label: 'The Archives', icon: '📜' },
    { path: '/network', label: 'The Network', icon: '🕸️' },
  ];

  return (
    <aside className="sidebar stone-card">
      <div className="sidebar-header">
        <AnubisLogo width={32} height={32} />
        <h2 className="brand-name font-cinzel text-gold">ANUBIS</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="version font-mono">v1.0.0</div>
        <div className="powered-by">Powered by Anubis Intelligence</div>
      </div>
    </aside>
  );
}
