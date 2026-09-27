"use client";

import Image from "next/image";
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
          <Image
            src="/images/tasm2-ticket.png"
            alt="A movie ticket for The Amazing Spider-Man 2, Yihung's favorite film"
            width={1717}
            height={916}
          />
        </span>

        <span className="about-ticket-face about-ticket-back">
          <Image
            src="/images/tasm2-ticket-back.png"
            alt=""
            aria-hidden="true"
            width={1729}
            height={910}
          />
          <span className="about-ticket-quote">
            <q>{quote}</q>
            <cite>— Uncle Ben</cite>
          </span>
        </span>
      </span>
    </button>
  );
}
