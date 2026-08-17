export const dummyJobs = Array.from({ length: 20 }).map((_, i) => ({
  id: `job-${i + 1}`,
  slug: `job-${i + 1}`,
  role: [
    "Frontend Developer", "Backend Engineer", "Full Stack Developer", "Data Analyst", 
    "Product Designer", "Marketing Manager", "DevOps Engineer", "Machine Learning Engineer"
  ][i % 8],
  company: [
    "TechNova", "InnovateCorp", "GrowthHackers", "CloudNative", 
    "CreativeStudio", "DataVision", "SecureNet", "FinTech Solutions"
  ][i % 8],
  experience: ["0-1 Years", "1-3 Years", "3-5 Years", "5+ Years"][i % 4],
  salary: ["₹6-8 LPA", "₹8-12 LPA", "₹12-18 LPA", "₹18-25 LPA", "₹25+ LPA"][i % 5],
  location: ["Bangalore", "Hyderabad", "Remote", "Pune", "Mumbai", "Gurgaon"][i % 6],
  mode: ["Remote", "Hybrid", "Onsite"][i % 3],
  skills: [
    ["React", "Node.js", "MongoDB"],
    ["Python", "SQL", "Tableau"],
    ["Figma", "UI/UX", "Prototyping"],
    ["AWS", "Docker", "CI/CD"],
    ["SEO", "Google Ads", "Content Strategy"]
  ][i % 5],
  category: ["Engineering", "Data", "Design", "Marketing", "Infrastructure"][i % 5],
  postedAt: `${(i % 5) + 1} days ago`,
  logo: ["T", "I", "G", "C", "C", "D", "S", "F"][i % 8],
  bg: [
    "bg-indigo-100 text-indigo-700", "bg-blue-100 text-blue-700", "bg-rose-100 text-rose-700", 
    "bg-emerald-100 text-emerald-700", "bg-purple-100 text-purple-700", "bg-amber-100 text-amber-700"
  ][i % 6]
}));
