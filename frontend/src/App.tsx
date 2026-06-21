import React from 'react';
import './App.css';

function App() {
  return (
    <>
      <canvas id="particle-canvas"></canvas>
      <div className="ambient-glow"></div>

      <nav className="genesis-nav" id="main-nav">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => window.location.hash = '#/'}>
            <div className="brand-logo">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">GENESIS</span>
              <span className="brand-subtitle">ACCENTURE FEDERAL SERVICES | FDE</span>
            </div>
          </div>
          
          <ul className="nav-links">
            <li><a href="#/dashboard" className="nav-link">Mission Command</a></li>
            <li><a href="#/framework" className="nav-link">NIST CSF</a></li>
            <li><a href="#/risks" className="nav-link">Risk Register</a></li>
            <li><a href="#/assessments" className="nav-link">Assessments</a></li>
            <li><a href="#/supply-chain" className="nav-link">Supply Chain</a></li>
            <li><a href="#/incidents" className="nav-link">Incidents</a></li>
            <li><a href="#/reports" className="nav-link">Reports</a></li>
            <li><a href="#/ai" className="nav-link">AI Insights <span className="badge new-badge">New</span></a></li>
          </ul>

          <div className="nav-actions">
            <div className="user-profile">
              <div className="avatar">FDE</div>
              <span className="user-role">Federal Deployments</span>
            </div>
          </div>
        </div>
        <div className="nav-accent-bar"></div>
      </nav>

      <main id="app-container" className="app-container">
        <div className="welcome-section">
          <h1>CM2US Initiative Active</h1>
          <p>CISA and GRC mission-critical infrastructure simulated environment.</p>
        </div>
      </main>
    </>
  );
}

export default App;
