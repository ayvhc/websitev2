"use client";

import { useEffect, useRef, useState } from "react";
import { UserRound } from "lucide-react";
import { DockNav } from "./components/DockNav";

type Scene = {
  title?: string;
  body?: string | string[];
  intro?: string[];
};

const scenes: Scene[] = [
  {
    intro: [
      "Hi, I'm Yihung Chen.",
      "I'm an engineer, early-stage investor, and entrepreneur.",
      "Creative robotics. Less friction. More possibilities.",
    ],
  },
  { title: "How I invest:" },
  {
    title: "Without Being Asked",
    body: "What do you choose to build when nobody is pushing you—and how far will you take it?",
  },
  {
    title: "The Founder",
    body: "Can you sell fast, win customers, pivot quickly, thrive under pressure, lead a team, engineer creatively, and manage capital — or at least attract the people who can?",
  },
  {
    title: "The Team",
    body: "Great teams are built through complementary strengths, not duplicated talent.",
  },
  {
    title: "Pain Intensity",
    body: "The best solutions are pulled by pain, not pushed by novelty.",
  },
  {
    title: "The Rest of the Puzzle",
    body: "Traction, market, timing, and business model still matter. But I begin with people, because great companies start with great founders solving meaningful problems.",
  },
  {
    title: "Let’s Talk",
    body: [
      "Building something ambitious or unconventional? I’d love to hear about it.",
      "Reach out to exchange ideas, collaborate, challenge my thinking, or suggest what I should explore next.",
    ],
  },
];

function FounderVisual({ activeScene }: { activeScene: number }) {
  const phase =
    activeScene < 2
      ? "quiet"
      : activeScene === 2
        ? "individual"
        : activeScene === 3
          ? "founder"
          : activeScene === 4
            ? "team"
            : activeScene === 5
              ? "pain"
              : activeScene === 6
                ? "puzzle"
                : "empty";

  return (
    <aside className={`visual-stage visual-${phase}`} aria-hidden="true">
      <div className="visual-canvas">
        <div className="team-formation">
          {Array.from({ length: 2 }, (_, index) => (
            <div className={`team-member team-member-${index + 1}`} key={index}>
              <UserRound strokeWidth={1.35} />
            </div>
          ))}
        </div>

        <div className="wheel-scene">
          <span className="floor-line" />
          <div className="circle-wheel">
            <span className="morph-segment morph-segment-1" />
            <span className="morph-segment morph-segment-2" />
            <span className="morph-segment morph-segment-3" />
          </div>
          <div className="square-wheel" />
        </div>

        <div className="puzzle-loop">
          <svg className="puzzle-loop-svg" viewBox="150 150 180 190" role="presentation">
            <path className="puzzle-loop-piece puzzle-loop-piece-1" d="M168 178H240V205c12 0 12 18 0 18v27h-27c0-12-18-12-18 0h-27Z" />
            <path className="puzzle-loop-piece puzzle-loop-piece-2" d="M240 178H312V250h-27c0 12-18 12-18 0h-27v-27c12 0 12-18 0-18Z" />
            <path className="puzzle-loop-piece puzzle-loop-piece-3" d="M168 250h27c0-12 18-12 18 0h27v27c-12 0-12 18 0 18v27h-72Z" />
            <path className="puzzle-loop-piece puzzle-loop-piece-4" d="M240 250h27c0 12 18 12 18 0h27v72h-72v-27c-12 0-12-18 0-18Z" />
          </svg>
        </div>

        <div className="main-human">
          <UserRound strokeWidth={1.25} />
          <div className="radar-chart">
            <span className="radar-ring radar-ring-outer" />
            <span className="radar-ring radar-ring-inner" />
            <span className="radar-axis radar-axis-1" />
            <span className="radar-axis radar-axis-2" />
            <span className="radar-axis radar-axis-3" />
            <span className="radar-axis radar-axis-4" />
            <span className="radar-axis radar-axis-5" />
            <span className="radar-axis radar-axis-6" />
            <span className="radar-value" />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const sentinels = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveScene(Number((visible.target as HTMLElement).dataset.scene));
      },
      { root, threshold: [0.45, 0.6, 0.75] },
    );
    sentinels.forEach((sentinel) => observer.observe(sentinel));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="portfolio-shell">
      <div className="scene-stage" aria-live="polite">
        {scenes.map((scene, index) => {
          const state =
            index === activeScene ? "active" : index < activeScene ? "past" : "future";
          return (
            <section
              className={`scene scene-${state}`}
              key={scene.title ?? "introduction"}
              aria-hidden={index !== activeScene}
            >
              {scene.intro ? (
                <div className="intro-copy">
                  {scene.intro.map((line, lineIndex) => (
                    <p className={lineIndex === 0 ? "intro-name" : "intro-line"} key={line}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="principle-copy">
                  <h1>{scene.title}</h1>
                  {Array.isArray(scene.body) ? (
                    scene.body.map((paragraph) => (
                      <p className="scene-body" key={paragraph}>{paragraph}</p>
                    ))
                  ) : scene.body ? (
                    <p className="scene-body">{scene.body}</p>
                  ) : null}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <FounderVisual activeScene={activeScene} />

      <div className="scroll-driver" ref={scrollRef} aria-label="Home">
        {scenes.map((scene, index) => (
          <div className="scroll-sentinel" data-scene={index} key={scene.title ?? "introduction"} />
        ))}
      </div>

      <DockNav current="Home" />
    </main>
  );
}
