"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import {
  Bike,
  Dumbbell,
  Film,
  Footprints,
  Globe2,
  MapPin,
  MountainSnow,
  Plane,
  Trophy,
  Wine,
} from "lucide-react";
import { DockNav } from "../components/DockNav";

const flipCards = [
  {
    id: "ticket",
    className: "about-ticket-card",
    front: (
      <>
        <p className="mood-eyebrow">Favorite movie</p>
        <div className="ticket-face">
          <span className="ticket-stub">ADMIT ONE</span>
          <h2>The Amazing Spider-Man 2</h2>
          <p>rewatched for the feeling, not just the plot</p>
        </div>
      </>
    ),
    back: (
      <>
        <p className="mood-eyebrow">TASM1 quote</p>
        <blockquote>
          Send me the exact line and I’ll place it here — centered like the back
          of a movie ticket.
        </blockquote>
      </>
    ),
  },
  {
    id: "icewine",
    className: "about-wine-card",
    front: (
      <>
        <Wine aria-hidden="true" />
        <p className="mood-eyebrow">Favorite drink</p>
        <h2>Ice Wine</h2>
      </>
    ),
    back: (
      <>
        <p className="mood-eyebrow">From Canada</p>
        <p>
          Sweet, cold, precise — the kind of detail that makes a small moment feel
          designed.
        </p>
      </>
    ),
  },
  {
    id: "places",
    className: "about-places-card",
    front: (
      <>
        <Globe2 aria-hidden="true" />
        <p className="mood-eyebrow">Places I’ve lived</p>
        <h2>Many homes, one map.</h2>
      </>
    ),
    back: (
      <>
        <p className="mood-eyebrow">Taiwan · Shanghai · Shenzhen · UIUC</p>
        <p>Ho Chi Minh · Indonesia · Beijing — and the spaces in between.</p>
      </>
    ),
  },
];

const sports = [
  { label: "Basketball", icon: Trophy },
  { label: "Running", icon: Footprints },
  { label: "Gym", icon: Dumbbell },
  { label: "Cycling", icon: Bike },
  { label: "Skiing", icon: MountainSnow },
];

function FlipCard({
  id,
  className,
  front,
  back,
}: {
  id: string;
  className: string;
  front: ReactNode;
  back: ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      className={`mood-card mood-flip-card ${className} ${flipped ? "is-flipped" : ""}`}
      type="button"
      aria-pressed={flipped}
      aria-label={`Flip ${id} card`}
      onClick={() => setFlipped((current) => !current)}
    >
      <span className="mood-card-inner">
        <span className="mood-card-face mood-card-front">{front}</span>
        <span className="mood-card-face mood-card-back">{back}</span>
      </span>
    </button>
  );
}

function SpiderMark() {
  return (
    <div className="spider-mark" aria-hidden="true">
      <span className="spider-body" />
      <span className="spider-leg spider-leg-1" />
      <span className="spider-leg spider-leg-2" />
      <span className="spider-leg spider-leg-3" />
      <span className="spider-leg spider-leg-4" />
      <span className="spider-leg spider-leg-5" />
      <span className="spider-leg spider-leg-6" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="about-shell">
      <section className="about-board" aria-labelledby="about-title">
        <div className="mood-card about-title-card">
          <p className="mood-eyebrow">About</p>
          <h1 id="about-title">A board of things that keep showing up.</h1>
          <p>
            Movement, cities, films, machines, taste, and a soft spot for people
            who start before anyone tells them to.
          </p>
        </div>

        <div className="mood-card about-photo-card" aria-label="Portrait placeholder">
          <div className="photo-placeholder">
            <span>YC</span>
          </div>
          <p>Portrait goes here.</p>
        </div>

        {flipCards.map((card) => (
          <FlipCard
            key={card.id}
            id={card.id}
            className={card.className}
            front={card.front}
            back={card.back}
          />
        ))}

        <div className="mood-card about-spider-card">
          <p className="mood-eyebrow">A small cinematic obsession</p>
          <SpiderMark />
          <p>Spider-inspired, not too loud.</p>
        </div>

        <div className="mood-card about-sports-card">
          <p className="mood-eyebrow">Sports</p>
          <div className="sports-orbit" aria-label="Sports I play">
            {sports.map((sport, index) => {
              const Icon = sport.icon;
              return (
                <span
                  className="sport-node"
                  key={sport.label}
                  style={{ "--sport-index": index } as CSSProperties}
                  title={sport.label}
                >
                  <Icon aria-hidden="true" />
                </span>
              );
            })}
            <span className="sports-center">all kinds</span>
          </div>
        </div>

        <div className="mood-card about-robotics-card">
          <p className="mood-eyebrow">Robotics</p>
          <h2>Creative machines, less friction.</h2>
          <div className="robot-sketch" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="mood-card about-note-card">
          <p className="mood-eyebrow">A pattern I like</p>
          <h2>Without being asked.</h2>
          <p>That’s still one of the clearest signals I trust.</p>
        </div>

        <div className="mood-card about-route-card">
          <Plane aria-hidden="true" />
          <MapPin aria-hidden="true" />
          <p>Still collecting places, stories, and strange little ideas.</p>
        </div>
      </section>
      <DockNav current="About" />
    </main>
  );
}
