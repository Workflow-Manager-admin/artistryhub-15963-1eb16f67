import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
/**
 * Marketplace Page
 * Displays a real-time image gallery for the marketplace, fetching images from a public API
 * (e.g., Lorem Picsum), presented in an attractive grid. Each image card includes an Explore button.
 * Handles loading and error states gracefully.
 */
function Marketplace() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch images from public API on component mount
  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError(null);
      try {
        // Using Lorem Picsum's list endpoint
        const res = await fetch("https://picsum.photos/v2/list?limit=12");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const gallery = data.map((img, i) => ({
          id: img.id.toString(),
          url: `https://picsum.photos/id/${img.id}/400/280`,
          alt: img.author ? `Marketplace art by ${img.author}` : `Marketplace image #${i + 1}`,
          label: img.author ? `By ${img.author}` : `Image ${i + 1}`,
        }));
        setImages(gallery);
      } catch (_e) {
        setError("Unable to load marketplace gallery. Please try again soon.");
        setImages([]);
      }
      setLoading(false);
    }
    fetchImages();
  }, []);

  return (
    <section className="main-content__page">
      <h1 className="title">Marketplace</h1>
      <p className="description">
        Shop real, unique pieces from creators in our vibrant, ever-changing marketplace! Browse trending art and crafts, each with its own story.
      </p>
      <div className="portfolio-grid">
        <h2 className="grid__title" style={{ fontSize: "1.35rem" }}>
          Live Marketplace Gallery
        </h2>
        {loading ? (
          <div className="card" style={{ textAlign: "center" }}>Loading images...</div>
        ) : error ? (
          <div className="card" style={{ color: "#b00", fontWeight: 500 }}>{error}</div>
        ) : (
          <div className="portfolio-grid__container">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="portfolio-card portfolio-card--marketplace card portfolio-card--interactive"
                tabIndex={0}
                aria-label={img.alt}
                style={{
                  cursor: "pointer",
                  transition: "transform 0.18s, box-shadow 0.18s"
                }}
              >
                <img
                  className="portfolio-card__image"
                  src={img.url}
                  alt={img.alt}
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                    width: "100%",
                    height: "160px",
                    background: "#eee",
                    boxShadow: "0 2px 10px #ffd70027"
                  }}
                  loading="lazy"
                  draggable={false}
                  onError={e => {
                    e.target.style.opacity = 0.3;
                    e.target.alt = "Failed to load";
                  }}
                />
                <div className="portfolio-card__label" style={{ margin: "0.7em 0 0.8em 0" }}>
                  <span style={{ color: "#FFD700", fontWeight: 600, letterSpacing: "0.01em" }}>
                    {img.label}
                  </span>
                </div>
                <button
                  className="portfolio-card__overlay-btn"
                  style={{
                    width: "100%",
                    marginTop: 8,
                    fontSize: "1.08rem",
                    background: "linear-gradient(92deg,#FFD700 60%,#800000 120%)",
                    color: "#800000",
                    fontWeight: 700,
                  }}
                  tabIndex={0}
                  onClick={e => {
                    e.stopPropagation();
                    // In the future, this could open details or trigger an action.
                    alert("Feature coming soon: Explore item!");
                  }}
                  aria-label="Explore this item"
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Marketplace;
