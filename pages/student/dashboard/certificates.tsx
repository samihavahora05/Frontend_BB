import { DashboardLayout } from "../../../src/layout/DashboardLayout";
import { Card, CardContent } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";
import { Award, Download, Share2, ExternalLink } from "lucide-react";

import useSWR from "swr";
import api from "../../../src/lib/axios";
import Link from "next/link";

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export default function CertificatesPage() {
  const { data: certificates, isLoading } = useSWR("/student/certificates", fetcher, {
    revalidateOnFocus: false
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">My Certificates</h1>
          <p className="text-slate-500 text-sm">View, download, and share your earned certificates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-slate-400">Loading certificates...</div>
          ) : certificates?.length > 0 ? (
            certificates.map((cert: any) => (
              <Card key={cert.id} className="hover:border-slate-300 transition-all overflow-hidden group">
                <div className="aspect-[1.4] bg-slate-100 relative overflow-hidden border-b border-slate-100">
                  <img src="https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&q=80" alt="Certificate" className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{cert.course}</h3>
                    <p className="text-white/80 text-xs font-semibold">Issued on {cert.issued_at}</p>
                  </div>
                </div>
                <CardContent className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Credential ID</div>
                      <div className="text-sm font-mono text-slate-700 font-semibold">{cert.certificate_number}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Award size={16} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/public/certificates/${cert.certificate_number}/download`} target="_blank" rel="noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full text-xs h-9 px-2 gap-1.5"><Download size={14}/> PDF</Button>
                    </a>
                    <Button variant="outline" className="flex-1 text-xs h-9 px-2 gap-1.5"><Share2 size={14}/> Share</Button>
                    <Link href={`/certificates/verify?id=${cert.certificate_number}`} target="_blank">
                      <Button variant="secondary" className="w-9 h-9 px-0 shrink-0 flex items-center justify-center"><ExternalLink size={14}/></Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl text-slate-500">
              You haven't earned any certificates yet. Complete a course to get certified!
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
