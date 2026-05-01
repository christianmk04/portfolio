export type AppId =
  | 'about' | 'experience' | 'projects' | 'skills' | 'publications' | 'contact'
  | 'snake' | 'minesweeper' | 'terminal' | 'readme'
  | 'wordle' | 'mastermind' | 'flappybird' | 'twentyfortyeight'
  | 'resume' | 'finder' | 'games'
  | 'aboutmac' | 'preferences'
  | 'imessage';

export const APPS = [
  { id: 'readme',           label: 'Read Me First', icon: '📖', defaultSize: { width: 460, height: 380 }, desktopOnly: false },
  { id: 'about',            label: 'About',         icon: '👤', defaultSize: { width: 500, height: 380 }, desktopOnly: false },
  { id: 'experience',       label: 'Experience',    icon: '💼', defaultSize: { width: 560, height: 400 }, desktopOnly: false },
  { id: 'projects',         label: 'Projects',      icon: '🚀', defaultSize: { width: 560, height: 400 }, desktopOnly: false },
  { id: 'skills',           label: 'Skills',        icon: '⚡', defaultSize: { width: 480, height: 360 }, desktopOnly: false },
  { id: 'publications',     label: 'Publications',  icon: '📄', defaultSize: { width: 500, height: 300 }, desktopOnly: false },
  { id: 'contact',          label: 'Contact',       icon: '✉️', defaultSize: { width: 420, height: 280 }, desktopOnly: false },
  { id: 'resume',           label: 'Resume',        icon: '📋', defaultSize: { width: 500, height: 420 }, desktopOnly: false },
  { id: 'finder',           label: 'Finder',        icon: '🗂',  defaultSize: { width: 600, height: 400 }, desktopOnly: false },
  { id: 'terminal',         label: 'Terminal',      icon: '💻', defaultSize: { width: 520, height: 360 }, desktopOnly: false },
  { id: 'games',            label: 'Games',         icon: '🎮', defaultSize: { width: 460, height: 380 }, desktopOnly: false },
  { id: 'aboutmac',    label: 'About This Mac',      icon: '🍎', defaultSize: { width: 420, height: 320 }, desktopOnly: false },
  { id: 'preferences', label: 'System Preferences',   icon: '⚙️', defaultSize: { width: 480, height: 380 }, desktopOnly: false },
  // Games — launched from Games folder, hidden from desktop icons & dock
  { id: 'snake',            label: 'Snake',         icon: '🐍', defaultSize: { width: 360, height: 420 }, desktopOnly: true },
  { id: 'minesweeper',      label: 'Minesweeper',   icon: '💣', defaultSize: { width: 340, height: 400 }, desktopOnly: true },
  { id: 'wordle',           label: 'Wordle',        icon: '🟩', defaultSize: { width: 400, height: 520 }, desktopOnly: true },
  { id: 'mastermind',       label: 'Mastermind',    icon: '🎯', defaultSize: { width: 360, height: 480 }, desktopOnly: true },
  { id: 'flappybird',       label: 'Flappy Bird',   icon: '🐦', defaultSize: { width: 360, height: 520 }, desktopOnly: true },
  { id: 'twentyfortyeight', label: '2048',          icon: '🔢', defaultSize: { width: 360, height: 440 }, desktopOnly: true },
  // iOS-only apps
  { id: 'imessage',         label: 'Messages',      icon: '💬', defaultSize: { width: 400, height: 500 }, desktopOnly: true },
] as const;

/** Apps that appear as icons on the desktop and in the dock */
export const VISIBLE_APPS = APPS.filter((a) => !a.desktopOnly);

export interface Internship {
  company: string;
  role: string;
  period: string;
  bullets: string[];
  tags: string[];
}

export const INTERNSHIPS: Internship[] = [
  {
    company: 'Cinch SG Pte. Ltd.',
    role: 'Software Engineer Intern',
    period: 'Jan 2026 – Present',
    bullets: [
      'Designed and architected agentic microservices workflows for chatbot integration with internal data warehouse.',
      'Developed Flask-based AI-powered product scraping tool to improve accuracy of internal price-estimation engine.',
    ],
    tags: ['Python', 'Flask', 'Agentic AI', 'Microservices'],
  },
  {
    company: 'Mindsprint Pte. Ltd. (Olam Group)',
    role: 'Full Stack Developer Intern',
    period: 'Aug 2025 – Dec 2025',
    bullets: [
      'Developed prototypes for Agentic Infrastructure platforms (AWS AgentCore), improving internal Agentic microservice deployment capabilities.',
      'Developed prototypes for LLM Servers such as OVMS, HuggingFace TEI/TGI and vLLM.',
    ],
    tags: ['AWS AgentCore', 'vLLM', 'HuggingFace', 'LLM Servers'],
  },
  {
    company: 'Central Provident Fund (CPF) Board',
    role: 'Software Engineer Intern',
    period: 'May 2025 – Aug 2025',
    bullets: [
      'Enhanced internal GenAI-powered knowledge assistant by revamping intranet scraping system and improving RAG capabilities for more accurate responses.',
      'Designed and developed a Flask-based Telegram bot to manage intern leave requests, improving HR efficiency through automation.',
    ],
    tags: ['Python', 'Flask', 'RAG', 'Telegram Bot', 'GenAI'],
  },
  {
    company: 'Singapore Management University (SCIS)',
    role: 'Research Software Engineer (LLM) Intern',
    period: 'May 2024 – Aug 2024',
    bullets: [
      'Led research initiatives on LLMs (GPT), evaluating their generative capabilities in code and passing test cases.',
      'Developed automation tools to iterate through GitHub Repositories for filling in code and running test cases.',
    ],
    tags: ['GPT', 'LLMs', 'Python', 'Research', 'Automation'],
  },
  {
    company: 'Ministry of Home Affairs (MHA)',
    role: 'Software Developer Intern',
    period: 'Dec 2023 – Apr 2024',
    bullets: [
      'Designed and built an AI-powered application for real-time web scraping, article summarization, and trend analysis for key internal stakeholders.',
      'Developed applications utilizing Retrieval-Augmented Generation (RAG) to automate factchecking, improving accuracy in document verification.',
    ],
    tags: ['RAG', 'Web Scraping', 'NLP', 'Python', 'AI'],
  },
  {
    company: 'Singapore Management University (SCIS)',
    role: 'Research Software Engineer (GenAI) Intern',
    period: 'May 2023 – Aug 2023',
    bullets: [
      'Led research on OpenAI\'s GPT Models to assess potential for educational content generation and evaluation.',
      'Designed and deployed a full-stack web application (FReMP stack) to automate resource generation, improving research workflow efficiency.',
    ],
    tags: ['GPT', 'GenAI', 'React', 'MongoDB', 'Flask', 'Research'],
  },
];

export interface Project {
  name: string;
  role: string;
  period: string;
  description: string;
  bullets: string[];
  tags: string[];
  link?: string;
}

export const PROJECTS: Project[] = [
  {
    name: 'ScamWise',
    role: 'Product Owner & Full Stack Developer',
    period: 'Jan 2025 – May 2025',
    description: 'A gamified scam education platform with real-time scam email and website detection.',
    bullets: [
      'Designed and developed key features including a gamified scam education platform and scam email/website detector.',
      'Collaborated with stakeholders and managed a cross-functional team to refine features and optimize user experience.',
      'Defined and prioritized product backlog, ensuring alignment with user needs and business goals.',
    ],
    tags: ['React', 'TypeScript', 'Python', 'AI/ML', 'Gamification'],
  },
  {
    name: 'SUTD What The Hack 2023',
    role: 'Finalist',
    period: 'Aug 2023',
    description: 'Hackathon finalist project: an elderly care web app with a Chatbot Companion and AI-powered fall detection.',
    bullets: [
      'Developed a web-application featuring a Chatbot Companion and Fall-Detection using computer vision.',
      'Focused on aiding elderly individuals in Singapore, particularly those living alone or with mental illnesses.',
    ],
    tags: ['Computer Vision', 'Chatbot', 'Python', 'React', 'Hackathon'],
    link: 'https://devpost.com',
  },
  {
    name: 'DomesticAID',
    role: 'Full Stack Developer',
    period: 'Aug 2022 – Dec 2022',
    description: 'A MEVN-stack prototype web application to support domestic workers in Singapore with help and social wellbeing resources.',
    bullets: [
      'Developed a prototype web-application using the MEVN stack (MongoDB, Express.js, Vue.js, Node.js).',
      'Focused on providing an outlet for help and social wellbeing for domestic workers in Singapore.',
    ],
    tags: ['Vue.js', 'Node.js', 'Express.js', 'MongoDB', 'MEVN'],
  },
];

export const SKILLS = {
  Languages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'PHP', 'SQL', 'HTML5', 'CSS3'],
  'Frameworks & Libraries': ['React.js', 'Next.js', 'Vue.js', 'Node.js', 'Flask', 'Spring Boot', 'Bootstrap', 'Pandas'],
  'Cloud & DevOps': ['AWS S3', 'AWS Athena', 'AWS Glue', 'AWS EMR', 'Docker', 'Kubernetes', 'Apache Airflow', 'Apache Spark', 'Hadoop', 'Git', 'CI/CD'],
  'AI & ML': ['LLMs', 'RAG', 'GenAI', 'OpenAI GPT', 'HuggingFace', 'vLLM', 'SAS Viya', 'Agentic AI'],
  Databases: ['MongoDB', 'MySQL', 'PostgreSQL'],
  Certifications: ['Oracle Certified Foundations Associate (Java)', 'SAS Certified Specialist: ML Using SAS Viya'],
};

export const PUBLICATION = {
  title: 'Teaching software development for real-world problems using a microservice-based collaborative problem-solving approach.',
  venue: 'ICSE-SEET 2024',
  conference: 'IEEE/ACM 46th International Conference on Software Engineering: Software Engineering Education and Training',
  location: 'Lisbon, April 14–20, 2024',
  pages: '22–33',
  link: 'https://ink.library.smu.edu.sg/sis_research/8758',
};

export const CONTACT = {
  email: '04christiankoh@gmail.com',
  linkedin: 'https://www.linkedin.com/in/04christiankoh/',
  phone: '+65 9732 7232',
  github: 'https://github.com/christianmk04',
};
