import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'student' | 'mentor' | 'company' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const mockUsers: Record<string, User> = {
  student: {
    id: 'usr_1',
    name: 'Rahul Singh',
    email: 'rahul@example.com',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  mentor: {
    id: 'usr_2',
    name: 'Priya Desai',
    email: 'priya@expert.com',
    role: 'mentor',
    avatar: 'https://i.pravatar.cc/150?u=2'
  },
  company: {
    id: 'usr_3',
    name: 'Google Recruiter',
    email: 'hr@google.com',
    role: 'company',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
  },
  admin: {
    id: 'usr_4',
    name: 'Super Admin',
    email: 'admin@blueboxx.in',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (role: UserRole) => {
        if (!role) return;
        set({ user: mockUsers[role], isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // saves to local storage so mock login persists across refreshes
    }
  )
);
