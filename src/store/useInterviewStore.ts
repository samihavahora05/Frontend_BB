import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Interview {
  id: number;
  name: string;
  role: string;
  date: string;
  time: string;
  type: string;
  match: number;
  status: 'Upcoming' | 'Completed';
  applicantId: string;
}

interface InterviewState {
  interviews: Interview[];
  addInterview: (interview: Omit<Interview, 'id' | 'status'>) => void;
  updateInterview: (id: number, updates: Partial<Interview>) => void;
  removeInterview: (id: number) => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      interviews: [
        { id: 1, name: 'Alex Johnson', role: 'Frontend Developer', date: 'Today', time: '10:30 AM', type: 'Technical Round', match: 95, status: 'Upcoming', applicantId: 'APP-seed-1' },
        { id: 2, name: 'Sarah Smith', role: 'UI/UX Designer', date: 'Today', time: '2:00 PM', type: 'Portfolio Review', match: 88, status: 'Upcoming', applicantId: 'APP-seed-2' },
        { id: 3, name: 'Rahul Singh', role: 'Backend Engineer', date: 'Tomorrow', time: '11:00 AM', type: 'System Design', match: 92, status: 'Upcoming', applicantId: 'APP-seed-3' },
        { id: 4, name: 'Priya Patel', role: 'Product Manager', date: 'Jul 28', time: '4:00 PM', type: 'Culture Fit', match: 85, status: 'Upcoming', applicantId: 'APP-seed-4' },
        { id: 5, name: 'Amit Kumar', role: 'Frontend Developer', date: 'Yesterday', time: '2:00 PM', type: 'Technical Round', match: 78, status: 'Completed', applicantId: 'APP-seed-5' },
      ],
      addInterview: (interview) =>
        set((state) => ({
          interviews: [
            ...state.interviews,
            { ...interview, id: Date.now(), status: 'Upcoming' },
          ],
        })),
      updateInterview: (id, updates) =>
        set((state) => ({
          interviews: state.interviews.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
      removeInterview: (id) =>
        set((state) => ({
          interviews: state.interviews.filter((i) => i.id !== id),
        })),
    }),
    { name: 'interview-store' }
  )
);
