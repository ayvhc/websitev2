"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BriefcaseBusiness,
  Compass,
  Home,
  Lightbulb,
  Mail,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

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
      "Creative robotics. Fewer barriers. More possibilities.",
    ],
  },
  {
    title: "How I invest:",
  },
  {
    title: "Without Being Asked",
    body: "What do you choose to build when nobody is pushing you—and how far will you take it?",
  },
  {
    title: "The Founder",
    body: "Can you sell fast, win customers, pivot quickly, thrive under pressure, lead a team, engineer creatively, and manage capital—or attract the people who can?",
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

type DockContextValue = {
  mouseX: MotionValue<number>;
};

const DockContext = createContext<DockContextValue | null>(null);
const dockSpring = { mass: 0.1, stiffness: 150, damping: 12 };

function Dock({ children }: { children: ReactNode }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <DockContext.Provider value={{ mouseX }}>
      <motion.nav
        className="dock"
        aria-label="Primary navigation"
        onMouseMove={(event) => mouseX.set(event.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {children}
      </motion.nav>
    </DockContext.Provider>
  );
}

function DockItem({ item }: { item: NavItem }) {
  const ref = useRef<HTMLButtonElement>(null);
  const context = useContext(DockContext);

  if (!context) throw new Error("DockItem must be used inside Dock");

  const distance = useTransform(context.mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return value - bounds.x - bounds.width / 2;
  });
  const size = useSpring(
    useTransform(distance, [-100, 0, 100], [40, 60, 40]),
    dockSpring,
  );
  const iconSize = useSpring(
    useTransform(distance, [-100, 0, 100], [20, 30, 20]),
    dockSpring,
  );
  const Icon = item.icon;

  return (
    <motion.button
      ref={ref}
      style={{ width: size, height: size }}
      className={`dock-item ${item.current ? "dock-item-current" : ""}`}
      type="button"
      aria-label={item.label}
      aria-current={item.current ? "page" : undefined}
    >
      <motion.span className="dock-icon" style={{ width: iconSize, height: iconSize }}>
        <Icon aria-hidden="true" strokeWidth={1.8} />
      </motion.span>
      <span className="dock-tooltip">{item.label}</span>
    </motion.button>
  );
}

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
                  <h1>{scene.title}</h1>
                  {Array.isArray(scene.body) ? (
                    scene.body.map((paragraph) => (
                      <p className="scene-body" key={paragraph}>
                        {paragraph}
                      </p>
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

      <div className="scroll-driver" ref={scrollRef} aria-label="About Yihung Chen">
        {scenes.map((scene, index) => (
          <div
            className="scroll-sentinel"
            data-scene={index}
            key={scene.title ?? "introduction"}
          />
        ))}
      </div>

      <div className="dock-wrap">
        <Dock>
          {navItems.map((item) => (
            <DockItem item={item} key={item.label} />
          ))}
        </Dock>
      </div>
    </main>
  );
}
