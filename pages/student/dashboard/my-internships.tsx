import { DashboardLayout } from "../../../src/layout/DashboardLayout";
import { Card, CardContent } from "../../../src/components/ui/Card";
import { Badge } from "../../../src/components/ui/Badge";
import { Button } from "../../../src/components/ui/Button";
import { Briefcase, MapPin, Building, Calendar, DollarSign, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function MyInternshipsPage() {
  const internships = [
    {
      role: "Frontend Developer Intern",
      company: "TechNova Solutions",
      logo: "T",
      status: "Shortlisted",
      appliedOn: "Oct 12, 2026",
      stipend: "₹15,000/mo",
      location: "Remote",
      bg: "bg-indigo-100 text-indigo-700"
    },
    {
      role: "Data Analyst Intern",
      company: "QuantData Corp",
      logo: "Q",
      status: "In Review",
      appliedOn: "Oct 15, 2026",
      stipend: "₹20,000/mo",
      location: "Bangalore",
      bg: "bg-blue-100 text-blue-700"
    },
    {
      role: "UI/UX Design Intern",
      company: "CreativeStudio",
      logo: "C",
      status: "Rejected",
      appliedOn: "Sep 28, 2026",
      stipend: "₹10,000/mo",
      location: "Hybrid",
      bg: "bg-rose-100 text-rose-700"
    },
    {
      role: "Software Engineering Intern",
      company: "InnovateTech",
      logo: "I",
      status: "Offer Received",
      appliedOn: "Sep 15, 2026",
      stipend: "₹25,000/mo",
      location: "Gurgaon",
      bg: "bg-emerald-100 text-emerald-700"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Shortlisted": return <Badge variant="gold">Shortlisted</Badge>;
      case "In Review": return <Badge variant="secondary">In Review</Badge>;
      case "Offer Received": return <Badge variant="emerald">Offer Received</Badge>;
      case "Rejected": return <Badge variant="destructive">Not Selected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">My Internships</h1>
            <p className="text-slate-500 text-sm">Track your internship applications and offers.</p>
          </div>
          <Link href="/internships">
            <Button variant="primary" className="gap-2"><Briefcase size={16}/> Browse Internships</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {internships.map((internship, i) => (
            <Card key={i} className="hover:border-slate-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 ${internship.bg}`}>
                      {internship.logo}
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-800 text-lg leading-tight">{internship.role}</h2>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                        <Building size={14} /> {internship.company}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(internship.status)}
                </div>

                <div className="grid grid-cols-2 gap-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} className="text-slate-400" /> {internship.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign size={16} className="text-slate-400" /> {internship.stipend}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={16} className="text-slate-400" /> Applied: {internship.appliedOn}
                  </div>
                </div>

                <div className="flex gap-3">
                  {internship.status === "Offer Received" ? (
                    <Button variant="emerald" className="w-full text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white">Accept Offer</Button>
                  ) : (
                    <Button variant="outline" className="w-full text-sm font-bold gap-2">View Application <ExternalLink size={14}/></Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
