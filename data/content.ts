// All content sourced from www.sajudhamza.com (captured Sept 2026).
// Edit this file to update the site — every section reads from here.

export const site = {
  name: "Sajud Hamza",
  surname: "Elinjulliparambil",
  brand: "SAJUD/HAMZA",
  kicker: "Artificial Intelligence · Data Engineering · Research",
  roles: [
    "AI & Machine Learning Researcher",
    "Senior Data Engineer",
    "Ph.D. Candidate, Pace University",
    "Inventor · 2 UK Patents",
  ],
  tagline:
    "I build AI systems with national-scale consequences — screening platforms that keep American workplaces and schools safe, data pipelines guarding the retirement savings of millions, and clinical-trial infrastructure on FDA approval pathways.",
  footerLine:
    "AI & machine learning researcher · Senior Data Engineer · Ph.D. candidate, Pace University · New York, NY",
  location: "New York, NY",
  email: "sajudhamza@gmail.com",
  phone: "+1 (201) 920-4767",
  phoneHref: "tel:+12019204767",
  linkedin: "https://www.linkedin.com/in/sajud-hamza/",
  github: "https://github.com/sajudhamza",
};

export const stats = [
  { value: 20, suffix: "+", label: "Peer-reviewed publications" },
  { value: 10, suffix: "", label: "International judging panels" },
  { value: 2, suffix: "", label: "UK patents granted" },
  { value: 4, suffix: "", label: "Major media features" },
];

export const about = {
  kicker: "About",
  title: "Engineering intelligence for systems that cannot fail",
  paragraphs: [
    "Senior Data Engineer at ConsultAdd Inc. and Ph.D. candidate in Computer Science at Pace University (4.0 GPA). Over the past decade my work has protected sensitive data for 100,000+ high-profile candidates, ~1,500 NYC public schools, millions of Americans' 401(k) accounts, and the City of London Police.",
    "In parallel: 20+ peer-reviewed publications spanning computer vision, federated learning, and healthcare AI; two granted UK design patents; judging panels for ten international award programs; and coverage in Tech Times, Benzinga, IBTimes, and LatestLY.",
  ],
};

export const education = [
  {
    years: "2023 — 2026 (expected)",
    meta: "GPA 4.0",
    degree: "Ph.D. in Computer Science",
    school: "Pace University, Seidenberg School — New York, NY",
    note: "Advanced research in AI, machine learning algorithms, and data engineering systems.",
  },
  {
    years: "2018 — 2020",
    meta: "GPA 3.87",
    degree: "M.S. in Information Systems, Data Science",
    school: "Pace University, Seidenberg School — New York, NY",
    note: "",
  },
  {
    years: "2010 — 2014",
    meta: "",
    degree: "Bachelor of Engineering, Electronics & Communication",
    school: "University of Mumbai — Mumbai, India",
    note: "",
  },
];

export const skills = [
  { group: "Programming", items: ["Python", "SQL", "JavaScript", "Java", "Scala", "R"] },
  {
    group: "AI & Machine Learning",
    items: ["Deep Learning", "NLP", "TensorFlow", "PyTorch", "Scikit-learn", "Computer Vision"],
  },
  {
    group: "Data Engineering",
    items: ["PySpark", "ETL/ELT", "Apache Spark", "Hadoop", "Snowflake", "dbt", "PostgreSQL", "MongoDB", "Redis"],
  },
  {
    group: "Cloud & DevOps",
    items: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Airflow", "CI/CD"],
  },
];

export const expertise = [
  {
    n: "01",
    title: "AI & Predictive Analytics",
    body: "Risk scoring and candidate-screening models over 10,000+ public data sources — NLP, tree ensembles, supervised learning at production scale.",
  },
  {
    n: "02",
    title: "Large-Scale Data Engineering",
    body: "PySpark and Spark SQL lakehouse pipelines; HBase tuning delivering ~70% performance gains on million-record workloads.",
  },
  {
    n: "03",
    title: "Cloud & Serverless Architecture",
    body: "AWS Lambda, API Gateway, DynamoDB, Redshift — zero-downtime CI/CD across regulated production environments.",
  },
  {
    n: "04",
    title: "Secure Full-Stack Systems",
    body: "Millisecond-SLA Web APIs guarding PII for ~1,500 NYC schools and retirement data for millions of Americans.",
  },
  {
    n: "05",
    title: "Computer Vision Research",
    body: "Published work on ViT, NeRF, diffusion models, skeleton GNNs, and quantum-inspired low-light imaging.",
  },
  {
    n: "06",
    title: "Federated & Healthcare AI",
    body: "FedShield intrusion detection (IEEE), federated predictive analytics for chronic disease, FDA-pathway clinical platforms.",
  },
];

export type Publication = { year: number; title: string; venue: string; featured?: boolean };

export const publications: Publication[] = [
  {
    year: 2026,
    title:
      "FedShield: Robust Federated Intrusion Detection for Consumer IoT under Malicious Updates using Blockchain Validation",
    venue: "IEEE Transactions on Consumer Electronics",
    featured: true,
  },
  {
    year: 2026,
    title:
      "The Role of Artificial Intelligence in Intelligent Urban Planning: From Data-Driven Insights to Sustainable City Systems",
    venue: "International Journal of AI, BigData, Computational and Management Studies",
  },
  {
    year: 2026,
    title: "Intelligent Medical Imaging: Leveraging Artificial Intelligence for Precision Diagnosis",
    venue: "International Journal of Emerging Trends in Computer Science and Information Technology",
  },
  {
    year: 2026,
    title: "A Review on the Role of Artificial Intelligence in Medicine and Clinical Sciences",
    venue: "American International Journal of Computer Science and Technology",
  },
  {
    year: 2026,
    title:
      "The Use of Federated Learning in AI-Based Predictive Analytics to Prevent Chronic Diseases in Global Health Systems",
    venue: "European Journal of Science, Innovation and Technology",
  },
  {
    year: 2025,
    title: "AI Driven Urban Planning for Real Time Traffic Monitoring Framework Using OpenCV and YOLO",
    venue: "Journal of Information Systems Engineering and Management",
  },
  {
    year: 2025,
    title:
      "The Crunchy Part Entails the Innovations Offered In Big Data Analytics and Software Engineering of Smarsh Decision-Making Systems",
    venue: "International Journal of Engineering and Computer Science",
  },
  {
    year: 2025,
    title: "AI-Powered Risk Management in Insurance: Challenges and Best Practices",
    venue: "Journal of Information Systems Engineering and Management",
  },
  {
    year: 2025,
    title: "The Impact of Large Language Models on Education and Workforce Skills",
    venue: "International Journal of Engineering Technology Research & Management",
  },
  {
    year: 2025,
    title: "The Role of Generative AI in Revolutionizing Creative Industries",
    venue: "International Journal of Engineering Technology Research & Management",
  },
  {
    year: 2025,
    title: "Ethical Challenges in Deploying AI for Healthcare Diagnostics",
    venue: "International Journal of Engineering Technology Research & Management",
  },
  {
    year: 2025,
    title: "Public-Private Partnerships in Cybersecurity: A Strategic Approach to National Threat Management",
    venue: "Journal of Electrical Systems",
  },
  {
    year: 2025,
    title: "Generalist Vision Models for Any-to-Any Image-to-Video Understanding",
    venue: "International Journal of Emerging Trends in Computer Science and Information Technology",
  },
  {
    year: 2025,
    title: "Ultra-Low-Light Imaging Enhancement Using Quantum-Inspired Neural Networks",
    venue: "International Journal of Emerging Research in Engineering and Technology",
  },
  {
    year: 2024,
    title: "Multiview Diffusion Models for High-Resolution Image Synthesis",
    venue: "International Journal of Emerging Research in Engineering and Technology",
  },
  {
    year: 2024,
    title: "Vision-Based Human Action Recognition Using Skeleton Graph Neural Networks",
    venue: "International Journal of Artificial Intelligence, Data Science, and Machine Learning",
  },
  {
    year: 2024,
    title: "Robust Object Detection under Extreme Weather Using Physics-Aware Deep Learning",
    venue: "American International Journal of Computer Science and Technology",
  },
  {
    year: 2023,
    title: "Real-Time Instance Segmentation Using Lightweight CNN-Transformer Hybrids",
    venue: "International Journal of Emerging Trends in Computer Science and Information Technology",
  },
  {
    year: 2022,
    title: "Vision Transformers (ViT) for Small-Scale Image Classification with Token Reduction",
    venue: "International Journal of AI, BigData, Computational and Management Studies",
  },
  {
    year: 2022,
    title: "3D Reconstruction from Monocular Videos Using Neural Radiance Fields (NeRF)",
    venue: "International Journal of Emerging Research in Engineering and Technology",
  },
];

export const articles = [
  {
    outlet: "HackerNoon",
    date: "May 29, 2023",
    title: "The Great Digital Gatekeeper: Social Media Background Checks for Safer Schools",
    body: "Discussed the importance of social media screening in today's world with the help of data analytics.",
  },
  {
    outlet: "BreakThrough",
    date: "May 20, 2023",
    title: "Intelligent background verification: The potential of machine learning and predictive analytics",
    body: "A comprehensive overview of how machine learning and predictive analytics are transforming the background-checking process for employers.",
  },
  {
    outlet: "LinkedIn Articles",
    date: "Sep 5, 2023",
    title: "Data Governance Best Practices for Modern Data Stacks",
    body: "Outlined key strategies for implementing effective data governance in cloud-native data architectures.",
  },
];

export const media = [
  {
    outlet: "Tech Times",
    date: "Aug 03, 2023",
    title: "Cleaning Up The Web With Machine Learning And Data Analytics",
    body: "A deep dive into how data analytics is reshaping the social media screening landscape.",
  },
  {
    outlet: "LatestLY",
    date: "Sep 25, 2023",
    title: "Revolutionising Workplace Safety: The Hero of Social Media Background Screening",
    body: "An article on how social media screening is helping make workplaces safe.",
  },
  {
    outlet: "IBTimes",
    date: "Feb 14, 2024",
    title: "Sajud Hamza Elinjulliparambil making schools safe again",
    body: "Article about how to make schools in America safe with the help of data and AI.",
  },
  {
    outlet: "Benzinga",
    date: "Aug 9, 2024",
    title: "A Look At American Safety Through The Work Of Sajud Hamza Elinjulliparambil",
    body: "How technology keeps the American people safe from fraud, and the role of data and AI in it.",
  },
];

export const judging = [
  {
    date: "Mar 2022",
    org: "QS Reimagine Awards",
    role: "Panel Judge — Tech Innovations",
    body: "Judge panel for QS Reimagine Awards, evaluating more than 40 entries on novel unicorn start-up ideas.",
  },
  {
    date: "Mar 2022",
    org: "Future Engineers",
    role: "Mentor & Judge — Undergraduate Computer Science",
    body: "Guided aspiring undergraduates in developing prototypes and judged their creative ideas to shape the future of engineering.",
  },
  {
    date: "Mar 2022",
    org: "NY Product Design Awards",
    role: "Panel Judge — Design Awards",
    body: "Judge panel evaluating more than 20 product-design entries.",
  },
  {
    date: "Apr 2023",
    org: "Globee Awards",
    role: "Panel Judge — Tech and AI",
    body: "Judged over 30 entries across three stages for the most advanced AI ideas.",
  },
  {
    date: "Oct 2023",
    org: "Titan Awards",
    role: "Panel Judge — Business & Tech",
    body: "Judged over 50 entries on innovative tech business ideas for Titan Business Awards 2023.",
  },
  {
    date: "Mar 2024",
    org: "The Global Undergraduate Awards",
    role: "Panel Judge — Computer Science",
    body: "Evaluated undergraduate research and prototypes from students entering the competitive world of science.",
  },
  {
    date: "Mar 2024 – Feb 2025",
    org: "Business Intelligence Group",
    role: "Panel Judge — Stratus, Fortress & Sustainability Awards",
    body: "Four judging cycles evaluating more than 40 entries on novel business-intelligence ideas.",
  },
  {
    date: "Dec 2024",
    org: "QS Reimagine Education & Conference Awards",
    role: "Panel Judge — 2024 edition",
    body: "Judged multiple entries across education and conference award categories.",
  },
  {
    date: "Apr 2025",
    org: "IEM–ICDC 2025",
    role: "Peer Reviewer",
    body: "Reviewed research papers for the 3rd International Conference on Computational Intelligence, Data Science & Cloud Computing, Institute of Engineering & Management, Kolkata.",
  },
  {
    date: "Jul 2025",
    org: "ICDSA 2025",
    role: "Peer Reviewer",
    body: "Reviewed research papers for the 6th International Conference on Data Science & Applications, Malaviya National Institute of Technology Jaipur.",
  },
];

export const memberships = [
  "Growth Hackers",
  "Harvard Business Review Advisory Council",
  "International Society of Applied Computing",
  "Vation Ventures Technology Practitioner Council",
];

export const patents = [
  {
    id: "UK 6439245",
    title: "Computing Device for Predicting and Displaying Financial Risk in Real Time",
    granted: "July 02, 2025",
    body: "A novel machine for computing, predicting and displaying financial risk in real time.",
    domain: "Financial risk computing",
  },
  {
    id: "UK 6504358",
    title: "Stereo Optical Measurement Device Designed for Unknown-Scale Object Inspection",
    granted: "February 20, 2026",
    body: "A stereo optical device for measuring and inspecting unknown-scale objects using only two vision cameras, improving precision and reliability in industrial and engineering applications.",
    domain: "Optical measurement",
  },
];

export const testimonials = [
  {
    quote:
      "I am pleased to write this letter to confirm Mr. Sajud Elinjulliparambil's critical employment at Consultadd Inc. Mr. Elinjulliparambil is a distinguished expert in his field who plays a crucial role at ConsultAdd. As Senior Data Engineer, his technical skills and innovative approach were instrumental in shaping our client's success and driving its growth.",
    name: "Bharat Bhate",
    title: "Founder / President, ConsultAdd Inc.",
  },
  {
    quote:
      "I first became acquainted with Mr. Sajud Elinjulliparambil through his impressive work with Fama Technologies. As a Developer at ConsultAdd, he played a crucial role in developing Fama's flagship product — an advanced AI tool designed to screen employment candidates. This cutting-edge tool sifts through data from over 10,000 online public sources to identify potential fraud indicators, illegal activities, or other risky behaviors. Mr. Elinjulliparambil's expertise in development and his innovative approach were instrumental in bringing this product to fruition.",
    name: "Brendten Eickstaedt",
    title: "Chief Technology Officer, Fama Technologies",
  },
  {
    quote:
      "I had the pleasure of collaborating with Sajud on a cutting-edge technology. Mr. Elinjulliparambil's role was of paramount importance, given the substantial responsibility he carried in managing high-stakes clients, including the City of London Police. In this capacity, he was entrusted with the critical task of analyzing complex system data to ensure the seamless operation of essential services.",
    name: "Amir Mirza",
    title: "Monitoring Services Lead, Blenheim Chalcot",
  },
  {
    quote:
      "I had the pleasure of collaborating with Sajud on a cutting-edge machine learning project. His deep understanding of both theoretical concepts and practical implementation was key to our success. He is a dedicated and brilliant engineer who consistently delivers high-quality work.",
    name: "Okpara Uche",
    title: "Principal AI Architect / ML Engineer",
  },
];

export const chapters = [
  { id: "about", n: "00", label: "About" },
  { id: "research", n: "01", label: "Research" },
  { id: "recognition", n: "02", label: "Recognition" },
  { id: "patents", n: "03", label: "Patents" },
  { id: "testimonials", n: "04", label: "Testimonials" },
  { id: "vault", n: "05", label: "Vault" },
];
