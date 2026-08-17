import { DockNav } from "../components/DockNav";

export default function AboutPage() {
  return (
    <main className="about-shell">
      <section className="about-board-shell" aria-label="About mood board">
        <div className="about-empty-board" />
      </section>
      <DockNav current="About" />
    </main>
  );
}
