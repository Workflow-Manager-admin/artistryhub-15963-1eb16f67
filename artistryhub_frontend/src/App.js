import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";

// PUBLIC_INTERFACE
function PortfolioGrid() {
  /** Stub for Portfolio Grid */
  return (
    <section className="ah-content-section">
      <h2 className="ah-section-title">Artist Portfolios</h2>
      <div className="ah-grid-placeholder">
        <div className="ah-portfolio-item ah-placeholder">Portfolio Item 1</div>
        <div className="ah-portfolio-item ah-placeholder">Portfolio Item 2</div>
        <div className="ah-portfolio-item ah-placeholder">Portfolio Item 3</div>
        <div className="ah-portfolio-item ah-placeholder">Portfolio Item 4</div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function Marketplace() {
  /** Stub for Marketplace */
  return (
    <section className="ah-content-section">
      <h2 className="ah-section-title">Marketplace</h2>
      <div className="ah-marketplace-placeholder">
        <div className="ah-market-item ah-placeholder">Marketplace Item 1</div>
        <div className="ah-market-item ah-placeholder">Marketplace Item 2</div>
        <div className="ah-market-item ah-placeholder">Marketplace Item 3</div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function StoriesSidebar() {
  /** Sidebar for behind-the-scenes stories */
  return (
    <aside className="ah-sidebar">
      <h3 className="ah-sidebar-title">Stories</h3>
      <ul className="ah-sidebar-list">
        <li className="ah-sidebar-item">
          <span className="ah-story-title">How I Made This Vase</span>
        </li>
        <li className="ah-sidebar-item">
          <span className="ah-story-title">Weaving With Gold Thread</span>
        </li>
        <li className="ah-sidebar-item">
          <span className="ah-story-title">Painting the Maroon Dream</span>
        </li>
      </ul>
    </aside>
  );
}

// PUBLIC_INTERFACE
function CustomOrdersSidebar() {
  /** Sidebar for custom order options */
  return (
    <aside className="ah-sidebar">
      <h3 className="ah-sidebar-title">Custom Orders</h3>
      <ul className="ah-sidebar-list">
        <li className="ah-sidebar-item">Request a hand-painted mug</li>
        <li className="ah-sidebar-item">Commission a custom portrait</li>
        <li className="ah-sidebar-item">Order a bespoke necklace</li>
      </ul>
    </aside>
  );
}

// PUBLIC_INTERFACE
function Messaging() {
  /** Stub for messaging system */
  return (
    <section className="ah-content-section">
      <h2 className="ah-section-title">Messages</h2>
      <div className="ah-messaging-placeholder">
        <div className="ah-message-thread">
          <div className="ah-msg-sender">Buyer</div>
          <div className="ah-msg-content">Hi! Can you paint a golden frame?</div>
          <div className="ah-msg-sender">Artist</div>
          <div className="ah-msg-content">Absolutely! I'll sketch options for you.</div>
        </div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function Profile() {
  /** Stub for user profile */
  return (
    <section className="ah-content-section">
      <h2 className="ah-section-title">My Profile</h2>
      <div className="ah-profile-placeholder">
        <div className="ah-profile-avatar"></div>
        <div className="ah-profile-details">
          <div className="ah-profile-name">Alex Craftmaker</div>
          <div className="ah-profile-bio">Mixed media visual artist | Enjoys maroon hues & golden highlights.</div>
        </div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function Home() {
  /** Home page with hero, grid, and sidebars */
  return (
    <div className="ah-main-layout">
      <div className="ah-main-content">
        <section className="ah-hero">
          <div className="ah-hero-heading">ArtistryHub</div>
          <div className="ah-hero-subheading">
            Where Creativity Connects & <span style={{ color: "var(--ah-accent)", fontWeight: 600 }}>Shines</span>
          </div>
          <div className="ah-hero-desc">
            A curated space for artists and crafters to display, tell, and sell.
            <br />
            Discover inspiration, order unique crafts, and connect with makers.
          </div>
        </section>
        <PortfolioGrid />
      </div>
      <div className="ah-sidebars">
        <StoriesSidebar />
        <CustomOrdersSidebar />
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function NavigationBar() {
  /** Top navigation bar with links and brand */
  return (
    <nav className="ah-navbar">
      <div className="ah-navbar-inner">
        <NavLink to="/" className="ah-logo" end>
          <span className="ah-logo-symbol">🎨</span>
          <span className="ah-logo-text">ArtistryHub</span>
        </NavLink>
        <div className="ah-nav-links">
          <NavLink to="/portfolios" className={({ isActive }) => isActive ? "ah-nav-link active" : "ah-nav-link"}>Portfolios</NavLink>
          <NavLink to="/marketplace" className={({ isActive }) => isActive ? "ah-nav-link active" : "ah-nav-link"}>Marketplace</NavLink>
          <NavLink to="/messages" className={({ isActive }) => isActive ? "ah-nav-link active" : "ah-nav-link"}>Messages</NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "ah-nav-link active" : "ah-nav-link"}>Profile</NavLink>
        </div>
      </div>
    </nav>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <Router>
      <div className="ah-app-bg">
        <NavigationBar />
        <main className="ah-app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolios" element={<PortfolioGrid />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/messages" element={<Messaging />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
