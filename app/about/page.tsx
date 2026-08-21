import { DockNav } from "../components/DockNav";

export default function AboutPage() {
  return (
    <main className="about-shell">
      <section className="about-board-shell" aria-label="About mood board">
        <div className="about-empty-board">
          <div className="about-wide-frame">
            <img
              src="/images/tasm2-ticket.png"
              alt="A movie ticket for The Amazing Spider-Man 2, Yihung's favorite film"
            />
          </div>
          <div className="about-portrait-frame">
            <img src="/images/yihung-chen-portrait.jpg" alt="Yihung Chen portrait" />
          </div>
        </div>
      </section>
      <DockNav current="About" />
    </main>
  );
}
