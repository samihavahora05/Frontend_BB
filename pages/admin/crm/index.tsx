import React from 'react';
import Head from 'next/head';
import { AdminDashboardLayout } from '../../../src/layout/AdminDashboardLayout';
import { LeadService } from '../../../src/lib/api/admin/LeadService';
import { 
  Briefcase, Mail, BookOpen, Users, Compass, Calendar, 
  BarChart3, CheckCircle, TrendingUp, Handshake
} from 'lucide-react';
import Link from 'next/link';

export default function CRMDashboard() {
  const { data: crmResponse, isLoading } = LeadService.useCRMDashboard();
  const crmData = crmResponse?.data || {};

  const statCards = [
    { title: "New Leads (Today)", value: crmData.todays_leads || 0, icon: TrendingUp, color: "bg-blue-50 text-blue-600", link: "/admin/crm/contact-inquiries" },
    { title: "Pending Follow-ups", value: crmData.pending_follow_ups || 0, icon: Calendar, color: "bg-yellow-50 text-yellow-600", link: "/admin/crm/contact-inquiries" },
    { title: "Converted Leads", value: crmData.converted_leads || 0, icon: CheckCircle, color: "bg-emerald-50 text-emerald-600", link: "#" },
    { title: "Total Lifetime Leads", value: crmData.total_leads || 0, icon: BarChart3, color: "bg-purple-50 text-purple-600", link: "#" },
  ];

  const categoryCards = [
    { title: "Contact Inquiries", value: crmData.new_leads || 0, icon: Mail, link: "/admin/crm/contact-inquiries" },
    { title: "Course Inquiries", value: crmData.course_inquiries || 0, icon: BookOpen, link: "/admin/crm/course-inquiries" },
    { title: "Mentor Inquiries", value: crmData.mentor_inquiries || 0, icon: Users, link: "/admin/crm/mentor-inquiries" },
    { title: "Corporate Training", value: crmData.corporate_training || 0, icon: Briefcase, link: "/admin/crm/corporate-training" },
    { title: "Partnership Requests", value: 0, icon: Handshake, link: "/admin/crm/partnership-requests" },
    { title: "Need Guidance", value: 0, icon: Compass, link: "/admin/crm/need-guidance" },
  ];

  return (
    <AdminDashboardLayout>
      <Head>
        <title>CRM Dashboard | BlueBoxx DA</title>
      </Head>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
          <Briefcase size={28} className="text-[#C9A227]" /> CRM Overview
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-semibold">Track, manage, and convert incoming leads efficiently.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A6B]"></div>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className={`p-4 rounded-xl ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-2xl font-black text-[#0d1635] mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-[#C9A227]"/> Lead Pipelines
          </h2>
          
          {/* Pipeline Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCards.map((cat, idx) => (
              <Link href={cat.link} key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#1B2A6B]/30 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#1B2A6B]/5 transition-colors">
                    <cat.icon size={22} className="text-gray-600 group-hover:text-[#1B2A6B] transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">View Pipeline</span>
                </div>
                <h3 className="text-gray-500 text-sm font-bold">{cat.title}</h3>
                <p className="text-xl font-black text-[#0d1635] mt-1">{cat.value} <span className="text-sm font-semibold text-gray-400">Total</span></p>
              </Link>
            ))}
          </div>
        </>
      )}

    </AdminDashboardLayout>
  );
}
