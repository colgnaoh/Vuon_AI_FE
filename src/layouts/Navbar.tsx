import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { name: 'Ideas', path: '/ideas', index: '01' },
  { name: 'Projects', path: '/projects', index: '02' },
  { name: 'Equipment', path: '/equipment', index: '03' },
];

const contactEmail = 'hyperdatalabspace@reso.vn';
const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`;

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <Link to="/" className="wordmark" aria-label="VUON AI SPACE - Home">
          <span className="wordmark-mark" aria-hidden="true"><img src="/vuon-logo.png" alt="" /></span>
          <span className="wordmark-copy">
            <strong>VUON AI SPACE</strong>
            <span>where ideas grow</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} aria-current={isActive(link.path) ? 'page' : undefined} className="nav-link">
              <span className="font-mono text-[0.58rem] text-[var(--accent)]" aria-hidden="true">{link.index}</span>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                aria-label={userMenuOpen ? 'Close account menu' : 'Open account menu'}
                className="nav-account"
              >
                <span className="nav-avatar" aria-hidden="true">{user.fullName.charAt(0).toUpperCase()}</span>
                <span className="max-w-28 truncate">{user.fullName}</span>
                <span className="account-state">{userMenuOpen ? 'close' : 'open'}</span>
              </button>

              {userMenuOpen && (
                <div role="menu" aria-label="Account menu" className="absolute right-0 mt-2 w-56 border border-[var(--line)] bg-[var(--paper-bright)] p-2 shadow-[var(--shadow-paper)]">
                  <div className="border-b border-[var(--line)] px-3 py-2">
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">account</p>
                    <p className="mt-1 truncate text-sm font-semibold text-[var(--ink)]">{user.fullName}</p>
                    <p className="truncate text-xs text-[var(--ink-soft)]">{user.email}</p>
                  </div>
                  <Link to="/profile/me" role="menuitem" onClick={() => setUserMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--ink-soft)] hover:bg-[var(--accent-wash)] hover:text-[var(--accent-strong)]">My profile</Link>
                  <Link to="/my-bookings" role="menuitem" onClick={() => setUserMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--ink-soft)] hover:bg-[var(--accent-wash)] hover:text-[var(--accent-strong)]">Equipment bookings</Link>
                  {isAdmin && <Link to="/admin/dashboard" role="menuitem" onClick={() => setUserMenuOpen(false)} className="block px-3 py-2 text-sm text-[var(--accent-strong)] hover:bg-[var(--accent-wash)]">Admin portal</Link>}
                  <button type="button" role="menuitem" onClick={handleLogout} className="flex w-full items-center gap-2 border-t border-[var(--line)] px-3 py-2 text-left text-sm text-[var(--ink-soft)] hover:text-[var(--accent-strong)]">Log out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href={gmailComposeUrl} target="_blank" rel="noreferrer" className="nav-join">Join the lab</a>
            </>
          )}
        </div>

        <button type="button" className="mobile-menu-toggle" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">
          <span className="mobile-menu-label" aria-hidden="true">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-navigation" className="mobile-nav-panel" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} aria-current={isActive(link.path) ? 'page' : undefined}>
                <span className="font-mono text-xs text-[var(--accent)]" aria-hidden="true">{link.index}</span>{' '}{link.name}
            </Link>
          ))}
          <div className="mobile-nav-actions">
            {isAuthenticated ? (
              <>
                <Link to="/profile/me" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <button type="button" onClick={handleLogout} className="border border-[var(--line)] p-3 text-sm text-[var(--ink-soft)]">Log out</button>
              </>
            ) : (
              <>
                <a href={gmailComposeUrl} target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}>Join the lab</a>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
