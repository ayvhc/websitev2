import { ArrowUpRight, Mail } from "lucide-react";
import { BlurIn } from "../components/BlurIn";
import { DockNav } from "../components/DockNav";

export default function ContactPage() {
  return (
    <main className="contact-shell">
      <section className="contact-stage" aria-labelledby="contact-title">
        <BlurIn>
          <p className="contact-eyebrow">Contact</p>
          <h1 id="contact-title">Get in Touch</h1>
          <p className="contact-intro">
            If you’re building something ambitious, early, or overlooked, I’d love
            to hear about it.
          </p>
        </BlurIn>

        <div className="contact-links">
          <a className="contact-link-row" href="mailto:adamchen1023@outlook.com">
            <span className="contact-link-icon" aria-hidden="true">
              <Mail />
            </span>
            <span className="contact-link-copy">
              <span>Email</span>
              <strong>adamchen1023@outlook.com</strong>
            </span>
            <ArrowUpRight className="contact-link-arrow" aria-hidden="true" />
          </a>
          <a
            className="contact-link-row"
            href="https://www.linkedin.com/in/ayvhc"
            target="_blank"
            rel="noreferrer"
            aria-label="Open LinkedIn profile"
          >
            <span className="contact-link-icon" aria-hidden="true">
              <span className="contact-link-monogram">in</span>
            </span>
            <span className="contact-link-copy">
              <span>LinkedIn</span>
              <strong>www.linkedin.com/in/ayvhc</strong>
            </span>
            <ArrowUpRight className="contact-link-arrow" aria-hidden="true" />
          </a>
        </div>
      </section>

      <DockNav current="Contact" />
    </main>
  );
}
