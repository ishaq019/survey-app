import React from 'react';
import { Link } from 'react-router-dom';
import AppLogo from './AppLogo';
import { getReturnUrl } from '../utils/returnUrl';

export default function Navbar({ theme, onThemeToggle }) {
  return (
    <nav className="nav">
      <div className="nav-brand-group">
        <Link className="nav-brand" to="/">
          <AppLogo size={30} className="nav-brand-logo" />
          <span className="nav-brand-text">
            <span className="nav-brand-name">Survey App</span>
            <span className="nav-brand-subtitle">Public survey workspace</span>
          </span>
        </Link>
      </div>

      <div className="nav-links">
        <a className="nav-link" href={getReturnUrl()}>
          Back to Quiz App
        </a>
      </div>

      <div className="nav-actions">
        <button
          type="button"
          className="nav-theme-toggle"
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span aria-hidden="true">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        <span className="nav-user">
          <span className="nav-user-name">No login required</span>
          <span className="nav-user-role">Public mode</span>
        </span>
      </div>
    </nav>
  );
}
