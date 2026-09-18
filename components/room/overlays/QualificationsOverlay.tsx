"use client";

import Shell from "./Shell";
import { education, site, skills } from "@/data/content";
import { workExperience } from "@/data/room";

/** Qualifications is a printed résumé lying on the coffee table. */
export default function QualificationsOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Shell cls="paper-overlay" open={open} onClose={onClose} label="Qualifications">
      <div className="paper-overlay__scroll">
        <article className="sheet">
          <div className="sheet__stain" aria-hidden />
          <div className="sheet__clip" aria-hidden />

          <header className="cv-head">
            <h1>
              {site.name} {site.surname}
            </h1>
            <div className="cv-head__role">{site.kicker}</div>
            <div className="cv-head__contact">
              {site.location} · {site.email} · {site.phone}
            </div>
          </header>

          <section className="cv-section">
            <h2>Education</h2>
            {education.map((e) => (
              <div className="cv-row" key={e.degree}>
                <div className="cv-row__when">
                  {e.years}
                  {e.meta ? <small>{e.meta}</small> : null}
                </div>
                <div className="cv-row__what">
                  <h3>{e.degree}</h3>
                  <div className="cv-row__where">{e.school}</div>
                  {e.note ? <p>{e.note}</p> : null}
                </div>
              </div>
            ))}
          </section>

          <section className="cv-section">
            <h2>Professional Experience</h2>
            {workExperience.map((w) => (
              <div className="cv-row" key={`${w.title}-${w.place}`}>
                <div className="cv-row__when">{w.years}</div>
                <div className="cv-row__what">
                  <h3>{w.title}</h3>
                  <div className="cv-row__where">{w.place}</div>
                  <p>{w.body}</p>
                  <div className="cv-tags">{w.tags.join(" · ")}</div>
                </div>
              </div>
            ))}
          </section>

          <section className="cv-section">
            <h2>Core Skills</h2>
            {skills.map((g) => (
              <div className="cv-row cv-row--tight" key={g.group}>
                <div className="cv-row__when">{g.group}</div>
                <div className="cv-row__what">
                  <p>{g.items.join(", ")}</p>
                </div>
              </div>
            ))}
          </section>

          <footer className="cv-foot">
            <span>{site.name} {site.surname} · Curriculum Vitae</span>
            <span>Page 1 of 1</span>
          </footer>
        </article>
      </div>
    </Shell>
  );
}
