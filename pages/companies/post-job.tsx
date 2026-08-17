import { useState } from "react";
import { CompaniesLayout } from "../../src/layout/CompaniesLayout";
import { Card, CardContent } from "../../src/components/ui/Card";
import { Button } from "../../src/components/ui/Button";
import { Briefcase, MapPin, DollarSign, CheckCircle2, ChevronRight, Check } from "lucide-react";

export default function PostJobPage() {
  const [step, setStep] = useState(1);

  return (
    <CompaniesLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Post a New Job</h1>
            <p className="text-sm font-semibold text-slate-500">Find the perfect candidate from our talent pool.</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between relative mb-8">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10">
            <div className="h-full bg-[#1B2A6B] transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          </div>
          {[
            { num: 1, label: "Basic Details" },
            { num: 2, label: "Requirements" },
            { num: 3, label: "Review" }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2 bg-transparent">
              <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center font-black text-sm transition-all duration-300 ${
                step >= s.num 
                  ? "bg-[#1B2A6B] border-[#1B2A6B] text-white shadow-[0_0_15px_rgba(27,42,107,0.4)]" 
                  : "bg-white border-slate-200 text-slate-300"
              }`}>
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              <span className={`text-[11px] font-extrabold uppercase tracking-widest ${step >= s.num ? "text-[#1B2A6B]" : "text-slate-400"}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <Card className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Job Title</label>
                    <input type="text" placeholder="e.g. Frontend Developer" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-800" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Employment Type</label>
                    <select className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-800 bg-white">
                      <option>Full-Time</option>
                      <option>Part-Time</option>
                      <option>Internship</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Location</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="e.g. Mumbai, India or Remote" className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Salary/Stipend Range</label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="e.g. ₹50,000 - ₹80,000 / month" className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-800" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mt-6">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Job Description</label>
                  <textarea rows={5} placeholder="Describe the responsibilities and day-to-day tasks..." className="w-full p-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-800 resize-none"></textarea>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Required Skills (Comma separated)</label>
                  <input type="text" placeholder="e.g. React, Node.js, TypeScript" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-800" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Experience Level</label>
                  <select className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-[#1B2A6B] focus:ring-2 focus:ring-[#1B2A6B]/20 outline-none transition-all font-semibold text-slate-800 bg-white">
                    <option>Fresher (0-1 Years)</option>
                    <option>Junior (1-3 Years)</option>
                    <option>Mid-Level (3-5 Years)</option>
                    <option>Senior (5+ Years)</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Screening Questions (Optional)</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Add a question for applicants to answer..." className="flex-1 h-10 px-4 rounded-lg border border-slate-200 text-sm outline-none" />
                    <Button variant="outline" className="h-10 text-[11px] font-bold">Add</Button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="text-xl font-black text-[#1B2A6B] mb-2">Frontend Developer</h3>
                  <div className="flex flex-wrap gap-4 text-[12px] font-bold text-slate-500 mb-6">
                    <span className="flex items-center gap-1.5"><Briefcase size={14}/> Full-Time</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14}/> Remote</span>
                    <span className="flex items-center gap-1.5"><DollarSign size={14}/> ₹50,000 - ₹80,000 / month</span>
                  </div>
                  
                  <h4 className="text-sm font-extrabold text-slate-800 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["React", "Node.js", "TypeScript"].map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600">{skill}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <CheckCircle2 size={24} className="text-blue-600 shrink-0" />
                    <p className="text-xs font-semibold text-blue-900">Your job posting will be reviewed and published to the student dashboard within 2 hours.</p>
                  </div>
                </div>
              </div>
            )}

          </CardContent>
          
          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
            {step > 1 ? (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className="border-slate-200 text-slate-600 hover:bg-slate-100 font-extrabold rounded-xl h-12 px-8 transition-colors"
              >
                Back
              </Button>
            ) : <div></div>}
            
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step + 1)}
                className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-extrabold rounded-xl h-12 px-8 shadow-[0_4px_15px_rgba(27,42,107,0.2)] transition-all group gap-2"
              >
                Next Step <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button 
                className="bg-[#C9A227] hover:bg-amber-400 text-[#0d1635] font-black rounded-xl h-12 px-10 shadow-[0_4px_20px_rgba(201,162,39,0.3)] transition-all hover:scale-[1.02] uppercase tracking-wider text-[11px]"
              >
                Publish Job
              </Button>
            )}
          </div>
        </Card>

      </div>
    </CompaniesLayout>
  );
}
