import React, { useState } from "react";
import Head from "next/head";
import { StudentDashboardLayout } from "../../../src/layout/StudentDashboardLayout";
import { Copy, Gift, Users, Link as LinkIcon, ArrowRight, Share2, Wallet } from "lucide-react";
import useSWR from "swr";
import api from "../../../src/lib/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { PreloaderAnimation } from "../../../src/components/ui/PreloaderAnimation";

const ReferralDashboard = () => {
  const fetcher = (url: string) => api.get(url).then(res => res.data.data);
  const { data, isLoading } = useSWR("/student/referrals", fetcher, { revalidateOnFocus: false });
  const [copied, setCopied] = useState(false);

  const referralLink = data ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://blueboxx.in'}/signup?ref=${data.code}` : "";

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join BlueBoxx DA',
          text: 'Use my referral link to join BlueBoxx DA and get exclusive rewards!',
          url: referralLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  if (isLoading) {
    return (
      <StudentDashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <PreloaderAnimation />
        </div>
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout>
      <Head>
        <title>Referral & Earn | Student Dashboard - BlueBoxx DA</title>
      </Head>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Referral & Earn</h1>
          <p className="text-slate-500 font-medium">Invite your friends and earn rewards for every successful enrollment.</p>
        </div>

        {/* Top Banner / Link Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1B2A6B] to-[#2a3f96] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-blue-900/10"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white/90 text-sm font-semibold backdrop-blur-sm border border-white/10">
                <Gift size={14} className="text-[#C9A227]" />
                <span>Earn Wallet Points</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold font-sora leading-tight">
                Invite friends. <span className="text-[#C9A227]">Get Rewarded.</span>
              </h2>
              <p className="text-blue-100/80 max-w-lg text-sm md:text-base leading-relaxed">
                Share your unique link. When they sign up and enroll in a course, you both earn reward points directly to your wallet.
              </p>
            </div>

            <div className="w-full md:w-auto bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shrink-0 shadow-lg shadow-black/10">
              <p className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-3 text-center md:text-left">Your Referral Link</p>
              <div className="flex items-center gap-2 bg-slate-900/40 p-2 rounded-xl border border-white/10 overflow-hidden w-full md:w-80">
                <LinkIcon size={16} className="text-blue-300 ml-2 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="bg-transparent text-sm text-white flex-1 outline-none px-2 font-mono truncate"
                />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#C9A227] hover:bg-[#b08d22] text-[#0d1635] py-2.5 rounded-lg font-bold text-sm transition-all shadow-md"
                >
                  <Copy size={16} /> {copied ? "Copied!" : "Copy Link"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg font-bold text-sm transition-all border border-white/10"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="text-blue-600" />}
            title="Total Referrals"
            value={data?.stats?.total || 0}
            bg="bg-blue-50"
            border="border-blue-100"
          />
          <StatCard
            icon={<Gift className="text-emerald-600" />}
            title="Successful"
            value={data?.stats?.successful || 0}
            bg="bg-emerald-50"
            border="border-emerald-100"
          />
          <StatCard
            icon={<ArrowRight className="text-amber-600" />}
            title="Pending"
            value={data?.stats?.pending || 0}
            bg="bg-amber-50"
            border="border-amber-100"
          />
          <StatCard
            icon={<Wallet className="text-purple-600" />}
            title="Earnings"
            value={`₹${data?.stats?.earnings || 0}`}
            bg="bg-purple-50"
            border="border-purple-100"
          />
        </div>

        {/* History Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-lg">Referral History</h3>
          </div>
          
          {data?.history && data.history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.history.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 text-sm">{item.name}</span>
                          <span className="text-xs text-slate-500">{item.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.status === 'successful' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                        ₹{item.reward_amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Users size={24} />
              </div>
              <h3 className="text-slate-900 font-bold mb-1">No referrals yet</h3>
              <p className="text-sm text-slate-500 max-w-sm">Share your link with friends to start earning rewards for successful enrollments.</p>
            </div>
          )}
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

const StatCard = ({ icon, title, value, bg, border }: any) => (
  <div className={`p-6 rounded-2xl border ${border} ${bg} relative overflow-hidden transition-transform hover:-translate-y-1`}>
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
        {icon}
      </div>
    </div>
    <div>
      <p className="text-slate-500 font-medium text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  </div>
);

export default ReferralDashboard;
