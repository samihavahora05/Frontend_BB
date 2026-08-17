import { MainLayout } from "../src/layout/MainLayout";
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, UserX, ClipboardList, Phone, Scale, HeartHandshake } from "lucide-react";

export default function HarassmentPolicyPage() {
  const sections = [
    {
      id: "purpose",
      icon: <ShieldAlert className="text-[#C9A227] mt-1" size={24} />,
      title: "1. PURPOSE & SCOPE",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>BlueBoxx DA Pvt. Ltd. is committed to maintaining a workplace and learning environment that is free from all forms of harassment, discrimination, and misconduct. This policy applies to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>All full-time and part-time employees</li>
            <li>Interns, trainees, and course participants</li>
            <li>Mentors, instructors, and guest experts</li>
            <li>Clients, vendors, and any third parties interacting within our platform or premises</li>
          </ul>
          <p>This policy is applicable to all work-related interactions — in-person, online (via the platform, email, WhatsApp, or social media), or during any BlueBoxx-organized event.</p>
        </div>
      ),
    },
    {
      id: "definition",
      icon: <AlertTriangle className="text-[#C9A227] mt-1" size={24} />,
      title: "2. DEFINITION OF HARASSMENT",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>Harassment includes any unwanted conduct that violates an individual's dignity or creates an intimidating, hostile, degrading, humiliating, or offensive environment. This includes but is not limited to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Sexual Harassment:</strong> Unwelcome sexual advances, requests for sexual favors, sharing explicit content, or any verbal/physical conduct of a sexual nature.</li>
            <li><strong>Verbal Harassment:</strong> Offensive jokes, slurs, threats, insults, or comments targeting a person's gender, caste, religion, ethnicity, disability, or sexual orientation.</li>
            <li><strong>Psychological Harassment:</strong> Intimidation, bullying, unreasonable criticism, isolation, or deliberate exclusion intended to undermine a person's dignity or confidence.</li>
            <li><strong>Cyberbullying:</strong> Sending hostile, threatening, or demeaning messages via email, social media, chat platforms, or any digital medium.</li>
            <li><strong>Discriminatory Harassment:</strong> Treating individuals unfairly based on gender, caste, religion, disability, age, race, or any other protected characteristic.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "prohibited",
      icon: <UserX className="text-[#C9A227] mt-1" size={24} />,
      title: "3. PROHIBITED CONDUCT",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>The following behaviors are strictly prohibited at BlueBoxx and will result in immediate disciplinary action:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Physical touching, gestures, or actions of a sexual or threatening nature</li>
            <li>Sharing, displaying, or distributing offensive, sexually explicit, or derogatory materials</li>
            <li>Making threats, whether direct or implied, against any individual</li>
            <li>Using authority or position to coerce, manipulate, or unfairly influence another person</li>
            <li>Retaliating against any person who has reported harassment or participated in an investigation</li>
            <li>Making deliberately false complaints against another individual</li>
          </ul>
        </div>
      ),
    },
    {
      id: "reporting",
      icon: <ClipboardList className="text-[#C9A227] mt-1" size={24} />,
      title: "4. HOW TO REPORT",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>Any individual who believes they have experienced or witnessed harassment should report it promptly. Reports can be made through the following channels:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Email:</strong> info.blueboxx@gmail.com (Subject: Harassment Complaint)</li>
            <li><strong>Phone:</strong> +91 90235 12853 (during business hours)</li>
            <li><strong>In-Person:</strong> Speak directly with a senior HR team member or the designated Complaints Committee at our Vadodara office</li>
          </ul>
          <p className="mt-4">All complaints will be acknowledged within <strong>48 working hours</strong> and treated with the highest level of confidentiality. The identity of the complainant will be protected to the extent possible.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-2">
            <p className="text-amber-800 font-semibold text-sm">⚠️ Anonymous complaints may also be submitted, however please note that anonymous complaints may limit the scope of the investigation.</p>
          </div>
        </div>
      ),
    },
    {
      id: "process",
      icon: <Scale className="text-[#C9A227] mt-1" size={24} />,
      title: "5. INVESTIGATION PROCESS",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>Upon receiving a formal complaint, BlueBoxx will conduct a fair, impartial, and timely investigation following these steps:</p>
          <ol className="list-decimal pl-5 space-y-3">
            <li><strong>Acknowledgment:</strong> The complainant will receive confirmation that their complaint has been received within 48 hours.</li>
            <li><strong>Preliminary Assessment:</strong> An initial review will be conducted to determine the nature and severity of the complaint.</li>
            <li><strong>Formal Investigation:</strong> A designated committee will interview the complainant, the respondent, and any relevant witnesses. All parties will have the opportunity to present their account.</li>
            <li><strong>Decision:</strong> Based on findings, the committee will recommend appropriate action within a reasonable timeframe.</li>
            <li><strong>Communication:</strong> Both parties will be informed of the outcome of the investigation.</li>
          </ol>
        </div>
      ),
    },
    {
      id: "consequences",
      icon: <AlertTriangle className="text-[#C9A227] mt-1" size={24} />,
      title: "6. CONSEQUENCES OF VIOLATION",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>Any individual found to have engaged in harassment will be subject to disciplinary action, which may include one or more of the following depending on the severity of the conduct:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Formal written warning placed on record</li>
            <li>Mandatory sensitivity and awareness training</li>
            <li>Suspension from platform access, internship, or course program</li>
            <li>Removal from mentorship responsibilities or expert roles</li>
            <li>Termination of employment, internship, or contractual engagement</li>
            <li>Legal action in accordance with applicable Indian law, including the POSH Act, 2013</li>
          </ul>
        </div>
      ),
    },
    {
      id: "commitment",
      icon: <HeartHandshake className="text-[#C9A227] mt-1" size={24} />,
      title: "7. OUR COMMITMENT",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>BlueBoxx DA is deeply committed to fostering a culture of respect, dignity, and inclusion. We believe that every individual deserves to work and learn in an environment free from fear, bias, and hostility.</p>
          <p>We encourage everyone in our community to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Treat all individuals with respect and professionalism</li>
            <li>Speak up when they witness inappropriate behavior</li>
            <li>Support those who come forward with complaints</li>
            <li>Actively participate in awareness and sensitivity programs</li>
          </ul>
          <p>This policy is reviewed annually and updated to reflect changes in law and best practices. For any questions or clarifications, please contact us at <strong>info.blueboxx@gmail.com</strong>.</p>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="pt-32 pb-24 bg-transparent min-h-screen">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-6 border border-red-100">
              <ShieldAlert size={16} />
              <span>Safe Workplace Policy</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mb-6 leading-tight">
              Harassment Policy
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              BlueBoxx DA is committed to providing a safe, respectful, and inclusive environment for all learners, mentors, and employees.
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
                  <ShieldAlert size={18} className="text-[#C9A227]" /> Table of Contents
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
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-3">Need to report an incident?</p>
                  <a
                    href="mailto:info.blueboxx@gmail.com?subject=Harassment Complaint"
                    className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors px-4 py-2.5 rounded-xl text-sm font-bold border border-red-100"
                  >
                    <Phone size={14} /> Contact Us
                  </a>
                </div>
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
                <p className="text-slate-400 text-xs mt-2">This policy is in compliance with The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act).</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
