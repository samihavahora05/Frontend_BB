import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, CreditCard, Award, Briefcase, RefreshCcw, AlertTriangle, CheckCircle2, UserCheck, Download } from "lucide-react";
import { SEO } from "../src/components/seo/SEO";

export default function TermsPage() {
  const sections = [
    {
      id: "registration",
      icon: <UserCheck className="text-[#C9A227] mt-1" size={24} />,
      title: "1. PLATFORM REGISTRATION & THREE-STAGE VERIFICATION",
      content: (
        <div className="space-y-4 text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">1.1 Mandatory Verification Process</h3>
            <p className="mb-2">Every applicant must complete a three-stage verification, designed to confirm eligibility, skill level, and sincerity.</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Stage 1 — Resume Check & Background Assessment:</strong> The resume is evaluated for accuracy, skill authenticity, education history, and relevance to the chosen domain. Any false claims, mismatched data, or unverifiable information may result in rejection or a request for resubmission. This stage ensures that the applicant meets the minimum eligibility required for task allocation.</li>
              <li><strong>Stage 2 — Eligibility Screening + Understanding of KRA/KPI:</strong> We verify whether the applicant understands the task system, workload expectations, deadlines, and performance evaluation. A brief orientation on the platform rules, KRA (Key Responsibility Areas), and KPI (Key Performance Indicators) is provided. Students must confirm they are ready to commit time and effort before being approved.</li>
              <li><strong>Stage 3 — Final Approval & Onboarding:</strong> Dashboard access is granted only after meeting internal eligibility parameters. Onboarding includes access to tasks, mentors, helpdesk, reporting tools, and project guidelines. Approval is based on performance in earlier stages and internal evaluation. It is not automatic.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">1.2 Right to Reject or Approve</h3>
            <p>BlueBoxx reserves complete rights to approve, hold, or reject any application without explanation, for quality control and compliance reasons.</p>
          </div>
        </div>
      ),
    },
    {
      id: "fees",
      icon: <CreditCard className="text-[#C9A227] mt-1" size={24} />,
      title: "2. PLATFORM FEES, PAYMENT TERMS & RESPONSIBILITY",
      content: (
        <div className="space-y-4 text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">2.1 Platform Fee — Complete Detailed Breakdown</h3>
            <p className="mb-3">The Platform Fee charged by BlueBoxx covers the following operational, digital, and infrastructural deliverables:</p>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm my-4">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100 text-slate-800 font-bold">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left w-1/3">Deliverable</th>
                    <th scope="col" className="px-4 py-3 text-left w-2/3">What It Covers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Task Management System</td>
                    <td className="px-4 py-3">Deployment and maintenance of customized project tracking boards, milestone submissions, and version-controlled review portals.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900">KRA/KPI Tracking Tools</td>
                    <td className="px-4 py-3">Real-time quantitative performance benchmarking, evaluation metrics, analytics engines, and milestone progress logging.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Internship / Project Assignments</td>
                    <td className="px-4 py-3">Curation, provisioning, and allocation of verified corporate, industrial, and internal practical live-project tasks.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Mentor Guidance & Evaluation</td>
                    <td className="px-4 py-3">Dedicated industry expert reviews, structured technical feedback, code/deliverable inspection, and weekly advisory sessions.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Reporting & Analytics Dashboard</td>
                    <td className="px-4 py-3">Live productivity graphs, time-tracking logs, submission compliance trackers, and cumulative performance scoring.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Certificate & Experience Letters</td>
                    <td className="px-4 py-3">Verification, generation, unique credential authentication, secure archiving, and issuance of formal completion credentials.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Maintenance & Tech Support</td>
                    <td className="px-4 py-3">24/7 cloud infrastructure, server uptime, database backups, API integrations, and continuous portal enhancements.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Admin Support & Student Management</td>
                    <td className="px-4 py-3">Comprehensive query resolution, onboarding coordination, documentation validation, and administrative helpdesk services.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Resource Material & Training Assets</td>
                    <td className="px-4 py-3">Curated technical guides, standard operating procedures, development templates, workflow documentation, and software toolkits.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900">Quality Assurance & Review</td>
                    <td className="px-4 py-3">Multi-tier manual deliverable assessment, anti-plagiarism scanning, and industry-readiness quality certification.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2 mt-6">2.2 Fee Payment Responsibility</h3>
            <p>The Platform Fee must be paid either by the Student OR by the Company, depending on the agreed onboarding contract. If a company refuses to pay or sponsors only partial costs, the student must pay the fee to maintain platform access, even if they are a beginner. Platform access, task allocation, and mentorship are activated strictly after confirmed fee payment.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2 mt-6">2.3 Non-Refundable Nature of Fees</h3>
            <p className="mb-2">Platform Fee, Mentor Fee, and Deposit Fee are strictly non-refundable under any circumstance. Immediate resource allocation, mentor time booking, dedicated seat reservations, digital asset provisioning, and administrative overheads are irreversibly incurred upon registration. Refund requests will not be processed unless approved in writing by BlueBoxx management in exceptional cases only.</p>
          </div>
        </div>
      ),
    },
    {
      id: "performance",
      icon: <FileText className="text-[#C9A227] mt-1" size={24} />,
      title: "3. TASK, KRA, KPI PERFORMANCE RULES",
      content: (
        <div className="space-y-4 text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">3.1 Purpose of KRA & KPI System</h3>
            <p>The KRA/KPI system ensures structured performance evaluation and helps students learn real workplace discipline, accountability, and time management.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">3.2 Student Responsibility & Task Execution</h3>
            <p>Students must complete tasks strictly as per assigned guidelines, quality standards, and submission formats. Daily progress updates, milestone check-ins, and time logs are mandatory components of the performance requirement.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">3.3 Failure to Meet Performance Expectations</h3>
            <p>Repeated poor performance, missed deadlines, or substandard deliverables may lead to withheld certificates, marking the internship as “Incomplete”, termination of platform access without refund, and recording compliance flags in the student&apos;s permanent profile.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">3.4 Daily Checking & Platform Accountability</h3>
            <p>Students are required to log in and check their dashboard daily for updates, feedback, task adjustments, and notices. All assigned work, mentor comments, and deadlines are automatically logged with cryptographic timestamps.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">3.5 Zero Tolerance for Irresponsibility</h3>
            <p>Continuous negligence, unexcused absence, or lack of effort will immediately affect internship standing and lead to disciplinary action or disenrollment.</p>
          </div>
        </div>
      ),
    },
    {
      id: "certificates",
      icon: <Award className="text-[#C9A227] mt-1" size={24} />,
      title: "4. CERTIFICATES, EXPERIENCE LETTERS & COMPLETION DOCUMENTS",
      content: (
        <div className="space-y-4 text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">4.1 Eligibility Criteria for Certificates</h3>
            <p>Students will receive completion certificates and experience credentials only after achieving the minimum required KPI score, completing 100% of assigned tasks, and resolving all pending mentor review submissions.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">4.2 Standardized Document Formats</h3>
            <p>BlueBoxx follows strict corporate formatting and verifiable identification numbers for Experience Letters, Internship Certificates, Letters of Recommendation (LOR), and Project Reports.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">4.3 Processing & Verification Requirements</h3>
            <p>Before issuing any formal document, BlueBoxx conducts thorough internal verification of project submissions, attendance logs, technical quality, and overall KPI metrics.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">4.4 Circumstances Where Documents May Be Withheld</h3>
            <p>BlueBoxx will not issue certificates or recommendation letters if student performance is below KPI standards, tasks are incomplete or plagiarized, the internship was terminated for cause, behavioral misconduct occurred, or tasks were not submitted consistently.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">4.5 Final Approval Rights</h3>
            <p>Management and appointed mentor panels hold final authority to approve, modify, or reject certification depending on cumulative overall performance.</p>
          </div>
        </div>
      ),
    },
    {
      id: "ownership",
      icon: <Briefcase className="text-[#C9A227] mt-1" size={24} />,
      title: "5. PROJECT OWNERSHIP & INTELLECTUAL PROPERTY RIGHTS",
      content: (
        <div className="space-y-4 text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">5.1 Ownership of Client-Based Work</h3>
            <p>All source code, architectures, creative assets, designs, and project work delivered for clients remain the exclusive, perpetual property of the respective client.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">5.2 Ownership of BlueBoxx Internal Work</h3>
            <p>Any work, modules, datasets, software tools, or content created as part of internal BlueBoxx initiatives is the sole and exclusive intellectual property of BlueBoxx DA Pvt. Ltd.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">5.3 Restriction on Portfolio Usage</h3>
            <p>Students must obtain prior written permission from BlueBoxx management before using any BlueBoxx or client project code, screenshots, or assets in their personal portfolio or public repositories.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">5.4 Penalties for IP Misuse</h3>
            <p>Plagiarism, unauthorized repository cloning, data exfiltration, sharing internal credentials, or publishing confidential work is strictly prohibited and subject to immediate termination and legal recourse.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">5.5 Confidentiality Obligation</h3>
            <p>Students must maintain strict non-disclosure of all confidential data, credentials, internal project files, client roadmaps, and proprietary documentation accessed during their tenure.</p>
          </div>
        </div>
      ),
    },
    {
      id: "stipend",
      icon: <CreditCard className="text-[#C9A227] mt-1" size={24} />,
      title: "6. STIPEND POLICY & RESPONSIBILITY",
      content: (
        <div className="space-y-4 text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">6.1 Nature of Stipend</h3>
            <p>Stipend, if applicable, is determined strictly by the specific agreement between the hiring company/client and the student, contingent on satisfactory milestone completion.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">6.2 BlueBoxx Is Not Responsible for Stipend Delays</h3>
            <p>BlueBoxx is not liable if a third-party company delays payment, cancels or denies stipend, if the student fails to meet deliverable requirements, or if external banking channels encounter issues.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">6.3 Stipend Approved by BlueBoxx</h3>
            <p>In cases where BlueBoxx itself is the direct stipend provider, students must strictly adhere to milestone deadlines, quality parameters, and formal reporting schedules to qualify for disbursement.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">6.4 Stipend Cannot Be Claimed Later</h3>
            <p>If the internship tenure concludes and the student did not follow reporting requirements or complete deliverables on time, stipend cannot be claimed retroactively under any circumstance.</p>
          </div>
        </div>
      ),
    },
    {
      id: "refunds",
      icon: <RefreshCcw className="text-[#C9A227] mt-1" size={24} />,
      title: "7. REFUNDS, DEPOSITS & MENTOR FEES",
      content: (
        <div className="space-y-4 text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">7.1 Non-Refundable Fee Policy</h3>
            <p>All fees collected — including Platform Fees, Mentor Booking Fees, and Administrative Deposit Fees — are strictly non-refundable.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">7.2 No Refund Cases</h3>
            <p>Refunds will not be granted under any circumstance for personal reasons, academic exam conflicts, medical situations, device malfunctions, internet unavailability, lack of time, poor performance scores, unilateral withdrawal, interpersonal disagreements, or failure to meet KRAs/KPIs.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">7.3 Deposit Adjustment Rules</h3>
            <p>Security or administrative deposits, if applicable, may be adjusted internally against platform services but will not be refunded in cash unless approved in writing by executive management.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">7.4 Management Decision is Final</h3>
            <p>In rare, exceptional circumstances where a refund or credit note is sanctioned by management, it will follow formal company policy and documentation timelines.</p>
          </div>
        </div>
      ),
    },
    {
      id: "conduct",
      icon: <AlertTriangle className="text-[#C9A227] mt-1" size={24} />,
      title: "8. CODE OF CONDUCT, ETHICS & PROFESSIONAL BEHAVIOUR",
      content: (
        <div className="space-y-4 text-slate-600">
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">8.1 Expected Behaviour from All Students</h3>
            <p>Students and participants must exhibit the highest standards of integrity, punctuality, diligence, and professional etiquette in all platform activities and communications.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">8.2 Actions Strictly Prohibited</h3>
            <p>The following actions are strictly prohibited: fraudulent task submissions, code plagiarism, abusive or unprofessional language, proxy attendance, unauthorized sharing of proprietary data, unapproved absence, and misuse of platform infrastructure.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">8.3 Consequences for Misconduct</h3>
            <p>Misconduct will result in immediate formal warnings, temporary suspension, permanent platform blacklisting, marking the internship as “Incomplete”, forfeiture of certificates, and reporting to academic institutions or legal authorities where appropriate.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">8.4 Confidentiality & Data Safety Rules</h3>
            <p>Students must safeguard client records, authentication tokens, strategy documentation, proprietary codebase repositories, payment mechanisms, and training assets from unauthorized disclosure.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">8.5 Communication Standards</h3>
            <p>All interactions with mentors, project leads, clients, and fellow interns must remain courteous, constructive, and conducted exclusively through authorized platform communication channels.</p>
          </div>
        </div>
      ),
    },
    {
      id: "declaration",
      icon: <ShieldCheck className="text-[#C9A227] mt-1" size={24} />,
      title: "9. FINAL DECLARATION & ACCEPTANCE",
      content: (
        <div className="space-y-4 text-slate-600">
          <div className="border border-emerald-500/40 bg-emerald-50/50 p-5 rounded-xl">
            <p className="font-bold text-slate-900 mb-3">By submitting your registration, application, or digital signature on the BlueBoxx platform, you solemnly declare and agree:</p>
            <ol className="list-decimal pl-5 space-y-2 text-slate-700 text-sm">
              <li>All credentials, contact details, educational records, and resumes provided are authentic, accurate, and verifiable.</li>
              <li>You understand, acknowledge, and accept that all platform, mentor, and deposit fees are strictly non-refundable.</li>
              <li>You accept that internship progress, certificate eligibility, and stipend disbursements are evaluated solely on documented dashboard analytics, task submissions, and KPI performance.</li>
              <li>You grant BlueBoxx DA Pvt. Ltd. full administrative authority to approve or reject applications, issue or withhold completion documents, and terminate access in cases of misconduct or substandard performance.</li>
              <li>You agree that all deliverables, code, and project assets belong exclusively to the client or BlueBoxx DA Pvt. Ltd. as per policy.</li>
              <li>You confirm that BlueBoxx is not responsible for external company stipend delays or disputes unless BlueBoxx is the designated paying agency.</li>
              <li>You confirm that you have thoroughly read, fully understood, and unconditionally accepted all 9 sections and policies contained within this Official Consent & Terms document.</li>
            </ol>
          </div>
          <div className="bg-[#1B2A6B] text-white font-bold p-3.5 rounded-lg text-center text-xs tracking-wide">
            PROCEEDING WITH REGISTRATION OR DIGITAL SIGNATURE SUBMISSION REPRESENTS COMPLETE, LEGALLY BINDING ACCEPTANCE OF THESE POLICIES.
          </div>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <SEO title="Terms & Conditions | Blueboxx DA" description="Read the official terms and conditions for using the Blueboxx DA platform." />
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
              <ShieldCheck size={16} />
              <span>Official Document</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mb-6 leading-tight">
              Terms & Conditions
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              BLUEBOXX DA — OFFICIAL CONSENT, DECLARATION & TERMS AND CONDITIONS (FULL VERSION)
            </p>
            <p className="text-base text-slate-500 mt-4 max-w-2xl mx-auto">
              Applicable for all Students, Interns, Trainees, Companies, and Project Participants using the BlueBoxx Platform.
            </p>
            <div className="mt-6 flex justify-center">
              <a
                href="/documents/terms-and-conditions.pdf"
                download="BlueBoxx_Internship_Terms_and_Conditions.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1B2A6B] hover:bg-[#121c47] text-white text-sm font-bold rounded-xl shadow-md transition-all hover:scale-105"
              >
                <Download size={18} />
                <span>Download Official Terms & Conditions PDF</span>
              </a>
            </div>
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
                  <FileText size={18} className="text-[#C9A227]" /> Table of Contents
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
                <p className="text-slate-400 text-xs mt-2">If you have any questions regarding these terms, please contact our support team.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
