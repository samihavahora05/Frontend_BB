import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompanyProfile {
  name: string;
  about: string;
  industry: string;
  size: string;
  website: string;
  location: string;
  email: string;
  phone: string;
  logo: string;
}

interface CompanyStore {
  profile: CompanyProfile;
  updateProfile: (updates: Partial<CompanyProfile>) => void;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      profile: {
        name: "",
        about: "",
        industry: "Technology",
        size: "1-10",
        website: "",
        location: "",
        email: "",
        phone: "",
        logo: ""
      },
      updateProfile: (updates) => set((state) => ({ 
        profile: { ...state.profile, ...updates } 
      })),
    }),
    {
      name: 'company-profile-storage',
    }
  )
);
