import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
/**
 * Portfolios Page
 * Displays artist portfolios: Showcases great artworks in a rich portfolio gallery.
 * Fetches and displays a visually appealing grid of real-time images.
 *
 * Enhancements:
 * - Adds hover overlays to portfolio images with details.
 * - Opens a modal lightbox to view image in large format on click.
 */
function Portfolios() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, img: null });

  // PUBLIC_INTERFACE
  /** Open the image modal/lightbox */
  const handleOpenModal = (img) => {
    setModal({ open: true, img });
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  // PUBLIC_INTERFACE
  /** Close the modal */
  const handleCloseModal = () => {
    setModal({ open: false, img: null });
    document.body.style.overflow = ""; // Restore scroll
  };

  // PUBLIC_INTERFACE
  /** Allow closing modal with ESC key */
  useEffect(() => {
    if (!modal.open) return;
    function onEsc(e) {
      if (e.key === "Escape") handleCloseModal();
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
    // eslint-disable-next-line
  }, [modal.open]);

  // Fetch 12 random images from the public picsum.photos API dynamically
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        // Fetch image list from the public API (can switch to Unsplash or another endpoint if desired)
        const res = await fetch('https://picsum.photos/v2/list?page=1&limit=12');
        if (!res.ok) throw new Error('Failed to load images');
        const data = await res.json();
        // Map fetched data to suit display (simulate artist names & artwork labels)
        const imgData = data.map((img, i) => ({
          url: `https://picsum.photos/id/${img.id}/450/300`,
          alt: img.author ? `Work by ${img.author}` : `Art Portfolio ${i + 1}`,
          label: img.author ? `Artwork by ${img.author}` : `Artwork #${i + 1}`,
          artist: img.author || `Artist ${String.fromCharCode(65 + (i % 8))}`,
          id: img.id,
        }));
        setImages(imgData);
      } catch (err) {
        setImages([]);
      }
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
                className="portfolio-card portfolio-card--portfolio card portfolio-card--interactive"
                tabIndex={0}
                aria-label={img.label + " by " + img.artist}
                style={{
                  transition: "transform 0.18s, box-shadow 0.18s",
                  outline: "none",
                  cursor: "pointer",
                  position: "relative"
                }}
                onClick={() => handleOpenModal(img)}
                onKeyPress={e => {
                  if (e.key === "Enter" || e.key === " ") handleOpenModal(img);
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
                  draggable={false}
                />
                {/* Overlay on hover/focus with image details */}
                <div className="portfolio-card__overlay">
                  <div>
                    <div className="portfolio-card__overlay-label">{img.label}</div>
                    <div className="portfolio-card__overlay-artist">
                      by <b>{img.artist}</b>
                    </div>
                    <button
                      className="portfolio-card__overlay-btn"
                      tabIndex={-1}
                      aria-label="View fullscreen"
                      onClick={e => {
                        e.stopPropagation();
                        handleOpenModal(img);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
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
      {/* Modal Lightbox */}
      {modal.open && (
        <div className="image-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="image-modal"
            onClick={e => e.stopPropagation()}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="image-modal__close"
              onClick={handleCloseModal}
              aria-label="Close image modal"
              tabIndex={1}
            >
              &times;
            </button>
            <img
              src={modal.img.url}
              alt={modal.img.alt}
              className="image-modal__img"
              style={{
                maxWidth: "86vw",
                maxHeight: "68vh",
                borderRadius: "13px",
                background: "#faf7f5"
              }}
              draggable={false}
            />
            <div className="image-modal__caption">
              <div style={{ fontWeight: 700 }}>{modal.img.label}</div>
              <div style={{ color: "#86656b" }}>
                by {modal.img.artist}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Portfolios;
