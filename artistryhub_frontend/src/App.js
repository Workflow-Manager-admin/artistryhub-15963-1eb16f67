import React from 'react';
import './App.css';

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
            <li><a href="#">Portfolios</a></li>
            <li><a href="#">Marketplace</a></li>
            <li><a href="#">Stories</a></li>
            <li><a href="#">Custom Orders</a></li>
            <li><a href="#">Profile</a></li>
          </ul>
        </div>
      </nav>

      {/* HERO */}
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
      </section>

      {/* MAIN GRID LAYOUT */}
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
    </div>
  );
}

export default App;