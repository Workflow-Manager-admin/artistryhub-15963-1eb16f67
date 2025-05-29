// PUBLIC_INTERFACE
import React from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar';
import HeroSection from './components/HeroSection';
import PortfolioGrid from './components/PortfolioGrid';
import Sidebar from './components/Sidebar';

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
        <Sidebar />
      </main>
    </div>
  );
}

export default App;
