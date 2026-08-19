import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <p className="footer-label">VUON / open studio</p>
          <p className="footer-copy">An open studio for people to meet, prototype quickly and bring ideas to life.</p>
          <p className="mt-5 font-mono text-xs text-[var(--accent-strong)]">learn / connect / build / repeat</p>
        </div>

        <div>
          <p className="footer-label">explore</p>
          <div className="footer-links">
            <Link to="/ideas">Ideas to build together</Link>
            <Link to="/projects">Active projects</Link>
          </div>
        </div>

        <div>
          <p className="footer-label">stay in the loop</p>
          <div className="footer-links">
            <span>AI · Robotics · IoT</span>
            <span>Ho Chi Minh City</span>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© 2026 VUON AI SPACE</span>
        <span>made for people who make things</span>
      </div>
    </footer>
  );
};
