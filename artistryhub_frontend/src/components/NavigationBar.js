import React from 'react';

// PUBLIC_INTERFACE
/**
 * ArtistryHub Navigation Bar
 * Sleek, branded navigation component reusing App.css color variables.
 */
function NavigationBar() {
  return (
    <nav className="navbar artistry-navbar">
      <div className="container navbar__container">
        <div className="navbar__left">
          <a href="/" className="logo artistry-logo" aria-label="ArtistryHub Home">
            <span className="logo-symbol artistry-logo-symbol">🎨</span>
            <span>ArtistryHub</span>
          </a>
        </div>
        <div className="navbar__center">
          <ul className="navbar__links artistry-navbar__links">
            <li className="navbar__link"><a href="#portfolios">Portfolios</a></li>
            <li className="navbar__link"><a href="#marketplace">Marketplace</a></li>
            <li className="navbar__link"><a href="#profiles">User Profiles</a></li>
            <li className="navbar__link"><a href="#stories">Stories</a></li>
            <li className="navbar__link"><a href="#custom-orders">Custom Orders</a></li>
            <li className="navbar__link"><a href="#messages">Messages</a></li>
          </ul>
        </div>
        <div className="navbar__right">
          <button className="btn btn--gold">Sign In</button>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
