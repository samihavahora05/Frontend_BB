import { create } from 'zustand';

export type JobCategory = 'Job' | 'Internship';
export type JobStatus = 'Pending' | 'Active' | 'Rejected' | 'Closed';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  category: JobCategory;
  type: string; // Full-Time, Part-Time, Contract, Internship
  locationType: string; // Remote, On-site, Hybrid
  location: string;
  salary: string;
  description: string;
  skills: string[];
  status: JobStatus;
  applicants: number;
  views: number;
  postedAt: string;
  postedBy: string; // company id or name
}

interface JobStoreState {
  jobs: JobPosting[];
  addJob: (job: Omit<JobPosting, 'id' | 'status' | 'applicants' | 'views' | 'postedAt'>) => void;
  updateJobStatus: (id: string, status: JobStatus) => void;
  deleteJob: (id: string) => void;
  getJobsByStatus: (status: JobStatus) => JobPosting[];
  getJobsByCompany: (company: string) => JobPosting[];
  getPublicJobs: () => JobPosting[];
  getPublicInternships: () => JobPosting[];
  getPendingJobs: () => JobPosting[];
}

export const useJobStore = create<JobStoreState>((set, get) => ({
  jobs: [
    // Seed data – already approved jobs
    {
      id: 'job-seed-1',
      title: 'Senior Frontend Developer',
      company: 'Acme Corp',
      category: 'Job',
      type: 'Full-Time',
      locationType: 'Hybrid',
      location: 'Bangalore',
      salary: '₹15,00,000 - ₹20,00,000',
      description: 'We are looking for an experienced Frontend Developer to join our core product team. You will be responsible for building high-quality, performant user interfaces using React and TypeScript.',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      status: 'Active',
      applicants: 45,
      views: 320,
      postedAt: '2 days ago',
      postedBy: 'Acme Corp',
    },
    {
      id: 'job-seed-2',
      title: 'UI/UX Designer Intern',
      company: 'Acme Corp',
      category: 'Internship',
      type: 'Internship',
      locationType: 'Remote',
      location: '',
      salary: '₹15,000/month',
      description: 'Join our design team and work on real-world projects. You will create wireframes, prototypes, and high-fidelity designs for our product suite.',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      status: 'Active',
      applicants: 112,
      views: 890,
      postedAt: '1 week ago',
      postedBy: 'Acme Corp',
    },
    {
      id: 'job-seed-3',
      title: 'Backend Engineer (Node.js)',
      company: 'Acme Corp',
      category: 'Job',
      type: 'Contract',
      locationType: 'On-site',
      location: 'Bangalore',
      salary: '₹10,00,000 - ₹14,00,000',
      description: 'We need a backend engineer proficient in Node.js and PostgreSQL to help us scale our microservices architecture.',
      skills: ['Node.js', 'PostgreSQL', 'Docker'],
      status: 'Active',
      applicants: 28,
      views: 150,
      postedAt: '3 weeks ago',
      postedBy: 'Acme Corp',
    },
    {
      id: 'job-seed-4',
      title: 'Product Manager',
      company: 'TechVenture',
      category: 'Job',
      type: 'Full-Time',
      locationType: 'Remote',
      location: '',
      salary: '₹18,00,000 - ₹25,00,000',
      description: 'Lead our product development lifecycle and collaborate with engineering, design, and marketing teams.',
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      status: 'Closed',
      applicants: 156,
      views: 1200,
      postedAt: '1 month ago',
      postedBy: 'TechVenture',
    },
    {
      id: 'job-seed-5',
      title: 'Data Science Intern',
      company: 'DataMinds',
      category: 'Internship',
      type: 'Internship',
      locationType: 'Remote',
      location: '',
      salary: '₹20,000/month',
      description: 'Work with our data science team to build ML models and data pipelines for real business use cases.',
      skills: ['Python', 'Pandas', 'Scikit-learn'],
      status: 'Pending',
      applicants: 0,
      views: 0,
      postedAt: 'Just now',
      postedBy: 'DataMinds',
    },
  ],

  addJob: (job) =>
    set((state) => ({
      jobs: [
        {
          ...job,
          id: `job-${Date.now()}`,
          status: 'Pending',
          applicants: 0,
          views: 0,
          postedAt: 'Just now',
        },
        ...state.jobs,
      ],
    })),

  updateJobStatus: (id, status) =>
    set((state) => ({
      jobs: state.jobs.map((job) => (job.id === id ? { ...job, status } : job)),
    })),

  deleteJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    })),

  getJobsByStatus: (status) => get().jobs.filter((j) => j.status === status),

  getJobsByCompany: (company) => get().jobs.filter((j) => j.postedBy === company),

  getPublicJobs: () =>
    get().jobs.filter((j) => j.status === 'Active' && j.category === 'Job'),

  getPublicInternships: () =>
    get().jobs.filter((j) => j.status === 'Active' && j.category === 'Internship'),

  getPendingJobs: () => get().jobs.filter((j) => j.status === 'Pending'),
}));
