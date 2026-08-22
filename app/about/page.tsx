import { DockNav } from "../components/DockNav";
import { IceWineReveal } from "./IceWineReveal";
import { MovieTicketFlip } from "./MovieTicketFlip";

export default function AboutPage() {
  return (
    <main className="about-shell">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero-copy">
          <h1 id="about-hero-title">About Me.</h1>
          <p className="about-hero-intro">
            I&apos;m Yihung — an engineer, early-stage investor, and entrepreneur
            shaped by the people, places, and ideas I&apos;ve encountered along the way.
          </p>
          <p className="about-hero-detail">
            Beyond building and investing, I&apos;m drawn to stories, movement, and the
            small details that make a life feel distinctly your own.
          </p>
        </div>

      </section>

      <section id="about-board" className="about-board-shell" aria-label="About mood board">
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
