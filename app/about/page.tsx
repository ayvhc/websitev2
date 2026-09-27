import Image from "next/image";
import { DockNav } from "../components/DockNav";
import { IceWineReveal } from "./IceWineReveal";
import { MovieTicketFlip } from "./MovieTicketFlip";
import { TravelMap } from "./TravelMap";

export default function AboutPage() {
  return (
    <main className="about-shell">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-hero-copy">
          <h1 id="about-hero-title">About Me.</h1>
          <p className="about-hero-intro">
            <span>Everyone calls me Adam.</span>
            <span>I like robotics. I like helping people.</span>
            <span>My favorite color is blue.</span>
            <span>I’m not fond of cucumbers.</span>
            <span>
              I’m scared of butterflies, but that won’t stop me from someday building
              robots that help people do things they never thought possible.
            </span>
          </p>
        </div>

      </section>

      <section id="about-board" className="about-board-shell" aria-label="About mood board">
        <div className="about-empty-board">
          <div className="about-wide-frame">
            <MovieTicketFlip />
          </div>
          <div className="about-dachshund">
            <Image
              className="about-dachshund-resting"
              src="/images/dachshund-baguette.png"
              alt="A hand-drawn dachshund wearing a beret and holding a baguette"
              width={1536}
              height={1024}
            />
            <Image
              className="about-dachshund-surprised"
              src="/images/dachshund-surprised.png"
              alt="The surprised dachshund dropping its baguette"
              width={1536}
              height={1024}
            />
            <button
              type="button"
              className="about-dachshund-hitbox"
              aria-label="Hover to surprise the dachshund"
            />
          </div>
          <TravelMap />
          <IceWineReveal />
          <div className="about-portrait-frame">
            <Image
              src="/images/yihung-chen-portrait.jpg"
              alt="Yihung Chen portrait"
              width={2287}
              height={4360}
            />
          </div>
        </div>
      </section>
      <DockNav current="About" />
    </main>
  );
}
