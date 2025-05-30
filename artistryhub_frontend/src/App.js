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

  // Animated card entry (fade-in/slide-up) with IntersectionObserver
  const [visibleCards, setVisibleCards] = useState(Array(demoPortfolios.length).fill(false));
  useEffect(() => {
    // intersection animation entry on scroll
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
    const io = new window.IntersectionObserver(cb, { threshold: 0.28 });
    cardEls.forEach((el, i) => {
      io.observe(el);
      el.style.animationDelay = (0.04 + i * 0.11) + "s";
    });
    return () => { io.disconnect(); };
  }, [selectedCategory]);

  // Portfolio Card Component (in-file)
  const PortfolioCard = ({ idx, portfolio }) => (
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
            className={`ah-like-btn${liked[idx] ? " liked" : ""}`}
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
              transition: "background 0.20s, color 0.20s, box-shadow 0.18s, transform 0.17s",
              transform: liked[idx] ? "scale(1.09)" : "scale(1)"
            }}
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

/**
 * PUBLIC_INTERFACE
 * Enhanced Marketplace: elegant product/artwork cards, badges, price and artist info, on-brand theme.
 */
function Marketplace() {
  // Product data for marketplace cards
  const products = [
    {
      id: 1,
      title: "Golden Tides – Ceramic Mug",
      desc: "Hand-thrown porcelain, gold luster rim. Each mug a sunrise scene.",
      artist: "Emily Rivera",
      price: 32,
      featured: true,
      isNew: false,
      image:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=440&q=80",
      category: "Ceramics",
    },
    {
      id: 2,
      title: "Crimson Knot – Handwoven Scarf",
      desc: "Luxurious alpaca yarn with maroon-&-gold pattern. Limited edition.",
      artist: "Sunlit Weaves",
      price: 58,
      featured: false,
      isNew: true,
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=440&q=80",
      category: "Textiles",
    },
    {
      id: 3,
      title: "Starlit Path Necklace",
      desc:
        "Dainty beadwork with gold threading, inspired by golden constellations.",
      artist: "Rosa Goldsmith",
      price: 44,
      featured: true,
      isNew: true,
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=440&q=80",
      category: "Jewelry",
    },
    {
      id: 4,
      title: "Custom Monogram Canvas",
      desc:
        "Your name or initials in a swirling maroon & gold abstract background.",
      artist: "Art by Quentin",
      price: 80,
      featured: false,
      isNew: false,
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=440&q=80",
      category: "Painting",
    },
  ];

  // Badge SVGs
  const featuredBadge = (
    <span
      style={{
        background:
          "linear-gradient(90deg, var(--ah-accent) 80%, #fffbe7 120%)",
        color: "var(--ah-primary)",
        fontWeight: 700,
        borderRadius: "8px",
        fontSize: "0.87em",
        letterSpacing: 0.5,
        padding: "3px 10px 3px 7px",
        marginRight: 7,
        marginBottom: 4,
        marginTop: 4,
        boxShadow: "0 0 10px #ffd90044, 0 2px 5px #80000022",
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
      }}
      title="Featured artwork"
    >
      <span role="img" aria-label="star">
        ⭐
      </span>
      Featured
    </span>
  );
  const newBadge = (
    <span
      style={{
        background:
          "linear-gradient(90deg, #fffee7 78%, var(--ah-accent) 130%)",
        color: "var(--ah-primary)",
        fontWeight: 600,
        borderRadius: "8px",
        fontSize: "0.83em",
        letterSpacing: 0.2,
        padding: "3px 10px 3px 9px",
        marginLeft: 2,
        marginTop: 3,
        marginBottom: 5,
        boxShadow: "0 0 10px #ffd90033, 0 2px 5px #80000014",
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
      }}
      title="Recently added"
    >
      <span role="img" aria-label="new">
        🆕
      </span>
      New
    </span>
  );

  // Product Card component
  function ProductCard({ product }) {
    return (
      <div
        className="ah-market-card"
        tabIndex={0}
        aria-label={`Artwork: ${product.title}`}
      >
        {/* Badges Row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, minHeight: 29 }}>
          {product.featured && featuredBadge}
          {product.isNew && newBadge}
        </div>
        {/* Main Image */}
        <div
          style={{
            width: "100%",
            aspectRatio: "4/3",
            background: "#fff5d3",
            borderRadius: "9px 9px 0 0",
            overflow: "hidden",
            marginBottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderTopLeftRadius: 9,
              borderTopRightRadius: 9,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0
            }}
          />
        </div>
        <div style={{ padding: "14px 13px 11px 13px", display: "flex", flexDirection: "column", gap: "4px", position: "relative", background: "none" }}>
          <span style={{
            fontWeight: 700,
            fontSize: "1.07em",
            color: "var(--ah-primary)",
            minHeight: 26,
            lineHeight: 1.12,
            fontFamily: "Georgia, serif",
            marginBottom: 2
          }}>
            {product.title}
          </span>
          <span style={{
            fontWeight: 400,
            fontSize: "0.97em",
            color: "var(--ah-text-main)",
            opacity: 0.90,
            minHeight: 20,
            marginBottom: 2
          }}>
            {product.desc}
          </span>
          <div style={{
            display: "flex",
            gap: 10,
            marginTop: 6,
            alignItems: "center"
          }}>
            <span
              style={{
                background: "var(--ah-accent)",
                color: "var(--ah-primary)",
                borderRadius: "15px",
                padding: "3.5px 10px",
                fontSize: "0.92em",
                fontWeight: 600,
                boxShadow: "0 1px 3px var(--ah-border)"
              }}
            >
              {product.category}
            </span>
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "var(--ah-text-faded)",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "0.97em"
            }}>
              <span role="img" aria-label="artist">👤</span>
              {product.artist}
            </span>
          </div>
          <span style={{
            marginTop: 10,
            color: "var(--ah-primary)",
            fontWeight: 700,
            fontSize: "1.09em",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            <span style={{
              color: "var(--ah-accent)",
              fontWeight: 900,
              fontSize: "1.11em"
            }}>
              ${product.price}
            </span>
            <span style={{
              fontWeight: 400,
              color: "#9d7369",
              fontSize: "0.88em"
            }}>
              {/* Price label */}
              {product.price < 40 ? "Great Value" : product.price > 65 ? "Premium Art" : "Limited Edition"}
            </span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <section className="ah-content-section" style={{ background: "var(--ah-secondary)", boxShadow: "0 3px 21px 0 #80000009, 0 1px 10px #FFD70022" }}>
      <h2 className="ah-section-title" style={{ color: "var(--ah-primary)", marginBottom: 22 }}>
        Marketplace
      </h2>
      <div className="ah-market-grid">
        {products.map(product =>
          <ProductCard product={product} key={product.id} />
        )}
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

/*
 * PUBLIC_INTERFACE
 * Redesigned Messaging system: modern, elegant chat interface using ArtistryHub's maroon, gold, and white theme.
 * Sent and received bubbles, avatars, timestamps, polished input area, and distinct separation for a premium, branded look.
 */
function Messaging() {
  // Mocked messages for the UI
  const messages = [
    {
      id: 1,
      sender: "Buyer",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg",
      time: "09:58 AM",
      content: "Hello! Are gold trims available for custom cups?",
      sent: false,
    },
    {
      id: 2,
      sender: "Artist",
      avatar: "https://randomuser.me/api/portraits/men/17.jpg",
      time: "10:01 AM",
      content: "Yes! I can add gold accents—would you like a name or design?",
      sent: true,
    },
    {
      id: 3,
      sender: "Buyer",
      avatar: "https://randomuser.me/api/portraits/women/52.jpg",
      time: "10:02 AM",
      content: "That sounds perfect! Could you add the initials ‘A.C.’ in gold?",
      sent: false,
    },
    {
      id: 4,
      sender: "Artist",
      avatar: "https://randomuser.me/api/portraits/men/17.jpg",
      time: "10:03 AM",
      content: "Absolutely! I’ll sketch out a preview and send it for approval shortly.",
      sent: true,
    },
  ];

  const [input, setInput] = React.useState("");

  // Handler for sending new messages (UI only)
  function handleSendMessage(e) {
    e.preventDefault();
    // In demo: do not actually append message; reset input instead
    setInput("");
  }

  return (
    <section
      className="ah-content-section"
      style={{
        maxWidth: 570,
        margin: "0 auto",
        boxShadow: "0 6px 32px 0 #80000007, 0 1.2px 8px #FFD70019",
        borderRadius: 18,
        padding: 0,
        overflow: "hidden",
        background: "var(--ah-light)",
        border: "2.1px solid var(--ah-border)",
        minHeight: 510,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          background:
            "linear-gradient(89deg, var(--ah-primary) 82%, #FFD700 140%)",
          color: "var(--ah-secondary)",
          padding: "22px 30px 12px 30px",
          borderBottom: "2px solid var(--ah-accent)",
          fontFamily: "'Georgia', serif",
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: "1.55em",
            letterSpacing: 1.4,
            display: "flex",
            alignItems: "center",
            gap: 13,
          }}
        >
          <span style={{ fontSize: "1.25em" }}>💬</span>
          Messages
        </div>
      </header>
      <div
        className="ah-messages-main"
        style={{
          background:
            "linear-gradient(99deg, #fffdfa 74%, var(--ah-accent) 180%)",
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          padding: "28px 20px 14px 20px",
          gap: 10,
          overflowY: "auto",
          minHeight: 320,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: msg.sent ? "row-reverse" : "row",
              alignItems: "flex-end",
              gap: 14,
              marginBottom: 5,
            }}
          >
            {/* Profile avatar */}
            <img
              src={msg.avatar}
              alt={`${msg.sender} avatar`}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: `2.5px solid ${
                  msg.sent ? "var(--ah-accent)" : "var(--ah-primary)"
                }`,
                background:
                  msg.sent
                    ? "linear-gradient(140deg, #ffe586 58%, var(--ah-accent) 130%)"
                    : "linear-gradient(130deg, #b68c82 40%, var(--ah-primary) 130%)",
                objectFit: "cover",
                boxShadow: msg.sent
                  ? "0 2px 9px 0 #ffd90099"
                  : "0 2px 9px 0 #80000033",
              }}
            />
            {/* Bubble area */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.sent ? "flex-end" : "flex-start",
                maxWidth: "77%",
                minWidth: 65,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.96em",
                  color: msg.sent
                    ? "var(--ah-primary)"
                    : "var(--ah-accent)",
                  marginBottom: 2,
                  letterSpacing: 0.1,
                  textAlign: msg.sent ? "right" : "left",
                  opacity: 0.92,
                }}
              >
                {msg.sender}
              </div>
              <div
                style={{
                  background: msg.sent
                    ? "linear-gradient(101deg, var(--ah-accent) 48%, #fffbe7 120%)"
                    : "linear-gradient(95deg, #fffdfa 78%, var(--ah-primary) 160%)",
                  color: msg.sent
                    ? "var(--ah-primary)"
                    : "var(--ah-dark)",
                  borderRadius: msg.sent
                    ? "26px 11px 24px 26px"
                    : "13px 24px 26px 24px",
                  boxShadow: msg.sent
                    ? "0 2px 13px 0 #ffd90080"
                    : "0 4px 16px 0 #80000018",
                  fontSize: "1.09em",
                  padding: "9px 19px 11px 18px",
                  marginBottom: 2,
                  fontFamily: "'Segoe UI', 'Georgia', serif",
                  fontWeight: 500,
                  transition: "background 0.2s",
                  border: msg.sent
                    ? "2.4px solid var(--ah-accent)"
                    : "2.2px solid #e0b899",
                  lineHeight: 1.48,
                  wordBreak: "break-word",
                  minWidth: 36,
                  minHeight: 42,
                }}
              >
                {msg.content}
              </div>
              <div
                style={{
                  fontSize: "0.86em",
                  color: msg.sent
                    ? "var(--ah-border)"
                    : "#bf9986",
                  fontWeight: 400,
                  marginTop: 1,
                  textShadow: "none",
                  letterSpacing: 0.07,
                  textAlign: msg.sent ? "right" : "left",
                  opacity: 0.93,
                }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSendMessage}
        style={{
          background:
            "linear-gradient(87deg, var(--ah-secondary) 80%, #fff8e3 120%)",
          borderTop: "1.5px solid var(--ah-accent)",
          padding: "18px 20px 14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 17,
          minHeight: 80,
        }}
        autoComplete="off"
        spellCheck="true"
      >
        <input
          type="text"
          placeholder="Type your message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            borderRadius: 22,
            border: "2.1px solid var(--ah-primary)",
            padding: "13px 20px",
            fontSize: "1.1em",
            outline: "none",
            fontWeight: 500,
            color: "var(--ah-primary)",
            background: "linear-gradient(104deg, #fffdfa 70%, #FFF8D7 120%)",
            boxShadow: "0 1px 8px 0 #ffd90025",
            marginRight: 6,
            fontFamily: "'Segoe UI', 'Inter', 'Georgia', serif",
          }}
        />
        <button
          type="submit"
          className="ah-btn"
          style={{
            fontWeight: 700,
            background:
              "linear-gradient(97deg, var(--ah-primary) 65%, var(--ah-accent) 180%)",
            color: "var(--ah-accent)",
            border: "none",
            borderRadius: 19,
            fontSize: "1.13em",
            padding: "11px 27px",
            boxShadow: "0 2px 10px 0 #80000010",
            letterSpacing: "0.5px",
            cursor: input.trim() ? "pointer" : "not-allowed",
            opacity: input.trim() ? 1 : 0.4,
            transition: "background 0.19s, opacity 0.15s",
          }}
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </section>
  );
}

/**
 * PUBLIC_INTERFACE
 * ArtistryHub Enhanced Profile Page: visual header (banner + circular avatar), editable display name/bio/socials,
 * a dynamic user artwork gallery (grid or carousel), badges for achievements/status, elegant layout/animations,
 * all themed to maroon, gold, and white.
 */
function Profile() {
  // Demo: Simulated user state
  const [displayName, setDisplayName] = useState("Alex Craftmaker");
  const [editingName, setEditingName] = useState(false);

  const [bio, setBio] = useState(
    "Mixed media visual artist | Enjoys maroon hues & golden highlights."
  );
  const [editingBio, setEditingBio] = useState(false);

  const [social, setSocial] = useState({
    instagram: "art.alex.c",
    twitter: "alex_crafts",
    website: "alexcrafts.com"
  });
  const [editingSocial, setEditingSocial] = useState(false);

  // Artworks gallery (user's uploads)
  const userArtworks = [
    {
      title: "Ruby Reflections",
      url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=440&q=80"
    },
    {
      title: "Golden Morning Mug",
      url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Graceful Beads",
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Tapestry Sun",
      url: "https://images.unsplash.com/photo-1465101178521-c1a9136a3d18?auto=format&fit=crop&w=400&q=80"
    },
    {
      title: "Inspiration Board",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    }
  ];

  // Sample badges (could be from user status/achievements)
  const badges = [
    {
      text: "Founder Artist",
      color: "var(--ah-accent)",
      icon: "🌟"
    },
    {
      text: "Trending",
      color: "#bc752f",
      icon: "🔥"
    },
    {
      text: "Verified",
      color: "var(--ah-primary)",
      icon: "✔️"
    }
  ];

  // Editable form handlers
  const [editInputs, setEditInputs] = useState({
    displayName: displayName,
    bio: bio,
    instagram: social.instagram,
    twitter: social.twitter,
    website: social.website
  });

  const handleEditStart = (field) => {
    if (field === "name") setEditingName(true);
    if (field === "bio") setEditingBio(true);
    if (field === "social") setEditingSocial(true);
    setEditInputs((inputs) => ({
      ...inputs,
      displayName,
      bio,
      instagram: social.instagram,
      twitter: social.twitter,
      website: social.website
    }));
  };
  const handleEditCancel = (field) => {
    if (field === "name") setEditingName(false);
    if (field === "bio") setEditingBio(false);
    if (field === "social") setEditingSocial(false);
  };
  const handleEditSave = (field) => {
    if (field === "name") {
      setDisplayName(editInputs.displayName.trim() || displayName);
      setEditingName(false);
    }
    if (field === "bio") {
      setBio(editInputs.bio.trim() || bio);
      setEditingBio(false);
    }
    if (field === "social") {
      setSocial({
        instagram: editInputs.instagram.trim(),
        twitter: editInputs.twitter.trim(),
        website: editInputs.website.trim(),
      });
      setEditingSocial(false);
    }
  };

  // Animation for gallery
  const [galleryIdx, setGalleryIdx] = useState(0);
  const galleryLen = userArtworks.length > 0 ? userArtworks.length : 1;
  useEffect(() => {
    const interval = setInterval(() => {
      setGalleryIdx((prev) => (prev + 1) % galleryLen);
    }, 4100);
    return () => clearInterval(interval);
  }, [galleryLen]);

  return (
    <section
      className="ah-content-section"
      style={{
        background: "var(--ah-secondary)",
        boxShadow: "0 3px 28px 0 #80000013, 0 1.5px 10px #ffd70025",
        padding: 0,
        overflow: "hidden",
        borderRadius: 26,
        margin: "0 auto"
      }}
    >
      {/* Profile header with banner & avatar */}
      <div
        style={{
          width: "100%",
          minHeight: 163,
          background: "linear-gradient(95deg, var(--ah-primary) 46%, #ac5151 130%)",
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "start",
          overflow: "visible",
        }}
      >
        {/* Banner effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "radial-gradient(circle at 55% 45%, #ffd90011 0%, transparent 86%)",
            pointerEvents: "none"
          }}
        />
        {/* Animated slightly floating avatar */}
        <div
          style={{
            marginLeft: 48,
            marginBottom: -52,
            zIndex: 2,
            position: "relative",
          }}
        >
          <div
            style={{
              boxShadow: "0 7px 25px 0 #ac5151aa, 0 1px 9px var(--ah-accent)",
              borderRadius: "50%",
              background: "linear-gradient(150deg,#fff6de 40%, #ffd700cc 150%)",
              border: "6px solid var(--ah-accent)",
              padding: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "profileAvatarFloat 3s ease-in-out infinite alternate",
              width: 120,
              height: 120,
            }}
          >
            <img
              src="https://randomuser.me/api/portraits/men/35.jpg"
              alt="Profile avatar"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: "50%",
                border: "4px solid var(--ah-secondary)",
                background: "#fffdfa",
              }}
              loading="eager"
            />
          </div>
        </div>
        {/* Badge row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            position: "absolute",
            right: 38,
            bottom: 19,
            zIndex: 6
          }}
        >
          {badges.map((b, idx) => (
            <span
              key={b.text}
              className="ah-profile-badge"
              style={{
                background: b.color,
                color: b.color === "var(--ah-primary)" ? "var(--ah-accent)" : "var(--ah-primary)",
                fontWeight: 700,
                borderRadius: 12,
                fontSize: "1.03em",
                margin: 0,
                padding: "6px 16px 6px 10px",
                display: "inline-flex",
                alignItems: "center",
                boxShadow: "0 2px 14px #ffd70012,0 0.5px 4px #a1885807",
                gap: 5,
                letterSpacing: 0.3,
                opacity: 0.97,
                transform: `rotate(${(idx - 1) * 7.5}deg) scale(${1 - 0.03 * idx})`,
                border: idx === 2 ? "2.4px solid var(--ah-border)" : "none"
              }}
              title={b.text}
            >
              <span aria-label={b.text}>{b.icon}</span>
              <span style={{ marginLeft: 3 }}>{b.text}</span>
            </span>
          ))}
        </div>
      </div>
      {/* Profile details: name, bio, edit */}
      <div
        style={{
          marginTop: 65,
          marginLeft: 46,
          paddingBottom: 20
        }}
      >
        {/* Editable Display Name */}
        {!editingName ? (
          <div
            className="ah-profile-name"
            style={{
              fontSize: "2rem",
              fontWeight: 900,
              letterSpacing: 1.2,
              color: "var(--ah-primary)",
              display: "flex",
              alignItems: "center",
              gap: 13
            }}
          >
            {displayName}
            <button
              onClick={() => handleEditStart("name")}
              className="ah-btn"
              style={{
                fontSize: "0.91em",
                padding: "3.5px 11px",
                borderRadius: 9,
                marginLeft: 3,
                boxShadow: "0 1.2px 6px #ffd70017",
                background: "var(--ah-accent)",
                color: "var(--ah-primary)",
                fontWeight: 600,
                border: "none",
                outline: "none",
                cursor: "pointer"
              }}
              aria-label="Edit display name"
              type="button"
            >
              ✏️
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <input
              value={editInputs.displayName}
              onChange={e => setEditInputs(inputs => ({ ...inputs, displayName: e.target.value }))}
              style={{
                fontSize: "1.6rem",
                padding: "7px 13px",
                borderRadius: 7,
                border: "2.3px solid var(--ah-accent)",
                fontWeight: 800,
                color: "var(--ah-primary)",
                background: "#FFF8DB",
                fontFamily: "'Georgia',serif"
              }}
              autoFocus
              aria-label="Display name"
              onKeyDown={e => {
                if (e.key === "Enter") handleEditSave("name");
                if (e.key === "Escape") handleEditCancel("name");
              }}
              maxLength={32}
            />
            <button className="ah-btn" style={{ padding: "2.5px 12px", fontSize: "1em" }} onClick={() => handleEditSave("name")} aria-label="Save name">✔</button>
            <button className="ah-btn" style={{ padding: "2.5px 11px", fontSize: "1em", background: "#ffe3ae", color: "var(--ah-primary)" }} onClick={() => handleEditCancel("name")} aria-label="Cancel edit">✖</button>
          </div>
        )}
        {/* Editable Bio */}
        {!editingBio ? (
          <div
            className="ah-profile-bio"
            style={{ margin: "9px 0 6px 1px", fontSize: "1.18rem", color: "#86423a" }}
          >
            {bio}
            <button
              onClick={() => handleEditStart("bio")}
              className="ah-btn"
              style={{
                fontSize: "0.82em",
                padding: "1.5px 7px",
                borderRadius: 8,
                marginLeft: 10,
                background: "#ffe3ae",
                color: "var(--ah-primary)",
                fontWeight: 500,
                border: "none",
                outline: "none",
                cursor: "pointer"
              }}
              aria-label="Edit bio"
              type="button"
            >
              ✏️
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "4px 0" }}>
            <input
              value={editInputs.bio}
              onChange={e => setEditInputs(inputs => ({ ...inputs, bio: e.target.value }))}
              style={{
                fontSize: "1.09rem",
                padding: "7px 13px",
                borderRadius: 7,
                border: "2.3px solid var(--ah-accent)",
                fontWeight: 600,
                color: "var(--ah-primary)",
                background: "#FFF8DB",
                marginRight: 6
              }}
              autoFocus
              aria-label="Bio"
              onKeyDown={e => {
                if (e.key === "Enter") handleEditSave("bio");
                if (e.key === "Escape") handleEditCancel("bio");
              }}
              maxLength={100}
            />
            <button className="ah-btn" style={{ padding: "1.5px 11px", fontSize: "0.94em" }} onClick={() => handleEditSave("bio")} aria-label="Save bio">✔</button>
            <button className="ah-btn" style={{ padding: "1.5px 9px", fontSize: "0.94em", background: "#ffe3ae", color: "var(--ah-primary)" }} onClick={() => handleEditCancel("bio")} aria-label="Cancel edit">✖</button>
          </div>
        )}
        {/* Social Links Editable */}
        <div style={{ marginTop: 13 }}>
          {!editingSocial ? (
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: "var(--ah-accent)", marginRight: 2 }}>Socials:</span>
              <a
                href={`https://instagram.com/${social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#c93273", fontWeight: 600, textDecoration: "none" }}
              >
                <span style={{ fontSize: "1.3em" }}>📸</span> @{social.instagram}
              </a>
              <a
                href={`https://twitter.com/${social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1d7ebf", fontWeight: 600, textDecoration: "none" }}
              >
                <span style={{ fontSize: "1.23em" }}>🐦</span> @{social.twitter}
              </a>
              <a
                href={
                  social.website.startsWith("http")
                    ? social.website
                    : `https://${social.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--ah-primary)", fontWeight: 600, textDecoration: "underline" }}
              >
                <span style={{ fontSize: "1.17em" }}>🌐</span>{" "}
                {social.website.replace(/^https?:\/\//i, "")}
              </a>
              <button
                onClick={() => handleEditStart("social")}
                className="ah-btn"
                style={{
                  fontSize: "0.82em",
                  padding: "2px 9px",
                  borderRadius: 7,
                  marginLeft: 9,
                  background: "var(--ah-accent)",
                  color: "var(--ah-primary)",
                  fontWeight: 600,
                  border: "none",
                  outline: "none",
                  cursor: "pointer"
                }}
                aria-label="Edit social links"
                type="button"
              >
                ✏️
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, color: "var(--ah-accent)", marginRight: 2 }}>Socials:</span>
              <input
                value={editInputs.instagram}
                placeholder="Instagram"
                aria-label="Instagram"
                onChange={e => setEditInputs(inputs => ({ ...inputs, instagram: e.target.value }))}
                style={{
                  borderRadius: 6,
                  border: "2px solid var(--ah-accent)",
                  padding: "3px 7px",
                  minWidth: 90,
                  fontSize: "0.96em"
                }}
              />
              <input
                value={editInputs.twitter}
                placeholder="Twitter"
                aria-label="Twitter"
                onChange={e => setEditInputs(inputs => ({ ...inputs, twitter: e.target.value }))}
                style={{
                  borderRadius: 6,
                  border: "2px solid var(--ah-accent)",
                  padding: "3px 7px",
                  minWidth: 90,
                  fontSize: "0.96em"
                }}
              />
              <input
                value={editInputs.website}
                placeholder="Website"
                aria-label="Website"
                onChange={e => setEditInputs(inputs => ({ ...inputs, website: e.target.value }))}
                style={{
                  borderRadius: 6,
                  border: "2px solid var(--ah-accent)",
                  padding: "3px 7px",
                  minWidth: 90,
                  fontSize: "0.96em"
                }}
              />
              <button className="ah-btn" style={{ padding: "2.5px 10px", fontSize: "0.94em" }} onClick={() => handleEditSave("social")} aria-label="Save social">✔</button>
              <button className="ah-btn" style={{ padding: "2.5px 9px", fontSize: "0.94em", background: "#ffe3ae", color: "var(--ah-primary)" }} onClick={() => handleEditCancel("social")} aria-label="Cancel social">✖</button>
            </div>
          )}
        </div>
      </div>
      {/* Divider */}
      <div
        style={{
          width: "100%",
          minHeight: 2,
          background: "linear-gradient(90deg, #fff8e3 50%, var(--ah-accent) 100%)",
          opacity: 0.82,
          margin: "2px 0 22px 0"
        }}
      />
      {/* User Artwork Gallery - grid + carousel + subtle animations */}
      <div>
        <h3
          style={{
            color: "var(--ah-primary)",
            fontFamily: "Georgia,serif",
            fontWeight: 700,
            fontSize: "1.15rem",
            marginLeft: 55,
            marginBottom: 11,
            marginTop: 3,
            letterSpacing: "0.3px",
            display: "flex",
            alignItems: "center",
            gap: 7
          }}
        >
          <span role="img" aria-label="Gallery">🎨</span> My Artworks
        </h3>
        {/* Carousel for mobile, Grid for desktop */}
        <div
          style={{
            width: "100%",
            maxWidth: 840,
            margin: "0 auto",
            padding: "0 24px 28px 24px"
          }}
        >
          <div
            className="ah-user-gallery"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(205px, 1fr))",
              gap: 19,
              alignItems: "stretch",
              justifyContent: "center",
              transition: "all 0.3s",
              animation: "fadeGalleryIn 0.65s"
            }}
          >
            {userArtworks.map((a, idx) => (
              <div
                key={a.title}
                className="ah-user-gallery-imgwrap"
                style={{
                  background: "linear-gradient(103deg,#fffbe9 65%,#ffd90022 130%)",
                  borderRadius: 13,
                  boxShadow: "0 2px 13px 0 #ac515115, 0 0.5px 4px #ffd70008",
                  padding: "7px 7px 10px 7px",
                  border: "2.5px solid var(--ah-border)",
                  position: "relative",
                  minHeight: 160,
                  transition: "box-shadow 0.18s,border-color 0.16s",
                  cursor: "pointer",
                  overflow: "hidden",
                  transform: galleryIdx === idx ? "scale(1.026)" : "scale(1)"
                }}
                title={a.title}
              >
                <img
                  src={a.url}
                  alt={a.title}
                  style={{
                    width: "100%",
                    minHeight: 119,
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    borderRadius: 10,
                    border: galleryIdx === idx ? "2.7px solid var(--ah-accent)" : "2.1px solid var(--ah-primary)",
                    boxShadow: galleryIdx === idx
                      ? "0 5px 20px #ffd70055"
                      : "0 2px 11px #ac515135",
                    transition: "border 0.18s, box-shadow 0.19s"
                  }}
                  className={galleryIdx === idx ? "gallery-img-highlight" : ""}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 7,
                    left: 7,
                    right: 7,
                    color: "var(--ah-primary)",
                    background: "rgba(255,245,210,0.91)",
                    fontWeight: 700,
                    fontSize: "1.01em",
                    textAlign: "center",
                    borderRadius: 5,
                    padding: "3px 0",
                    boxShadow: "0 1px 5px rgba(128,0,0,0.07)"
                  }}
                >
                  {a.title}
                </div>
                {/* Carousel marker */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 6,
                    right: 8,
                    zIndex: 2,
                    fontSize: "0.93em",
                    color: "#b9847d"
                  }}>
                  {idx + 1} / {userArtworks.length}
                </div>
                {/* Subtle bounce animation effect */}
                {galleryIdx === idx && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      boxShadow: "0 7px 24px #ffd90030",
                      borderRadius: 13,
                      pointerEvents: "none",
                      animation: "galleryBounceGlow 1.3s 1"
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Custom subtle animation keyframes (injected in style tag for demonstration, ideally in CSS) */}
      <style>{`
        @keyframes profileAvatarFloat {
          0% { transform:translateY(0) scale(1) rotate(-4deg);}
          70% { transform:translateY(-9px) scale(1.02) rotate(2deg);}
          100% { transform:translateY(-5px) scale(1.02);}
        }
        @keyframes fadeGalleryIn {
          from { opacity: 0; filter: blur(8px) translateY(47px);}
          to { opacity: 1; filter: blur(0) translateY(0);}
        }
        @keyframes galleryBounceGlow {
          0% { box-shadow: 0 7px 24px #ffd90002;}
          29% { box-shadow: 0 7px 24px #ffd70080;}
          100% { box-shadow: 0 7px 24px #ffd90002;}
        }
      `}</style>
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

  // Featured slider preview data (featured artists/artworks)
  const featuredSlides = [
    {
      artist: "Emily Rivera",
      artworkTitle: "Golden Tide Vase",
      desc: "Handpainted ceramics, sunlight and tradition—organic gold accents.",
      img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=550&q=80"
    },
    {
      artist: "Art by Quentin",
      artworkTitle: "Maroon Mirage",
      desc: "Abstract energy in maroon and shimmering gold.",
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=550&q=80"
    },
    {
      artist: "Sunlit Weaves",
      artworkTitle: "Harvest Shawl",
      desc: "Handwoven, nature-dyed wearable tapestry.",
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=550&q=80"
    }
  ];

  // Artistic hero background image for parallax effect (not the slider)
  const heroImageUrl =
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80";

  // Hero parallax scroll
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      // Only modest parallax (up to ~28px shift for visual depth)
      const y = window.scrollY || window.pageYOffset;
      setParallax(Math.min(1, y / 290));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsg((prev) => (prev + 1) % messages.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Carousel slider state for featured artworks
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredSlides.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [featuredSlides.length]);

  // Animated parallax maroon-gold background style
  const heroParallaxBg = {
    transform: `translateY(${-parallax * 28}px) scale(1.01)`,
    boxShadow: parallax > 0.15 ? "0 12px 42px 0 #ac515138" : "0 6px 40px 0 rgba(128,0,0,0.09)"
  };

  // Animated CTA
  const handleCtaHover = (e) => {
    e.target.classList.add("ah-cta-animated");
  };
  const handleCtaOut = (e) => {
    e.target.classList.remove("ah-cta-animated");
  };

  return (
    <>
    {/* HERO WITH PARALLAX */}
    <section
      className="ah-hero ah-hero-with-art-image"
      style={{
        maxWidth: 1100,
        margin: "64px auto 68px auto",
        minHeight: 345,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 36,
        background: "linear-gradient(100deg, var(--ah-primary) 37%, #ac5151 110%)",
        position: "relative",
        ...heroParallaxBg,
        transition: "box-shadow 0.35s, transform 0.33s",
        willChange: "transform"
      }}
    >
      <div
        className="ah-hero-textblock"
        style={{
          flex: 2.2,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 0,
        }}
      >
        {/* Animated Welcoming Message */}
        <div
          className="ah-hero-heading animated-welcome-text"
          style={{
            fontSize: "3.1rem",
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          <span
            key={currentMsg}
            className="welcome-fade-in"
          >
            {messages[currentMsg]}
          </span>
        </div>
        <div className="ah-hero-flashy-underline"></div>

        {/* Brand summary below the animated intro */}
        <div
          className="ah-hero-desc"
          style={{
            textAlign: "center",
            marginTop: 30,
            color: "#ffe3ae",
            fontSize: "1.18rem",
            fontWeight: 400,
            lineHeight: 1.7,
            background: "none"
          }}
        >
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
        {/* Animated CTA */}
        <button
          className="ah-cta-btn"
          tabIndex={0}
          style={{ margin: "40px auto 4px auto" }}
          onMouseEnter={handleCtaHover}
          onFocus={handleCtaHover}
          onMouseLeave={handleCtaOut}
          onBlur={handleCtaOut}
          onClick={() => window.scrollTo({top: 600, behavior: "smooth"})}
        >
          Explore Artist Portfolios
          <span className="cta-arrow" aria-hidden="true">→</span>
        </button>
      </div>
      {/* Decorative hero painting image w/ slight parallax */}
      <div
        className="ah-hero-imageblock"
        style={{
          flex: 1.7,
          minWidth: 240,
          maxWidth: 430,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${parallax * 18}px)`,
          transition: "transform 0.36s cubic-bezier(.66,.01,.27,1.09)"
        }}
      >
        <img
          src={heroImageUrl}
          alt="ArtistryHub artistic paint brushes, maroon and gold on canvas"
          style={{
            width: "100%",
            maxWidth: 430,
            height: "auto",
            objectFit: "cover",
            borderRadius: 16,
            boxShadow: "0 14px 42px 0 #ac515199, 0 1px 8px var(--ah-accent)",
            border: "3px solid var(--ah-accent)",
            background:
              "linear-gradient(130deg, #f7f3f1 70%, var(--ah-accent) 150%)"
          }}
          loading="eager"
        />
      </div>
    </section>
    {/* FEATURED ARTIST/ARTWORK SLIDER SECTION */}
    <section className="ah-featured-slider-section" style={{
      background: "linear-gradient(94deg, #fffdfa 77%, #fae2bf 133%)",
      boxShadow: "0 4px 38px #ffd70015, 0 1px 8px #ac515144",
      borderRadius: 14,
      margin: "0 auto 50px auto",
      maxWidth: 930,
      padding: "36px 5vw 32px 5vw",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{margin: "0 auto 19px auto", textAlign: "center"}}>
        <span style={{
          fontFamily: "Georgia, serif",
          fontWeight: 800,
          color: "var(--ah-primary)",
          fontSize: "2.08rem"
        }}>Featured Artistry</span>
        <span className="ah-slider-glow-dot" />
      </div>
      <div className="ah-featured-slider-wrapper">
        <button
          className="ah-slider-arrow"
          aria-label="Previous featured"
          tabIndex={0}
          onClick={() => setCurrentSlide((s) => (s - 1 + featuredSlides.length) % featuredSlides.length)}
        >‹</button>
        {featuredSlides.map((slide, idx) => (
          <div key={slide.artist}
            className={`ah-slider-slide${idx === currentSlide ? " active" : ""}${Math.abs(currentSlide-idx) === 1 ? " adjacent" : ""}`}
            style={{
              opacity: idx === currentSlide ? 1 : 0.3,
              transform: idx === currentSlide
                ? "scale(1.01) translateY(0)"
                : `scale(0.92) translateY(${Math.abs(currentSlide-idx)*24}px)`,
              zIndex: idx === currentSlide ? 3 : 1,
              pointerEvents: idx === currentSlide ? "auto" : "none"
            }}
          >
            <img
              src={slide.img}
              alt={slide.artworkTitle}
              className="ah-slider-art-img"
              loading="lazy"
            />
            <div className="ah-slider-slide-info">
              <span className="ah-slider-art-title">{slide.artworkTitle}</span>
              <span className="ah-slider-art-artist">by {slide.artist}</span>
              <span className="ah-slider-art-desc">{slide.desc}</span>
            </div>
          </div>
        ))}
        <button
          className="ah-slider-arrow"
          aria-label="Next featured"
          tabIndex={0}
          onClick={() => setCurrentSlide((s) => (s + 1) % featuredSlides.length)}
        >›</button>
      </div>
      <div className="ah-slider-dot-row">
        {featuredSlides.map((_, idx) => (
          <span
            key={idx}
            className={`ah-slider-dot${idx === currentSlide ? " active" : ""}`}
            aria-label={idx === currentSlide ? "Current slide" : undefined}
            onClick={() => setCurrentSlide(idx)}
            tabIndex={0}
          />
        ))}
      </div>
    </section>
    {/* Interactive scroll transition JS helper */}
    <style>{`
      /* Gold shimmer hover for CTA */
      .ah-cta-btn {
        background: linear-gradient(98deg, var(--ah-primary) 56%, var(--ah-accent) 210%);
        color: var(--ah-accent);
        border: none;
        border-radius: 2em;
        font-size: 1.24rem;
        font-weight: 800;
        box-shadow: 0 4px 22px #ac515127, 0 1px 9px #FFD70025;
        padding: 18px 40px 17px 38px;
        margin-top: 23px;
        letter-spacing: 1.1px;
        cursor: pointer;
        outline: none;
        min-width: 238px;
        transition: background 0.29s, box-shadow 0.18s, color 0.13s, transform 0.22s;
        position: relative;
        overflow: hidden;
        will-change: transform;
        z-index: 4;
        display: inline-flex;
        align-items: center;
        gap: 14px;
      }
      .ah-cta-btn .cta-arrow {
        margin-left: 6px;
        font-weight: 900;
        font-size: 1.7em;
        color: var(--ah-accent);
        opacity: 0.93;
        transition: color 0.19s, transform 0.19s;
      }
      .ah-cta-btn.ah-cta-animated,
      .ah-cta-btn:active,
      .ah-cta-btn:focus {
        background: linear-gradient(86deg, var(--ah-accent) 70%, var(--ah-primary) 126%);
        color: var(--ah-primary);
        box-shadow: 0 11px 32px #ffd90035, 0 2px 16px #FFD70016;
        transform: scale(1.048) translateY(-2.5px) perspective(44px) rotateX(2.5deg);
      }
      .ah-cta-btn.ah-cta-animated .cta-arrow,
      .ah-cta-btn:active .cta-arrow,
      .ah-cta-btn:focus .cta-arrow {
        color: var(--ah-primary);
        transform: translateX(1px) scale(1.05);
      }
      /* ---- Featured Slider Section ---- */
      .ah-featured-slider-section {
        margin-top: 18px;
        margin-bottom: 0;
        background: linear-gradient(94deg,#fffdfa 77%,#fae2bf 133%);
        box-shadow: 0 4px 38px #ffd70015,0 1px 8px #ac515144;
        border-radius: 14px;
      }
      .ah-slider-glow-dot {
        display: inline-block;
        width: 20px;
        height: 18px;
        border-radius: 100px;
        margin-left: 18px;
        margin-bottom: 6px;
        background: radial-gradient(circle,var(--ah-accent) 60%,#ffe3ae 99%,transparent 100%);
        box-shadow: 0 1px 12px #ffd900b5,0 2.5px 14px #ffd90049;
        animation: glowPulse 2.5s infinite alternate;
        vertical-align: middle;
      }
      @keyframes glowPulse {
        0% { box-shadow:0 1.3px 24px #ffd900b5, 0 0 0 #ffd700b5;}
        65% { box-shadow: 0 0.8px 20px #ffd900b5,0 2px 14px #ffd90029;}
        100% { box-shadow: 0 3px 24px #ffd700b5,0 2px 14px #ffd90049;}
      }
      .ah-featured-slider-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2.8vw;
        max-width: 880px;
        margin: 0 auto;
        padding: 12px 0;
        scroll-snap-type: x mandatory;
      }
      .ah-slider-arrow {
        font-size: 2em;
        color: var(--ah-primary);
        background: linear-gradient(93deg, #ffd90037 70%, #fff8e3 120%);
        border: none;
        border-radius: 69px;
        width: 44px;
        height: 44px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.93;
        box-shadow: 0 2px 10px #ffd90022,0 2.5px 6px #ac5151;
        transition: background 0.17s, transform 0.12s;
        position: relative;
        z-index: 10;
      }
      .ah-slider-arrow:hover, .ah-slider-arrow:focus {
        background: linear-gradient(84deg, var(--ah-accent) 50%, #ffe3ae 120%);
        color: var(--ah-primary);
        transform: scale(1.09);
      }
      .ah-slider-slide {
        background: linear-gradient(109deg, #fffbe9 77%, #fae2bf 170%);
        border-radius: 13px;
        box-shadow: 0 2px 16px #ffd7002a,0 1px 5px #ac515129;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: transform 0.37s cubic-bezier(.48,.01,.35,1.18), opacity 0.27s;
        padding: 23px 28px 23px 28px;
        min-width: 228px;
        max-width: 350px;
        width: 86vw;
        margin: 0 1vw;
        position: relative;
        z-index: 2;
        scroll-snap-align: center;
        cursor: pointer;
        opacity: 0.55;
        border: 2.1px solid var(--ah-border);
      }
      .ah-slider-slide.active {
        opacity: 1.0;
        border: 2.7px solid var(--ah-accent);
        box-shadow: 0 8px 40px #ffd7001e, 0 2px 18px #ac515139;
      }
      .ah-slider-slide.adjacent {
        opacity: 0.8;
      }
      .ah-slider-art-img {
        width: 100%;
        max-width: 295px;
        min-width: 180px;
        aspect-ratio: 4/3;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 15px;
        box-shadow: 0 1px 16px #ffd70032, 0 2px 12px #ac515147;
        border: 2.1px solid var(--ah-primary);
        transition: border-color 0.18s, box-shadow 0.17s;
      }
      .ah-slider-slide.active .ah-slider-art-img {
        border: 2.9px solid var(--ah-accent);
        box-shadow: 0 9px 45px #ffd70048;
      }
      .ah-slider-slide-info {
        display: flex;
        flex-direction: column;
        gap: 7px;
        align-items: center;
        margin-top: 2px;
        min-width: 120px;
      }
      .ah-slider-art-title {
        font-size: 1.16em;
        font-weight: 800;
        color: var(--ah-primary);
        font-family: Georgia, serif;
      }
      .ah-slider-art-artist {
        color: #BC752F;
        font-weight: 500;
        font-size: 1.01em;
        font-style: italic;
      }
      .ah-slider-art-desc {
        color: var(--ah-text-main);
        font-size: 0.98em;
        opacity: 0.83;
        margin-bottom: 2px;
      }
      .ah-slider-dot-row {
        display: flex;
        justify-content: center;
        gap: 13px;
        margin: 18px 0 0 0;
      }
      .ah-slider-dot {
        width: 18px;
        height: 8px;
        background: #ad7843;
        border-radius: 8px;
        opacity: 0.48;
        box-shadow: 0 2px 10px #ffd70025;
        cursor: pointer;
        transition: background 0.22s, opacity 0.14s, width 0.16s;
      }
      .ah-slider-dot.active {
        background: linear-gradient(90deg, var(--ah-accent) 50%, #ffe3ae 140%);
        opacity: 1.0;
        width: 28px;
      }
      /* Parallax background fade on homepage, slider section */
      .ah-featured-slider-section {
        animation: fadeDownAppear 0.78s ease;
        will-change: box-shadow,background;
      }
      @keyframes fadeDownAppear {
        from { opacity: 0; transform: translateY(-38px) scale(.97);}
        to   { opacity: 1; transform: none;}
      }
      @media (max-width: 690px) {
        .ah-featured-slider-section {
          padding: 15px 1vw 18px 2vw;
        }
        .ah-slider-slide {padding: 11px 4vw 11px 4vw;}
        .ah-slider-art-img { max-width: 196px; }
      }
      @media (max-width:510px) {
        .ah-slider-art-img { max-width: 93vw; }
      }
    `}
    </style>
    </>
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
