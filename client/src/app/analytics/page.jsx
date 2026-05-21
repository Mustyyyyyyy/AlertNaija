"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";
import API from "../../lib/api";

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-dark">
      <Topbar />
      <section className="px-6 lg:px-10 py-8">
        <BackButton />
        <h1 className="text-3xl font-heading font-bold text-white mb-6">Analytics</h1>
        
        {data ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#111826] border border-slate-700 rounded-2xl p-6">
              <h2 className="text-slate-400 text-sm mb-2">Total Incidents</h2>
              <p className="text-4xl font-bold text-primary">{data.total}</p>
            </div>
            <div className="bg-[#111826] border border-slate-700 rounded-2xl p-6">
              <h2 className="text-slate-400 text-sm mb-2">Resolution Rate</h2>
              <p className="text-4xl font-bold text-emerald-400">{data.resolutionRate}%</p>
            </div>
            <div className="bg-[#111826] border border-slate-700 rounded-2xl p-6">
              <h2 className="text-slate-400 text-sm mb-2">Responders</h2>
              <p className="text-4xl font-bold text-white">{data.responders.total}</p>
              <p className="text-slate-400 text-sm">{data.responders.available} available</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No analytics data available.</p>
        )}
      </section>
    </main>
  );
}