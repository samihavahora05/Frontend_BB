import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../lib/axios";
import { getActiveRoleFromUrl, getActiveToken, saveSession, clearSession, migrateLegacyToken, getSessions } from "../lib/authUtils";
import { useStore } from "../store/useStore";

export type UserRole = "student" | "expert" | "company" | "admin" | "super_admin" | "college" | "intern" | "job-seeker" | null;

export interface User {
  id?: number | string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: string;
  profile_photo?: string;
  role?: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  role: UserRole;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { mutate } from "swr";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    migrateLegacyToken();
    
    const activeRole = getActiveRoleFromUrl(router.pathname);
    const token = getActiveToken(router.pathname);

    if (token) {
      // Pre-load user from cached session if available for instant render
      const sessions = getSessions();
      if (activeRole !== 'public') {
        if (activeRole === 'admin') {
          if (sessions['super_admin']) setUser(sessions['super_admin'].user);
          else if (sessions['admin']) setUser(sessions['admin'].user);
        } else if (activeRole && sessions[activeRole]) {
          setUser(sessions[activeRole].user);
        } else {
          const anyTokenRole = Object.keys(sessions).find(k => sessions[k]?.token === token);
          if (anyTokenRole && sessions[anyTokenRole]?.user) setUser(sessions[anyTokenRole].user);
        }
      } else if (activeRole === 'public') {
        const anyTokenRole = Object.keys(sessions).find(k => sessions[k]?.token === token);
        if (anyTokenRole && sessions[anyTokenRole]?.user) setUser(sessions[anyTokenRole].user);
      }

      setIsAuthReady(true);

      api.get("/me")
        .then((response) => {
          const fetchedUser = response.data;
          let role = null;
          if (fetchedUser.roles && fetchedUser.roles.length > 0) {
            const roleNames = fetchedUser.roles.map((r: any) => r.name);
            if (roleNames.includes('super_admin')) role = 'super_admin';
            else if (roleNames.includes('admin')) role = 'admin';
            else role = roleNames[0];
          }

          const mappedUser = {
            name: fetchedUser.name,
            email: fetchedUser.email,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fetchedUser.name)}`,
            role: role
          };
          setUser(mappedUser);
          if (role) saveSession(role, token, mappedUser);
        })
        .catch(() => {
          // Token invalid, clear it
          if (activeRole !== 'public') clearSession(activeRole as string);
          else {
             // Wipe completely if public and token is dead (extreme edge case)
             const anyTokenRole = Object.keys(sessions).find(k => sessions[k]?.token === token);
             if (anyTokenRole) clearSession(anyTokenRole);
          }
          setUser(null);
        })
        .finally(() => {
          setIsAuthReady(true);
        });
    } else {
      setUser(null);
      useStore.getState().clearCart();
      setIsAuthReady(true);
    }
  }, [router.pathname]);

  const login = (userData: User, token: string) => {
    setUser(userData);
    if (userData.role) saveSession(userData.role, token, userData);
    mutate(() => true, undefined, { revalidate: true });
  };

  const logout = () => {
    useStore.getState().clearCart();
    mutate("/student/wishlist", null, false);
    const activeRole = getActiveRoleFromUrl(router.pathname);
    const token = getActiveToken(router.pathname);
    if (token) {
      api.post("/logout").catch(() => {});
    }
    
    if (activeRole !== 'public') {
      clearSession(activeRole as string);
    } else if (user?.role) {
      clearSession(user.role);
    }
    setUser(null);
    mutate(() => true, undefined, { revalidate: false });

    if (typeof document !== 'undefined') {
      document.body.style.overflow = "";
      document.body.style.opacity = "";
      document.body.style.pointerEvents = "";
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAuthReady,
      role: user?.role ?? null,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


