import { DockNav } from "../components/DockNav";

export default function AboutPage() {
  return (
    <main className="about-shell">
      <section className="about-placeholder">
        <h1>About</h1>
        <p>This page is coming next.</p>
      </section>
      <DockNav current="About" />
    </main>
  );
}
