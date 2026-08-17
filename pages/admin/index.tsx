import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0d1635] flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-sm tracking-wider text-slate-300">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
