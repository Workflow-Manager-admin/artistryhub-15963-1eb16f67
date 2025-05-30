import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";

// PUBLIC_INTERFACE
function Home() {
  // Classic, static, simple Home introduction only
  return (
    <section style={{ margin: "48px auto", maxWidth: 680 }}>
      <h1 style={{ color: "var(--ah-primary)", textAlign: "center", marginTop: 42 }}>
        Welcome to ArtistryHub
      </h1>
      <p style={{
        textAlign: "center",
        color: "var(--ah-text-faded)",
        fontSize: "1.17em",
        marginTop: 16,
        marginBottom: 0,
        letterSpacing: "0.01em"
      }}>
        Discover a creative community for artists and crafters.<br />
        Showcase your work, connect, and get inspired!
      </p>
    </section>
  );
}

// PUBLIC_INTERFACE
function PortfolioGrid() {
  // This was originally a placeholder; restores to a simple placeholder portfolio grid.
  return (
    <section style={{ margin: "36px auto", maxWidth: 800 }}>
      <h2 style={{ color: "var(--ah-primary)", marginBottom: 22, textAlign: "center" }}>
        Artist Portfolios
      </h2>
      <div style={{
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fffde9",
        borderRadius: "11px",
        border: "1.5px solid var(--ah-border)",
        boxShadow: "0 1px 6px rgba(136,0,0,0.03)"
      }}>
        Portfolio previews coming soon.
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function Marketplace() {
  return (
    <section style={{ margin: "36px auto", maxWidth: 800 }}>
      <h2 style={{ color: "var(--ah-primary)" }}>Marketplace</h2>
      <p>Marketplace items will be shown here.</p>
    </section>
  );
}

// PUBLIC_INTERFACE
function NavigationBar() {
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
function Profile() {
  return (
    <section style={{ margin: "36px auto", maxWidth: 800 }}>
      <h2 style={{ color: "var(--ah-primary)" }}>Your Profile</h2>
      <p>This is your profile page.</p>
    </section>
  );
}

// PUBLIC_INTERFACE
function Messaging() {
  return (
    <section style={{ margin: "36px auto", maxWidth: 800 }}>
      <h2 style={{ color: "var(--ah-primary)" }}>Messages</h2>
      <p>Your messages will appear here.</p>
    </section>
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
