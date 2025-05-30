import React from 'react';
import './App.css';
import { Link, Routes, Route } from 'react-router-dom';

// Skeleton pages for each route
function Home() {
  return (
    <section className="hero">
      <div className="container">
        <div className="subtitle">Welcome to a community of creativity</div>
        <h1 className="title">Discover Makers, Masterpieces & Stories</h1>
        <div className="description">
          Explore unique artist portfolios, trending crafts, and inspiring stories.<br/>
          Commission custom works and join a vibrant marketplace built for creators and collectors.
        </div>
        <button className="btn btn-large">Browse Marketplace</button>
      </div>
      {/* You can keep the portfolios and main-grid here for / */}
      <main className="main-grid container">
        {/* LEFT: Portfolios & Crafts */}
        <section className="main-portfolios" aria-label="Portfolios and Crafts">
          <div className="section-title">Artist Portfolios</div>
          {/* Placeholder grid items */}
          <div className="portfolio-grid">
            {[1,2,3,4].map((i) => (
              <div className="portfolio-card" key={"portfolio-" + i}>
                <div className="portfolio-thumb placeholder-thumb" />
                <div className="portfolio-info">
                  <div className="portfolio-name">Artist {i}</div>
                  <div className="portfolio-desc">Portfolio or craft sample description</div>
                </div>
              </div>
            ))}
          </div>
          <div className="section-title" style={{marginTop: '32px'}}>Trending Crafts</div>
          <div className="crafts-grid">
            {[1,2,3].map(i => (
              <div className="craft-card" key={"craft-" + i}>
                <div className="craft-thumb placeholder-thumb" />
                <div className="craft-info">
                  <div className="craft-title">Craft #{i}</div>
                  <div className="craft-meta">by Creator {i}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* RIGHT: Sidebar for stories and orders */}
        <aside className="sidebar" aria-label="Stories and Custom Orders">
          <div className="sidebar-group">
            <div className="sidebar-title">Stories</div>
            <div className="story-card">
              <div className="story-thumb placeholder-thumb" />
              <div className="story-info">
                <div className="story-headline">Behind the Canvas</div>
                <div className="story-preview">Peek into an artist's process...</div>
              </div>
            </div>
            <div className="story-card">
              <div className="story-thumb placeholder-thumb"/>
              <div className="story-info">
                <div className="story-headline">The Making of "Golden Lace"</div>
                <div className="story-preview">A gold leaf craft's story.</div>
              </div>
            </div>
          </div>
          <div className="sidebar-group" style={{marginTop: 24}}>
            <div className="sidebar-title">Custom Orders</div>
            <div className="customorder-widget">
              <div>
                <span role="img" aria-label="custom">💡</span> Want something unique?
              </div>
              <button className="btn" style={{marginTop:'12px', width:'100%'}}>Request Custom Piece</button>
            </div>
          </div>
        </aside>
      </main>
    </section>
  );
}

function Portfolios() {
  return (
    <div className="container" style={{marginTop: "110px"}}>
      <h2 className="title" style={{fontSize: "2rem"}}>Artist Portfolios</h2>
      <p className="description">Browse portfolios of talented artists and crafters.</p>
      {/* Placeholder content */}
    </div>
  );
}

function Marketplace() {
  return (
    <div className="container" style={{marginTop:"110px"}}>
      <h2 className="title" style={{fontSize: "2rem"}}>Marketplace</h2>
      <p className="description">Explore and purchase unique artworks and crafts.</p>
      {/* Placeholder content */}
    </div>
  );
}

function Stories() {
  return (
    <div className="container" style={{marginTop:"110px"}}>
      <h2 className="title" style={{fontSize: "2rem"}}>Stories</h2>
      <p className="description">Read behind-the-scenes stories from creators.</p>
      {/* Placeholder content */}
    </div>
  );
}

function CustomOrders() {
  return (
    <div className="container" style={{marginTop:"110px"}}>
      <h2 className="title" style={{fontSize: "2rem"}}>Custom Orders</h2>
      <p className="description">Request a custom, one-of-a-kind craft or artwork.</p>
      {/* Placeholder content */}
    </div>
  );
}

function Profile() {
  return (
    <div className="container" style={{marginTop:"110px"}}>
      <h2 className="title" style={{fontSize: "2rem"}}>Your Profile</h2>
      <p className="description">View and manage your ArtistryHub profile and orders.</p>
      {/* Placeholder content */}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo">
            <span className="logo-symbol">🎨</span> ArtistryHub
          </div>
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/portfolios">Portfolios</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
            <li><Link to="/stories">Stories</Link></li>
            <li><Link to="/custom-orders">Custom Orders</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolios" element={<Portfolios />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/custom-orders" element={<CustomOrders />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
