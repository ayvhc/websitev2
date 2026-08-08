"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
} from "react";
import {
  BriefcaseBusiness,
  Compass,
  Home,
  Lightbulb,
  Mail,
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
  { label: "About", icon: UserRound, href: "/about" },
  { label: "Investment", icon: Lightbulb, href: "/investment" },
  { label: "Experience", icon: BriefcaseBusiness, href: "/experience" },
  { label: "Journey", icon: Compass, href: "/journey" },
  { label: "Contact", icon: Mail, href: "/contact" },
];

const DockContext = createContext<{ mouseX: MotionValue<number> } | null>(null);
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
        <a
          className="dock-control"
          href={item.href}
          aria-label={item.label}
          aria-current={current ? "page" : undefined}
        >
          {content}
        </a>
      ) : (
        <button className="dock-control" type="button" aria-label={item.label}>
          {content}
        </button>
      )}
    </motion.div>
  );
}

export function DockNav({ current }: { current: "Home" | "About" | "Investment" | "Experience" | "Journey" | "Contact" }) {
  return (
    <div className="dock-wrap">
      <Dock>
        {navItems.map((item) => (
          <DockItem item={item} current={item.label === current} key={item.label} />
        ))}
      </Dock>
    </div>
  );
}
