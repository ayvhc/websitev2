"use client";

import { useState } from "react";

const quote =
  "If you could do good things for other people, you have a moral obligation to do those things. Not choices. Responsibilities.";

export function MovieTicketFlip() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <button
      type="button"
      className={`about-ticket-button${isFlipped ? " is-flipped" : ""}`}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? "Show the movie ticket front" : "Reveal Uncle Ben's quote"}
      onClick={() => setIsFlipped((current) => !current)}
    >
      <span className="about-ticket-inner">
        <span className="about-ticket-face about-ticket-front">
          <img
            src="/images/tasm2-ticket.png"
            alt="A movie ticket for The Amazing Spider-Man 2, Yihung's favorite film"
          />
        </span>

        <span className="about-ticket-face about-ticket-back">
          <img src="/images/tasm2-ticket-back.png" alt="" aria-hidden="true" />
          <span className="about-ticket-quote">
            <q>{quote}</q>
            <cite>— Uncle Ben</cite>
          </span>
        </span>
      </span>
    </button>
  );
}
