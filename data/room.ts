// Data for the interactive 3D room: hotspot placement plus the richer
// per-section content (links, certificates, photos) the overlays need.
// Copy and lists shared with the rest of the site live in ./content.ts.

import { articles, judging, media, memberships, publications, site, testimonials } from "./content";

export type HotspotKey =
  | "introduction"
  | "qualifications"
  | "patents"
  | "publications"
  | "articles"
  | "judging"
  | "media"
  | "testimonials"
  | "memberships";

export type OverlayKey = HotspotKey | "vault";

export type CameraView = { radius: number; phi: number; theta: number; target: [number, number, number] };
export type Hotspot = { key: HotspotKey; label: string; position: [number, number, number]; hint: string; view: CameraView };

const PI = Math.PI;
/** Camera pose used when a section opens: distance, tilt (0 = above, PI/2 = eye level), orbit angle, look-at point. */
const view = (radius: number, phi: number, theta: number, target: [number, number, number]): CameraView => ({ radius, phi, theta, target });

/** Where each glowing dot sits in the room (scene units). */
export const hotspots: Hotspot[] = [
  { key: "introduction", label: "Introduction", position: [0.35, 3.35, -4.35], hint: "Who I am", view: view(7, PI * 0.47, 0, [0.35, 3.3, -4.35]) },
  { key: "qualifications", label: "Qualifications", position: [-0.35, 1.25, 1.9], hint: "Education, experience, skills", view: view(7, PI * 0.3, -PI * 0.25, [-0.35, 1.2, 1.9]) },
  { key: "patents", label: "Patents", position: [2.1, 2.55, -3.65], hint: "Two granted UK patents", view: view(5.5, PI * 0.22, PI * 0.15, [2.1, 2.5, -3.65]) },
  { key: "publications", label: "Publications", position: [-3.65, 4.65, -4.0], hint: "20+ peer-reviewed papers", view: view(7.5, PI * 0.45, -PI * 0.08, [-3.65, 4.5, -4.0]) },
  { key: "articles", label: "Articles", position: [-3.65, 2.45, -4.15], hint: "Writing and thought leadership", view: view(6.5, PI * 0.45, -PI * 0.08, [-3.65, 2.4, -4.15]) },
  { key: "judging", label: "Judging", position: [3.85, 1.15, -0.5], hint: "Award panels and peer review", view: view(6.5, PI * 0.4, -PI * 0.42, [3.85, 1.2, -0.5]) },
  { key: "media", label: "Media", position: [4.15, 2.7, 1.6], hint: "Press coverage", view: view(10.5, PI * 0.47, -PI * 0.5, [4.15, 2.9, 1.6]) },
  { key: "testimonials", label: "Testimonials", position: [-3.85, 2.45, 3.65], hint: "What colleagues say", view: view(6.5, PI * 0.4, -PI * 0.42, [-3.85, 1.9, 3.65]) },
  { key: "memberships", label: "Memberships", position: [-1.9, 1.6, -2.0], hint: "Professional communities", view: view(6.5, PI * 0.38, -PI * 0.25, [-1.9, 1.6, -2.0]) },
];

/** Menu shown at the bottom of the screen; the vault has no dot in the room. */
export const menu: { key: OverlayKey; label: string }[] = [
  ...hotspots.map((h) => ({ key: h.key as OverlayKey, label: h.label })),
  { key: "vault", label: "Vault" },
];

export const wallText = {
  lines: [site.name, site.surname] as [string, string],
  subtitle: "AI Researcher · Data Engineer · Inventor",
};

/* ── Introduction ─────────────────────────────────────────────── */

export const intro = {
  photo: "/assets/profile.jpg",
  subtitle: "AI & ML Researcher • Senior Data Engineer • Inventor",
  tagline: "AI. Data. Innovation. — Unlocking the future, one insight at a time.",
  whatIDo: [
    {
      title: "Data Engineering",
      body: "End-to-end pipelines with Python, Spark, Airflow, Kafka, Snowflake, Databricks and dbt. Warehouse optimisation, real-time ETL, and metadata governance with Alation across AWS and Azure.",
    },
    {
      title: "Full-Stack Development",
      body: "FCRA-compliant screening platforms, containerised microservices with Docker and Kubernetes, and full-stack products built with FastAPI, Django, React, React Native and Angular.",
    },
    {
      title: "AI & Research",
      body: "20+ peer-reviewed papers across computer vision, federated learning, healthcare AI, urban planning and cybersecurity. Working with TensorFlow, PyTorch, LangChain and Hugging Face. Two granted UK patents.",
    },
    {
      title: "School Safety & Social Impact",
      body: "Social-media screening platforms that use AI and data analytics to surface risk for schools and workplaces, protecting the most vulnerable through proactive, technology-driven solutions.",
    },
  ],
  journey: [
    "I started at <strong>Accenture</strong> in Bangalore (2016–2018), managing large enterprise datasets on Azure SQL and Synapse, building GraphQL APIs and dbt models, and shipping Python microservices on Docker and Kubernetes with CI/CD on Azure.",
    "In the US with ConsultAdd, I built <strong>Fama Technologies</strong>&rsquo; FCRA-compliant background-check platform: AWS microservices on Kubernetes and ML pipelines that screen candidates across 10,000+ public sources. I then led data pipelines for <strong>Principal Financial Group</strong>, moving third-party data into Snowflake with dbt and Snowpipes, real-time ETL into Redshift, and a LeanIX-to-Snowflake architecture designed from scratch.",
    "At <strong>WIRB Copernicus Group</strong> I refactored a cloud-native document platform into async FastAPI services with Okta authentication, automated PDF generation and Playwright tests on Azure. Most recently, at <strong>Huntington Bank</strong>, I designed the Enterprise Metadata Operating Hub, an AWS-native platform that reconciles and enriches the Alation data catalog automatically. All of it alongside my Ph.D. and peer-reviewed research.",
  ],
  projects: [
    {
      title: "ShelfShack",
      body: "A complete web rental platform built from scratch to production in about two weeks: FastAPI backend, React Native frontend, deployed on AWS with RDS, ECS, Route 53, CloudWatch and Amplify, developed with AI tooling (Claude, Codex, Gemini, Cursor).",
    },
    {
      title: "Events-Venues",
      body: "An \"Airbnb for events\" marketplace where venues self-onboard through a listing wizard and customers book directly. AI-powered search turns a free-text event description into database filters via the OpenAI API. Hosted on Supabase.",
    },
    {
      title: "Autonomous Social Publishing Pipeline",
      body: "A fully autonomous n8n workflow: voice-to-text scripting, avatar and voice generation with HeyGen and ElevenLabs, captions via Submagic, and scheduled publishing to Instagram through Meta's Graph API.",
    },
    {
      title: "US Immigration Law Chatbot",
      body: "An AI chatbot focused on H1B visas that answers immigration-law questions in real time, built with Python, LangChain, OpenAI and React.",
    },
  ],
};

/* ── Qualifications ───────────────────────────────────────────── */

export type WorkItem = { years: string; title: string; place: string; body: string; tags: string[] };

export const workExperience: WorkItem[] = [
  {
    years: "Apr 2026 — Aug 2026",
    title: "Senior Data Engineer",
    place: "Huntington Bank • via ConsultAdd • Remote",
    body: "Designed and built the Enterprise Metadata Operating Hub (EMOH), an AWS-native platform that pulls the Alation data catalog, detects missing descriptions, ownership and lineage, generates the missing metadata and writes it back, replacing manual stewardship with a continuously reconciled source of truth.",
    tags: ["Python", "AWS Lambda", "Glue", "Step Functions", "Alation", "pytest"],
  },
  {
    years: "Nov 2024 — Mar 2026",
    title: "Senior Python Data Engineer",
    place: "WIRB Copernicus Group • via ConsultAdd • Remote",
    body: "Refactored a cloud-native document platform into modular async FastAPI services, added Okta-backed JWT authentication with role-based access, automated PDF generation with WeasyPrint, Playwright end-to-end tests, and deployment on Azure Kubernetes Service.",
    tags: ["Python", "FastAPI", "Okta", "Azure AKS", "Playwright", "WeasyPrint"],
  },
  {
    years: "Feb 2024 — Oct 2024",
    title: "Senior Python Data Engineer",
    place: "Principal Financial Group • via ConsultAdd • Remote",
    body: "Led pipelines for a segmentation and personalisation platform: third-party data into Snowflake via S3, dbt models and Snowpipes, real-time ETL into Redshift for KPIs, and a LeanIX-to-Snowflake architecture designed from scratch with the EDA and Archer teams.",
    tags: ["Snowflake", "dbt", "AWS Redshift", "Databricks", "Airflow", "Spark"],
  },
  {
    years: "May 2022 — Dec 2023",
    title: "Full Stack Python Developer",
    place: "Fama Technologies • via ConsultAdd • Remote",
    body: "Built an FCRA-compliant background-check platform that screens candidates' online behaviour with real-time alerts: Django and Angular end to end, ML pipelines with TensorFlow and PyTorch, microservices on Docker and Kubernetes, and Hadoop clusters on AWS provisioned with Terraform.",
    tags: ["Python", "Django", "AWS Lambda", "Kubernetes", "TensorFlow", "Terraform"],
  },
  {
    years: "Jan 2016 — Jul 2018",
    title: "Python Software Developer",
    place: "Accenture • Bangalore, India",
    body: "Managed large enterprise datasets on Azure SQL and Synapse, built GraphQL APIs and dbt models, delivered ETL with Azure Data Factory and HDInsight, and shipped Python microservices on Docker and Kubernetes with CI/CD on Azure.",
    tags: ["Python", "Azure SQL", "Synapse", "Data Factory", "GraphQL", "Docker"],
  },
];

/* ── Books: articles and publications ─────────────────────────── */

export type BookItem = {
  title: string;
  summary: string;
  tags: string[];
  link?: string;
  venue?: string;
  year?: string;
  authors?: string;
};

const articleLinks: Record<string, { link: string; tags: string[] }> = {
  HackerNoon: {
    link: "https://hackernoon.com/the-great-digital-gatekeeper-social-media-background-checks-for-safer-schools",
    tags: ["School Safety", "AI", "Social Media", "Background Checks"],
  },
  BreakThrough: {
    link: "https://breakthrough.neliti.com/background-verification-machine-learning-predictive-analytics/",
    tags: ["Machine Learning", "Predictive Analytics", "Background Verification"],
  },
  "LinkedIn Articles": {
    link: site.linkedin,
    tags: ["Data Governance", "Cloud", "Data Stacks"],
  },
};

export const articlesBook: BookItem[] = articles.map((a) => ({
  title: a.title,
  summary: a.body,
  tags: articleLinks[a.outlet]?.tags ?? [],
  link: articleLinks[a.outlet]?.link,
  venue: a.outlet,
  year: a.date,
}));

// Extra detail for publications, keyed by a distinctive fragment of the title.
const publicationExtra: { match: string; link: string; summary: string; tags: string[] }[] = [
  {
    match: "Intelligent Urban Planning",
    link: "https://ijaibdcms.org/index.php/ijaibdcms/article/view/441",
    summary: "Explores how AI and data-driven approaches are transforming urban planning for sustainable city systems.",
    tags: ["AI", "Urban Planning", "Sustainability"],
  },
  {
    match: "Real Time Traffic Monitoring",
    link: "https://jisem-journal.com/index.php/journal/article/view/5765",
    summary: "Methods for building highly scalable real-time traffic monitoring with AI for urban planning.",
    tags: ["AI", "YOLO", "OpenCV", "Traffic Monitoring"],
  },
  {
    match: "Crunchy Part",
    link: "https://ijecs.in/index.php/ijecs/article/view/5341",
    summary: "Examines how big-data analytics and software-engineering solutions are restructuring decision-making across industries.",
    tags: ["Big Data", "Software Engineering", "Decision Systems"],
  },
  {
    match: "Risk Management in Insurance",
    link: "https://jisem-journal.com/index.php/journal/article/view/7055",
    summary: "Presents a novel AI-powered risk-management framework for the insurance industry.",
    tags: ["AI", "Risk Management", "Insurance"],
  },
  {
    match: "Large Language Models on Education",
    link: "https://ijetrm.com/issues/files/Aug-2025-19-1755572302-AUG20.pdf",
    summary: "How large language models are transforming learning, teaching and work as tutors, writing assistants, coding partners and analysis aids.",
    tags: ["LLMs", "Education", "Workforce"],
  },
  {
    match: "Generative AI in Revolutionizing Creative",
    link: "https://ijetrm.com/issues/files/Aug-2025-19-1755572481-AUG21.pdf",
    summary: "How generative AI is changing creative industries across art, music, design, film, gaming, advertising and publishing.",
    tags: ["Generative AI", "Creative Industries"],
  },
  {
    match: "Ethical Challenges in Deploying AI",
    link: "https://ijetrm.com/issues/files/Aug-2025-19-1755572691-AUG22.pdf",
    summary: "Examines how AI is transforming diagnostics in healthcare, from disease detection to clinical decision support and predictive analytics.",
    tags: ["AI Ethics", "Healthcare", "Diagnostics"],
  },
  {
    match: "Public-Private Partnerships in Cybersecurity",
    link: "https://journal.esrgroups.org/jes/article/view/9148",
    summary: "How public-private partnerships bridge capability, intelligence and response gaps for national cybersecurity.",
    tags: ["Cybersecurity", "Public Policy", "PPP"],
  },
  {
    match: "Generalist Vision Models",
    link: "https://www.ijetcsit.org/index.php/ijetcsit/article/view/528",
    summary: "Examines multimodal foundation models handling images, video, audio and language, covering Unified-IO 2, UnIVAL, PaLI-3 and 4M-21.",
    tags: ["Computer Vision", "Multimodal AI", "Foundation Models"],
  },
  {
    match: "Ultra-Low-Light Imaging",
    link: "https://ijeret.org/index.php/ijeret/article/view/412",
    summary: "Addresses ultra-low-light imaging for biomedical microscopy, astronomy, surveillance and remote sensing where photon-limited conditions impair image quality.",
    tags: ["Quantum Computing", "Image Enhancement", "Neural Networks"],
  },
  {
    match: "Multiview Diffusion Models",
    link: "https://ijeret.org/index.php/ijeret/article/view/399",
    summary: "A comprehensive review of multiview diffusion models for generating coherent images from different viewpoints, with applications in 3D reconstruction, VR and medical imaging.",
    tags: ["Diffusion Models", "3D Vision", "Image Synthesis"],
  },
  {
    match: "Skeleton Graph Neural Networks",
    link: "http://ijaidsml.org/index.php/ijaidsml/article/view/380",
    summary: "A systematised review of skeleton-based human action recognition using graph neural networks, with applications in surveillance, healthcare and robotics.",
    tags: ["Action Recognition", "Graph Neural Networks", "Computer Vision"],
  },
  {
    match: "Extreme Weather",
    link: "https://aijcst.org/index.php/aijcst/article/view/145",
    summary: "Physics-aware approaches incorporating atmospheric scattering, rain-streak formation and low-light noise models for robust object detection.",
    tags: ["Object Detection", "Deep Learning", "Autonomous Driving"],
  },
  {
    match: "Real-Time Instance Segmentation",
    link: "https://www.ijetcsit.org/index.php/ijetcsit/article/view/527",
    summary: "Examines instance segmentation combining CNNs and Transformers for resource-constrained platforms and autonomous systems.",
    tags: ["Instance Segmentation", "CNN-Transformer", "Edge Computing"],
  },
  {
    match: "Vision Transformers (ViT)",
    link: "https://ijaibdcms.org/index.php/ijaibdcms/article/view/344",
    summary: "Explores how Vision Transformers exploit self-attention to capture long-range dependencies for image classification, outperforming traditional CNNs.",
    tags: ["Vision Transformers", "Image Classification", "Token Reduction"],
  },
  {
    match: "Neural Radiance Fields",
    link: "https://ijeret.org/index.php/ijeret/article/view/398",
    summary: "Reviews NeRF for monocular-video 3D reconstruction with applications in AR/VR, robotics, cultural heritage and digital content creation.",
    tags: ["NeRF", "3D Reconstruction", "Neural Rendering"],
  },
  {
    match: "FedShield",
    link: "",
    summary: "Robust federated intrusion detection for consumer IoT that stays reliable under malicious client updates by validating contributions on a blockchain.",
    tags: ["Federated Learning", "IoT Security", "Blockchain"],
  },
  {
    match: "Intelligent Medical Imaging",
    link: "",
    summary: "How AI models are used for precision diagnosis across medical-imaging modalities.",
    tags: ["Medical Imaging", "AI", "Diagnosis"],
  },
  {
    match: "Medicine and Clinical Sciences",
    link: "",
    summary: "A review of the role of artificial intelligence across medicine and the clinical sciences.",
    tags: ["Healthcare AI", "Clinical Science"],
  },
  {
    match: "Federated Learning in AI-Based Predictive",
    link: "",
    summary: "Using federated learning for privacy-preserving predictive analytics to prevent chronic disease in global health systems.",
    tags: ["Federated Learning", "Predictive Analytics", "Global Health"],
  },
];

export const publicationsBook: BookItem[] = publications.map((p) => {
  const extra = publicationExtra.find((e) => p.title.includes(e.match));
  return {
    title: p.title,
    summary: extra?.summary ?? "",
    tags: extra?.tags ?? [],
    link: extra?.link || undefined,
    venue: p.venue,
    year: String(p.year),
    authors: `${site.name} ${site.surname}`,
  };
});

/* ── Media ────────────────────────────────────────────────────── */

const mediaLinks: Record<string, string> = {
  Benzinga:
    "https://www.benzinga.com/partner/general/24/08/40289096/a-look-at-american-safety-through-the-work-of-sajud-hamza-elinjulliparambi",
  IBTimes: "https://www.ibtimes.co.in/sajud-hamza-elinjulliparambil-making-schools-safe-again-866089",
  "Tech Times": "https://www.techtimes.com/articles/294646/20230803/cleaning-up-web-machine-learning-data-analytics.htm",
  LatestLY:
    "https://www.latestly.com/technology/revolutionising-workplace-safety-the-hero-of-social-media-background-screening-5438174.html",
};

export type NewsItem = { headline: string; byline: string; body: string; link?: string; featured: boolean };

export const news: NewsItem[] = [...media]
  .sort((a, b) => (a.outlet === "Benzinga" ? -1 : b.outlet === "Benzinga" ? 1 : 0))
  .map((m) => ({
    headline: m.title,
    byline: `${m.outlet} — ${m.date}`,
    body: m.body,
    link: mediaLinks[m.outlet],
    featured: m.outlet === "Benzinga",
  }));

/* ── Judging ──────────────────────────────────────────────────── */

export type JudgeItem = {
  title: string;
  org: string;
  date: string;
  body: string;
  type: "judge" | "review";
  cert?: string;
  panelLink?: string;
};

const judgingExtra: Record<string, { cert?: string; panelLink?: string }> = {
  "QS Reimagine Awards": { panelLink: "https://qsrea.evessiocloud.com/Awards2024/en/node/judgeprofile-sajud-e" },
  "Titan Awards": { cert: "/membercert/titan-endorsement.pdf", panelLink: "https://thetitanawards.com/our-judge.php" },
  "The Global Undergraduate Awards": { cert: "/membercert/inventionchallenge.pdf" },
  "Future Engineers": { cert: "/membercert/inventionchallenge.pdf" },
  "Business Intelligence Group": {
    cert: "/membercert/judge-certificate-stratus-2023.png",
    panelLink: "https://www.bintelligence.com/judge/sajud-p",
  },
  "NY Product Design Awards": { panelLink: "https://nydesignawards.com/our-judge.php" },
  "IEM–ICDC 2025": { cert: "/membercert/ICDC2025.jpeg" },
  "ICDSA 2025": { cert: "/membercert/ICDSA-2025-TPC-Certificate.pdf" },
};

export const judgingEvents: JudgeItem[] = judging.map((j) => ({
  title: j.role,
  org: j.org,
  date: j.date,
  body: j.body,
  type: /review/i.test(j.role) ? "review" : "judge",
  ...judgingExtra[j.org],
}));

/* ── Testimonials ─────────────────────────────────────────────── */

export type TestimonialItem = { name: string; role: string; quote: string; photo?: string; pdf?: string };

const testimonialExtra: Record<string, { photo: string; pdf?: string }> = {
  "Bharat Bhate": { photo: "/Testimonial/Bharat.png", pdf: "/Testimonial/pdfs/LOR-Bharat-Bhate-Sajud.pdf" },
  "Brendten Eickstaedt": { photo: "/Testimonial/Brendten-Eickstaedt.jpg", pdf: "/Testimonial/pdfs/Brendten-Recommendation.pdf" },
  "Amir Mirza": { photo: "/Testimonial/Amir-Mirza.jpg", pdf: "/Testimonial/pdfs/Amir-Mirza-Sajud-Hamza.pdf" },
  "Okpara Uche": { photo: "/Testimonial/Okpara-Uche.jpg" },
};

export const testimonialItems: TestimonialItem[] = testimonials.map((t) => ({
  name: t.name,
  role: t.title,
  quote: t.quote,
  ...testimonialExtra[t.name],
}));

/* ── Memberships ──────────────────────────────────────────────── */

export type MembershipItem = { name: string; role: string; image: string; body: string };

const membershipDetail: Record<string, { image: string; body: string }> = {
  "Growth Hackers": {
    image: "/memberships/growth_hackers.png",
    body: "The world's largest community of growth professionals, sharing strategies, tactics and insights to accelerate business growth.",
  },
  "Harvard Business Review Advisory Council": {
    image: "/memberships/harvard_business_review.jpg",
    body: "Connects leaders and experts who provide insight and feedback on the future of business management and strategy.",
  },
  "International Society of Applied Computing": {
    image: "/memberships/ISAC.png",
    body: "Promotes the advancement of computing applications across AI, data science and software engineering.",
  },
  "Vation Ventures Technology Practitioner Council": {
    image: "/memberships/vation_ventures.jpg",
    body: "Connects technology practitioners to evaluate, advise on and shape emerging enterprise technologies.",
  },
};

export const membershipItems: MembershipItem[] = memberships.map((name) => ({
  name,
  role: "Member",
  image: membershipDetail[name]?.image ?? "",
  body: membershipDetail[name]?.body ?? "",
}));
