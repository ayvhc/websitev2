"use client";

import { useEffect, useRef, useState } from "react";
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
        <div>
          <h2>SemiValley</h2>
          <p>AI infrastructure cooling</p>
        </div>
        <div>
          <h2>Tenda</h2>
          <p>AI for construction</p>
        </div>
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
  const activeSectionRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const wheelReleaseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-investment-section]"),
    );

    const selectSection = (index: number) => {
      const nextIndex = Math.max(0, Math.min(sections.length - 1, index));
      const target = sections[nextIndex];
      const targetTop =
        target.offsetTop - (root.clientHeight - target.offsetHeight) / 2;

      activeSectionRef.current = nextIndex;
      setActiveSection(nextIndex);
      root.scrollTo({ top: targetTop, behavior: "smooth" });
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < 4) return;
      event.preventDefault();

      if (wheelReleaseRef.current) clearTimeout(wheelReleaseRef.current);

      if (!wheelLockedRef.current) {
        wheelLockedRef.current = true;
        selectSection(activeSectionRef.current + (event.deltaY > 0 ? 1 : -1));
      }

      wheelReleaseRef.current = setTimeout(() => {
        wheelLockedRef.current = false;
      }, 260);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (wheelLockedRef.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const nextIndex = Number(
            (visible.target as HTMLElement).dataset.investmentSection,
          );
          activeSectionRef.current = nextIndex;
          setActiveSection(nextIndex);
        }
      },
      {
        root,
        rootMargin: "-30% 0px -30% 0px",
        threshold: [0.1, 0.35, 0.65],
      },
    );

    sections.forEach((section) => observer.observe(section));
    root.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      observer.disconnect();
      root.removeEventListener("wheel", handleWheel);
      if (wheelReleaseRef.current) clearTimeout(wheelReleaseRef.current);
    };
  }, []);

  return (
    <main className="investment-shell">
      <div className="investment-scroll" ref={scrollRef}>
        <div className="investment-lyrics">
          {investmentSections.map((section, index) => (
            <section
              className={`investment-section ${index === activeSection ? "investment-section-active" : ""}`}
              data-investment-section={index}
              key={section.title ?? "N1AC"}
            >
              <div className="investment-copy">
                {section.title ? <h1>{section.title}</h1> : null}
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>

      <DockNav current="Investment" />
    </main>
  );
}
