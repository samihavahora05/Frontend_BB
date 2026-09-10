export interface OpportunityPermissionResult {
  canApply: boolean;
  message: string;
  targetRole: 'intern' | 'jobseeker' | null;
  targetRoleDisplay: string | null;
  canRequestRoleChange: boolean;
  currentRoleDisplay: string;
}

export function normalizeRole(role?: string | null): string {
  if (!role) return '';
  const r = role.toLowerCase().trim().replace(/_/g, '-');
  if (r === 'job-seeker') return 'jobseeker';
  return r;
}

export function getRoleDisplayName(role?: string | null): string {
  const norm = normalizeRole(role);
  switch (norm) {
    case 'student': return 'Student';
    case 'intern': return 'Intern';
    case 'jobseeker': return 'Jobseeker';
    case 'expert': return 'Expert';
    case 'college': return 'College';
    case 'company': return 'Company';
    case 'admin':
    case 'super-admin': return 'Admin';
    default: return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Guest';
  }
}

export function canApplyToJob(role?: string | null): boolean {
  const norm = normalizeRole(role);
  return norm === 'jobseeker' || norm === 'admin' || norm === 'super-admin';
}

export function canApplyToInternship(role?: string | null): boolean {
  const norm = normalizeRole(role);
  return norm === 'intern' || norm === 'admin' || norm === 'super-admin';
}

export function canApplyToCourse(_role?: string | null): boolean {
  // Courses are open to all registered user roles
  return true;
}

export function getOpportunityPermission(
  role: string | null | undefined,
  type: 'job' | 'internship' | 'course'
): OpportunityPermissionResult {
  const currentRoleDisplay = getRoleDisplayName(role);
  const norm = normalizeRole(role);

  if (!role) {
    return {
      canApply: false,
      message: 'Please log in to apply for this opportunity.',
      targetRole: null,
      targetRoleDisplay: null,
      canRequestRoleChange: false,
      currentRoleDisplay: 'Guest'
    };
  }

  if (type === 'course') {
    return {
      canApply: true,
      message: 'You are eligible to enroll in Courses.',
      targetRole: null,
      targetRoleDisplay: null,
      canRequestRoleChange: false,
      currentRoleDisplay
    };
  }

  if (type === 'job') {
    if (canApplyToJob(role)) {
      return {
        canApply: true,
        message: 'You are eligible to apply for Jobs.',
        targetRole: null,
        targetRoleDisplay: null,
        canRequestRoleChange: false,
        currentRoleDisplay
      };
    }

    let message = `You are currently registered as a ${currentRoleDisplay}. ${currentRoleDisplay}s cannot apply for Jobs.`;
    if (norm === 'student') {
      message = 'You are currently registered as a Student. Students cannot apply for Jobs.';
    } else if (norm === 'intern') {
      message = 'You are currently registered as an Intern. Interns can apply for Internships, not Jobs.';
    } else if (norm === 'expert') {
      message = 'You are currently registered as an Expert. Experts cannot apply for Jobs.';
    } else if (norm === 'college') {
      message = 'College accounts manage campus drives and cannot submit candidate applications.';
    } else if (norm === 'company') {
      message = 'Company accounts post hiring opportunities and cannot apply for Jobs.';
    }

    const canRequest = norm === 'student' || norm === 'intern' || norm === 'expert';

    return {
      canApply: false,
      message,
      targetRole: 'jobseeker',
      targetRoleDisplay: 'Jobseeker',
      canRequestRoleChange: canRequest,
      currentRoleDisplay
    };
  }

  if (type === 'internship') {
    if (canApplyToInternship(role)) {
      return {
        canApply: true,
        message: 'You are eligible to apply for Internships.',
        targetRole: null,
        targetRoleDisplay: null,
        canRequestRoleChange: false,
        currentRoleDisplay
      };
    }

    let message = `You are currently registered as a ${currentRoleDisplay}. ${currentRoleDisplay}s cannot apply for Internships.`;
    if (norm === 'student') {
      message = 'You are currently registered as a Student. Students cannot apply for Internships.';
    } else if (norm === 'jobseeker') {
      message = 'You are currently registered as a Jobseeker. Jobseekers can apply for Jobs, not Internships.';
    } else if (norm === 'expert') {
      message = 'You are currently registered as an Expert. Experts cannot apply for Internships.';
    } else if (norm === 'college') {
      message = 'College accounts manage campus drives and cannot submit candidate applications.';
    } else if (norm === 'company') {
      message = 'Company accounts post internship listings and cannot apply for Internships.';
    }

    const canRequest = norm === 'student' || norm === 'jobseeker' || norm === 'expert';

    return {
      canApply: false,
      message,
      targetRole: 'intern',
      targetRoleDisplay: 'Intern',
      canRequestRoleChange: canRequest,
      currentRoleDisplay
    };
  }

  return {
    canApply: true,
    message: 'Allowed',
    targetRole: null,
    targetRoleDisplay: null,
    canRequestRoleChange: false,
    currentRoleDisplay
  };
}
