import React from 'react';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import PortfolioGrid from './components/PortfolioGrid';
import { Routes, Route } from 'react-router-dom';

// Importing new page components
import Portfolios from './pages/Portfolios';
import Marketplace from './pages/Marketplace';
import UserProfile from './pages/UserProfile';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Layout: flex row for content and sidebar */}
      <main className="main-container">
        <div className="main-content">
          <Routes>
            {/* Root path: Render the original hero/landing layout */}
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <PortfolioGrid />
                </>
              }
            />
            {/* Portfolios page */}
            <Route path="/portfolios" element={<Portfolios />} />
            {/* Marketplace page */}
            <Route path="/marketplace" element={<Marketplace />} />
            {/* User Profile page */}
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </div>
        {/* SIDEBAR: Stories & Custom Orders */}
        <Sidebar />
      </main>
    </div>
  );
}

export default App;
