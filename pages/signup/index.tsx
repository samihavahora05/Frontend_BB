import { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "../../src/components/seo/SEO";

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect /signup to the primary student registration page
    router.replace("/signup/student");
  }, [router]);

  return (
    <>
      <SEO 
        title="Create an Account | Student & Professional Registration | BlueBoxx"
        description="Sign up for BlueBoxx to start your journey in tech courses, live industrial internships, corporate recruitment, and career mentorship."
      />
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#1B2A6B] rounded-full animate-spin"></div>
      </div>
    </>
  );
}
