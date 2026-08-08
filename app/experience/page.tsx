import { DockNav } from "../components/DockNav";

type ExperienceItem = {
  mark: string;
  organization: string;
  role: string;
  location: string;
  dates: string;
  description: string;
};

const professionalExperience: ExperienceItem[] = [
  {
    mark: "N1",
    organization: "N1AC",
    role: "Angel Investor · Partner",
    location: "Hybrid, U.S.",
    dates: "Feb 2026 — Present",
    description:
      "Source and evaluate early-stage startups alongside former YC China founding-team member Kehan Dong. Reviewed 200+ pitches across founder quality, differentiation, market, traction, competition, and risk; support selected founders with diligence, positioning, fundraising strategy, and introductions.",
  },
  {
    mark: "IVY",
    organization: "IVY Capital",
    role: "VC Analyst Intern",
    location: "Shanghai, China",
    dates: "Jun 2026 — Jul 2026",
    description:
      "Led a four-person investment study on space data centers and presented the findings at the firm’s quarterly meeting. Evaluated 30+ startups, advanced three to senior-investor meetings, and received the firm’s Most Practical AI Award for an investor-relationship tracking agent.",
  },
  {
    mark: "PwC",
    organization: "PwC",
    role: "Business Consulting Intern",
    location: "Hybrid, China",
    dates: "Jun 2026 — Jul 2026",
    description:
      "Analyzed a Chinese OTC pharmaceutical company’s business model, portfolio, financial performance, competition, and risks. Developed a nationwide expansion strategy spanning distribution, pharmacies, e-commerce, O2O delivery, positioning, compliance, and CRM digitalization.",
  },
  {
    mark: "AZ",
    organization: "Azura de Maison",
    role: "Co-founder",
    location: "Illinois, U.S.",
    dates: "Sep 2025 — Present",
    description:
      "Launched UIUC’s first premium online bouquet brand. Generated approximately $2.7K in revenue and $1K+ in profit during a 30-hour Valentine’s Day campaign, with a 71% inquiry-to-purchase conversion rate.",
  },
  {
    mark: "H",
    organization: "Hennecke GmbH",
    role: "Rotational Intern",
    location: "Sankt Augustin, Germany",
    dates: "Jul 2025 — Aug 2025",
    description:
      "Rotated through engineering, production, R&D, sales, and ESG. Supported precision testing, machining, CNC operations, circuit assembly, predictive maintenance, and modular production-line projects.",
  },
  {
    mark: "UBS",
    organization: "UBS LEADS",
    role: "Event Host",
    location: "Hong Kong, China",
    dates: "Jun 2024",
    description:
      "Emceed and coordinated the 2024 UBS LEADS Graduation Ceremony for 300+ executives, regional directors, and students, facilitating conversations on entrepreneurship, strategy, and business management.",
  },
];

const researchExperience: ExperienceItem[] = [
  {
    mark: "AI",
    organization: "University of Illinois Urbana-Champaign",
    role: "Paid Data Analyst · AI Data for Autism Research",
    location: "Illinois, U.S.",
    dates: "Oct 2024 — May 2025",
    description:
      "Analyzed 10,000+ video frames of children’s gaze patterns, processed datasets in CVAT, and supported AI model training for autism-severity classification and early-detection research.",
  },
  {
    mark: "CAS",
    organization: "Chinese Academy of Sciences",
    role: "Research Intern · Computer Network Information Center",
    location: "Beijing, China",
    dates: "Jun 2025 — Jul 2025",
    description:
      "Built a relational SQL database linking professors, papers, and institutions. Automated annual reporting for 107 institutes and developed a Python PDF comparison tool for contract auditing.",
  },
  {
    mark: "GL",
    organization: "Gazzola Lab · UIUC",
    role: "Researcher · Advanced Molds for Soft Robotic Structures",
    location: "Illinois, U.S.",
    dates: "Sep 2024 — May 2025",
    description:
      "Designed and fabricated molds for air-pressure-driven soft robotic actuators, improving the functionality and control of robotic fingers while exploring more flexible, dexterous actuator geometries.",
  },
];

const education = [
  {
    mark: "UI",
    school: "University of Illinois Urbana-Champaign",
    program: "B.S. Systems Engineering · Minor in Business · GPA 3.83",
    location: "Illinois, U.S.",
    dates: "Sep 2024 — Expected May 2028",
  },
  {
    mark: "SAS",
    school: "Singapore American School",
    program: "High School Diploma",
    location: "Singapore",
    dates: "Sep 2020 — Jun 2024",
  },
];

const skillGroups = [
  {
    label: "Programming & Data",
    skills: ["Python", "SQL", "Java", "C++", "Data automation", "Relational databases"],
  },
  {
    label: "Engineering",
    skills: ["SolidWorks", "Fusion 360", "Arduino", "CNC machining", "3D printing", "Electronics prototyping"],
  },
  {
    label: "Languages",
    skills: ["English", "Chinese", "Taiwanese"],
  },
];

function ExperienceRow({ item }: { item: ExperienceItem }) {
  return (
    <article className="experience-row">
      <div className="experience-mark" aria-hidden="true">{item.mark}</div>
      <div className="experience-entry">
        <div className="experience-heading">
          <div>
            <h2>{item.organization}</h2>
            <p className="experience-role">{item.role}</p>
          </div>
          <div className="experience-meta">
            <time>{item.dates}</time>
            <span>{item.location}</span>
          </div>
        </div>
        <p className="experience-description">{item.description}</p>
      </div>
    </article>
  );
}

export default function ExperiencePage() {
  return (
    <main className="experience-shell">
      <div className="experience-scroll">
        <div className="experience-page">
          <header className="experience-intro">
            <p className="experience-eyebrow">Experience</p>
            <h1>Investing, building, and engineering across disciplines.</h1>
            <p>
              My work sits at the intersection of early-stage investing, business
              strategy, technical research, and hands-on engineering.
            </p>
          </header>

          <section className="experience-section">
            <h2 className="experience-section-title">Professional Experience</h2>
            <div className="experience-timeline">
              {professionalExperience.map((item) => (
                <ExperienceRow item={item} key={`${item.organization}-${item.role}`} />
              ))}
            </div>
          </section>

          <section className="experience-section">
            <h2 className="experience-section-title">Research & Engineering</h2>
            <div className="experience-timeline">
              {researchExperience.map((item) => (
                <ExperienceRow item={item} key={`${item.organization}-${item.role}`} />
              ))}
            </div>
          </section>

          <section className="experience-section">
            <h2 className="experience-section-title">Education</h2>
            <div className="experience-timeline">
              {education.map((item) => (
                <article className="experience-row education-row" key={item.school}>
                  <div className="experience-mark" aria-hidden="true">{item.mark}</div>
                  <div className="experience-entry">
                    <div className="experience-heading">
                      <div>
                        <h2>{item.school}</h2>
                        <p className="experience-role">{item.program}</p>
                      </div>
                      <div className="experience-meta">
                        <time>{item.dates}</time>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="experience-section skills-section">
            <h2 className="experience-section-title">Technical Skills</h2>
            <div className="experience-skill-groups">
              {skillGroups.map((group) => (
                <div className="experience-skill-group" key={group.label}>
                  <h3>{group.label}</h3>
                  <div className="experience-skills">
                    {group.skills.map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <DockNav current="Experience" />
    </main>
  );
}
