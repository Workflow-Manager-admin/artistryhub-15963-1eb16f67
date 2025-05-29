import React from "react";

/**
 * PortfolioGrid
 * Visually attractive grid placeholder for artist portfolios & marketplace items.
 * Uses elegant maroon, gold, and white theming.
 */
// PUBLIC_INTERFACE
function PortfolioGrid() {
  // Placeholder data for portfolios and marketplace
  const gridItems = [
    { type: "portfolio", label: "Artist Portfolio", key: 1 },
    { type: "marketplace", label: "Marketplace Item", key: 2 },
    { type: "portfolio", label: "Artist Portfolio", key: 3 },
    { type: "marketplace", label: "Marketplace Item", key: 4 },
    { type: "portfolio", label: "Artist Portfolio", key: 5 },
    { type: "marketplace", label: "Marketplace Item", key: 6 }
  ];

  return (
    <section className="grid portfolio-grid" id="portfolios">
      <h2 className="grid__title">Portfolio &amp; Marketplace</h2>
      <div className="portfolio-grid__container">
        {gridItems.map((item) => (
          <div key={item.key}
               className={`portfolio-card portfolio-card--${item.type} card card--placeholder`}>
            <div className="portfolio-card__image" />
            <div className="portfolio-card__label">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PortfolioGrid;
