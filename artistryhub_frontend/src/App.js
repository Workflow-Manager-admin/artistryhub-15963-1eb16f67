import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Enhanced: PortfolioGrid displays cards with artist/artwork metadata, a like button, category filtering,
 * and a modal for details. The UI is brand-consistent and interactive.
 */
function PortfolioGrid() {
  // Mocked portfolio data for demo
  const demoPortfolios = [
    {
      id: 1,
      artist: "Emily Rivera",
      artworkTitle: "Golden Tide Vase",
      desc: "Handpainted ceramics, blending tradition and sunlight. Organic textures with gold accents.",
      category: "Ceramics",
      query: "ceramics pottery",
      likes: 17,
    },
    {
      id: 2,
      artist: "Art by Quentin",
      artworkTitle: "Maroon Mirage",
      desc: "Bold abstract canvas in rich maroon and gold, capturing movement and emotion.",
      category: "Painting",
      query: "abstract art",
      likes: 8,
    },
    {
      id: 3,
      artist: "Sunlit Weaves",
      artworkTitle: "Harvest Shawl",
      desc: "Handwoven textile, fibers dyed with nature. A tactile, wearable tapestry.",
      category: "Textiles",
      query: "textile fiber art",
      likes: 12,
    },
    {
      id: 4,
      artist: "Rosa Goldsmith",
      artworkTitle: "Starlit Beads",
      desc: "Jewelry inspired by night skies—delicate beadwork with gold threading.",
      category: "Jewelry",
      query: "artisan jewelry",
      likes: 4,
    }
  ];

  // Copyright-safe fallback images if Unsplash fails/rate-limited.
  const fallbackImages = [
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  ];

  // Categories from portfolio data for filtering
  const categories = ["All", ...Array.from(new Set(demoPortfolios.map(p => p.category)))];

  const [images, setImages] = useState(fallbackImages);
  const [likes, setLikes] = useState(() => demoPortfolios.map(p => p.likes));
  const [liked, setLiked] = useState(() => demoPortfolios.map(() => false));
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalArtworkIdx, setModalArtworkIdx] = useState(null);

  // Fetch Unsplash images just like before
  useEffect(() => {
    const unsplashImageUrls = demoPortfolios.map(p =>
      `https://source.unsplash.com/400x300/?${encodeURIComponent(p.query)}`
    );
    Promise.all(
      unsplashImageUrls.map(
        (url, idx) =>
          new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(fallbackImages[idx % fallbackImages.length]);
            img.src = url;
          })
      )
    ).then((results) => setImages(results));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Like button handler (UI state only)
  function handleLike(idx) {
    setLikes((prev) =>
      prev.map((val, i) => (i === idx ? (liked[idx] ? val - 1 : val + 1) : val))
    );
    setLiked((prev) => prev.map((l, i) => (i === idx ? !l : l)));
  }

  // Filtering
  const filteredPortfolios = selectedCategory === "All"
    ? demoPortfolios
    : demoPortfolios.filter(p => p.category === selectedCategory);

  // Modal open/close handlers
  function openModal(idx) {
    setModalArtworkIdx(idx);
    setModalOpen(true);
  }
  function closeModal(e) {
    // Close if overlay or close btn is clicked
    if (!e || e.target === e.currentTarget || (e.target && e.target.classList && e.target.classList.contains("ah-modal-close"))) {
      setModalOpen(false);
      setModalArtworkIdx(null);
    }
  }

  // Portfolio Card Component (in-file)
  const PortfolioCard = ({ idx, portfolio }) => (
    <div
      className="ah-portfolio-item"
      key={portfolio.id}
      tabIndex={0}
      aria-label={`View more about ${portfolio.artworkTitle} by ${portfolio.artist}`}
      style={{
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        padding: 0,
        overflow: "hidden",
        background: "var(--ah-light)",
        border: liked[idx] ? "3px solid var(--ah-accent)" : "2.5px solid var(--ah-border)",
        boxShadow: liked[idx]
          ? "0 3px 20px 0 var(--ah-accent), 0 3px 15px rgba(128,0,0,0.10)"
          : "0 1px 12px rgba(128,0,0,0.04)",
        transition: "box-shadow 0.2s,border-color 0.2s"
      }}
      onClick={() => openModal(idx)}
      onKeyPress={(e) => { if (e.key === "Enter") openModal(idx); }}
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
          alt={`${portfolio.artworkTitle} by ${portfolio.artist}`}
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
        padding: "13px 16px 10px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "7px",
        background: "var(--ah-light)",
      }}>
        <span style={{
          fontWeight: 700,
          fontSize: "1.04em",
          color: "var(--ah-primary)",
          minHeight: 24,
          lineHeight: 1.13
        }}>{portfolio.artworkTitle}</span>
        <span style={{
          fontWeight: 500,
          fontSize: "0.99em",
          color: "var(--ah-text-faded)",
          fontStyle: "italic",
          minHeight: 21,
        }}>by {portfolio.artist}</span>
        <span style={{
          fontWeight: 400,
          fontSize: "0.96em",
          color: "var(--ah-text-main)",
          marginBottom: 4,
          opacity: 0.9
        }}>{portfolio.desc}</span>
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 11, justifyContent: "space-between" }}>
          <span className="ah-category-chip"
            style={{
              background: "var(--ah-accent)",
              color: "var(--ah-primary)",
              fontSize: "0.91em",
              borderRadius: "18px",
              padding: "3px 13px",
              fontWeight: 600,
              boxShadow: "0 1px 2px var(--ah-border),0 0.5px 2px #b9847d44"
            }}>
            {portfolio.category}
          </span>
          <button
            type="button"
            className="ah-like-btn"
            aria-label={liked[idx] ? "Unlike artwork" : "Like artwork"}
            onClick={e => { e.stopPropagation(); handleLike(idx); }}
            tabIndex={0}
            style={{
              background: liked[idx] ? "var(--ah-primary)" : "#fcecc7",
              color: liked[idx] ? "var(--ah-accent)" : "var(--ah-primary)",
              border: "none",
              borderRadius: "18px",
              fontSize: "1rem",
              fontWeight: 700,
              padding: "5px 15px",
              minWidth: 60,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: liked[idx]
                ? "0 2px 8px 0 var(--ah-border)"
                : "0 1.5px 6px 0 #b9847d28",
              outline: "none",
              transition: "background 0.20s, color 0.20s"
            }}
          >
            {liked[idx] ? "♥" : "♡"} <span style={{ minWidth: 15, marginLeft: 2 }}>{likes[idx]}</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Modal for artwork details. Extra info can be added here.
  const ArtworkModal = ({ portfolioIdx }) => {
    if (portfolioIdx == null) return null;
    const portfolio = demoPortfolios[portfolioIdx];
    return (
      <div
        className="ah-modal-overlay"
        onClick={closeModal}
        aria-modal="true"
        tabIndex={-1}
        role="dialog"
        style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(58,32,51,0.18)",
          zIndex: 1001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          className="ah-modal-content"
          style={{
            background: "var(--ah-secondary)",
            padding: 0,
            borderRadius: 14,
            boxShadow: "0 10px 32px 0 var(--ah-primary), 0 1.5px 18px 0 #dcbb8a99",
            minWidth: 320,
            maxWidth: 460,
            width: "94vw",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <button
            className="ah-modal-close"
            aria-label="Close artwork details"
            onClick={closeModal}
            style={{
              position: "absolute",
              top: 13,
              right: 16,
              background: "var(--ah-dark)",
              color: "var(--ah-accent)",
              border: "none",
              borderRadius: 10,
              fontSize: 19,
              width: 34,
              height: 34,
              cursor: "pointer",
              fontWeight: 700,
              zIndex: 2,
              opacity: 0.82,
              boxShadow: "0 3px 8px rgba(128,0,0,0.09)"
            }}
          >×</button>
          <img
            src={images[portfolioIdx] || fallbackImages[portfolioIdx % fallbackImages.length]}
            alt={portfolio.artworkTitle}
            style={{
              width: "100%",
              objectFit: "cover",
              borderTopLeftRadius: 13,
              borderTopRightRadius: 13,
              height: 210,
              background: "#eee"
            }}
          />
          <div style={{
            padding: "24px 22px 22px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 7
          }}>
            <span style={{
              fontWeight: 800,
              fontSize: "1.29em",
              color: "var(--ah-primary)",
              lineHeight: 1.13
            }}>{portfolio.artworkTitle}</span>
            <span style={{
              fontWeight: 500,
              fontSize: "1.09em",
              color: "var(--ah-text-faded)",
              fontStyle: "italic",
            }}>by {portfolio.artist}</span>
            <span style={{
              fontWeight: 400,
              fontSize: "1rem",
              color: "var(--ah-text-main)"
            }}>{portfolio.desc}</span>
            <span className="ah-category-chip"
              style={{
                marginTop: 12,
                background: "var(--ah-accent)",
                color: "var(--ah-primary)",
                fontSize: "0.93em",
                borderRadius: "18px",
                padding: "4px 13px",
                fontWeight: 700,
                boxShadow: "0 1px 2px var(--ah-border),0 1px 4px #b9847d18",
                width: "fit-content"
              }}>
              Category: {portfolio.category}
            </span>
            <div style={{ marginTop: 11, display: "flex", gap: 9, alignItems: "center" }}>
              <button
                type="button"
                className="ah-like-btn"
                aria-label={liked[portfolioIdx] ? "Unlike artwork" : "Like artwork"}
                onClick={e => { e.stopPropagation(); handleLike(portfolioIdx); }}
                tabIndex={0}
                style={{
                  background: liked[portfolioIdx] ? "var(--ah-primary)" : "#fcecc7",
                  color: liked[portfolioIdx] ? "var(--ah-accent)" : "var(--ah-primary)",
                  border: "none",
                  borderRadius: "18px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  padding: "5px 16px",
                  minWidth: 60,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: liked[portfolioIdx]
                    ? "0 2px 8px 0 var(--ah-border)"
                    : "0 1.5px 6px 0 #b9847d28",
                  outline: "none",
                  transition: "background 0.21s, color 0.22s"
                }}
              >
                {liked[portfolioIdx] ? "♥" : "♡"} <span style={{ minWidth: 14, marginLeft: 2 }}>{likes[portfolioIdx]}</span>
              </button>
              <span style={{
                fontSize: "0.98em",
                color: liked[portfolioIdx] ? "var(--ah-primary)" : "#9e665c"
              }}>{liked[portfolioIdx] ? "You like this" : ""}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="ah-content-section" style={{ zIndex: 1 }}>
      <h2 className="ah-section-title" style={{ marginBottom: 22 }}>
        Artist Portfolios
      </h2>

      {/* Category filtering controls */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 13,
        marginBottom: 21,
        marginTop: 8,
        alignItems: "center"
      }}>
        <span style={{ fontWeight: 600, color: "var(--ah-primary)", letterSpacing: "0.4px" }}>
          Filter:
        </span>
        {categories.map((cat) =>
          <button
            key={cat}
            className="ah-btn"
            style={{
              padding: "5px 16px",
              fontSize: "1.01em",
              fontWeight: selectedCategory === cat ? 700 : 500,
              background: selectedCategory === cat ? "var(--ah-accent)" : "var(--ah-secondary)",
              color: selectedCategory === cat ? "var(--ah-primary)" : "var(--ah-primary)",
              border: selectedCategory === cat ? "2.5px solid var(--ah-primary)" : "1.5px solid var(--ah-border)",
              boxShadow: selectedCategory === cat
                ? "0 3px 13px 0 #b9847d22"
                : "0 1px 4px 0 #b9847d12",
              borderRadius: 16,
              marginRight: 1,
              cursor: "pointer",
              outline: "none",
              transition: "background 0.16s, color 0.16s"
            }}
            onClick={() => setSelectedCategory(cat)}
            tabIndex={0}
            aria-pressed={selectedCategory === cat}
          >{cat}</button>
        )}
      </div>

      {/* Portfolio grid */}
      <div className="ah-grid-placeholder">
        {filteredPortfolios.length > 0 ? filteredPortfolios.map((p, idx) => {
          // Find the original index for likes/images in case of filter
          const originalIdx = demoPortfolios.findIndex(item => item.id === p.id);
          return (
            <PortfolioCard key={p.id} idx={originalIdx} portfolio={p} />
          );
        }) : (
          <div className="ah-portfolio-item ah-placeholder" style={{ minHeight: 120, textAlign: "center", fontStyle: "italic" }}>
            No artworks found for this category.
          </div>
        )}
      </div>

      {/* Modal for artwork details */}
      {modalOpen && modalArtworkIdx != null && (
        <ArtworkModal portfolioIdx={modalArtworkIdx} />
      )}
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

/**
 * PUBLIC_INTERFACE
 * Home page: Elegant one-section intro about ArtistryHub (mission, audience, offering).
 */
function Home() {
  // Flashy animated messages for welcome, on brand
  const messages = [
    "Welcome to ArtistryHub!",
    "Where Creativity Finds Its Audience",
    "Discover, Connect, and Celebrate Creativity",
    "Handcrafted. Unique. Elegant.",
    "Bringing Artists and Admirers Together"
  ];

  const [currentMsg, setCurrentMsg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsg((prev) => (prev + 1) % messages.length);
    }, 2800); // Change message every 2.8 seconds
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <section className="ah-hero" style={{ maxWidth: 700, margin: "64px auto 68px auto" }}>
      {/* Animated Welcoming Message */}
      <div className="ah-hero-heading animated-welcome-text" style={{ fontSize: "3.1rem", textAlign: "center" }}>
        <span
          key={currentMsg}
          className="welcome-fade-in"
        >
          {messages[currentMsg]}
        </span>
      </div>
      <div className="ah-hero-flashy-underline"></div>
      {/* Brand summary below the animated intro */}
      <div className="ah-hero-desc" style={{
        textAlign: "center",
        marginTop: 30,
        color: "#ffe3ae",
        fontSize: "1.18rem",
        fontWeight: 400,
        lineHeight: 1.7,
        background: "none"
      }}>
        <span style={{ color: "var(--ah-accent)", fontWeight: 700 }}>
          ArtistryHub
        </span>{" "}
        connects passionate artists, crafters, and admirers in a vibrant, supportive community.<br />
        <br />
        <span style={{ color: "var(--ah-accent)", fontWeight: 600 }}>
          Our mission
        </span>: To empower creative individuals to showcase their artistry, share stories behind every piece, and spark meaningful connections.<br />
        <br />
        <span style={{ color: "var(--ah-secondary)", fontWeight: 500 }}>
          Who is it for?
        </span> Artists, crafters, and anyone seeking unique, handcrafted inspiration or commissions.<br />
        <br />
        <span style={{ color: "var(--ah-accent)", fontWeight: 600 }}>
          What does it offer?
        </span> Elegant portfolios, direct connections with makers, art stories, and a welcoming space to discover, connect, and celebrate creativity.
      </div>
    </section>
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
