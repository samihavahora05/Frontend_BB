import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Database, Eye, Share2, Server, Cookie, HelpCircle } from "lucide-react";
import { SEO } from "../src/components/seo/SEO";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "collection",
      icon: <Database className="text-[#C9A227] mt-1" size={24} />,
      title: "1. INFORMATION WE COLLECT",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>At BlueBoxx, we collect information to provide better services to all our users. The types of personal information we obtain include:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Details:</strong> Name, email address, phone number, and physical address provided during registration.</li>
            <li><strong>Academic & Professional Data:</strong> Resumes, educational background, skills, and portfolio links submitted during the evaluation stages.</li>
            <li><strong>Platform Usage Data:</strong> Time logs, daily task progress, mentor feedback, KRA/KPI metrics, and general dashboard activity.</li>
            <li><strong>Device & Technical Information:</strong> IP addresses, browser types, and access times for platform security and optimization.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "usage",
      icon: <Eye className="text-[#C9A227] mt-1" size={24} />,
      title: "2. HOW WE USE YOUR INFORMATION",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We use the information we collect for the following operational purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To verify eligibility and allocate appropriate tasks or internship projects.</li>
            <li>To track daily/weekly performance and generate KPI reports.</li>
            <li>To facilitate communication between mentors, students, and administration.</li>
            <li>To process and issue certificates, experience letters, and other completion documents.</li>
            <li>To maintain the integrity of our platform and prevent unauthorized access or academic dishonesty.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "sharing",
      icon: <Share2 className="text-[#C9A227] mt-1" size={24} />,
      title: "3. INFORMATION SHARING & DISCLOSURE",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>BlueBoxx does not sell your personal data. We only share your information under the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>With Mentors & Reviewers:</strong> To evaluate submissions and provide constructive feedback.</li>
            <li><strong>With External Clients/Partners:</strong> For live project allocations, only relevant skill profiles (anonymized where possible) may be shared.</li>
            <li><strong>Legal Requirements:</strong> If required by law, court order, or governmental authority to disclose data.</li>
            <li><strong>Platform Service Providers:</strong> Third-party tools used for hosting, analytics, and communications under strict confidentiality agreements.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "security",
      icon: <Server className="text-[#C9A227] mt-1" size={24} />,
      title: "4. DATA SECURITY & PROTECTION",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We implement robust technical and organizational measures to safeguard your personal data against unauthorized access, loss, or misuse.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>All data transmitted between your device and our servers is encrypted.</li>
            <li>Access to personal data is strictly limited to authorized personnel who require it for operational duties.</li>
            <li>Regular security audits are performed to ensure our platform remains secure.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "cookies",
      icon: <Cookie className="text-[#C9A227] mt-1" size={24} />,
      title: "5. COOKIES & TRACKING TECHNOLOGIES",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies help us:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Maintain your session securely while you are logged in.</li>
            <li>Remember your preferences and display customized views.</li>
            <li>Analyze traffic patterns to improve platform performance and user experience.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "contact",
      icon: <HelpCircle className="text-[#C9A227] mt-1" size={24} />,
      title: "6. CONTACT & DATA RIGHTS",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>You have the right to request access to, correction of, or deletion of your personal information stored on our platform, subject to certain exceptions required for legal or operational record-keeping.</p>
          <p>If you have any questions or concerns regarding this Privacy Policy, please contact our administrative team at:</p>
          <div className="bg-slate-100 p-4 rounded-lg mt-4 border border-slate-200">
            <p><strong>Email:</strong> info.blueboxx@gmail.com</p>
            <p><strong>Phone:</strong> +91 90235 12853</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <SEO title="Privacy Policy | Blueboxx DA" description="Read our privacy policy to understand how Blueboxx DA handles your personal and academic data." />
      <div className="pt-32 pb-24 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B2A6B]/10 text-[#1B2A6B] text-sm font-semibold mb-6">
              <Lock size={16} />
              <span>Data Protection</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mb-6 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              How BlueBoxx protects and manages your personal and academic data.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents - Sticky Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/3 hidden lg:block"
            >
              <div className="sticky top-28 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-[#0F172A] mb-4 pb-4 border-b border-slate-100 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#C9A227]" /> Table of Contents
                </h3>
                <ul className="space-y-3">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="text-sm text-slate-600 hover:text-[#1B2A6B] hover:font-medium transition-colors block line-clamp-1">
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6 md:p-10 space-y-12">
                {sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-32">
                    <div className="flex gap-4 mb-6">
                      <div className="shrink-0">{section.icon}</div>
                      <h2 className="text-xl md:text-2xl font-bold text-[#0F172A]">{section.title}</h2>
                    </div>
                    <div className="pl-0 md:pl-10">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>
              <div className="bg-slate-50 p-6 md:p-10 border-t border-slate-200 text-center">
                <p className="text-slate-500 text-sm">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                <p className="text-slate-400 text-xs mt-2">By using the BlueBoxx platform, you consent to the data practices described in this policy.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
