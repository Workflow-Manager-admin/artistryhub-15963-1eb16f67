import React from "react";

// PUBLIC_INTERFACE
/**
 * HeroSection component for ArtistryHub.
 * Showcases featured artworks and an intro to the gallery,
 * using the brand's maroon, white, and gold palette.
 */
function HeroSection() {
  return (
    <section className="hero artistry-hero">
      <div className="artistry-hero__intro">
        <span className="subtitle artistry-hero__subtitle">
          Celebrating Creativity
        </span>
        <h1 className="title artistry-hero__title">
          Discover Featured Artworks
        </h1>
        <div className="description artistry-hero__description">
          Explore a curated selection of trending crafts and artistic masterpieces. Dive into unique styles, connect with creators, and let inspiration find you.
        </div>
        <button className="btn btn-large btn--gold artistry-hero__cta">
          Explore Gallery
        </button>
      </div>
      <div className="artistry-hero__gallery-intro">
        <div className="artistry-hero__thumbnails">
          {/* Gallery placeholders - replace with dynamic images later */}
          <figure className="artistry-hero__thumb">
            <img
              src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=80"
              alt="Abstract Painting"
            />
            <figcaption>
              Abstract<span className="thumb-dot">•</span>
            </figcaption>
          </figure>
          <figure className="artistry-hero__thumb">
            <img
              src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80"
              alt="Handmade Ceramics"
            />
            <figcaption>
              Ceramics<span className="thumb-dot">•</span>
            </figcaption>
          </figure>
          <figure className="artistry-hero__thumb">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=200&q=80"
              alt="Illustration"
            />
            <figcaption>
              Illustration<span className="thumb-dot">•</span>
            </figcaption>
          </figure>
          <figure className="artistry-hero__thumb">
            <img
              src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=200&q=80"
              alt="Woodcraft"
            />
            <figcaption>
              Woodcraft
            </figcaption>
          </figure>
        </div>
        <div className="artistry-hero__gallery-desc">
          <span>
            Trending: <b>Abstracts</b>, <b>Ceramics</b>, <b>Illustration</b>, <b>Woodcraft</b>
          </span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
