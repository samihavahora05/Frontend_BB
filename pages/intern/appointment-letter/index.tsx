import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { InternDashboardLayout } from "../../../src/layout/InternDashboardLayout";
import { 
  FileText, CheckCircle2, Clock, AlertCircle, Download, 
  ArrowLeft, ShieldCheck, PenTool, Sparkles, Send, Award
} from "lucide-react";
import { SignaturePad } from "../../../src/components/common/SignaturePad";
import api from "../../../src/lib/axios";
import toast from "react-hot-toast";

export default function InternAppointmentLetterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    loadLetterData();
  }, []);

  const loadLetterData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/intern/appointment-letter");
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load appointment letter information.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignSubmit = async () => {
    if (!signatureData) {
      toast.error("Please draw or upload your digital signature before submitting.");
      return;
    }
    if (!agreedTerms) {
      toast.error("Please confirm acceptance of internship terms.");
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading("Submitting signed appointment letter...", { id: "sign-letter" });
      const res = await api.post("/intern/appointment-letter/sign", {
        signature: signatureData,
      });

      if (res.data?.success) {
        toast.success("Appointment Letter E-Signed successfully!", { id: "sign-letter" });
        loadLetterData();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit signature.", { id: "sign-letter" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      toast.loading("Downloading official Appointment Letter...", { id: "dl-letter" });
      const res = await api.get("/intern/appointment-letter/download", {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `BlueBoxx_Appointment_Letter_${data?.candidate_name?.replace(/\s+/g, '_') || 'Intern'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Downloaded successfully!", { id: "dl-letter" });
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to download PDF.", { id: "dl-letter" });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <InternDashboardLayout>
        <div className="max-w-4xl mx-auto py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-500">Loading Appointment Letter & Verification Status...</p>
        </div>
      </InternDashboardLayout>
    );
  }

  const isSigned = Boolean(data?.is_signed);

  return (
    <InternDashboardLayout>
      <Head>
        <title>Appointment Letter & E-Sign | BlueBoxx Intern Portal</title>
      </Head>

      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-[#0d1635] flex items-center gap-2">
            <FileText className="text-[#1B2A6B]" size={26} />
            Internship Appointment Letter & Digital E-Sign
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Review the official terms of your technical internship, provide your E-Signature, and download your verified appointment document.
          </p>
        </div>

        {/* Status Alert Banner */}
        {isSigned ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-900 text-base">Appointment Letter E-Signed</h3>
                <p className="text-xs text-emerald-700 font-medium">
                  Signed on {data?.signed_at ? new Date(data.signed_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Record'}. Your file is waiting for Admin approval & task allocation.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Download size={15} /> Download PDF
            </button>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-center gap-3.5 text-amber-900">
            <AlertCircle size={24} className="text-amber-600 shrink-0" />
            <div className="text-xs font-medium">
              <strong className="block text-amber-950 font-bold mb-0.5">Signature Required:</strong>
              Please digitally sign below to accept your BlueBoxx Internship Appointment Letter. Once signed, Admin will review and allocate your daily tasks.
            </div>
          </div>
        )}

        {/* Appointment Letter Terms Preview Card */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">Official Letter Document</span>
              <h2 className="text-lg font-black text-[#0d1635]">BlueBoxx Technologies - Technical Internship</h2>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-[#1B2A6B] border border-blue-200 text-xs font-bold rounded-full">
              Reference: BB-AL-{new Date().getFullYear()}-{data?.candidate_name?.substring(0, 3)?.toUpperCase() || 'INT'}
            </span>
          </div>

          <div className="text-xs text-slate-700 space-y-3 leading-relaxed bg-slate-50/60 p-5 rounded-2xl border border-slate-100">
            <p><strong>Candidate Name:</strong> {data?.candidate_name}</p>
            <p><strong>Registered Email:</strong> {data?.candidate_email}</p>
            <p><strong>Role:</strong> Technical Software Engineering Intern (Web / AI / Digital Solutions)</p>
            <p><strong>Stipend & Terms:</strong> Performance-based assessment incentives upon successful milestone deliveries.</p>
            <div className="pt-2 border-t border-slate-200">
              <strong className="block text-slate-800 mb-1">Standard Internship Commitments:</strong>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Adherence to assigned task completion timelines (25 minutes sprint + 5 minutes self-analysis).</li>
                <li>Confidentiality and proprietary code security across all assigned client repositories.</li>
                <li>Consistent attendance in daily scrums and scheduled mentor evaluation sessions.</li>
              </ul>
            </div>
          </div>

          {/* E-Signature Input (Canvas / Upload) */}
          {!isSigned && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <h3 className="text-sm font-black text-[#0d1635] flex items-center gap-1.5">
                  <PenTool size={16} className="text-[#1B2A6B]" /> Draw or Upload Digital Signature
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Use your mouse/finger to draw on the pad below or upload an image of your signature.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <SignaturePad
                  height={150}
                  label="Candidate Signature"
                  defaultMode="draw"
                  onSignatureChange={(sig) => {
                    if (typeof sig === "string") {
                      setSignatureData(sig);
                    }
                  }}
                />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agreeInternTerms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1B2A6B] focus:ring-[#1B2A6B] cursor-pointer"
                />
                <label htmlFor="agreeInternTerms" className="text-xs text-slate-600 font-medium cursor-pointer select-none">
                  I hereby declare that the above signature is my legal electronic signature and I accept all terms and conditions of the BlueBoxx Internship Program.
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleSignSubmit}
                  disabled={isSubmitting || !signatureData || !agreedTerms}
                  className="w-full py-3.5 bg-[#1B2A6B] hover:bg-[#0d1635] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>Submitting Signature...</>
                  ) : (
                    <>
                      <ShieldCheck size={16} /> Sign & Submit to Admin for Approval
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </InternDashboardLayout>
  );
}
