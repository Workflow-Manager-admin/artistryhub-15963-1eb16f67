// PUBLIC_INTERFACE
import React from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar';
import HeroSection from './components/HeroSection';

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
          <section className="hero">
            <div className="subtitle">Celebrating Creativity</div>
            <h1 className="title">Welcome to ArtistryHub</h1>
            <div className="description">
              Connect with artists &amp; crafters. Discover unique creations. Order custom masterpieces. Tell your story!
            </div>
            <button className="btn btn-large">Explore Marketplace</button>
          </section>

          {/* GRID: portfolios/marketplace */}
          <section className="grid portfolio-grid" id="portfolios">
            {/* Placeholder for artist portfolios / trending marketplace items */}
            <div className="grid__placeholder">
              <h2 className="grid__title">Portfolio &amp; Marketplace</h2>
              <div className="grid__description">
                {/* Later to be replaced with dynamic grid of cards */}
                <div className="card card--placeholder">[ Portfolio Card Placeholder ]</div>
                <div className="card card--placeholder">[ Marketplace Card Placeholder ]</div>
                <div className="card card--placeholder">[ Portfolio Card Placeholder ]</div>
                <div className="card card--placeholder">[ Marketplace Card Placeholder ]</div>
              </div>
            </div>
          </section>
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
