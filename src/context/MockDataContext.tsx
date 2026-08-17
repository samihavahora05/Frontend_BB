import React, { createContext, useContext, useState, ReactNode } from "react";

export type PlacementData = {
  id: number;
  name: string;
  company: string;
  role: string;
  location: string;
  status: "applied" | "interviewing" | "offered";
};

export type MenteeData = {
  id: number;
  name: string;
  role: string;
  company: string;
  status: string;
  progress: number;
  rating: number;
};

export type ScheduleSlotData = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  mentee: string;
  status: string;
};

export type JobData = {
  id: number;
  title: string;
  type: string;
  location: string;
  status: "Active" | "Pending Approval" | "Closed";
  posted: string;
  applicants: number;
  views: number;
};

interface MockDataContextType {
  placements: PlacementData[];
  setPlacements: React.Dispatch<React.SetStateAction<PlacementData[]>>;
  mentees: MenteeData[];
  setMentees: React.Dispatch<React.SetStateAction<MenteeData[]>>;
  schedule: ScheduleSlotData[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleSlotData[]>>;
  jobs: JobData[];
  addJob: (job: Omit<JobData, "id" | "posted" | "applicants" | "views">) => void;
  editJob: (id: number, updatedJob: Partial<JobData>) => void;
  deleteJob: (id: number) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

const INITIAL_JOBS: JobData[] = [
  { id: 1, title: "Frontend Developer", type: "Full-time", location: "Bangalore", status: "Active", posted: "Oct 15, 2026", applicants: 84, views: 520 },
  { id: 2, title: "Product Design Intern", type: "Internship", location: "Remote", status: "Active", posted: "Oct 20, 2026", applicants: 42, views: 315 },
  { id: 3, title: "Backend Engineer", type: "Full-time", location: "Gurugram", status: "Pending Approval", posted: "Oct 27, 2026", applicants: 0, views: 0 },
  { id: 4, title: "Marketing Executive", type: "Full-time", location: "Mumbai", status: "Closed", posted: "Sep 10, 2026", applicants: 156, views: 1200 },
];

export function MockDataProvider({ children }: { children: ReactNode }) {
  // Use localStorage for jobs if available, otherwise fallback to initial
  const [jobs, setJobs] = useState<JobData[]>([]);
  
  React.useEffect(() => {
    const savedJobs = localStorage.getItem("mock_jobs");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      setJobs(INITIAL_JOBS);
    }
  }, []);

  // Sync jobs to localStorage whenever they change
  React.useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem("mock_jobs", JSON.stringify(jobs));
    }
  }, [jobs]);

  const addJob = (job: Omit<JobData, "id" | "posted" | "applicants" | "views">) => {
    const newJob: JobData = {
      ...job,
      id: Date.now(),
      posted: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
      applicants: 0,
      views: 0
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const editJob = (id: number, updatedFields: Partial<JobData>) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, ...updatedFields } : job));
  };

  const deleteJob = (id: number) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  const [placements, setPlacements] = useState<PlacementData[]>([
    { id: 1, name: "Sneha Reddy", company: "Google", role: "Software Engineer", location: "Bangalore", status: "applied" },
    { id: 2, name: "Vikas Singh", company: "Microsoft", role: "Product Manager", location: "Hyderabad", status: "applied" },
    { id: 3, name: "Amit Kumar", company: "Amazon", role: "SDE-1", location: "Remote", status: "interviewing" },
    { id: 4, name: "Rahul Sharma", company: "Tech Mahindra", role: "Frontend Dev", location: "Pune", status: "offered" },
    { id: 5, name: "Priya Patel", company: "Infosys", role: "Data Analyst", location: "Bangalore", status: "offered" },
  ]);

  const [mentees, setMentees] = useState<MenteeData[]>([
    { id: 1, name: "Rahul Sharma", role: "Frontend Developer", company: "Tech Mahindra", status: "Active", progress: 85, rating: 4.8 },
    { id: 2, name: "Priya Patel", role: "Data Analyst", company: "Infosys", status: "Active", progress: 60, rating: 4.9 },
    { id: 3, name: "Amit Kumar", role: "SDE-1", company: "Amazon", status: "Completed", progress: 100, rating: 5.0 },
  ]);

  const [schedule, setSchedule] = useState<ScheduleSlotData[]>([
    { id: 1, date: 'Oct 15', startTime: '10:00 AM', endTime: '11:00 AM', type: '1-on-1 Mentorship', mentee: 'Sneha Reddy', status: 'Upcoming' },
    { id: 2, date: 'Oct 16', startTime: '02:00 PM', endTime: '03:00 PM', type: 'Code Review', mentee: 'Vikas Singh', status: 'Upcoming' },
    { id: 3, date: 'Oct 10', startTime: '11:00 AM', endTime: '12:00 PM', type: 'Career Guidance', mentee: 'Amit Kumar', status: 'Completed' },
  ]);

  return (
    <MockDataContext.Provider value={{ 
      placements, setPlacements, 
      mentees, setMentees, 
      schedule, setSchedule,
      jobs, addJob, editJob, deleteJob
    }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
}
