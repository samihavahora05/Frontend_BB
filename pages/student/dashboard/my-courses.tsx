import { getImageUrl } from "../../../src/lib/imageUtils";
import { useState } from "react";
import { DashboardLayout } from "../../../src/layout/DashboardLayout";
import { Card, CardContent } from "../../../src/components/ui/Card";
import { Badge } from "../../../src/components/ui/Badge";
import { Button } from "../../../src/components/ui/Button";
import { PlayCircle, Award, CheckCircle2, MoreVertical, Calendar } from "lucide-react";

import useSWR from "swr";
import api from "../../../src/lib/axios";
import Link from "next/link";

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export default function MyCoursesPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  const { data: courses, isLoading } = useSWR("/student/courses", fetcher, {
    revalidateOnFocus: false
  });

  const activeCourses = courses?.active || [];
  const completedCourses = courses?.completed || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800">My Courses</h1>
            <p className="text-sm font-semibold text-slate-500">Track your progress and continue learning.</p>
          </div>
          <Link href="/courses">
            <Button className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-bold rounded-xl px-6 h-11">
              Browse New Courses
            </Button>
          </Link>
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-4 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab("active")}
            className={`pb-3 px-2 text-sm font-extrabold transition-all relative ${
              activeTab === "active" ? "text-[#1B2A6B]" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Active Courses ({activeCourses.length})
            {activeTab === "active" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B2A6B] rounded-t-md"></div>
            )}
          </button>
          <button 
            onClick={() => setActiveTab("completed")}
            className={`pb-3 px-2 text-sm font-extrabold transition-all relative ${
              activeTab === "completed" ? "text-[#1B2A6B]" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Completed ({completedCourses.length})
            {activeTab === "completed" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B2A6B] rounded-t-md"></div>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2].map((n) => (
                <div key={n} className="h-48 bg-slate-200 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : activeTab === "active" ? (
            <div className="grid grid-cols-1 gap-6">
              {activeCourses.map((course: any) => (
                <Card key={course.enrollment_id} className="bg-white border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgba(27,42,107,0.06)] transition-all rounded-3xl overflow-hidden group">
                  <div className="flex flex-col md:flex-row">
                    {/* Course Image */}
                    <div className="w-full md:w-72 h-48 md:h-auto bg-slate-200 shrink-0 relative overflow-hidden flex items-center justify-center text-slate-400">
                      {course.thumbnail ? (
                        <img src={getImageUrl(course.thumbnail)} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <PlayCircle size={48} />
                      )}
                      <div className="absolute inset-0 bg-[#0d1635]/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <PlayCircle size={48} className="text-white drop-shadow-md" />
                      </div>
                    </div>

                    {/* Course Details */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col relative">
                      <div className="absolute right-6 top-6">
                        <button className="text-slate-400 hover:text-[#1B2A6B] transition-colors p-2 rounded-full hover:bg-slate-50">
                          <MoreVertical size={20} />
                        </button>
                      </div>

                      <div className="flex flex-col flex-1">
                        <Badge variant="blue" className="w-fit text-[10px] py-0 px-2 font-bold mb-3 shadow-sm bg-blue-100 text-blue-700 hover:bg-blue-200">In Progress</Badge>
                        <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-[#1B2A6B] transition-colors pr-10">{course.title}</h3>
                        <p className="text-[13px] font-semibold text-slate-500 mb-6 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                            <img src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`} alt={course.instructor} />
                          </span>
                          Instructor: {course.instructor}
                        </p>

                        <div className="mt-auto">
                          <div className="flex justify-between items-end mb-2">
                            <div>
                              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Up Next</p>
                              <p className="text-sm font-bold text-[#1B2A6B]">{course.next_module}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-black text-slate-800">{course.progress}%</span>
                              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">{course.completed_lessons} of {course.total_lessons} lessons</p>
                            </div>
                          </div>
                          
                          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner mt-3">
                            <div className="bg-[#1B2A6B] h-full rounded-full relative" style={{ width: `${course.progress}%` }}>
                              <div className="absolute inset-0 bg-white/20 w-full animate-[shinesweep_2s_infinite]"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-100 flex justify-between items-center">
                        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#C9A227]" /> Keep going, you are doing great!
                        </div>
                        <Link href={`/student/learn/${course.course_id}`}>
                          <Button className="bg-white text-[#1B2A6B] border border-slate-200 hover:border-[#1B2A6B] hover:bg-slate-50 font-extrabold rounded-xl h-10 px-6 gap-2 text-xs uppercase tracking-wider group-hover:bg-[#1B2A6B] group-hover:text-white transition-all shadow-sm">
                            Continue Learning <PlayCircle size={14} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {activeCourses.length === 0 && (
                 <div className="text-center text-slate-500 py-12 border-2 border-dashed border-slate-200 rounded-3xl">
                   <p className="mb-4">You have no active courses.</p>
                   <Link href="/courses">
                     <Button className="bg-[#1B2A6B] hover:bg-[#0d1635] text-white">Browse Courses</Button>
                   </Link>
                 </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedCourses.map((course: any) => (
                <Card key={course.enrollment_id} className="bg-white border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgba(27,42,107,0.06)] hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden group">
                  <div className="h-40 bg-slate-200 relative overflow-hidden flex items-center justify-center text-slate-400">
                    {course.thumbnail ? (
                      <img src={getImageUrl(course.thumbnail)} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <PlayCircle size={48} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1635]/80 to-transparent"></div>
                    <Badge variant="emerald" className="absolute top-4 left-4 flex items-center gap-1 font-bold shadow-sm bg-emerald-500 text-white border-none">
                      <CheckCircle2 size={12} /> Completed
                    </Badge>
                  </div>
                  <CardContent className="p-6 relative">
                    <div className="absolute -top-8 right-6 w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Grade</span>
                      <span className="text-xl font-black text-[#1B2A6B] leading-none mt-1">A+</span>
                    </div>
                    
                    <h3 className="text-lg font-black text-slate-800 mb-1 mt-2 group-hover:text-[#1B2A6B] transition-colors pr-16">{course.title}</h3>
                    <p className="text-xs font-semibold text-slate-500 mb-5">Instructor: {course.instructor}</p>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={12} className="text-emerald-500" /> {course.completed_date || 'Recently'}
                      </div>
                      <Link href="/student/certificates">
                        <Button variant="outline" className="border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white h-8 text-[10px] font-extrabold uppercase tracking-wider rounded-lg px-4 gap-1.5 transition-colors">
                          <Award size={12} /> View Certificate
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {completedCourses.length === 0 && (
                <div className="col-span-1 md:col-span-2 text-center text-slate-500 py-12 border-2 border-dashed border-slate-200 rounded-3xl">
                  <p>You haven't completed any courses yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
