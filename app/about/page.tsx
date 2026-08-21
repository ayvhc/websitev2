import { DockNav } from "../components/DockNav";
import { IceWineReveal } from "./IceWineReveal";
import { MovieTicketFlip } from "./MovieTicketFlip";

export default function AboutPage() {
  return (
    <main className="about-shell">
      <section className="about-board-shell" aria-label="About mood board">
        <div className="about-empty-board">
          <div className="about-wide-frame">
            <MovieTicketFlip />
          </div>
          <IceWineReveal />
          <div className="about-portrait-frame">
            <img src="/images/yihung-chen-portrait.jpg" alt="Yihung Chen portrait" />
          </div>
        </div>
      </section>
      <DockNav current="About" />
    </main>
  );
}
