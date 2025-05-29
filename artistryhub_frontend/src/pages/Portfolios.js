import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
/**
 * Portfolios Page
 * Displays artist portfolios: Showcases great artworks in a rich portfolio gallery.
 * Fetches and displays a visually appealing grid of real-time images,
 * enhanced with interactivity: Like (toggle), Comment (input/list & modal/local), and Share (copy link).
 * All state logic and feedback handled on the frontend only.
 */
function Portfolios() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state: { open: bool, img: <imgObj or null> }
  const [modal, setModal] = useState({ open: false, img: null });

  // Like state: { [img.id]: boolean }
  const [likes, setLikes] = useState({});
  // Comments: { [img.id]: [string] }
  const [comments, setComments] = useState({});
  // Current unsubmitted comment text per image: { [img.id]: string }
  const [commentInput, setCommentInput] = useState({});
  // Share and feedback: { [img.id]: string }
  const [shareMessage, setShareMessage] = useState({});

  // --- Modal (Lightbox) logic ---
  // PUBLIC_INTERFACE
  /** Open the image modal/lightbox for a gallery image */
  const handleOpenModal = (img) => {
    setModal({ open: true, img });
    document.body.style.overflow = "hidden";
    setShareMessage({});
  };

  // PUBLIC_INTERFACE
  /** Closes the modal (and resets share feedback) */
  const handleCloseModal = () => {
    setModal({ open: false, img: null });
    document.body.style.overflow = "";
    setShareMessage({});
  };

  // PUBLIC_INTERFACE
  /** Allows closing modal by pressing the ESC key */
  useEffect(() => {
    if (!modal.open) return;
    const escHandler = (e) => {
      if (e.key === "Escape") handleCloseModal();
    };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, [modal.open]);
  
  // PUBLIC_INTERFACE
  /** Fetch 12 random images from the public API for gallery cards */
  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://picsum.photos/v2/list?page=1&limit=12");
        if (!res.ok) throw new Error();
        const data = await res.json();
        const imgData = data.map((img, i) => ({
          url: `https://picsum.photos/id/${img.id}/450/300`,
          alt: img.author ? `Work by ${img.author}` : `Art Portfolio ${i + 1}`,
          label: img.author ? `Artwork by ${img.author}` : `Artwork #${i + 1}`,
          artist: img.author || `Artist ${String.fromCharCode(65 + (i % 8))}`,
          id: img.id.toString(),
        }));
        setImages(imgData);
      } catch (err) {
        setImages([]);
        setError("Sorry, we could not load the gallery. Please try again later.");
      }
      setLoading(false);
    }
    fetchImages();
  }, []);

  // --- Like/Unlike toggle (simulate like) ---
  // PUBLIC_INTERFACE
  const handleLikeToggle = (imgId) => {
    setLikes((prev) => ({
      ...prev,
      [imgId]: !prev[imgId],
    }));
  };

  // --- Comment Input + Submission (mock only: local frontend state) ---
  // Comment input update
  // PUBLIC_INTERFACE
  const handleCommentChange = (imgId, value) => {
    setCommentInput((prev) => ({
      ...prev,
      [imgId]: value,
    }));
  };
  // Submission logic (updates local list, clears field, flashes feedback in modal)
  // PUBLIC_INTERFACE
  const handleCommentSubmit = (imgId, inModal = false) => {
    const val = (commentInput[imgId] || "").trim();
    if (!val) return;
    setComments((prev) => ({
      ...prev,
      [imgId]: [...(prev[imgId] || []), val],
    }));
    setCommentInput((prev) => ({
      ...prev,
      [imgId]: "",
    }));
    // Add flash message in modal if desired
    if (inModal && typeof window !== "undefined") {
      setShareMessage((prev) => ({
        ...prev,
        [imgId]: "Comment added!",
      }));
      setTimeout(() => setShareMessage((prev) => ({ ...prev, [imgId]: "" })), 1200);
    }
  };

  // --- Share logic: copy to clipboard simulation + feedback ---
  // PUBLIC_INTERFACE
  const handleShare = async (img, inModal = false) => {
    const link = window.location.origin + "/portfolios?img=" + img.id;
    try {
      await navigator.clipboard.writeText(link);
      setShareMessage((prev) => ({
        ...prev,
        [img.id]: "Copied gallery link!",
      }));
      setTimeout(
        () =>
          setShareMessage((prev) => ({
            ...prev,
            [img.id]: "",
          })),
        1300
      );
    } catch (err) {
      setShareMessage((prev) => ({
        ...prev,
        [img.id]: "Failed to copy link",
      }));
      setTimeout(
        () =>
          setShareMessage((prev) => ({
            ...prev,
            [img.id]: "",
          })),
        1300
      );
    }
  };

  // --- Control bar of interactivity below each card (or modal) ---
  // PUBLIC_INTERFACE
  const Controls = ({ img, isModal }) => (
    <div
      style={{
        display: "flex",
        gap: 16,
        alignItems: "center",
        margin: isModal ? "1em 0 0.3em 0" : "0.6em 0 0.1em 0",
        flexWrap: "wrap",
        borderTop: isModal ? "1.4px solid #e1d2c8" : undefined,
        paddingTop: isModal ? 13 : 0,
        justifyContent: isModal ? "flex-start" : "space-between",
        zIndex: 2,
      }}
    >
      {/* Like toggle button */}
      <button
        style={{
          background: likes[img.id]
            ? "linear-gradient(93deg,#FFD700 60%,#800000 120%)"
            : "#f8eee4",
          color: likes[img.id] ? "#800000" : "#a07720",
          border: likes[img.id]
            ? "2px solid #FFD700"
            : "1.3px solid #d9c7b6",
          boxShadow: "0 2px 9px #ffd70033",
          borderRadius: 7,
          fontWeight: 700,
          padding: "6px 13px",
          fontSize: "1.01rem",
          marginRight: 7,
          cursor: "pointer",
          outline: "none",
        }}
        aria-pressed={!!likes[img.id]}
        onClick={(e) => {
          e.stopPropagation();
          handleLikeToggle(img.id);
        }}
        title={likes[img.id] ? "Unlike" : "Like"}
      >
        <span role="img" aria-label="like">
          ❤️
        </span>{" "}
        Like{likes[img.id] ? "d" : ""}
      </button>
      {/* Simulated like count */}
      <span
        style={{
          fontSize: "0.98em",
          minWidth: 34,
          color: "#86656b",
        }}
      >
        {likes[img.id] ? "1 like" : "0 likes"}
      </span>
      {/* Comment input/field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommentSubmit(img.id, isModal);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          margin: "0 0.6em",
          gap: 4,
        }}
      >
        <input
          style={{
            fontSize: "1em",
            borderRadius: 5,
            border: "1px solid #dcc5a4",
            padding: "5px 8px",
            marginRight: 4,
            width: isModal ? 160 : 87,
            background: "#fffbe6",
            outline: "none",
          }}
          type="text"
          aria-label="Add a comment"
          maxLength={120}
          placeholder={
            comments[img.id]?.length
              ? "Add another comment"
              : "Add a comment"
          }
          value={commentInput[img.id] || ""}
          onChange={(e) =>
            handleCommentChange(img.id, e.target.value)
          }
        />
        <button
          type="submit"
          style={{
            background:
              "linear-gradient(92deg,#FFD700 60%,#800000 120%)",
            color: "#800000",
            border: "none",
            borderRadius: 6,
            fontWeight: 700,
            padding: "5px 11px",
            cursor: "pointer",
            fontSize: "1em",
          }}
        >
          Send
        </button>
      </form>
      {/* Share button */}
      <button
        style={{
          background: "#faf7e7",
          color: "#800000",
          border: "1.1px solid #FFD700",
          borderRadius: 7,
          fontWeight: 700,
          padding: "6px 12px",
          fontSize: "1.01rem",
          marginLeft: 6,
          cursor: "pointer",
          outline: "none",
        }}
        aria-label="Copy direct gallery link"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleShare(img, isModal);
        }}
      >
        <span role="img" aria-label="share">
          🔗
        </span>{" "}
        Share
      </button>
      {/* Share feedback */}
      {shareMessage[img.id] ? (
        <span
          style={{
            color: "#FFD700",
            background: "#221",
            borderRadius: 7,
            padding: "2px 8px",
            marginLeft: 7,
            fontSize: "0.945em",
            fontWeight: 500,
            boxShadow: "0 1px 8px #FFD70033",
            letterSpacing: "0.01em",
          }}
        >
          {shareMessage[img.id]}
        </span>
      ) : null}
    </div>
  );

  // --- Comments List (simulated, under each card/modal) ---
  const CommentsBlock = ({ imgId, isModal }) => {
    const list = comments[imgId] || [];
    return list.length ? (
      <ul
        style={{
          margin: isModal
            ? "0.5em 0 0.33em 0"
            : "0.41em 0 0.17em 0",
          padding: "0 0 0 1.08em",
          fontSize: "0.98em",
          color: "#703515",
          maxHeight: isModal ? 100 : 44,
          overflowY: "auto",
          background: isModal ? "#fff9ec" : "#fff8e13c",
          borderRadius: isModal ? 6 : 3,
          boxShadow: isModal ? "0 1px 7px #FFD70028" : "none",
        }}
      >
        {list.map((cmt, i) => (
          <li key={i} style={{ padding: "2px 0" }}>
            💬 {cmt}
          </li>
        ))}
      </ul>
    ) : null;
  };

  // --- Main Render ---
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
        ) : error ? (
          <div
            className="card"
            style={{ color: "#b00", fontWeight: 500 }}
          >
            {error}
          </div>
        ) : (
          <div className="portfolio-grid__container">
            {images.map((img, i) => (
              <div
                key={img.url}
                className="portfolio-card portfolio-card--portfolio card portfolio-card--interactive"
                tabIndex={0}
                aria-label={img.label + " by " + img.artist}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  outline: "none",
                  transition: "transform 0.18s, box-shadow 0.18s",
                }}
                onClick={() => handleOpenModal(img)}
                onKeyPress={(e) => {
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
                  onError={(e) => {
                    e.target.style.opacity = 0.3;
                    e.target.alt = "Failed to load";
                  }}
                />
                {/* Overlay on hover/focus with image details */}
                <div className="portfolio-card__overlay">
                  <div>
                    <div className="portfolio-card__overlay-label">
                      {img.label}
                    </div>
                    <div className="portfolio-card__overlay-artist">
                      by <b>{img.artist}</b>
                    </div>
                    <button
                      className="portfolio-card__overlay-btn"
                      tabIndex={-1}
                      aria-label="View fullscreen"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(img);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                <div
                  className="portfolio-card__label"
                  style={{ marginBottom: "0.5em" }}
                >
                  <span style={{ color: "#800000", fontWeight: 600 }}>
                    {img.label}
                  </span>
                  <span
                    style={{
                      color: "#86656b",
                      fontWeight: 400,
                      marginLeft: 10,
                      fontSize: "0.99em",
                    }}
                  >
                    by {img.artist}
                  </span>
                </div>
                {/* Interactive controls: Like, Comment, Share */}
                <Controls img={img} isModal={false} />
                <CommentsBlock imgId={img.id} isModal={false} />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal (Lightbox gallery view) */}
      {modal.open && modal.img && (
        <div
          className="image-modal-backdrop"
          onClick={handleCloseModal}
        >
          <div
            className="image-modal"
            onClick={(e) => e.stopPropagation()}
            tabIndex={0}
            role="dialog"
            aria-modal="true"
            style={{ minWidth: 280 }}
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
                background: "#faf7f5",
              }}
              draggable={false}
            />
            <div className="image-modal__caption">
              <div style={{ fontWeight: 700 }}>{modal.img.label}</div>
              <div style={{ color: "#86656b", marginBottom: "0.35em" }}>
                by {modal.img.artist}
              </div>
              {/* Modal: interactive controls + comment list */}
              <Controls img={modal.img} isModal={true} />
              <CommentsBlock imgId={modal.img.id} isModal={true} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Portfolios;
