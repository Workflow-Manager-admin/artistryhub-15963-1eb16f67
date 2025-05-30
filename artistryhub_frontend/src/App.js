import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Enhanced: PortfolioGrid displays cards with artist/artwork metadata, a like button, category filtering,
 * and a modal for details. The UI is brand-consistent and interactive.
 */

/**
 * Utility: Custom Tooltip component (accessible, mouse/focus, dynamic position, on-brand)
 */
function Tooltip({ children, label, shown }) {
  const tipRef = useRef();
  // Calculate tooltip style dynamically
  useEffect(() => {
    if (shown && tipRef.current) {
      // Center horizontally
      let rect = tipRef.current.parentNode.getBoundingClientRect();
      let tRect = tipRef.current.getBoundingClientRect();
      let desiredLeft = Math.max(rect.left + rect.width / 2 - tRect.width / 2, 6);
      if (desiredLeft + tRect.width > window.innerWidth - 6) {
        tipRef.current.style.left = `${window.innerWidth - tRect.width - 6}px`;
      } else {
        tipRef.current.style.left = desiredLeft + "px";
      }
    }
  }, [shown, label]);

  return (
    <span
      className="ah-tooltip"
      style={{
        visibility: shown ? "visible" : "hidden",
        opacity: shown ? 1 : 0,
        zIndex: 50
      }}
      role="tooltip"
      ref={tipRef}
    >
      {label}
    </span>
  );
}

/**
 * Utility: Simple confetti burst (vanilla SVGs, on-brand gold/maroon/white, CSS-animated)
 */
function ConfettiBurst({ triggerKey }) {
  // Each time triggerKey changes/confetti is needed, re-render confetti
  // Small variant for button, bigger for modal
  const confettiCount = 16;
  const radii = [2, 2.6, 1.9, 2.1, 2.9, 1.4, 2.5, 2];
  const colors = [
    "var(--ah-accent)",
    "var(--ah-accent)",
    "var(--ah-primary)",
    "var(--ah-primary)",
    "var(--ah-secondary)",
    "#FFF8DB"
  ];

  return (
    <span className="ah-confetti-burst" aria-hidden="true">
      {[...Array(confettiCount)].map((_, idx) => {
        const angle = (idx / confettiCount) * 2 * Math.PI;
        const x = Math.sin(angle) * 38 + 22;
        const y = Math.cos(angle) * 34 + 15;
        return (
          <svg
            key={triggerKey + "-" + idx}
            width={9 + (idx % 7)}
            height={9 + (idx % 6)}
            style={{
              position: "absolute",
              left: "50%",
              top: "56%",
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${1 + (idx % 2) * 0.18}) rotate(${angle * 80 + idx * 16}deg)`,
              pointerEvents: "none"
            }}
          >
            <circle
              cx="5"
              cy="5"
              r={radii[idx % radii.length]}
              fill={colors[idx % colors.length]}
            />
          </svg>
        );
      })}
    </span>
  );
}

/**
 * Utility: Small spring out-bounce animation (triggered for like button)
 */
function useSpringBounce(trigger) {
  const [bounce, setBounce] = useState(false);
  useEffect(() => {
    if (trigger) {
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 470);
      return () => clearTimeout(t);
    }
  }, [trigger]);
  return bounce;
}

// PUBLIC_INTERFACE
function PortfolioGrid() {
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

  const fallbackImages = [
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
  ];

  const categories = ["All", ...Array.from(new Set(demoPortfolios.map(p => p.category)))];

  const [images, setImages] = useState(fallbackImages);
  const [likes, setLikes] = useState(() => demoPortfolios.map(p => p.likes));
  const [liked, setLiked] = useState(() => demoPortfolios.map(() => false));
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalArtworkIdx, setModalArtworkIdx] = useState(null);

  // For animation sequencing
  const [likeAnimKey, setLikeAnimKey] = useState(0);

  // Confetti effect on "like"
  const [confettiIdx, setConfettiIdx] = useState(null);

  // Tooltip states (card, like btn, filter)
  const [cardTip, setCardTip] = useState({ idx: null });
  const [likeTip, setLikeTip] = useState({ idx: null });
  const [filterTip, setFilterTip] = useState({ cat: null });

  // Fetch Unsplash images as before
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

  // Like handler: adds like, confetti, spring, a11y update
  function handleLike(idx) {
    setLikes((prev) =>
      prev.map((val, i) => (i === idx ? (liked[idx] ? val - 1 : val + 1) : val))
    );
    setLiked((prev) => prev.map((l, i) => (i === idx ? !l : l)));
    setLikeAnimKey(k => k + 1);
    setConfettiIdx(idx);
    setTimeout(() => setConfettiIdx(null), 610); // Remove confetti
    // Optionally: use ARIA live region for sr, skipped for brevity
  }

  // Filtering as before
  const filteredPortfolios = selectedCategory === "All"
    ? demoPortfolios
    : demoPortfolios.filter(p => p.category === selectedCategory);

  // Modal open/close handlers, as before
  function openModal(idx) {
    setModalArtworkIdx(idx);
    setModalOpen(true);
  }
  function closeModal(e) {
    if (!e || e.target === e.currentTarget || (e.target && e.target.classList && e.target.classList.contains("ah-modal-close"))) {
      setModalOpen(false);
      setModalArtworkIdx(null);
    }
  }

  // Card animations: stagger/spring-in, respects prefers-reduced-motion
  const [visibleCards, setVisibleCards] = useState(Array(demoPortfolios.length).fill(false));
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleCards(Array(demoPortfolios.length).fill(true));
      return;
    }
    const cardEls = document.querySelectorAll(".ah-portfolio-item");
    const cb = (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.dataset.idx);
          setVisibleCards(v => {
            const next = v.slice();
            next[idx] = true;
            return next;
          });
          obs.unobserve(entry.target);
        }
      });
    };
    const io = new window.IntersectionObserver(cb, { threshold: 0.2 });
    cardEls.forEach((el, i) => {
      io.observe(el);
      el.style.animationDelay = (0.04 + i * 0.13) + "s";
      el.style.setProperty("--spring-idx", i);
    });
    return () => { io.disconnect(); };
  }, [selectedCategory]);

  // Portfolio Card Component: adds confetti, bounce, tooltip, a11y
  const PortfolioCard = ({ idx, portfolio }) => {
    // Tooltip state
    const [cardFocused, setCardFocused] = useState(false);

    // Out-bounce animation hook (spring) for like button when liked
    const bounce = useSpringBounce(likeAnimKey && liked[idx]);

    return (
      <div
        className={`ah-portfolio-item${visibleCards[idx] ? " ah-visible" : ""}`}
        data-idx={idx}
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
        onMouseEnter={() => setCardTip({ idx })}
        onMouseLeave={() => setCardTip({ idx: null })}
        onFocus={() => { setCardTip({ idx }); setCardFocused(true); }}
        onBlur={() => { setCardTip({ idx: null }); setCardFocused(false); }}
        aria-describedby={cardTip.idx === idx ? "ah-card-tooltip" : undefined}
      >
        {/* Main image area */}
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
            {/* Like/confetti/tooltip button */}
            <span style={{ position: "relative", display: "inline-block" }}>
              <button
                type="button"
                className={`ah-like-btn${liked[idx] ? " liked" : ""}${bounce ? " ah-bounce" : ""}`}
                aria-label={liked[idx] ? "Unlike artwork" : "Like artwork"}
                onClick={e => { e.stopPropagation(); handleLike(idx); }}
                onMouseEnter={() => setLikeTip({ idx })}
                onMouseLeave={() => setLikeTip({ idx: null })}
                onFocus={() => setLikeTip({ idx })}
                onBlur={() => setLikeTip({ idx: null })}
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
                  transition: "background 0.20s, color 0.20s, box-shadow 0.18s, transform 0.17s",
                  transform: bounce ? "scale(1.15)" : liked[idx] ? "scale(1.09)" : "scale(1)"
                }}
                aria-describedby={likeTip.idx === idx ? "ah-like-tooltip" : undefined}
              >
                {liked[idx] ? "♥" : "♡"}
                <span
                  style={{
                    minWidth: 15,
                    marginLeft: 2,
                    display: "inline-block",
                    fontWeight: 600,
                    transition: "color 0.19s, transform 0.18s",
                    color: liked[idx] ? "var(--ah-accent)" : "var(--ah-primary)"
                  }}>
                  {likes[idx]}
                </span>
                {/* Confetti burst (on like) */}
                {confettiIdx === idx && <ConfettiBurst triggerKey={likeAnimKey} />}
              </button>
              {/* Accessible like tooltip */}
              <Tooltip
                label={liked[idx] ? "Unlike this artwork" : "Like this artwork"}
                shown={likeTip.idx === idx}
              />
            </span>
          </div>
        </div>
        {/* Custom tooltip on card (top) */}
        <Tooltip
          label={`See "${portfolio.artworkTitle}" by ${portfolio.artist}`}
          shown={cardTip.idx === idx || cardFocused}
        />
      </div>
    );
  };

  // Modal for artwork details, adds transition/modal animation (only one enhanced version here!)
  const ArtworkModal = ({ portfolioIdx }) => {
    if (portfolioIdx == null) return null;
    const portfolio = demoPortfolios[portfolioIdx];
    // Spring pop-in transition, animated overlay
    return (
      <div
        className="ah-modal-overlay ah-fadein"
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
          className="ah-modal-content ah-springpop"
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
                className={`ah-like-btn${liked[portfolioIdx] ? " liked" : ""}`}
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
                {confettiIdx === portfolioIdx && <ConfettiBurst triggerKey={likeAnimKey+1000} />}
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
    <section className="ah-content-section" style={{ zIndex: 1, position: "relative" }}>
      <h2 className="ah-section-title" style={{ marginBottom: 22 }}>
        Artist Portfolios
      </h2>

      {/* Category filtering controls with tooltips and accessible a11y */}
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
          <span key={cat} style={{ position: "relative" }}>
            <button
              className={`ah-btn${selectedCategory === cat ? " selected" : ""}`}
              style={{
                padding: "5px 16px",
                fontSize: "1.01em",
                fontWeight: selectedCategory === cat ? 700 : 500,
                background: selectedCategory === cat ? "var(--ah-accent)" : "var(--ah-secondary)",
                color: selectedCategory === cat ? "var(--ah-primary)" : "var(--ah-primary)",
                border: selectedCategory === cat ? "2.5px solid var(--ah-primary)" : "1.5px solid var(--ah-border)",
                boxShadow: selectedCategory === cat
                  ? "0 3px 13px 0 #ffd90099,0 0px 14px #ffd70011"
                  : "0 1px 4px 0 #b9847d12",
                borderRadius: 16,
                marginRight: 1,
                cursor: "pointer",
                outline: "none",
                transition: "background 0.18s, color 0.18s, box-shadow 0.13s, transform 0.11s",
                transform: selectedCategory === cat ? "scale(1.08)" : "scale(1) rotate(-1deg)",
                zIndex: 3
              }}
              onClick={() => setSelectedCategory(cat)}
              onMouseEnter={() => setFilterTip({ cat })}
              onMouseLeave={() => setFilterTip({ cat: null })}
              onFocus={() => setFilterTip({ cat })}
              onBlur={() => setFilterTip({ cat: null })}
              tabIndex={0}
              aria-pressed={selectedCategory === cat}
            >{cat}</button>
            <Tooltip
              label={`Show ${cat === "All" ? "all categories" : `only ${cat}`}`}
              shown={filterTip.cat === cat}
            />
          </span>
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

/** ADD BACK MISSING COMPONENTS **/

// PUBLIC_INTERFACE (very basic marketplace demo)
function Marketplace() {
  return (
    <section>
      <h2 style={{ color: "var(--ah-primary)" }}>Marketplace</h2>
      {/* Replace with real marketplace grid as in full code */}
      <p>Marketplace items will be shown here.</p>
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

// PUBLIC_INTERFACE (used for demo and header on homepage)
function Home() {
  return (
    <section>
      <h1 style={{ color: "var(--ah-primary)", textAlign: "center" }}>Welcome to ArtistryHub!</h1>
      <p style={{ textAlign: "center" }}>Where creativity finds its audience.</p>
      {/* Add your custom homepage sections, hero, slider, etc. */}
    </section>
  );
}

// PUBLIC_INTERFACE (very basic profile page mock)
function Profile() {
  return (
    <section>
      <h2 style={{ color: "var(--ah-primary)" }}>Your Profile</h2>
      {/* Replace with more detailed profile UI as in provided full code */}
      <p>This is your profile page.</p>
    </section>
  );
}

// PUBLIC_INTERFACE (very basic messaging page mock)
function Messaging() {
  return (
    <section>
      <h2 style={{ color: "var(--ah-primary)" }}>Messages</h2>
      {/* Replace with real messaging UI as in full code */}
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
