"use client";

import Link from "next/link";
import {
  createContext,
  useEffect,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import {
  BriefcaseBusiness,
  Home,
  Lightbulb,
  Mail,
  Moon,
  Sun,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
};

const navItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Investment", icon: Lightbulb, href: "/investment" },
  { label: "Experience", icon: BriefcaseBusiness, href: "/experience" },
  { label: "About", icon: UserRound, href: "/about" },
  { label: "Contact", icon: Mail, href: "/contact" },
];

const DockContext = createContext<{ mouseX: MotionValue<number> } | null>(null);
const dockSpring = { mass: 0.1, stiffness: 150, damping: 12 };
const themeStorageKey = "yihung-theme";

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

function DockItem({ item, current }: { item: NavItem; current: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
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
  const content = (
    <>
      <motion.span className="dock-icon" style={{ width: iconSize, height: iconSize }}>
        <Icon aria-hidden="true" strokeWidth={1.8} />
      </motion.span>
      <span className="dock-tooltip">{item.label}</span>
    </>
  );

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      className={`dock-item ${current ? "dock-item-current" : ""}`}
    >
      {item.href ? (
        <Link
          className="dock-control"
          href={item.href}
          aria-label={item.label}
          aria-current={current ? "page" : undefined}
        >
          {content}
        </Link>
      ) : (
        <button className="dock-control" type="button" aria-label={item.label}>
          {content}
        </button>
      )}
    </motion.div>
  );
}

function DockThemeToggle() {
  const ref = useRef<HTMLDivElement>(null);
  const context = useContext(DockContext);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  if (!context) throw new Error("DockThemeToggle must be used inside Dock");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
  }, []);

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
  const Icon = theme === "dark" ? Sun : Moon;
  const label = theme === "dark" ? "Light mode" : "Dark mode";

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem(themeStorageKey, nextTheme);
  }

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      className="dock-item dock-theme-item"
    >
      <button
        className="dock-control"
        type="button"
        aria-label={label}
        onClick={toggleTheme}
      >
        <motion.span className="dock-icon" style={{ width: iconSize, height: iconSize }}>
          <Icon aria-hidden="true" strokeWidth={1.8} />
        </motion.span>
        <span className="dock-tooltip">{label}</span>
      </button>
    </motion.div>
  );
}

export function DockNav({ current }: { current: "Home" | "About" | "Investment" | "Experience" | "Contact" }) {
  return (
    <div className="dock-wrap">
      <Dock>
        {navItems.map((item) => (
          <DockItem item={item} current={item.label === current} key={item.label} />
        ))}
        <DockThemeToggle />
      </Dock>
    </div>
  );
}
