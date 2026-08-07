"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { DockNav } from "../components/DockNav";

const investmentSections = [
  {
    title: "Investment",
    content: (
      <p>I started with short-dated options. Now, I invest in early-stage startups.</p>
    ),
  },
  {
    content: (
      <p>
        I’m part of N1AC, an angel collective that hosts six highly selective live
        pitches each month, often featuring founders from Stanford, UC Berkeley,
        MIT, Harvard, Peking University, and Tsinghua University.
      </p>
    ),
  },
  {
    title: "Personal Investments",
    content: (
      <div className="investment-list">
        <a
          className="investment-link"
          href="https://semivalley.co/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>SemiValley</h2>
          <p>AI infrastructure cooling</p>
        </a>
        <a
          className="investment-link"
          href="https://www.heytenda.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>Tenda</h2>
          <p>AI for construction</p>
        </a>
      </div>
    ),
  },
  {
    title: "Let’s Connect",
    content: (
      <>
        <p>
          Building something others do not believe in yet? Starting earlier than
          people expect? Seeing a problem most have overlooked?
        </p>
        <p>I’d love to hear what you’re working on.</p>
      </>
    ),
  },
];

export default function InvestmentPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const sentinels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-investment-section]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveSection(
            Number((visible.target as HTMLElement).dataset.investmentSection),
          );
        }
      },
      { root, threshold: [0.45, 0.6, 0.75] },
    );

    sentinels.forEach((sentinel) => observer.observe(sentinel));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="investment-shell">
      <div className="investment-scene-stage" aria-live="polite">
        {investmentSections.map((section, index) => (
          <section
            className={`investment-scene ${index === activeSection ? "investment-scene-active" : ""}`}
            style={{
              "--investment-shift": `${(index - activeSection) * 18}rem`,
            } as CSSProperties}
            aria-hidden={index !== activeSection}
            key={section.title ?? "N1AC"}
          >
            <div className="investment-copy">
              {section.title ? <h1>{section.title}</h1> : null}
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <div className="scroll-driver" ref={scrollRef} aria-label="Investment">
        {investmentSections.map((section, index) => (
          <div
            className="scroll-sentinel"
            data-investment-section={index}
            key={section.title ?? "N1AC"}
          />
        ))}
      </div>

      <DockNav current="Investment" />
    </main>
  );
}
