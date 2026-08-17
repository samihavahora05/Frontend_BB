import { MainLayout } from "../../src/layout/MainLayout";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SEO } from "../../src/components/seo/SEO";

export default function SuccessStoryDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  return (
    <MainLayout>
      <SEO title={`${String(slug || 'Success Story').replace(/-/g, ' ')} | Blueboxx DA`} description="Read our student success stories on Blueboxx DA." />
      <div className="pt-24 pb-16 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6 capitalize">{String(slug || 'Loading...').replace(/-/g, ' ')}</h1>
          <p className="text-[#64748B] max-w-2xl mx-auto mb-10 text-lg">Full student success story interview will appear here.</p>
          <button onClick={() => router.back()} className="btn-primary px-8 py-3.5 inline-flex items-center gap-2"><ArrowLeft size={16} /> Go Back</button>
        </motion.div>
      </div>
    </MainLayout>
  );
}
