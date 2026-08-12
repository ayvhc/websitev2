import { DockNav } from "../components/DockNav";
import { ThemeToggle } from "../components/ThemeToggle";

export default function AboutPage() {
  return (
    <main className="about-shell">
      <ThemeToggle />
      <section className="about-placeholder">
        <h1>About</h1>
        <p>This page is coming next.</p>
      </section>
      <DockNav current="About" />
    </main>
  );
}
