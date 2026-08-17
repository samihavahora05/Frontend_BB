import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, CreditCard, Award, Briefcase, RefreshCcw, AlertTriangle, CheckCircle2, UserCheck } from "lucide-react";
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
            <p className="mb-3">The Platform Fee charged by BlueBoxx covers the following:</p>
            <ul className="space-y-3">
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Access to the Task Management System:</strong> Students receive full access to the BlueBoxx Task Dashboard where tasks, deadlines, comments, revisions, and approvals are managed. It ensures accuracy, transparency, and zero miscommunication. All actions are automatically recorded with timestamps to avoid disputes.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span><strong>KRA/KPI Tracking Tools:</strong> The system displays daily/weekly/monthly performance metrics. Students can track progress in real-time and improve based on mentor feedback. This transparent system ensures measurable growth.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Internship / Project Assignments:</strong> Students receive real, practical assignments based on projects—either internal BlueBoxx or external client work. Task allocation is matched with student skill and performance history. Workload distribution is fair, regulated, and based on system logic.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Mentor Guidance & Evaluation:</strong> Mentors provide feedback, task review, corrections, quality checks, and expert advice. Time and expertise of mentors are compensated through the Platform Fee. Mentors help maintain professional project standards.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Reporting & Analytics Dashboard:</strong> Students can view daily reports, submission history, performance charts, attendance, and logs. This avoids misunderstandings regarding performance. Reports are auto-generated and cannot be manipulated by students.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Certificate & Experience Letter Processing:</strong> After successful completion, documents are issued as per standards. Verification, formatting, approval, and digital delivery are included in the fee. Documents are only issued after 100% criteria are met.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span><strong>System Maintenance & Operational Support:</strong> The platform requires servers, software updates, automation tools, backups, and maintenance. The fee supports the complete tech infrastructure that students use. This ensures a smooth and uninterrupted platform experience.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Admin Support & Student Management System:</strong> The internal administration team manages onboarding, verification, progress tracking, and communication. This team handles operational support essential for internship flow. The Platform Fee compensates for these operational resources.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Resource Material & Training Assets:</strong> Reference guides, templates, briefs, industry examples, and learning material may be provided. These help students perform better and produce industry-level work. Such resources are proprietary and included as part of the system.</span></li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <span><strong>Quality Assurance & Review:</strong> Each submission is evaluated for quality, accuracy, creativity, and correctness. QA reviewers ensure the delivered work meets professional standards. The review process is time-consuming and is covered within the platform fee.</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2 mt-6">2.2 Fee Payment Responsibility</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>The Platform Fee must be paid either by the Student OR by the Company, depending on agreement.</li>
              <li>If a company refuses to pay, the student must pay the fee, even if they are a beginner.</li>
              <li>Platform access is activated only after successful fee payment.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2 mt-6">2.3 Non-Refundable Nature of Fees</h3>
            <p className="mb-2">Platform Fee, Mentor Fee, and Deposit Fee are strictly non-refundable under any circumstance. Reasons include:</p>
            <ul className="list-disc pl-5 space-y-1 mb-2">
              <li>Immediate resource allocation</li>
              <li>Mentor time booked</li>
              <li>Dashboard activated</li>
              <li>Seat blocked for you</li>
              <li>Digital material shared</li>
              <li>Administrative overhead incurred</li>
            </ul>
            <p>Refund requests will not be processed unless approved by BlueBoxx management in exceptional cases only.</p>
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
            <p>The KRA/KPI system ensures structured performance evaluation and helps students learn real workplace discipline. It removes confusion by setting clear expectations, deadlines, and measurable outcomes. Every student is judged based on the work recorded in the system—no manual adjustments.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">3.2 Student Responsibility & Task Execution</h3>
            <p>Students must complete tasks as per guidelines, quality standards, and submission formats assigned. They must read the task descriptions carefully, avoid shortcuts, and follow mentor instructions. Daily progress updates and time logs are part of the performance requirement.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">3.3 Failure to Meet Performance Expectations</h3>
            <p className="mb-2">If a student regularly misses deadlines, does not complete tasks, or fails to meet KPIs, it will negatively affect their evaluation. Repeated poor performance may lead to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Withheld certificates</li>
              <li>Internship marked as &quot;Incomplete&quot;</li>
              <li>Termination without refund</li>
              <li>Reporting issues recorded in the system</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">3.4 Daily Checking & Platform Accountability</h3>
            <p>Students are required to check the dashboard daily for updates. Excuses such as &quot;I didn&apos;t see the task&quot; or &quot;I forgot&quot; are not accepted. All assigned work, comments, and deadlines are automatically logged with time stamps.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">3.5 Zero Tolerance for Irresponsibility</h3>
            <p>Continuous negligence or lack of effort will immediately affect internship status. The platform records all activity; hence, no disputes will be entertained regarding unsubmitted or late work.</p>
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
            <p>Students will receive certificates only after achieving the minimum KPI score, completing all tasks, and closing pending submissions. The platform and mentors jointly evaluate performance before issuing any document. Incomplete KPIs automatically disqualify a student from receiving certifications.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">4.2 Standardized Document Formats</h3>
            <p>BlueBoxx follows strict corporate formatting for Experience Letters, Internship Certificates, LORs, and Project Reports. These formats are designed to reflect professional quality and brand standards. Customization requests by students are not entertained to maintain uniformity.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">4.3 Processing & Verification Requirements</h3>
            <p>Before issuing documents, BlueBoxx conducts verification of all submissions, attendance, quality, and KPIs. Only after successful verification, documents are digitally processed and issued to the student. Any mismatch, incomplete log, or missing task delays certificate issuance.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">4.4 Circumstances Where Documents May Be Withheld</h3>
            <p className="mb-2">BlueBoxx will not issue certificates if:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Student performance is below KPI standards</li>
              <li>Tasks are incomplete or plagiarized</li>
              <li>The internship was terminated</li>
              <li>There is behavioral misconduct</li>
              <li>Tasks were not submitted consistently</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">4.5 Final Approval Rights</h3>
            <p>The management and mentor team hold final authority to approve, modify, or reject certification depending on overall performance.</p>
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
            <p>All assignments and project work delivered to clients remain fully owned by the client. Students act only as contributors and do not possess any ownership of the work they produce. This includes designs, videos, code, marketing content, drafts, and strategy documents.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">5.2 Ownership of BlueBoxx Internal Work</h3>
            <p>Any work done as part of internal BlueBoxx projects is the sole property of BlueBoxx DA. Students cannot reuse, resell, reverse engineer, or claim credit for the work. Such work is protected under BlueBoxx&apos;s internal IP and copyright rules.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">5.3 Restriction on Portfolio Usage</h3>
            <p>Students must take written permission before using any BlueBoxx or client project in their portfolio. Unauthorized use may violate NDA/IP laws, resulting in legal action.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">5.4 Penalties for IP Misuse</h3>
            <p>Any form of plagiarism, file stealing, sharing internal data, or publishing confidential work is strictly prohibited. Consequences include immediate termination, blacklisting, withholding certificates, and legal action if required.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">5.5 Confidentiality Obligation</h3>
            <p>Students must maintain confidentiality of all data, credentials, internal project files, and documents accessed during internship.</p>
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
            <p>Stipend, if applicable, is based on the agreement between the company/client and student. Stipend is not guaranteed for all internships and depends entirely on external partner decisions. Eligibility is linked to performance, reported hours, and KPI score.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">6.2 BlueBoxx Is Not Responsible for Stipend Delays</h3>
            <p>BlueBoxx is not liable if a company delays payment, cancels or denies stipend, the student fails to meet requirements, or payment systems change. All stipend agreements are solely between the student and the paying company.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">6.3 Stipend Approved by BlueBoxx</h3>
            <p>If BlueBoxx itself is the stipend provider, students must strictly follow reporting schedules. Incorrect or missing logs, poor performance, or misconduct may result in stipend cancellation. Stipend is released only after task and KPI verification.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">6.4 Stipend Cannot Be Claimed Later</h3>
            <p>If the internship ends and student did not follow reporting or complete tasks, stipend cannot be claimed afterwards. Pending stipend requests after closure are automatically invalid.</p>
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
            <p>All fees collected—Platform Fee, Mentor Fee, Deposit Fee—are strictly non-refundable. This is because resources, mentors, dashboards, and admin time are allocated from day one. Even if a student discontinues voluntarily, fees are non-refundable.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">7.2 No Refund Cases</h3>
            <p>Refunds will not be given for personal issues, medical emergencies, device issues, lack of internet, lack of time, poor performance, internship withdrawal, conflicts, or failure to meet tasks/KRAs/KPIs.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">7.3 Deposit Adjustment Rules</h3>
            <p>Deposits, if any, may be adjusted internally but will not be refunded unless management approves. Any deduction applied is final and non-negotiable.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">7.4 Management Decision is Final</h3>
            <p>In rare circumstances, if a refund is approved, it will follow company policy and documentation. Such approval is solely at the discretion of senior management.</p>
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
            <p>Students must demonstrate professionalism at all times. This includes respecting mentors, maintaining work ethics, following deadlines, and adhering to task instructions. Positive attitude and discipline are mandatory parts of evaluation.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">8.2 Actions Strictly Prohibited</h3>
            <p>Fake submissions, plagiarism, rude/abusive behavior, fake attendance, sharing confidential data, unapproved leaves, or misuse of assets are strictly not allowed. Any such action will immediately affect internship status.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">8.3 Consequences for Misconduct</h3>
            <p>Misconduct can lead to warnings, temporary suspension, permanent banning, &quot;Incomplete Internship&quot; status, no certificate, or legal reporting.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">8.4 Confidentiality & Data Safety Rules</h3>
            <p>Students must protect client data, login credentials, strategy documents, project files, payment information, and training material. Sharing any such data outside the platform is considered a serious violation.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">8.5 Communication Standards</h3>
            <p>Students must communicate respectfully with clients, mentors, and team members. Unprofessional communication can lead to termination.</p>
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
          <p>By registering, you acknowledge that all information provided is true and accurate. You understand and accept that all fees are non-refundable. You accept that performance is evaluated based only on dashboard data. You grant BlueBoxx full authority to approve/reject applications, issue/withhold certificates, and terminate access due to misconduct. You agree that all work belongs to either the client or BlueBoxx. You agree that BlueBoxx is not responsible for stipend issues unless BlueBoxx is the paying agency. You confirm you have read, understood, and accepted all terms listed in this document. Proceeding with registration means complete acceptance of these policies.</p>
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
