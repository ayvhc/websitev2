"use client";

import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Compass,
  Home,
  Lightbulb,
  Mail,
  type LucideIcon,
} from "lucide-react";

type Scene = {
  eyebrow?: string;
  title?: string;
  body?: string;
  intro?: string[];
};

const scenes: Scene[] = [
  {
    intro: [
      "Hi, I'm Yihung Chen.",
      "I'm an engineer, early-stage investor, and entrepreneur.",
      "tbd",
    ],
  },
  {
    eyebrow: "01",
    title: "Without Being Asked",
    body: "At the earliest stage, I pay close attention to what someone chooses to do when nobody is pushing them. The problems they pursue, the direction they take, and how consistently they keep moving reveal far more than any pitch ever could.",
  },
  {
    eyebrow: "02",
    title: "The Founder",
    body: "Before investing in a company, I'm investing in a person. I try to understand their strengths, blind spots, and how they naturally approach difficult problems.",
  },
  {
    eyebrow: "03",
    title: "The Team",
    body: "A great founder can start a company, but a great team is what gives it the best chance to succeed. I look for teams whose strengths complement one another instead of overlapping.",
  },
  {
    eyebrow: "04",
    title: "Pain Intensity",
    body: "A great solution isn't enough if the problem isn't painful enough. I spend just as much time understanding how deeply customers need a solution as I do evaluating the people building it.",
  },
  {
    eyebrow: "05",
    title: "The Rest of the Puzzle",
    body: "Traction, product-market fit, market size, timing, distribution, business model, and everything else still matter—they're the fundamentals of investing. My philosophy simply begins with people, because I believe great companies are ultimately built by great founders solving meaningful problems.",
  },
];

type NavItem = {
  label: string;
  icon: LucideIcon;
  current?: boolean;
};

const navItems: NavItem[] = [
  { label: "About", icon: Home, current: true },
  { label: "Investment Philosophy", icon: Lightbulb },
  { label: "Experience", icon: BriefcaseBusiness },
  { label: "Journey", icon: Compass },
  { label: "Contact", icon: Mail },
];

export default function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const sentinels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-scene]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveScene(Number((visible.target as HTMLElement).dataset.scene));
        }
      },
      { root, threshold: [0.45, 0.6, 0.75] },
    );

    sentinels.forEach((sentinel) => observer.observe(sentinel));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="portfolio-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="brand-mark" aria-label="Yihung Chen">
        YC
      </div>

      <div className="scene-stage" aria-live="polite">
        {scenes.map((scene, index) => {
          const state =
            index === activeScene
              ? "active"
              : index < activeScene
                ? "past"
                : "future";

          return (
            <section
              className={`scene scene-${state}`}
              key={scene.title ?? "introduction"}
              aria-hidden={index !== activeScene}
            >
              {scene.intro ? (
                <div className="intro-copy">
                  {scene.intro.map((line, lineIndex) => (
                    <p
                      className={lineIndex === 0 ? "intro-name" : "intro-line"}
                      key={line}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="principle-copy">
                  <p className="scene-number">{scene.eyebrow}</p>
                  <h1>{scene.title}</h1>
                  <p className="scene-body">{scene.body}</p>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="scene-counter" aria-hidden="true">
        <span>{String(activeScene + 1).padStart(2, "0")}</span>
        <span className="counter-line" />
        <span>{String(scenes.length).padStart(2, "0")}</span>
      </div>

      <p className={`scroll-hint ${activeScene > 0 ? "scroll-hint-hidden" : ""}`}>
        Scroll to explore
      </p>

      <div className="scroll-driver" ref={scrollRef} aria-label="About Yihung Chen">
        {scenes.map((scene, index) => (
          <div
            className="scroll-sentinel"
            data-scene={index}
            key={scene.title ?? "introduction"}
          />
        ))}
      </div>

      <nav className="dock" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={`dock-item ${item.current ? "dock-item-current" : ""}`}
              key={item.label}
              type="button"
              aria-label={item.label}
              aria-current={item.current ? "page" : undefined}
            >
              <Icon aria-hidden="true" strokeWidth={1.7} />
              <span className="dock-tooltip">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </main>
  );
}
