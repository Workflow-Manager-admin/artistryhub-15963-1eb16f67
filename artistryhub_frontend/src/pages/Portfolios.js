import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
/**
 * Portfolios Page
 * Displays artist portfolios: Showcases great artworks in a rich portfolio gallery.
 * Fetches and displays a visually appealing grid of real-time images.
 */
function Portfolios() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch 12 random images from picsum.photos (unsplash.it alternative)
  useEffect(() => {
    const fetchImages = () => {
      // Static mock for variety, as there’s no backend API (stable for mock/demo)
      const imgData = Array.from({ length: 12 }).map((_, i) => ({
        url: `https://picsum.photos/seed/artist${i + 11}/450/300`,
        alt: `Art Portfolio ${i + 1}`,
        label: `Artwork #${i + 1}`,
        artist: `Artist ${String.fromCharCode(65 + (i % 8))}`,
      }));
      setImages(imgData);
      setLoading(false);
    };
    fetchImages();
  }, []);

  return (
    <section className="main-content__page">
      <h1 className="title">Artist Portfolios</h1>
      <p className="description">
        Explore a visually rich collection of real artist portfolios—discover creative profiles, browse artwork showcases, and find your next inspiration on ArtistryHub!
      </p>
      <div className="portfolio-grid">
        <h2 className="grid__title" style={{ fontSize: "1.6rem" }}>
          Gallery
        </h2>
        {loading ? (
          <div className="card">Loading images...</div>
        ) : (
          <div className="portfolio-grid__container">
            {images.map((img, i) => (
              <div
                key={img.url}
                className="portfolio-card portfolio-card--portfolio card"
                tabIndex={0}
                aria-label={img.label + " by " + img.artist}
                style={{
                  transition: "transform 0.15s, box-shadow 0.16s",
                  outline: "none"
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
                    boxShadow: "0 2px 10px #80000017",
                  }}
                  loading="lazy"
                />
                <div className="portfolio-card__label">
                  <span style={{ color: "#800000", fontWeight: 600 }}>{img.label}</span>
                  <span style={{
                    color: "#86656b",
                    fontWeight: 400,
                    marginLeft: 10,
                    fontSize: "0.99em"
                  }}>
                    by {img.artist}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Portfolios;
