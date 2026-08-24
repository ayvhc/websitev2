"use client";

import { useState } from "react";

export function IceWineReveal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`about-ice-wine${isOpen ? " is-open" : ""}`}>
      <button
        type="button"
        className="about-ice-wine-button"
        aria-expanded={isOpen}
        aria-controls="ice-wine-note"
        aria-label={isOpen ? "Hide ice wine details" : "Show ice wine details"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <img
          src="/images/ice-wine-minimal.png"
          alt="A minimal drawing of golden Canadian ice wine"
        />
      </button>

      <div
        id="ice-wine-note"
        className="about-ice-wine-note"
        aria-hidden={!isOpen}
      >
        <span>Favorite drink</span>
        <strong>Ice Wine</strong>
        <p>Canadian winter-frozen grapes pressed into liquid gold, naturally sweet and warm. I absolutely LOVE it.</p>
      </div>
    </div>
  );
}
