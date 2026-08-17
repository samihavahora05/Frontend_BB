import React, { useState, useRef, useEffect } from "react";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { AnimatedContent } from "../../../src/components/reactbits/AnimatedContent";
import { 
  Download, Trash2, Plus, Loader2, Palette, Sparkles, Target, 
  CheckCircle, AlertCircle, BookOpen, Award, 
  Code, Search, ExternalLink, Globe, Layers, FileCheck, X,
  FolderGit2, ShieldCheck, Mail, Phone, MapPin, Linkedin, Github
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../src/context/AuthContext";
import api from "../../../src/lib/axios";
import toast from "react-hot-toast";

// ── Types ──────────────────────────────────────────────────────
interface EduEntry {
  id: number;
  school: string;
  degree: string;
  duration: string;
  cgpa: string;
  coursework?: string;
}

interface ExpEntry {
  id: number;
  company: string;
  role: string;
  duration: string;
  desc: string;
}

interface InternshipEntry {
  id: number;
  company: string;
  role: string;
  duration: string;
  desc: string;
  technologies: string;
}

interface ProjectEntry {
  id: number;
  title: string;
  desc: string;
  tech: string;
  role: string;
  duration: string;
  githubUrl: string;
  liveUrl: string;
  contributions: string;
}

interface CertEntry {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  skills: string;
  isPlanned?: boolean;
}

interface CustomEntry {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  desc: string;
  link: string;
}

interface CustomSection {
  id: number;
  sectionTitle: string;
  entries: CustomEntry[];
}

const inputCls =
  "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none";
const labelCls = "block text-xs font-bold text-slate-500 uppercase mb-1.5";
const sectionCard = "bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 relative";

// Preset Certifications Data for Search Explorer
const POPULAR_CERTIFICATIONS = [
  { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", role: "Cloud", level: "Beginner", skills: "AWS, Cloud Computing, IAM, S3", link: "https://aws.amazon.com/certification/" },
  { name: "Meta Front-End Developer Professional Certificate", issuer: "Meta / Coursera", role: "Frontend Developer", level: "Intermediate", skills: "React, JavaScript, HTML/CSS, UI/UX", link: "https://www.coursera.org/professional-certificates/meta-front-end-developer" },
  { name: "Google Data Analytics Professional Certificate", issuer: "Google", role: "Data Analyst", level: "Beginner", skills: "SQL, R, Tableau, Data Visualization", link: "https://www.coursera.org/professional-certificates/google-data-analytics" },
  { name: "Microsoft Certified: Azure Fundamentals (AZ-900)", issuer: "Microsoft", role: "Cloud", level: "Beginner", skills: "Azure, Cloud Architecture, Security", link: "https://learn.microsoft.com/certifications/azure-fundamentals/" },
  { name: "Oracle Certified Associate, Java SE Programmer", issuer: "Oracle", role: "Software Engineer", level: "Intermediate", skills: "Java, OOP, Data Structures", link: "https://education.oracle.com/java-certification" },
  { name: "Cisco Certified Network Associate (CCNA)", issuer: "Cisco", role: "Cybersecurity", level: "Intermediate", skills: "Networking, Routing, Switching, Security", link: "https://www.cisco.com/c/en/us/training-events/vendor-certificates/ccna.html" },
  { name: "Full Stack Web Development with React & Node", issuer: "BlueBoxx DA", role: "Full Stack Developer", level: "Intermediate", skills: "React, Node.js, Express, MongoDB, REST APIs", link: "/courses" },
  { name: "Python for Data Science & AI", issuer: "IBM / NPTEL", role: "Data Analyst", level: "Beginner", skills: "Python, Pandas, NumPy, Machine Learning", link: "https://nptel.ac.in/" },
];

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);

  // Cert Explorer Modal
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certSearchQuery, setCertSearchQuery] = useState("");

  // Job Description Analyzer
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [jobDescriptionInput, setJobDescriptionInput] = useState("");
  const [jdAnalysis, setJdAnalysis] = useState<any>(null);
  const [isAnalyzingJd, setIsAnalyzingJd] = useState(false);

  const { user } = useAuth();

  // ── Personal Info State ─────────────────────────────────────
  const [fullName, setFullName] = useState(user?.name || "SAMIHA VAHORA");
  const [jobTitle, setJobTitle] = useState("Frontend Developer");
  const [phone, setPhone] = useState(user?.phone || "+91 9876543210");
  const [location, setLocation] = useState("Bangalore, India");
  const [linkedin, setLinkedin] = useState("linkedin.com/in/samihavahora");
  const [github, setGithub] = useState("github.com/isamihavahora");
  const [portfolio, setPortfolio] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [hackerrank, setHackerrank] = useState("");
  const [summary, setSummary] = useState(
    "Passionate and detail-oriented Frontend Developer with experience in building responsive and user-friendly web applications using React and Next.js. Strong focus on UI/UX, performance optimization, and writing clean, maintainable code."
  );
  const [objective, setObjective] = useState(
    "Seeking an entry-level Frontend Developer or Software Engineer role to leverage my React and JavaScript skills to build scalable web apps."
  );

  // ── Education State ─────────────────────────────────────────
  const [eduList, setEduList] = useState<EduEntry[]>([
    { id: 1, school: "NIT Trichy", degree: "B.Tech in Computer Science", duration: "2022 – 2026", cgpa: "8.5/10", coursework: "Data Structures, Algorithms, Web Engineering, Database Management Systems" },
  ]);

  // ── Experience & Internships State ──────────────────────────
  const [expList, setExpList] = useState<ExpEntry[]>([
    {
      id: 1,
      company: "Tech Corp",
      role: "Frontend Developer Intern",
      duration: "Jan 2026 – Present",
      desc: "• Developed responsive web applications using React and Next.js.\n• Collaborated with designers to implement pixel-perfect UI components.\n• Integrated REST APIs and handled state management using Redux.\n• Optimized application performance and improved load time by 30%.",
    },
  ]);

  const [internshipList, setInternshipList] = useState<InternshipEntry[]>([
    {
      id: 1,
      company: "Brainwave Matrix Solutions",
      role: "Software Engineering Intern",
      duration: "May 2025 – Aug 2025",
      desc: "• Built and maintained frontend modules using React, Tailwind CSS, and TypeScript.\n• Implemented reusable components and improved UI consistency.\n• Fixed bugs and optimized existing features to enhance performance.",
      technologies: "React, Tailwind CSS, TypeScript"
    }
  ]);

  // ── Projects State ──────────────────────────────────────────
  const [projectList, setProjectList] = useState<ProjectEntry[]>([
    {
      id: 1,
      title: "E-Learning Platform Portal",
      desc: "Developed a responsive e-learning platform with course browsing, user authentication, and dashboard.",
      tech: "React, Next.js, Tailwind CSS, Node.js, MySQL",
      role: "Lead Developer",
      duration: "3 months",
      githubUrl: "github.com/example/elearning-portal",
      liveUrl: "elearning-demo.example.com",
      contributions: "• Developed a responsive e-learning platform with course browsing, user authentication, and dashboard.\n• Implemented payment integration and real-time progress tracking.\n• Improved performance and accessibility."
    },
    {
      id: 2,
      title: "Task Manager Application",
      desc: "Created a task management application with CRUD operations and real-time updates.",
      tech: "React, Redux Toolkit, Node.js, Express, MongoDB",
      role: "Full Stack Developer",
      duration: "2 months",
      githubUrl: "github.com/example/task-manager",
      liveUrl: "task-manager-demo.example.com",
      contributions: "• Created a task management application with CRUD operations.\n• Implemented authentication and real-time update features.\n• Deployed using Vercel (frontend) and Render (backend)."
    }
  ]);

  // ── Categorized Skills State ────────────────────────────────
  const [skillCategories, setSkillCategories] = useState({
    languages: ["JavaScript", "TypeScript", "SQL"],
    frontend: ["React.js", "Next.js", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Redux Toolkit"],
    backend: ["Node.js", "Express.js", "REST APIs"],
    database: ["MongoDB", "MySQL", "Firebase"],
    tools: ["VS Code", "Postman", "Figma", "Vercel", "Netlify", "Render", "Docker (Basic)", "Git", "GitHub"],
    softSkills: ["Data Structures", "Algorithms", "OOPs", "Git", "Problem Solving"],
    custom: [] as string[]
  });

  const [newSkillInput, setNewSkillInput] = useState("");
  const [skillCategorySelect, setSkillCategorySelect] = useState<keyof typeof skillCategories>("frontend");

  // ── Certifications State ───────────────────────────────────
  const [certList, setCertList] = useState<CertEntry[]>([
    {
      id: 1,
      name: "React – The Complete Guide (incl. Hooks, React Router, Redux)",
      issuer: "Udemy",
      issueDate: "Nov 2025",
      credentialId: "",
      credentialUrl: "udemy.com/certificate/react-complete",
      skills: "React, Redux, Hooks",
      isPlanned: false
    },
    {
      id: 2,
      name: "JavaScript Algorithms and Data Structures",
      issuer: "freeCodeCamp",
      issueDate: "Oct 2025",
      credentialId: "",
      credentialUrl: "freecodecamp.org/certification/js-algorithms",
      skills: "JavaScript, ES6, Algorithms",
      isPlanned: false
    },
    {
      id: 3,
      name: "Responsive Web Design Certification",
      issuer: "freeCodeCamp",
      issueDate: "Aug 2025",
      credentialId: "",
      credentialUrl: "freecodecamp.org/certification/responsive-web",
      skills: "HTML5, CSS3, Flexbox, Grid",
      isPlanned: false
    }
  ]);

  // ── Additional Sections State ──────────────────────────────
  const [achievements, setAchievements] = useState<string>(
    "• Solved 250+ DSA problems on LeetCode.\n• 5-star problem solver on HackerRank.\n• Participated in Smart India Hackathon 2024.\n• Winner of Intra College Coding Contest 2023."
  );
  const [languages, setLanguages] = useState<string>("English – Fluent, Hindi – Native, Gujarati – Native");
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);

  // ── Styling & Template State ────────────────────────────────
  const accentColors = ["#1B2A6B", "#C9A227", "#0d1635", "#0f766e", "#b91c1c", "#7c3aed", "#0369a1", "#374151"];
  const [accent, setAccent] = useState(accentColors[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<"classic" | "modern" | "minimal">("classic");
  const previewRef = useRef<HTMLDivElement>(null);

  // ── Load saved resume data on mount ────────────────────────
  useEffect(() => {
    api.get("/student/profile")
      .then((res) => {
        const data = res.data?.data;
        if (data?.bio && data.bio.startsWith('{')) {
          try {
            const rd = JSON.parse(data.bio);
            if (rd.fullName) setFullName(rd.fullName);
            if (rd.jobTitle) setJobTitle(rd.jobTitle);
            if (rd.phone) setPhone(rd.phone);
            if (rd.location) setLocation(rd.location);
            if (rd.linkedin) setLinkedin(rd.linkedin);
            if (rd.github) setGithub(rd.github);
            if (rd.portfolio) setPortfolio(rd.portfolio);
            if (rd.leetcode) setLeetcode(rd.leetcode);
            if (rd.hackerrank) setHackerrank(rd.hackerrank);
            if (rd.summary) setSummary(rd.summary);
            if (rd.objective) setObjective(rd.objective);
            if (rd.eduList) setEduList(rd.eduList);
            if (rd.expList) setExpList(rd.expList);
            if (rd.internshipList) setInternshipList(rd.internshipList);
            if (rd.projectList) setProjectList(rd.projectList);
            if (rd.skillCategories) setSkillCategories(rd.skillCategories);
            if (rd.certList) setCertList(rd.certList);
            if (rd.achievements) setAchievements(rd.achievements);
            if (rd.languages) setLanguages(rd.languages);
            if (rd.customSections) setCustomSections(rd.customSections);
            if (rd.targetRole) setTargetRole(rd.targetRole);
            if (rd.accent) setAccent(rd.accent);
            if (rd.selectedTemplate) setSelectedTemplate(rd.selectedTemplate);
          } catch (e) {
            console.error("Error parsing saved resume data", e);
          }
        }
      })
      .catch(() => {});
  }, []);

  // ── Save Resume Handler ──────────────────────────────────────
  const handleSaveResume = async () => {
    try {
      setIsSaving(true);
      const resumeData = {
        fullName, jobTitle, phone, location, linkedin, github, portfolio,
        leetcode, hackerrank, summary, objective, eduList, expList,
        internshipList, projectList, skillCategories, certList,
        achievements, languages, customSections, targetRole, accent, selectedTemplate
      };
      await api.put("/student/profile", {
        bio: JSON.stringify(resumeData),
        phone,
        location
      });
      toast.success("Resume saved successfully!");
    } catch (err) {
      toast.error("Failed to save resume data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    window.print();
    setTimeout(() => setIsDownloading(false), 1500);
  };

  // ── Handlers for Arrays ──────────────────────────────────────
  const addEdu = () => setEduList((p) => [...p, { id: Date.now(), school: "", degree: "", duration: "", cgpa: "", coursework: "" }]);
  const removeEdu = (id: number) => setEduList((p) => p.filter((e) => e.id !== id));
  const updateEdu = (id: number, field: keyof EduEntry, val: string) =>
    setEduList((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  const addExp = () => setExpList((p) => [...p, { id: Date.now(), company: "", role: "", duration: "", desc: "" }]);
  const removeExp = (id: number) => setExpList((p) => p.filter((e) => e.id !== id));
  const updateExp = (id: number, field: keyof ExpEntry, val: string) =>
    setExpList((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  const addInternship = () => setInternshipList((p) => [...p, { id: Date.now(), company: "", role: "", duration: "", desc: "", technologies: "" }]);
  const removeInternship = (id: number) => setInternshipList((p) => p.filter((e) => e.id !== id));
  const updateInternship = (id: number, field: keyof InternshipEntry, val: string) =>
    setInternshipList((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  const addProject = () => setProjectList((p) => [...p, { id: Date.now(), title: "", desc: "", tech: "", role: "", duration: "", githubUrl: "", liveUrl: "", contributions: "" }]);
  const removeProject = (id: number) => setProjectList((p) => p.filter((e) => e.id !== id));
  const updateProject = (id: number, field: keyof ProjectEntry, val: string) =>
    setProjectList((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  const addCert = () => setCertList((p) => [...p, { id: Date.now(), name: "", issuer: "", issueDate: "", credentialId: "", credentialUrl: "", skills: "", isPlanned: false }]);
  const removeCert = (id: number) => setCertList((p) => p.filter((e) => e.id !== id));
  const updateCert = (id: number, field: keyof CertEntry, val: any) =>
    setCertList((p) => p.map((e) => (e.id === id ? { ...e, [field]: val } : e)));

  const addCustomSection = () => {
    const title = prompt("Enter Custom Section Title (e.g., Hackathons, Publications, Volunteering):");
    if (title && title.trim()) {
      setCustomSections((p) => [
        ...p,
        {
          id: Date.now(),
          sectionTitle: title.trim(),
          entries: [{ id: Date.now(), title: "", subtitle: "", date: "", desc: "", link: "" }]
        }
      ]);
    }
  };

  const removeCustomSection = (secId: number) => setCustomSections((p) => p.filter((s) => s.id !== secId));

  const addCustomEntry = (secId: number) => {
    setCustomSections((p) =>
      p.map((s) =>
        s.id === secId
          ? {
              ...s,
              entries: [...s.entries, { id: Date.now(), title: "", subtitle: "", date: "", desc: "", link: "" }]
            }
          : s
      )
    );
  };

  const updateCustomEntry = (secId: number, entryId: number, field: keyof CustomEntry, val: string) => {
    setCustomSections((p) =>
      p.map((s) =>
        s.id === secId
          ? {
              ...s,
              entries: s.entries.map((e) => (e.id === entryId ? { ...e, [field]: val } : e))
            }
          : s
      )
    );
  };

  const removeCustomEntry = (secId: number, entryId: number) => {
    setCustomSections((p) =>
      p.map((s) =>
        s.id === secId
          ? { ...s, entries: s.entries.filter((e) => e.id !== entryId) }
          : s
      )
    );
  };

  // Skill Add / Delete
  const handleAddSkillCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const val = newSkillInput.trim();
    setSkillCategories((prev) => ({
      ...prev,
      [skillCategorySelect]: Array.from(new Set([...prev[skillCategorySelect], val]))
    }));
    setNewSkillInput("");
  };

  const removeSkillFromCategory = (category: keyof typeof skillCategories, idx: number) => {
    setSkillCategories((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== idx)
    }));
  };

  // Polish Project Quality Action
  const polishProjectDesc = (projId: number) => {
    const proj = projectList.find((p) => p.id === projId);
    if (!proj) return;
    const tech = proj.tech || "modern web technologies";
    const improvedContributions =
      `• Developed a responsive web application leveraging ${tech}.\n` +
      `• Implemented modular component architecture and REST API endpoints ensuring pixel-perfect UI.\n` +
      `• Optimized performance and overall application load time by 30%.`;
    
    updateProject(projId, "contributions", improvedContributions);
    toast.success("Project contributions enhanced with impact action verbs!");
  };

  // Add Certification from Search Explorer
  const handleAddPresetCert = (preset: typeof POPULAR_CERTIFICATIONS[0]) => {
    const newCert: CertEntry = {
      id: Date.now(),
      name: preset.name,
      issuer: preset.issuer,
      issueDate: "Planned / In Progress",
      credentialId: "",
      credentialUrl: preset.link,
      skills: preset.skills,
      isPlanned: true
    };
    setCertList((prev) => [...prev, newCert]);
    toast.success(`Added "${preset.name}" to your Planned Certifications!`);
    setIsCertModalOpen(false);
  };

  // Analyze Job Description Handler
  const handleAnalyzeJD = () => {
    if (!jobDescriptionInput.trim()) {
      toast.error("Please paste a job description first.");
      return;
    }
    setIsAnalyzingJd(true);
    setTimeout(() => {
      const text = jobDescriptionInput.toLowerCase();
      const allStudentSkills = Object.values(skillCategories).flat().map((s) => s.toLowerCase());

      const commonKeywords = ["react", "next.js", "typescript", "javascript", "node.js", "python", "sql", "html", "css", "tailwind", "git", "rest api", "docker", "figma", "agile"];
      const jdPresentKeywords = commonKeywords.filter((kw) => text.includes(kw));

      const matchedSkills = jdPresentKeywords.filter((kw) => allStudentSkills.some((sk) => sk.includes(kw)));
      const missingSkills = jdPresentKeywords.filter((kw) => !allStudentSkills.some((sk) => sk.includes(kw)));

      const matchScore = jdPresentKeywords.length > 0 ? Math.round((matchedSkills.length / jdPresentKeywords.length) * 100) : 75;

      setJdAnalysis({
        matchScore,
        matchedSkills,
        missingSkills,
        targetRoleFound: targetRole,
        recommendations: [
          `Add missing tech keywords like ${missingSkills.slice(0, 3).join(", ").toUpperCase() || "TypeScript, REST APIs"} to your Skills section if you have working knowledge.`,
          "Ensure your project contribution bullet points use action verbs matching the job responsibilities."
        ]
      });
      setIsAnalyzingJd(false);
    }, 1500);
  };

  // Calculate Real Completeness & ATS Score
  const calculateCompleteness = () => {
    let score = 0;
    if (fullName && phone && location) score += 15;
    if (summary || objective) score += 15;
    if (eduList.length > 0 && eduList[0].school) score += 20;
    if (expList.length > 0 || internshipList.length > 0) score += 20;
    if (projectList.length > 0 && projectList[0].title) score += 15;
    const totalSkills = Object.values(skillCategories).flat().length;
    if (totalSkills >= 5) score += 15;
    return Math.min(100, score);
  };

  const calculateAtsScore = () => {
    let ats = 50;
    if (linkedin || github) ats += 10;
    if (summary.length > 50) ats += 10;
    if (eduList.length > 0) ats += 10;
    if (projectList.length >= 2) ats += 10;
    if (certList.length > 0) ats += 5;
    const totalSkills = Object.values(skillCategories).flat().length;
    if (totalSkills >= 8) ats += 5;
    return Math.min(98, ats);
  };

  const completenessScore = calculateCompleteness();
  const atsScore = calculateAtsScore();

  // Filtered Preset Certs for Modal
  const filteredPresetCerts = POPULAR_CERTIFICATIONS.filter((c) =>
    c.name.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
    c.skills.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(certSearchQuery.toLowerCase())
  );

  return (
    <StudentDashboardLayout>
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm 8mm 6mm 8mm;
          }
          html, body {
            height: auto !important;
            overflow: visible !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, nav, aside, footer, .no-print, button, .StudentDashboardLayout_sidebar {
            display: none !important;
          }
          .resume-preview-print {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            height: auto !important;
          }
          .resume-print-area {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .resume-section-block {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <AnimatedContent direction="up" delay={0.1}>
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800 mb-1">Resume Builder</h1>
              <p className="text-sm font-medium text-slate-500">
                Create a professional ATS-friendly resume for job & internship applications.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveResume}
                disabled={isSaving}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 text-sm"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                Save Resume
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-6 py-2.5 bg-[#1B2A6B] text-white rounded-xl font-bold hover:bg-[#0d1635] transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
              >
                {isDownloading ? (
                  <><Loader2 size={18} className="animate-spin" /> Downloading...</>
                ) : (
                  <><Download size={18} /> Download PDF</>
                )}
              </button>
            </div>
          </div>
        </AnimatedContent>

        <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-[600px]">

          {/* ── Editor ── */}
          <AnimatedContent direction="up" delay={0.2} className="w-full lg:w-1/2 flex flex-col">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">

              {/* Navigation Tabs Bar */}
              <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/50 scrollbar-none">
                {[
                  { id: "personal", label: "Personal" },
                  { id: "education", label: "Education" },
                  { id: "experience", label: "Experience" },
                  { id: "internships", label: "Internships" },
                  { id: "projects", label: "Projects" },
                  { id: "skills", label: "Skills" },
                  { id: "certifications", label: "Certifications" },
                  { id: "additional", label: "Additional" },
                  { id: "job targeting", label: "Targeting" },
                  { id: "ai analysis", label: "AI Analysis", isSparkle: true }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
                      activeTab === t.id
                        ? t.isSparkle ? "border-purple-600 text-purple-700 bg-purple-50/50" : "border-[#1B2A6B] text-[#1B2A6B] bg-white"
                        : t.isSparkle ? "border-transparent text-purple-500 hover:text-purple-700" : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t.isSparkle && <Sparkles size={13} />}
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-4">

                {/* ── Personal Tab ── */}
                {activeTab === "personal" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Full Name</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Target Job Title</label>
                        <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={inputCls} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Phone Number</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>City / Location</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputCls} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>LinkedIn Profile</label>
                        <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/username" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>GitHub Profile</label>
                        <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/username" className={inputCls} />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className={labelCls}>Portfolio Link</label>
                        <input type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="myportfolio.com" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>LeetCode</label>
                        <input type="url" value={leetcode} onChange={(e) => setLeetcode(e.target.value)} placeholder="leetcode.com/user" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>HackerRank</label>
                        <input type="url" value={hackerrank} onChange={(e) => setHackerrank(e.target.value)} placeholder="hackerrank.com/user" className={inputCls} />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Professional Summary</label>
                      <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} className={`${inputCls} resize-none`} placeholder="Highlight your top technical skills and career strengths..." />
                    </div>

                    <div>
                      <label className={labelCls}>Career Objective (Optional)</label>
                      <textarea rows={2} value={objective} onChange={(e) => setObjective(e.target.value)} className={`${inputCls} resize-none`} placeholder="Describe your goal for entry-level roles or internships..." />
                    </div>
                  </div>
                )}

                {/* ── Education Tab ── */}
                {activeTab === "education" && (
                  <div className="space-y-4">
                    {eduList.map((edu, idx) => (
                      <div key={edu.id} className={sectionCard}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#1B2A6B] uppercase tracking-wider">
                            Education {eduList.length > 1 ? `#${idx + 1}` : ""}
                          </span>
                          {eduList.length > 1 && (
                            <button onClick={() => removeEdu(edu.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        <div>
                          <label className={labelCls}>School / College / University</label>
                          <input type="text" value={edu.school} onChange={(e) => updateEdu(edu.id, "school", e.target.value)} placeholder="e.g. NIT Trichy" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Degree / Specialization</label>
                          <input type="text" value={edu.degree} onChange={(e) => updateEdu(edu.id, "degree", e.target.value)} placeholder="e.g. B.Tech in Computer Science" className={inputCls} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Duration / Graduation Year</label>
                            <input type="text" value={edu.duration} onChange={(e) => updateEdu(edu.id, "duration", e.target.value)} placeholder="e.g. 2022 – 2026" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>CGPA / Grade</label>
                            <input type="text" value={edu.cgpa} onChange={(e) => updateEdu(edu.id, "cgpa", e.target.value)} placeholder="e.g. 8.5/10 or 85%" className={inputCls} />
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Relevant Coursework & Modules</label>
                          <input type="text" value={edu.coursework || ""} onChange={(e) => updateEdu(edu.id, "coursework", e.target.value)} placeholder="e.g. Data Structures, Web Engineering, DBMS" className={inputCls} />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addEdu}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-[#1B2A6B]/30 rounded-xl text-sm font-bold text-[#1B2A6B] hover:border-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-all"
                    >
                      <Plus size={16} /> Add Education Entry
                    </button>
                  </div>
                )}

                {/* ── Experience Tab ── */}
                {activeTab === "experience" && (
                  <div className="space-y-4">
                    {expList.length === 0 && (
                      <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                        <p className="text-sm font-medium text-slate-500">
                          No full-time experience? Freshers can focus on Internships, Projects, and Education.
                        </p>
                      </div>
                    )}
                    {expList.map((exp, idx) => (
                      <div key={exp.id} className={sectionCard}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#1B2A6B] uppercase tracking-wider">
                            Work Experience {expList.length > 1 ? `#${idx + 1}` : ""}
                          </span>
                          <button onClick={() => removeExp(exp.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div>
                          <label className={labelCls}>Company Name</label>
                          <input type="text" value={exp.company} onChange={(e) => updateExp(exp.id, "company", e.target.value)} placeholder="e.g. Tech Corp" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Job Role / Designation</label>
                          <input type="text" value={exp.role} onChange={(e) => updateExp(exp.id, "role", e.target.value)} placeholder="e.g. Frontend Developer" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Duration</label>
                          <input type="text" value={exp.duration} onChange={(e) => updateExp(exp.id, "duration", e.target.value)} placeholder="e.g. Jan 2026 – Present" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Key Responsibilities (one bullet per line)</label>
                          <textarea
                            rows={3}
                            value={exp.desc}
                            onChange={(e) => updateExp(exp.id, "desc", e.target.value)}
                            placeholder={"Developed responsive web apps using React.\nOptimized backend query times by 35%."}
                            className={`${inputCls} resize-none`}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addExp}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-[#1B2A6B]/30 rounded-xl text-sm font-bold text-[#1B2A6B] hover:border-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-all"
                    >
                      <Plus size={16} /> Add Experience Entry
                    </button>
                  </div>
                )}

                {/* ── Internships Tab ── */}
                {activeTab === "internships" && (
                  <div className="space-y-4">
                    {internshipList.map((intern, idx) => (
                      <div key={intern.id} className={sectionCard}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#1B2A6B] uppercase tracking-wider">
                            Internship {internshipList.length > 1 ? `#${idx + 1}` : ""}
                          </span>
                          <button onClick={() => removeInternship(intern.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div>
                          <label className={labelCls}>Company / Organization</label>
                          <input type="text" value={intern.company} onChange={(e) => updateInternship(intern.id, "company", e.target.value)} placeholder="e.g. Brainwave Matrix Solutions" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Internship Role</label>
                          <input type="text" value={intern.role} onChange={(e) => updateInternship(intern.id, "role", e.target.value)} placeholder="e.g. Software Engineering Intern" className={inputCls} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>Duration</label>
                            <input type="text" value={intern.duration} onChange={(e) => updateInternship(intern.id, "duration", e.target.value)} placeholder="e.g. May 2025 – Aug 2025" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Technologies Used</label>
                            <input type="text" value={intern.technologies} onChange={(e) => updateInternship(intern.id, "technologies", e.target.value)} placeholder="e.g. React, Tailwind CSS, TypeScript" className={inputCls} />
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Key Contributions</label>
                          <textarea
                            rows={3}
                            value={intern.desc}
                            onChange={(e) => updateInternship(intern.id, "desc", e.target.value)}
                            placeholder="Built features and solved bugs..."
                            className={`${inputCls} resize-none`}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addInternship}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-[#1B2A6B]/30 rounded-xl text-sm font-bold text-[#1B2A6B] hover:border-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-all"
                    >
                      <Plus size={16} /> Add Internship Entry
                    </button>
                  </div>
                )}

                {/* ── Projects Tab ── */}
                {activeTab === "projects" && (
                  <div className="space-y-4">
                    {projectList.map((proj, idx) => (
                      <div key={proj.id} className={sectionCard}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#1B2A6B] uppercase tracking-wider">
                            Project {projectList.length > 1 ? `#${idx + 1}` : ""}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => polishProjectDesc(proj.id)}
                              className="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors flex items-center gap-1"
                              title="Enhance wording with impact verbs"
                            >
                              <Sparkles size={12} /> AI Polish
                            </button>
                            <button onClick={() => removeProject(proj.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className={labelCls}>Project Title</label>
                          <input type="text" value={proj.title} onChange={(e) => updateProject(proj.id, "title", e.target.value)} placeholder="e.g. E-Learning Platform Portal" className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Technologies & Tools</label>
                          <input type="text" value={proj.tech} onChange={(e) => updateProject(proj.id, "tech", e.target.value)} placeholder="e.g. React, Next.js, Tailwind CSS, Node.js, MySQL" className={inputCls} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelCls}>GitHub Repository URL</label>
                            <input type="text" value={proj.githubUrl} onChange={(e) => updateProject(proj.id, "githubUrl", e.target.value)} placeholder="github.com/user/project" className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Duration</label>
                            <input type="text" value={proj.duration} onChange={(e) => updateProject(proj.id, "duration", e.target.value)} placeholder="e.g. 3 months" className={inputCls} />
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Project Contributions & Impact (one per line)</label>
                          <textarea
                            rows={3}
                            value={proj.contributions}
                            onChange={(e) => updateProject(proj.id, "contributions", e.target.value)}
                            placeholder="Developed responsive dashboard with filter search..."
                            className={`${inputCls} resize-none`}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addProject}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-[#1B2A6B]/30 rounded-xl text-sm font-bold text-[#1B2A6B] hover:border-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-all"
                    >
                      <Plus size={16} /> Add Project Entry
                    </button>
                  </div>
                )}

                {/* ── Skills Tab ── */}
                {activeTab === "skills" && (
                  <div className="space-y-6">
                    <form onSubmit={handleAddSkillCategory} className="flex gap-2">
                      <select
                        value={skillCategorySelect}
                        onChange={(e) => setSkillCategorySelect(e.target.value as any)}
                        className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                      >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="languages">Languages</option>
                        <option value="tools">Tools & Tech</option>
                        <option value="softSkills">Other / Soft Skills</option>
                        <option value="custom">Custom</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Add new skill..."
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1B2A6B] outline-none"
                      />
                      <button type="submit" className="px-4 py-2.5 bg-[#1B2A6B] text-white font-bold rounded-xl hover:bg-[#0d1635] text-sm">
                        Add Skill
                      </button>
                    </form>

                    {/* Categorized Skills Display */}
                    {[
                      { key: "frontend", label: "Frontend Development" },
                      { key: "backend", label: "Backend Development" },
                      { key: "database", label: "Database" },
                      { key: "languages", label: "Languages" },
                      { key: "tools", label: "Tools & Technologies" },
                      { key: "softSkills", label: "Other Skills / Soft Skills" },
                      { key: "custom", label: "Custom Skills" }
                    ].map((cat) => {
                      const skills = skillCategories[cat.key as keyof typeof skillCategories] || [];
                      if (skills.length === 0 && cat.key === "custom") return null;
                      return (
                        <div key={cat.key} className="space-y-2">
                          <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">{cat.label}</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                                {skill}
                                <button type="button" onClick={() => removeSkillFromCategory(cat.key as any, idx)} className="text-slate-400 hover:text-red-500">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                            {skills.length === 0 && <span className="text-xs text-slate-400 italic">No skills added in this category</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── Certifications Tab ── */}
                {activeTab === "certifications" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Your Certifications</h3>
                      <button
                        onClick={() => setIsCertModalOpen(true)}
                        className="px-3.5 py-1.5 bg-[#C9A227]/10 text-[#0d1635] border border-[#C9A227]/30 hover:bg-[#C9A227]/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Search size={14} className="text-[#C9A227]" /> Explore Certifications
                      </button>
                    </div>

                    <div className="space-y-4">
                      {certList.map((cert, idx) => (
                        <div key={cert.id} className={sectionCard}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#1B2A6B] uppercase tracking-wider flex items-center gap-1.5">
                              <Award size={14} className="text-[#C9A227]" />
                              {cert.isPlanned ? "Planned / Recommended Certification" : `Certification #${idx + 1}`}
                            </span>
                            <button onClick={() => removeCert(cert.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelCls}>Certification Name</label>
                              <input type="text" value={cert.name} onChange={(e) => updateCert(cert.id, "name", e.target.value)} placeholder="e.g. React – The Complete Guide" className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Issuing Organization</label>
                              <input type="text" value={cert.issuer} onChange={(e) => updateCert(cert.id, "issuer", e.target.value)} placeholder="e.g. Udemy / freeCodeCamp" className={inputCls} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelCls}>Issue Date / Status</label>
                              <input type="text" value={cert.issueDate} onChange={(e) => updateCert(cert.id, "issueDate", e.target.value)} placeholder="e.g. Nov 2025" className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Credential URL</label>
                              <input type="text" value={cert.credentialUrl} onChange={(e) => updateCert(cert.id, "credentialUrl", e.target.value)} placeholder="coursera.org/verify/..." className={inputCls} />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={addCert}
                        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-[#1B2A6B]/30 rounded-xl text-sm font-bold text-[#1B2A6B] hover:border-[#1B2A6B] hover:bg-[#1B2A6B]/5 transition-all"
                      >
                        <Plus size={16} /> Add Certification Entry
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Additional Tab ── */}
                {activeTab === "additional" && (
                  <div className="space-y-6">
                    <div>
                      <label className={labelCls}>Achievements & Honors (one bullet per line)</label>
                      <textarea rows={4} value={achievements} onChange={(e) => setAchievements(e.target.value)} className={`${inputCls} resize-none`} placeholder="• Solved 250+ DSA problems on LeetCode..." />
                    </div>

                    <div>
                      <label className={labelCls}>Languages Spoken</label>
                      <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} className={inputCls} placeholder="English – Fluent, Hindi – Native..." />
                    </div>

                    {/* Custom Sections */}
                    <div className="space-y-4 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Custom Resume Sections</h4>
                        <button onClick={addCustomSection} className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center gap-1">
                          <Plus size={14} /> Add Custom Section
                        </button>
                      </div>

                      {customSections.map((sec) => (
                        <div key={sec.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 relative">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-xs font-extrabold text-[#1B2A6B] uppercase">{sec.sectionTitle}</span>
                            <button onClick={() => removeCustomSection(sec.id)} className="text-slate-400 hover:text-red-500">
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {sec.entries.map((ent) => (
                            <div key={ent.id} className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
                              <div className="flex justify-between items-center">
                                <input
                                  type="text"
                                  placeholder="Title (e.g. Volunteer Lead)"
                                  value={ent.title}
                                  onChange={(e) => updateCustomEntry(sec.id, ent.id, "title", e.target.value)}
                                  className="text-xs font-bold text-slate-800 border-b border-slate-200 outline-none w-full mr-2"
                                />
                                <button onClick={() => removeCustomEntry(sec.id, ent.id)} className="text-slate-300 hover:text-red-500">
                                  <X size={13} />
                                </button>
                              </div>
                              <textarea
                                rows={2}
                                placeholder="Description / details..."
                                value={ent.desc}
                                onChange={(e) => updateCustomEntry(sec.id, ent.id, "desc", e.target.value)}
                                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none resize-none"
                              />
                            </div>
                          ))}

                          <button onClick={() => addCustomEntry(sec.id)} className="text-xs font-bold text-[#1B2A6B] hover:underline flex items-center gap-1">
                            <Plus size={13} /> Add Entry to {sec.sectionTitle}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Targeting Tab ── */}
                {activeTab === "job targeting" && (
                  <div className="space-y-6">
                    <div>
                      <label className={labelCls}>Target Career Role</label>
                      <select
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className={inputCls}
                      >
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="React Developer">React Developer</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="UI/UX Designer">UI/UX Designer</option>
                        <option value="Android Developer">Android Developer</option>
                      </select>
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Target size={15} className="text-[#1B2A6B]" /> Paste Job Description for Analysis
                      </h4>
                      <textarea
                        rows={5}
                        placeholder="Paste requirements from real job postings here..."
                        value={jobDescriptionInput}
                        onChange={(e) => setJobDescriptionInput(e.target.value)}
                        className={`${inputCls} resize-none font-sans`}
                      />
                      <button
                        onClick={handleAnalyzeJD}
                        disabled={isAnalyzingJd}
                        className="w-full py-3 bg-[#1B2A6B] text-white font-bold rounded-xl hover:bg-[#0d1635] transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                      >
                        {isAnalyzingJd ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        Analyze Job Requirements & Keywords
                      </button>

                      {jdAnalysis && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-slate-800">Job Keyword Match Score</span>
                            <span className="text-lg font-black text-[#C9A227]">{jdAnalysis.matchScore}%</span>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-bold text-emerald-700">Matched Skills ({jdAnalysis.matchedSkills.length})</p>
                            <div className="flex flex-wrap gap-1">
                              {jdAnalysis.matchedSkills.map((sk: string) => (
                                <span key={sk} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase">{sk}</span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-bold text-amber-700">Missing Target Keywords ({jdAnalysis.missingSkills.length})</p>
                            <div className="flex flex-wrap gap-1">
                              {jdAnalysis.missingSkills.map((sk: string) => (
                                <span key={sk} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase">{sk}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── AI Analysis & ATS Score Tab ── */}
                {activeTab === "ai analysis" && (
                  <div className="space-y-6 h-full flex flex-col">
                    {!aiResults && !isAnalyzing && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                          <Sparkles size={32} className="text-purple-600" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 mb-3">AI & ATS Resume Scorer</h2>
                        <p className="text-sm font-medium text-slate-500 mb-8 max-w-sm mx-auto">
                          Instantly analyze your resume structure, keyword matching, and completeness to maximize interview callbacks.
                        </p>
                        <button
                          onClick={() => {
                            setIsAnalyzing(true);
                            setTimeout(() => {
                              setAiResults({
                                score: atsScore,
                                completeness: completenessScore,
                                strengths: [
                                  "Clear education & graduation details",
                                  "Selected ATS-compliant 2-column layout",
                                  "Includes contact information & professional links"
                                ],
                                weaknesses: [
                                  projectList.length < 2 ? "Add at least 2 detailed projects with live demo links" : "Include measurable impact metrics in project descriptions",
                                  github ? "GitHub profile is linked" : "Add GitHub link to showcase project code repositories"
                                ],
                                recommendations: [
                                  { title: "Meta Front-End Developer Certificate", tag: "Recommended Cert", icon: BookOpen },
                                  { title: "React & Next.js Advanced Patterns", tag: "Skill Upgrade", icon: Target }
                                ]
                              });
                              setIsAnalyzing(false);
                            }, 1500);
                          }}
                          className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-black shadow-xl shadow-purple-500/30 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                          <Sparkles size={18} /> Run AI & ATS Scan
                        </button>
                      </div>
                    )}

                    {isAnalyzing && (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <Loader2 size={40} className="text-purple-600 animate-spin mb-6" />
                        <h2 className="text-lg font-black text-slate-800 mb-2">Analyzing Resume Data...</h2>
                        <p className="text-sm font-medium text-slate-500">Evaluating formatting, keywords, and section completeness.</p>
                      </div>
                    )}

                    {aiResults && (
                      <AnimatedContent direction="up" delay={0.1} className="space-y-6 pb-6">
                        <div className="bg-gradient-to-br from-purple-900 to-[#0d1635] rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
                          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                            <div className="relative w-28 h-28 shrink-0">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                <motion.circle 
                                  initial={{ strokeDashoffset: 283 }}
                                  animate={{ strokeDashoffset: 283 - (283 * aiResults.score) / 100 }}
                                  transition={{ duration: 1.2, ease: "easeOut" }}
                                  cx="50" cy="50" r="45" fill="none" stroke="#C9A227" strokeWidth="8" strokeLinecap="round" 
                                  strokeDasharray="283"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-white leading-none">{aiResults.score}</span>
                                <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest mt-1">/ 100</span>
                              </div>
                            </div>
                            
                            <div className="text-center sm:text-left">
                              <h3 className="text-xl font-black mb-1 flex items-center justify-center sm:justify-start gap-2">
                                <Target size={20} className="text-[#C9A227]" /> ATS Readiness: {aiResults.score >= 80 ? "Strong" : "Good Progress"}
                              </h3>
                              <p className="text-xs font-medium text-white/70 leading-relaxed max-w-sm">
                                Profile Completeness: <strong className="text-emerald-400">{aiResults.completeness}%</strong>. Adding verifiable certification links and project metrics will maximize callbacks.
                              </p>
                              <button onClick={() => setAiResults(null)} className="mt-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors">
                                Rescan Profile
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Feedback Split */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                            <h4 className="text-sm font-black text-emerald-800 mb-3 flex items-center gap-2">
                              <CheckCircle size={16} /> Key Strengths
                            </h4>
                            <ul className="space-y-2">
                              {aiResults.strengths.map((str: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-medium text-emerald-700">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" /> {str}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                            <h4 className="text-sm font-black text-amber-800 mb-3 flex items-center gap-2">
                              <AlertCircle size={16} /> ATS Recommendations
                            </h4>
                            <ul className="space-y-2">
                              {aiResults.weaknesses.map((wk: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-xs font-medium text-amber-700">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" /> {wk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AnimatedContent>
                    )}
                  </div>
                )}
              </div>
            </div>
          </AnimatedContent>

          {/* ── Preview Column (2-Column Reference Layout Matching Image 2) ── */}
          <div className="resume-preview-print w-full lg:w-1/2 flex flex-col">
            <AnimatedContent direction="left" delay={0.3} className="flex flex-col h-full">

              <div
                className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 p-6 overflow-y-auto resume-print-area text-slate-800"
                ref={previewRef}
                style={{ fontFamily: "Inter, Arial, sans-serif" }}
              >
                {/* Header matching Reference Image 2 */}
                <div className="border-b border-slate-300 pb-2 mb-3">
                  <h1 className="text-3xl font-black text-[#1B2A6B] tracking-tight uppercase mb-0.5">
                    {fullName}
                  </h1>
                  <p className="text-sm font-bold text-slate-700 mb-1.5">{jobTitle}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-slate-600">
                    <span className="flex items-center gap-1"><Mail size={12} className="text-[#1B2A6B]"/> {user?.email || "samihavahora71@gmail.com"}</span>
                    <span className="flex items-center gap-1"><Phone size={12} className="text-[#1B2A6B]"/> {phone}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-[#1B2A6B]"/> {location}</span>
                    {linkedin && <span className="flex items-center gap-1"><Linkedin size={12} className="text-[#1B2A6B]"/> {linkedin}</span>}
                    {github && <span className="flex items-center gap-1"><Github size={12} className="text-[#1B2A6B]"/> {github}</span>}
                  </div>
                </div>

                {/* 2-Column Grid Layout matching Reference Image 2 */}
                <div className="grid grid-cols-12 gap-5">
                  
                  {/* Left Column (~60%) */}
                  <div className="col-span-7 space-y-3">
                    
                    {/* SUMMARY */}
                    {summary && (
                      <div className="resume-section-block">
                        <h2 className="text-xs font-black text-[#1B2A6B] uppercase tracking-wider border-b border-[#1B2A6B] pb-0.5 mb-1">SUMMARY</h2>
                        <p className="text-[10.5px] text-slate-700 leading-snug font-medium">{summary}</p>
                      </div>
                    )}

                    {/* WORK EXPERIENCE */}
                    {expList.length > 0 && expList.some(e => e.company) && (
                      <div className="resume-section-block">
                        <h2 className="text-xs font-black text-[#1B2A6B] uppercase tracking-wider border-b border-[#1B2A6B] pb-0.5 mb-1.5">EXPERIENCE</h2>
                        {expList.filter(e => e.company).map((exp) => (
                          <div key={exp.id} className="mb-2">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                              <span className="text-[10px] font-semibold text-slate-500">{exp.duration}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10.5px] mb-0.5">
                              <span className="font-bold text-[#1B2A6B]">{exp.company}</span>
                              <span className="text-[10px] italic text-slate-500">{location}</span>
                            </div>
                            {exp.desc && (
                              <ul className="list-disc pl-3.5 text-[10px] text-slate-600 space-y-0.5 font-medium leading-tight">
                                {exp.desc.split("\n").filter(Boolean).map((line, i) => (
                                  <li key={i}>{line.replace(/^•\s*/, '')}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* INTERNSHIP EXPERIENCE */}
                    {internshipList.length > 0 && internshipList.some(i => i.company) && (
                      <div className="resume-section-block">
                        <h2 className="text-xs font-black text-[#1B2A6B] uppercase tracking-wider border-b border-[#1B2A6B] pb-0.5 mb-1.5">INTERNSHIP EXPERIENCE</h2>
                        {internshipList.filter(i => i.company).map((intern) => (
                          <div key={intern.id} className="mb-2">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xs font-bold text-slate-900">{intern.role}</h3>
                              <span className="text-[10px] font-semibold text-slate-500">{intern.duration}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10.5px] mb-0.5">
                              <span className="font-bold text-[#1B2A6B]">{intern.company}</span>
                              <span className="text-[10px] italic text-slate-500">Remote</span>
                            </div>
                            {intern.desc && (
                              <ul className="list-disc pl-3.5 text-[10px] text-slate-600 space-y-0.5 font-medium leading-tight">
                                {intern.desc.split("\n").filter(Boolean).map((line, idx) => (
                                  <li key={idx}>{line.replace(/^•\s*/, '')}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* KEY PROJECTS */}
                    {projectList.length > 0 && projectList.some(p => p.title) && (
                      <div className="resume-section-block">
                        <h2 className="text-xs font-black text-[#1B2A6B] uppercase tracking-wider border-b border-[#1B2A6B] pb-0.5 mb-1.5">KEY PROJECTS</h2>
                        {projectList.filter(p => p.title).map((proj) => (
                          <div key={proj.id} className="mb-2">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                {proj.title} <ExternalLink size={10} className="text-[#1B2A6B]" />
                              </h3>
                              {proj.duration && <span className="text-[10px] font-semibold text-slate-500">{proj.duration}</span>}
                            </div>
                            {proj.tech && (
                              <p className="text-[10px] text-slate-700 font-semibold mb-0.5">
                                <span className="text-[#1B2A6B] font-bold">Technologies:</span> {proj.tech}
                              </p>
                            )}
                            {proj.contributions && (
                              <ul className="list-disc pl-3.5 text-[10px] text-slate-600 space-y-0.5 font-medium leading-tight">
                                {proj.contributions.split("\n").filter(Boolean).map((line, idx) => (
                                  <li key={idx}>{line.replace(/^•\s*/, '')}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* EDUCATION */}
                    {eduList.length > 0 && eduList.some(e => e.school) && (
                      <div className="resume-section-block">
                        <h2 className="text-xs font-black text-[#1B2A6B] uppercase tracking-wider border-b border-[#1B2A6B] pb-0.5 mb-1.5">EDUCATION</h2>
                        {eduList.filter(e => e.school).map((edu) => (
                          <div key={edu.id} className="mb-1.5">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                              <span className="text-[10px] font-semibold text-slate-500">{edu.duration}</span>
                            </div>
                            <p className="text-[10.5px] font-bold text-[#1B2A6B]">{edu.school}</p>
                            {edu.cgpa && <p className="text-[10px] text-slate-600 font-medium">CGPA/Grade: {edu.cgpa}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* CERTIFICATIONS */}
                    {certList.length > 0 && certList.some(c => c.name) && (
                      <div className="resume-section-block">
                        <h2 className="text-xs font-black text-[#1B2A6B] uppercase tracking-wider border-b border-[#1B2A6B] pb-0.5 mb-1.5">CERTIFICATIONS</h2>
                        {certList.filter(c => c.name).map((cert) => (
                          <div key={cert.id} className="mb-1.5">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xs font-bold text-slate-900">• {cert.name}</h3>
                              <span className="text-[10px] font-semibold text-slate-500">{cert.issueDate}</span>
                            </div>
                            <p className="text-[10px] italic text-slate-500 pl-3">{cert.issuer}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ACHIEVEMENTS & HONORS */}
                    {achievements && (
                      <div className="resume-section-block">
                        <h2 className="text-xs font-black text-[#1B2A6B] uppercase tracking-wider border-b border-[#1B2A6B] pb-0.5 mb-1">ACHIEVEMENTS & HONORS</h2>
                        <ul className="list-disc pl-3.5 text-[10px] text-slate-600 space-y-0.5 font-medium leading-tight">
                          {achievements.split("\n").filter(Boolean).map((line, i) => (
                            <li key={i}>{line.replace(/^•\s*/, '')}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column (~40%) */}
                  <div className="col-span-5 space-y-3">
                    
                    {/* TECHNICAL SKILLS */}
                    <div className="resume-section-block">
                      <h2 className="text-xs font-black text-[#1B2A6B] uppercase tracking-wider border-b border-[#1B2A6B] pb-0.5 mb-1.5">TECHNICAL SKILLS</h2>
                      
                      <div className="space-y-1.5 text-[10.5px]">
                        {skillCategories.frontend.length > 0 && (
                          <div className="flex items-start gap-1.5">
                            <Code size={13} className="text-[#1B2A6B] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-800">Frontend Development</p>
                              <p className="text-[9.5px] text-slate-600 font-medium leading-tight">{skillCategories.frontend.join(", ")}</p>
                            </div>
                          </div>
                        )}
                        {skillCategories.backend.length > 0 && (
                          <div className="flex items-start gap-1.5">
                            <Layers size={13} className="text-[#1B2A6B] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-800">Backend Development</p>
                              <p className="text-[9.5px] text-slate-600 font-medium leading-tight">{skillCategories.backend.join(", ")}</p>
                            </div>
                          </div>
                        )}
                        {skillCategories.database.length > 0 && (
                          <div className="flex items-start gap-1.5">
                            <FileCheck size={13} className="text-[#1B2A6B] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-800">Database</p>
                              <p className="text-[9.5px] text-slate-600 font-medium leading-tight">{skillCategories.database.join(", ")}</p>
                            </div>
                          </div>
                        )}
                        {skillCategories.languages.length > 0 && (
                          <div className="flex items-start gap-1.5">
                            <Globe size={13} className="text-[#1B2A6B] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-800">Languages</p>
                              <p className="text-[9.5px] text-slate-600 font-medium leading-tight">{skillCategories.languages.join(", ")}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* TOOLS & TECHNOLOGIES */}
                    {skillCategories.tools.length > 0 && (
                      <div className="resume-section-block">
                        <h2 className="text-xs font-black text-[#1B2A6B] uppercase tracking-wider border-b border-[#1B2A6B] pb-0.5 mb-1.5">TOOLS & TECHNOLOGIES</h2>
                        <div className="space-y-1 text-[10px] font-medium text-slate-700">
                          {skillCategories.tools.map((t, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1B2A6B]"></span>
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* LANGUAGES */}
                    {languages && (
                      <div className="resume-section-block">
                        <h2 className="text-xs font-black text-[#1B2A6B] uppercase tracking-wider border-b border-[#1B2A6B] pb-0.5 mb-1.5">LANGUAGES</h2>
                        <ul className="text-[10px] font-medium text-slate-700 space-y-0.5">
                          {languages.split(",").map((l, idx) => (
                            <li key={idx}>• {l.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* INTERESTS */}
                    <div className="resume-section-block">
                      <h2 className="text-xs font-black text-[#1B2A6B] uppercase tracking-wider border-b border-[#1B2A6B] pb-0.5 mb-1.5">INTERESTS</h2>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-slate-700">
                        <span className="flex items-center gap-1.5"><Code size={12} className="text-[#1B2A6B]"/> Coding</span>
                        <span className="flex items-center gap-1.5"><FolderGit2 size={12} className="text-[#1B2A6B]"/> Open Source</span>
                        <span className="flex items-center gap-1.5"><BookOpen size={12} className="text-[#1B2A6B]"/> Tech Blogs</span>
                        <span className="flex items-center gap-1.5"><Globe size={12} className="text-[#1B2A6B]"/> Music</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Print Footer Matching Image 2 */}
                <div className="mt-8 pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] font-medium text-slate-500">
                  <span>Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  <div className="flex items-center gap-2">
                    <img src="/logoblue.png" alt="Blueboxx DA" className="h-5 object-contain" />
                    <span>1/1</span>
                  </div>
                </div>

              </div>

              {/* Accent Picker & Template Selector */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 no-print bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-slate-500" />
                  <span className="text-xs font-bold text-slate-700">Accent:</span>
                  {accentColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setAccent(c)}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${accent === c ? "border-black scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Style:</span>
                  {(["classic", "modern", "minimal"] as const).map((tmpl) => (
                    <button
                      key={tmpl}
                      onClick={() => setSelectedTemplate(tmpl)}
                      className={`px-2.5 py-1 text-xs font-extrabold rounded-lg uppercase tracking-wider transition-all ${
                        selectedTemplate === tmpl ? "bg-[#1B2A6B] text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {tmpl}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </div>

      {/* ── Certification Search Explorer Modal ── */}
      <AnimatePresence>
        {isCertModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCertModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl z-50 relative overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-[#C9A227]" />
                  <h3 className="font-black text-slate-800 text-base">Explore & Add Certifications</h3>
                </div>
                <button onClick={() => setIsCertModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 border-b border-slate-100">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by career role, certification, or skill (e.g. AWS, React, Data)..."
                    value={certSearchQuery}
                    onChange={(e) => setCertSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#1B2A6B]"
                  />
                </div>
              </div>

              <div className="p-5 overflow-y-auto space-y-3 flex-1">
                {filteredPresetCerts.map((preset, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:border-[#1B2A6B]/30 transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-slate-800 text-sm">{preset.name}</h4>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase">{preset.level}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Provider: {preset.issuer} • Target Role: {preset.role}</p>
                      <p className="text-[11px] font-medium text-slate-400">Skills: {preset.skills}</p>
                    </div>

                    <button
                      onClick={() => handleAddPresetCert(preset)}
                      className="px-4 py-2 bg-[#1B2A6B] hover:bg-[#0d1635] text-white text-xs font-bold rounded-xl shadow transition-all shrink-0 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add to Resume
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </StudentDashboardLayout>
  );
}
