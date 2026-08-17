import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppStage = 'Applied' | 'In Review' | 'Interview' | 'Offer' | 'Rejected';

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;           // Job title
  company: string;        // Company that posted
  jobId: string;
  match: number;
  stage: AppStage;
  appliedDate: string;
  exp: string;
  portfolio?: string;
  applicantName?: string;
  jobTitle?: string;
  status?: string;
  score?: number;
  appliedAt?: string;
}

interface ApplicantState {
  applicants: Applicant[];
  addApplication: (app: Omit<Applicant, 'id' | 'stage' | 'match' | 'appliedDate'>) => boolean;
  updateStage: (id: string, stage: AppStage) => void;
  removeApplication: (id: string) => void;
  getByCompany: (company: string) => Applicant[];
  getByStudent: (email: string) => Applicant[];
  hasApplied: (email: string, jobId: string) => boolean;
}

export const useApplicantStore = create<ApplicantState>()(
  persist(
    (set, get) => ({
      applicants: [
        // Seeded dummy data for demo
        { id: 'APP-001', name: 'Rahul Singh', email: 'rahul@example.com', phone: '+91 9876543210', role: 'Frontend Developer', company: 'Google', jobId: 'seed-1', match: 95, stage: 'Applied', appliedDate: '2h ago', exp: 'Fresher' },
        { id: 'APP-002', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 9123456789', role: 'Frontend Developer', company: 'Google', jobId: 'seed-2', match: 88, stage: 'In Review', appliedDate: '1d ago', exp: '1 Year' },
        { id: 'APP-003', name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 9988776655', role: 'UI/UX Designer', company: 'Microsoft', jobId: 'seed-3', match: 92, stage: 'Interview', appliedDate: '3d ago', exp: 'Fresher' },
        { id: 'APP-004', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 9871234560', role: 'Frontend Developer', company: 'Google', jobId: 'seed-4', match: 75, stage: 'Applied', appliedDate: '5h ago', exp: 'Fresher' },
        { id: 'APP-005', name: 'Vikram Mehta', email: 'vikram@example.com', phone: '+91 9012345678', role: 'Backend Engineer', company: 'Amazon', jobId: 'seed-5', match: 82, stage: 'Offer', appliedDate: '1w ago', exp: '2 Years' },
      ],

      addApplication: (app) => {
        // prevent duplicate applications
        const already = get().applicants.find(
          (a) => a.email === app.email && a.jobId === app.jobId
        );
        if (already) return false;

        const newApp: Applicant = {
          ...app,
          id: `APP-${Date.now()}`,
          stage: 'Applied',
          match: Math.floor(70 + Math.random() * 28), // AI-style match score
          appliedDate: 'Just now',
        };
        set((state) => ({ applicants: [newApp, ...state.applicants] }));
        return true;
      },

      updateStage: (id, stage) =>
        set((state) => ({
          applicants: state.applicants.map((a) =>
            a.id === id ? { ...a, stage } : a
          ),
        })),

      removeApplication: (id) =>
        set((state) => ({
          applicants: state.applicants.filter((a) => a.id !== id),
        })),

      getByCompany: (company) =>
        get().applicants.filter((a) => a.company.toLowerCase() === company.toLowerCase()),

      getByStudent: (email) =>
        get().applicants.filter((a) => a.email === email),

      hasApplied: (email, jobId) =>
        get().applicants.some((a) => a.email === email && a.jobId === jobId),
    }),
    { name: 'applicant-store' }
  )
);
