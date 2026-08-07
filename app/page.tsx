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
      "I'm an Engineer, Early-stage Investor, and Entrepreneur.",
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
    body: [
      "Can you sell fast, win customers, pivot quickly, thrive under pressure, lead a team, engineer creatively, and manage capital?",
      "Or at least attract the people who can?",
    ],
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
      "Building something ambitious or unconventional?",
      "I’d love to hear about it.",
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
          <svg className="puzzle-loop-svg" viewBox="150 160 180 180" role="presentation">
            <g className="puzzle-loop-shape">
              <path className="puzzle-loop-piece puzzle-loop-piece-1" d="M240 180h-52q-18 0-18 18v52h35c0-12 18-12 18 0h17v-28c12 0 12-18 0-18Z" />
              <path className="puzzle-loop-piece puzzle-loop-piece-2" d="M240 180h52q18 0 18 18v52h-35c0 12-18 12-18 0h-17v-28c12 0 12-18 0-18Z" />
              <path className="puzzle-loop-piece puzzle-loop-piece-3" d="M170 250v52q0 18 18 18h52v-42c-12 0-12-18 0-18v-10h-17c0-12-18-12-18 0Z" />
              <path className="puzzle-loop-piece puzzle-loop-piece-4" d="M240 250h17c0 12 18 12 18 0h35v52q0 18-18 18h-52v-42c-12 0-12-18 0-18Z" />
            </g>
            <g className="puzzle-click-lines">
              <line x1="178" y1="188" x2="166" y2="176" />
              <line x1="240" y1="174" x2="240" y2="160" />
              <line x1="302" y1="188" x2="314" y2="176" />
              <line x1="316" y1="250" x2="330" y2="250" />
              <line x1="302" y1="312" x2="314" y2="324" />
              <line x1="240" y1="326" x2="240" y2="340" />
              <line x1="178" y1="312" x2="166" y2="324" />
              <line x1="164" y1="250" x2="150" y2="250" />
            </g>
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
