import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
/**
 * ArtistryHub Navigation Bar
 * Sleek, branded navigation component reusing App.css color variables.
 * Uses React Router's <Link> for route navigation and applies active class for current path.
 */
function NavigationBar() {
  const location = useLocation();

  // Helper to determine if current path matches (startsWith so subpaths stay highlighted)
  const isActive = (matchPath) =>
    location.pathname === matchPath || location.pathname.startsWith(matchPath + "/");

  return (
    <nav className="navbar artistry-navbar">
      <div className="container navbar__container">
        <div className="navbar__left">
          <Link to="/" className="logo artistry-logo" aria-label="ArtistryHub Home">
            <span className="logo-symbol artistry-logo-symbol">🎨</span>
            <span>ArtistryHub</span>
          </Link>
        </div>
        <div className="navbar__center">
          <ul className="navbar__links artistry-navbar__links">
            <li className="navbar__link">
              <Link
                to="/portfolios"
                className={isActive("/portfolios") ? "active" : ""}
              >
                Portfolios
              </Link>
            </li>
            <li className="navbar__link">
              <Link
                to="/marketplace"
                className={isActive("/marketplace") ? "active" : ""}
              >
                Marketplace
              </Link>
            </li>
            <li className="navbar__link">
              <Link
                to="/profile"
                className={isActive("/profile") ? "active" : ""}
              >
                User Profile
              </Link>
            </li>
            {/* The following links can be updated to use real routes in the future */}
            <li className="navbar__link">
              <a href="#stories">Stories</a>
            </li>
            <li className="navbar__link">
              <a href="#custom-orders">Custom Orders</a>
            </li>
            <li className="navbar__link">
              <a href="#messages">Messages</a>
            </li>
          </ul>
        </div>
        <div className="navbar__right">
          <button className="btn btn--gold">Sign In</button>
        </div>
      </div>
      <style>
        {`
          /* Extra styling for active nav link using .active class */
          .artistry-navbar__links a.active {
            color: var(--accent-color);
            background: var(--navbar-link-hover-bg);
            text-decoration: none;
            outline: none;
            box-shadow: 0 2px 12px #FFD70019;
          }
        `}
      </style>
    </nav>
  );
}

export default NavigationBar;
