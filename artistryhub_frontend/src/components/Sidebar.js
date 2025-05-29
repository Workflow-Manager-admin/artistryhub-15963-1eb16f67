import React from "react";

/**
 * Sidebar component for ArtistryHub.
 * Sections: Behind-the-Scenes Stories, Custom Orders, Messaging.
 * Elegant maroon, white, and gold theming consistent with the ArtistryHub brand.
 */
// PUBLIC_INTERFACE
function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Stories Section */}
      <section className="sidebar__section sidebar__stories" id="stories">
        <h3 className="sidebar__title">Behind-the-Scenes Stories</h3>
        <div className="sidebar__placeholder">
          [ Stories Placeholder ]
        </div>
      </section>
      {/* Custom Orders Section */}
      <section className="sidebar__section sidebar__custom-orders" id="custom-orders">
        <h3 className="sidebar__title">Custom Orders</h3>
        <div className="sidebar__placeholder">
          [ Custom Orders Placeholder ]
        </div>
      </section>
      {/* Messaging Section */}
      <section className="sidebar__section sidebar__messaging" id="messages">
        <h3 className="sidebar__title">Messaging</h3>
        <div className="sidebar__placeholder">
          [ Messaging System Placeholder ]
        </div>
      </section>
    </aside>
  );
}

export default Sidebar;
