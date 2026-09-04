'use client';

import { useMemo, useState } from 'react';
import styles from './portfolio.module.css';

type Lens = 'All' | 'Project Controls' | 'Technical Office' | 'Structural & CAD' | 'QS & Estimating' | 'Site & Infrastructure';

type EvidenceItem = {
  title: string;
  eyebrow: string;
  summary: string;
  tags: Lens[];
  proof: string;
  href?: string;
};

const lenses: Lens[] = ['All', 'Project Controls', 'Technical Office', 'Structural & CAD', 'QS & Estimating', 'Site & Infrastructure'];

const evidence: EvidenceItem[] = [
  {
    title: 'Chinaimo Project Controls Technical Assessment',
    eyebrow: 'LIVE ASSESSMENT · 2026',
    summary: 'Auditable project-controls demonstration with preserved baseline, statused current forecast, partial recovery, BOQ/value-based progress control, schedule evidence and reviewer-facing technical notes.',
    tags: ['Project Controls', 'Technical Office', 'QS & Estimating'],
    proof: 'Live website · downloadable Excel / MPP / PDF evidence',
    href: '/'
  },
  {
    title: 'Saudi residential technical-office support',
    eyebrow: 'SAUDI ARABIA · 2024–2026',
    summary: 'Drawing review, multidisciplinary coordination, quantity and material tracking, procurement follow-up, progress documentation and technical-office records for large residential and site-development works.',
    tags: ['Technical Office', 'QS & Estimating', 'Site & Infrastructure'],
    proof: 'Employment / project evidence being curated'
  },
  {
    title: 'KAFD / Al Qasr Mall structural documentation exposure',
    eyebrow: 'RIYADH · HIGH-RISE / COMMERCIAL',
    summary: 'Shop-drawing, structural-detailing, BBS/rebar, quantity/progress, materials and coordination exposure within major Riyadh commercial and high-rise project environments.',
    tags: ['Structural & CAD', 'Technical Office', 'QS & Estimating'],
    proof: 'Drawing / project artifacts being curated'
  },
  {
    title: 'Structural, PT / precast and bridge-related support',
    eyebrow: 'PHILIPPINES · PROJECT-BASED PRACTICE',
    summary: 'Structural drafting, CAD detailing, quantity take-off, BOQ/BBS support and technical documentation across reinforced-concrete, post-tensioned, precast and bridge-related work under engineering review.',
    tags: ['Structural & CAD', 'QS & Estimating', 'Technical Office'],
    proof: 'Selected drawings and calculations to be attached'
  },
  {
    title: 'Local infrastructure and municipal engineering support',
    eyebrow: 'SORSOGON · 2018–2024',
    summary: 'Engineering review, estimates, schedules, quantities, permit-support documentation and coordination for public/private works including drainage, waterline, site development and local infrastructure matters.',
    tags: ['Site & Infrastructure', 'Technical Office', 'QS & Estimating'],
    proof: 'Reports / drawings / local project records being curated'
  },
  {
    title: 'Construction planning and technical proposals',
    eyebrow: 'PHILIPPINES · 2017–2018',
    summary: 'Feasibility, cost-estimation support, technical proposals, method statements, construction sequencing and Primavera P6 schedule preparation for project opportunities and execution planning.',
    tags: ['Project Controls', 'QS & Estimating', 'Technical Office'],
    proof: 'Planning samples and method statements to be attached'
  }
];

const career = [
  ['2024–2026', 'Saudi Arabia', 'Civil Engineer · Technical Office & Project Coordination', 'Residential development, drawing review, coordination, quantities, procurement and project records.'],
  ['2018–2024', 'Philippines', 'Civil Engineer · QS / Structural & Project Support', 'Structural drafting, quantities, BOQ/BBS, engineering review and public/private project support.'],
  ['2017–2018', 'Philippines', 'Senior Civil Engineer · Project Development', 'Feasibility, estimating, technical proposals, construction planning and schedule support.'],
  ['2016–2017', 'Philippines', 'Site / Technical Civil Engineer', 'Site inspection, QA/QC documentation, manpower coordination and construction monitoring.'],
  ['2011–2016', 'Saudi Arabia', 'Civil Engineer · Structural Detailer', 'Structural drawings, detailing, quantities and multidisciplinary technical documentation.'],
  ['2008–2010', 'Saudi Arabia', 'Civil Engineer · Technical Office', 'Shop drawings, as-builts, BOQ/billing/variation support and structural detailing for major Riyadh projects.'],
  ['2001 →', 'Philippines', 'Drafting / Engineering Foundations', 'AutoCAD production, structural detailing, precast / post-tensioned and bridge-related project exposure.']
] as const;

const credentials = [
  ['Registered Civil Engineer', 'Professional Regulation Commission · Philippines · 2001'],
  ['Registered Master Plumber', 'Professional Regulation Commission · Philippines'],
  ['BS Civil Engineering', 'Bicol University College of Engineering'],
  ['Career Service Professional', 'Civil Service Commission · Philippines'],
  ['Primavera P6 V8.2', 'Computer-Aided Construction Project Management training'],
  ['COSH', 'Construction Occupational Safety & Health training'],
  ['Bluebeam Revu', 'Quantity estimation & take-off workshop'],
  ['Autodesk Revit', 'BIM production training / continuing development']
] as const;

export default function PortfolioClient() {
  const [lens, setLens] = useState<Lens>('All');
  const visible = useMemo(() => lens === 'All' ? evidence : evidence.filter(item => item.tags.includes(lens)), [lens]);

  return (
    <main className={styles.shell}>
      <div className={styles.noise} aria-hidden="true" />
      <header className={styles.topbar}>
        <a className={styles.wordmark} href="#top" aria-label="Michael Futol portfolio home">MF<span> / 137</span></a>
        <nav className={styles.nav} aria-label="Portfolio navigation">
          <a href="#work">Work</a><a href="#experience">Experience</a><a href="#credentials">Credentials</a><a href="#contact">Contact</a>
        </nav>
      </header>

      <section id="top" className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>MICHAEL DELOVINO FUTOL · CIVIL ENGINEER</p>
          <h1>Engineering work,<br/><em>shown through evidence.</em></h1>
          <p className={styles.lede}>A curated record of project controls, technical-office work, structural and CAD output, quantity / estimating support, and construction engineering experience across the Philippines and Saudi Arabia.</p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="#work">View selected work</a>
            <a className={styles.secondary} href="mailto:michaelfutol.ce@gmail.com">Email Michael</a>
          </div>
        </div>
        <aside className={styles.heroIndex} aria-label="Portfolio summary">
          <div><span>Career span</span><strong>2001 → 2026</strong></div>
          <div><span>Markets</span><strong>Philippines · Saudi Arabia</strong></div>
          <div><span>Core practice</span><strong>Technical Office · Controls · CAD · QS</strong></div>
          <div><span>Evidence rule</span><strong>Claims link to work wherever possible</strong></div>
        </aside>
      </section>

      <section className={styles.statement}>
        <p>Not a gallery of polished claims.</p>
        <h2>The portfolio is organized so a reviewer can move from <em>role</em> → <em>work</em> → <em>evidence</em> without reading a long résumé first.</h2>
      </section>

      <section id="work" className={styles.section}>
        <div className={styles.sectionHead}>
          <div><p className={styles.index}>01 · SELECTED WORK</p><h2>Evidence, by role lens</h2></div>
          <p>Choose the discipline closest to the role. The same career can be reviewed from different angles without duplicating projects.</p>
        </div>
        <div className={styles.filters} role="tablist" aria-label="Filter portfolio by role">
          {lenses.map(item => <button key={item} type="button" className={lens === item ? styles.activeFilter : ''} onClick={() => setLens(item)}>{item}</button>)}
        </div>
        <div className={styles.workGrid}>
          {visible.map((item, index) => {
            const body = <>
              <div className={styles.cardTop}><span>{String(index + 1).padStart(2, '0')}</span><span>{item.eyebrow}</span></div>
              <h3>{item.title}</h3><p>{item.summary}</p>
              <div className={styles.tags}>{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              <div className={styles.proof}><span>PROOF STATUS</span><strong>{item.proof}</strong>{item.href && <b>Open evidence ↗</b>}</div>
            </>;
            return item.href ? <a className={styles.workCard} href={item.href} key={item.title}>{body}</a> : <article className={styles.workCard} key={item.title}>{body}</article>;
          })}
        </div>
      </section>

      <section id="experience" className={`${styles.section} ${styles.experienceSection}`}>
        <div className={styles.sectionHead}>
          <div><p className={styles.index}>02 · EXPERIENCE</p><h2>A career as a connected system</h2></div>
          <p>Site, technical office, structural documentation, quantities and planning are shown as one continuous construction-engineering practice rather than isolated job titles.</p>
        </div>
        <div className={styles.timeline}>
          {career.map(([years, place, role, detail]) => <article key={`${years}-${role}`}>
            <div className={styles.timelineYear}>{years}<span>{place}</span></div>
            <div><h3>{role}</h3><p>{detail}</p></div>
          </article>)}
        </div>
      </section>

      <section id="credentials" className={styles.section}>
        <div className={styles.sectionHead}>
          <div><p className={styles.index}>03 · CREDENTIALS</p><h2>Proof, not logo walls</h2></div>
          <p>Each credential will ultimately open its document proof. Until the archive is complete, the portfolio distinguishes verified résumé records from uploaded certificate evidence.</p>
        </div>
        <div className={styles.credentialGrid}>
          {credentials.map(([name, issuer], i) => <article key={name}><span>{String(i + 1).padStart(2, '0')}</span><h3>{name}</h3><p>{issuer}</p><small>DOCUMENT PROOF · CURATION IN PROGRESS</small></article>)}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div><p className={styles.index}>04 · CAPABILITY MAP</p><h2>What I can contribute</h2></div>
          <p>A practical working map rather than percentage-based skill bars.</p>
        </div>
        <div className={styles.capabilityMap}>
          <div><h3>Project Controls</h3><p>Primavera P6 · Microsoft Project · schedule logic · progress reporting · recovery studies · S-curves · evidence-based controls</p></div>
          <div><h3>Technical Office</h3><p>Drawing review · coordination · revisions · RFIs / support records · procurement trackers · submittal awareness · document discipline</p></div>
          <div><h3>Structural / CAD</h3><p>AutoCAD 2D/3D · RC detailing · plans / sections / details · BBS support · drawing cleanup · structural workflow coordination</p></div>
          <div><h3>QS / Estimating</h3><p>Quantity take-off · BOQ / BOM · material schedules · cost-estimation support · billing / valuation support · Bluebeam / PlanSwift exposure</p></div>
          <div><h3>Site / Infrastructure</h3><p>Residential · drainage · waterline · grading / site development · public works support · QA/QC documentation · construction monitoring</p></div>
          <div><h3>Digital Workflow</h3><p>Excel systems · AutoLISP-assisted workflows · web-based technical tools · GitHub / versioned evidence · AI-assisted engineering documentation</p></div>
        </div>
      </section>

      <section id="contact" className={styles.contact}>
        <p className={styles.index}>05 · CONTACT</p>
        <h2>Need the résumé?<br/><em>Start with the evidence first.</em></h2>
        <p>For recruiters, engineering teams and project managers: role-specific CVs, credentials and deeper project records will be available from this site as the archive is completed.</p>
        <div className={styles.heroActions}><a className={styles.primary} href="mailto:michaelfutol.ce@gmail.com">michaelfutol.ce@gmail.com</a><a className={styles.secondary} href="/">Open Chinaimo assessment</a></div>
      </section>

      <footer className={styles.footer}><span>MICHAEL FUTOL · ENGINEERING PORTFOLIO</span><span>CURATED EVIDENCE · VERSIONED WORK · 2026</span></footer>
    </main>
  );
}
