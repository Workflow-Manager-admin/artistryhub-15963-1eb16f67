import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";

// PUBLIC_INTERFACE
function PortfolioGrid() {
  /**
   * Portfolio grid showcasing sample artists and works.
   * Attempts to fetch artwork images from Unsplash demo endpoint, else uses realistic art placeholders.
   */
  const demoPortfolios = [
    {
      name: "Emily Rivera",
      desc: "Handpainted Ceramics",
      query: "ceramics pottery"
    },
    {
      name: "Art by Quentin",
      desc: "Abstract Canvas",
      query: "abstract art"
    },
    {
      name: "Sunlit Weaves",
      desc: "Textile & Fiber Arts",
      query: "textile fiber art"
    },
    {
      name: "Rosa Goldsmith",
      desc: "Jewelry & Beadwork",
      query: "artisan jewelry"
    }
  ];

  const fallbackImages = [
    // These are copyright-safe, realistic Unsplash images to use if fetch fails or rate limited.
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  ];

  const [images, setImages] = useState(fallbackImages);

  useEffect(() => {
    // Fetch images from Unsplash Source API (does not require an API key)
    // This approach is suitable for demo/prototyping, using the free source endpoint
    // See: https://source.unsplash.com/
    // Results will vary per refresh, but always real & current images.

    // Map each portfolio's query to a unique source.unslash.com image URL
    const unsplashImageUrls = demoPortfolios.map((p, idx) =>
      `https://source.unsplash.com/400x300/?${encodeURIComponent(p.query)}`
    );

    // Try prefetching all images; fallback instantly to the default set if error.
    Promise.all(
      unsplashImageUrls.map(
        (url) =>
          new Promise((resolve) => {
            // Preload image to detect broken or throttled URLs
            const img = new window.Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(fallbackImages[Math.floor(Math.random()*fallbackImages.length)]);
            img.src = url;
          })
      )
    ).then((results) => setImages(results));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="ah-content-section">
      <h2 className="ah-section-title">Artist Portfolios</h2>
      <div className="ah-grid-placeholder">
        {demoPortfolios.map((p, idx) => (
          <div
            className="ah-portfolio-item"
            key={p.name}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 0,
              overflow: "hidden",
              background: "var(--ah-light)",
              border: "2.5px solid var(--ah-border)",
              boxShadow: "0 1px 12px rgba(128,0,0,0.04)"
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "4/3",
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}
            >
              <img
                src={images[idx] || fallbackImages[idx % fallbackImages.length]}
                alt={`${p.desc} by ${p.name}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px"
                }}
                loading="lazy"
              />
            </div>
            <div style={{
              padding: "13px 16px 8px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "3px"
            }}>
              <span style={{
                fontWeight: 700,
                fontSize: "1.09em",
                color: "var(--ah-primary)"
              }}>{p.name}</span>
              <span style={{
                fontWeight: 400,
                fontSize: "0.97em",
                color: "var(--ah-text-faded)",
                fontStyle: "italic"
              }}>{p.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function Marketplace() {
  /** Marketplace feature for trending and available crafts */
  return (
    <section className="ah-content-section">
      <h2 className="ah-section-title">Marketplace</h2>
      <div className="ah-marketplace-placeholder">
        <div className="ah-market-item">"Golden Tides" – Ceramic Mug</div>
        <div className="ah-market-item">Crimson Knot – Handwoven Scarf</div>
        <div className="ah-market-item">"Starlit Path" Necklace</div>
        <div className="ah-market-item">Custom Monogram Canvas</div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function StoriesSidebar() {
  /** Sidebar for behind-the-scenes stories */
  return (
    <aside className="ah-sidebar">
      <h3 className="ah-sidebar-title">Behind the Scenes</h3>
      <ul className="ah-sidebar-list">
        <li className="ah-sidebar-item">
          <span className="ah-story-title">Hand-fired pottery in progress</span>
        </li>
        <li className="ah-sidebar-item">
          <span className="ah-story-title">Sketches for "Maroon Mirage"</span>
        </li>
        <li className="ah-sidebar-item">
          <span className="ah-story-title">Choosing gold accents</span>
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
        <li className="ah-sidebar-item">Commission a pet portrait</li>
        <li className="ah-sidebar-item">Order a bespoke necklace</li>
      </ul>
    </aside>
  );
}

// PUBLIC_INTERFACE
function Messaging() {
  /** Messaging system sample thread */
  return (
    <section className="ah-content-section">
      <h2 className="ah-section-title">Messages</h2>
      <div className="ah-messaging-placeholder">
        <div className="ah-message-thread">
          <div className="ah-msg-sender">Buyer</div>
          <div className="ah-msg-content">Hello! Are gold trims available for custom cups?</div>
          <div className="ah-msg-sender">Artist</div>
          <div className="ah-msg-content">Yes! I can add gold accents—would you like a name or design?</div>
        </div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function Profile() {
  /** User profile sample */
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

/**
 * PUBLIC_INTERFACE
 * GallerySidebar: Showcases a real-time (mocked) feed of artworks/crafts.
 */
function GallerySidebar() {
  // Mock gallery images
  const galleryData = [
    { src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80", title: "Painted Canvas" },
    { src: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80", title: "Pottery with Gold" },
    { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", title: "Bespoke Necklace" },
    { src: "https://images.unsplash.com/photo-1465101178521-c1a9136a3d18?auto=format&fit=crop&w=400&q=80", title: "Woven Tapestry" },
    { src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", title: "Handmade Mug" },
  ];

  return (
    <aside className="ah-sidebar ah-gallery-sidebar">
      <h3 className="ah-sidebar-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{fontWeight: 700, color: "var(--ah-accent)"}}>Latest Artworks</span>
        <span style={{fontSize: "1.3em", color: "var(--ah-primary)"}}>🖼️</span>
      </h3>
      <div className="ah-gallery-feed">
        {galleryData.map((img, idx) => (
          <div className="ah-gallery-img-wrapper" key={idx}>
            <img className="ah-gallery-img" src={img.src} alt={img.title} loading="lazy" />
            <div className="ah-gallery-img-caption">{img.title}</div>
          </div>
        ))}
      </div>
    </aside>
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
            Where Creativity Connects &amp; <span style={{ color: "var(--ah-accent)", fontWeight: 600 }}>Shines</span>
          </div>
          <div className="ah-hero-desc">
            A curated space for artists and crafters to display, tell, and sell.<br />
            Discover inspiration, order unique crafts, and connect with makers.
          </div>
        </section>
        <PortfolioGrid />
      </div>
      <div className="ah-sidebars">
        <GallerySidebar />
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
