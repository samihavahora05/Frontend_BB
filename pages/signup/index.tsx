import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect /signup to the primary student registration page
    router.replace("/signup/student");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-[#1B2A6B] rounded-full animate-spin"></div>
    </div>
  );
}
