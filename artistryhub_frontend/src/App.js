// PUBLIC_INTERFACE
import React from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar';
import HeroSection from './components/HeroSection';
import PortfolioGrid from './components/PortfolioGrid';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Layout: flex row for content and sidebar */}
      <main className="main-container">
        <div className="main-content">
          {/* HERO SECTION */}
          <HeroSection />

          {/* Portfolios & Marketplace Grid */}
          <PortfolioGrid />
        </div>
        {/* SIDEBAR: Stories & Custom Orders */}
        <aside className="sidebar">
          {/* Stories */}
          <section className="sidebar__section sidebar__stories" id="stories">
            <h3 className="sidebar__title">Behind-the-Scenes Stories</h3>
            <div className="sidebar__placeholder">[ Stories Placeholder ]</div>
          </section>
          {/* Custom Orders */}
          <section className="sidebar__section sidebar__custom-orders" id="custom-orders">
            <h3 className="sidebar__title">Custom Orders</h3>
            <div className="sidebar__placeholder">[ Custom Orders Placeholder ]</div>
          </section>
          {/* Messaging */}
          <section className="sidebar__section sidebar__messaging" id="messages">
            <h3 className="sidebar__title">Messaging</h3>
            <div className="sidebar__placeholder">[ Messaging System Placeholder ]</div>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default App;
