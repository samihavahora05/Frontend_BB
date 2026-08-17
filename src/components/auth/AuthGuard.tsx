import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { LoadingScreen } from "../LoadingScreen";

import { UserRole } from "../../context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const { isAuthenticated, isAuthReady, role } = useAuth();

  useEffect(() => {
    if (!isAuthReady) return;
    
    if (!isAuthenticated) {
      // Redirect to login, preserving the intended destination
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      // Redirect to appropriate dashboard based on actual role
      const normalizedRole = role.toLowerCase();
      if (normalizedRole === 'admin' || normalizedRole === 'super_admin') {
        router.replace("/admin/dashboard");
      } else if (normalizedRole === 'expert' || normalizedRole === 'mentor') {
        router.replace("/expert/dashboard");
      } else if (normalizedRole === 'company') {
        router.replace("/company/dashboard");
      } else if (normalizedRole === 'intern') {
        router.replace("/intern/dashboard");
      } else if (normalizedRole === 'job-seeker' || normalizedRole === 'jobseeker') {
        router.replace("/jobseeker/dashboard");
      } else {
        router.replace("/student/dashboard");
      }
    }
  }, [isAuthReady, isAuthenticated, router, allowedRoles, role]);

  // Show a loading screen while checking authentication state
  if (!isAuthReady || !isAuthenticated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
