import { DockNav } from "../components/DockNav";

export default function ContactPage() {
  return (
    <main className="contact-shell">
      <section className="contact-stage" aria-labelledby="contact-title">
        <p className="contact-eyebrow">Contact</p>
        <h1 id="contact-title">Let’s start a conversation.</h1>
        <p className="contact-intro">
          Building something ambitious or unconventional? Have an idea worth
          challenging, exploring, or building together? I’d love to hear from you.
        </p>

        <div className="contact-primary">
          <span>Email</span>
          <a href="mailto:adamchen1023@outlook.com">
            adamchen1023@outlook.com
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="contact-socials" aria-label="Social links">
          <button type="button" aria-label="LinkedIn link coming soon">
            LinkedIn
            <span aria-hidden="true">↗</span>
          </button>
          <button type="button" aria-label="X link coming soon">
            X
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>

      <DockNav current="Contact" />
    </main>
  );
}
