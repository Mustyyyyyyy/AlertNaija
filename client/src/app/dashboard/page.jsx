"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";
import SOSButton from "../../components/dashboard/SOSButton";
import LiveMap from "../../components/map/LiveMap";
import IncidentCard from "../../components/incidents/IncidentCard";
import API from "../../lib/api";
import useIncidentStore from "../../store/incident.store";
import useUserLocation from "../../hooks/useUserLocation";
import PWAInstall from "../../components/dashboard/PWAInstall";

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { incidents, setIncidents } = useIncidentStore();
  const { location, state } = useUserLocation();

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const res = await API.get("/auth/me");
      const { user } = res.data;
      setUser(user);
      
      const role = user.role?.toUpperCase();
      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role && role !== "CITIZEN") {
        router.push("/responder");
      }
    } catch { 
      localStorage.removeItem("token"); 
      router.push("/login"); 
    }
  };

  const fetchIncidents = async () => {
    try {
      const res = await API.get("/incidents");
      setIncidents(res.data);
    } catch (err) { console.error("Failed to fetch incidents:", err); }
  };

  useEffect(() => {
    Promise.all([fetchUser(), fetchIncidents()]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </main>
    );
  }

  const myIncidents = incidents.filter((i) => i.userId === user?.id);
  const allIncidents = incidents.filter((i) => i.status !== "RESOLVED");

  return (
    <main className="min-h-screen bg-background-dark relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      <Topbar />
      <PWAInstall />
      <section className="px-6 lg:px-10 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white">
            Welcome, {user?.fullName?.split(" ")[0] || "User"}
          </h1>
          <p className="text-slate-400">
            Report emergencies and track incident status
          </p>
        </div>

        <SOSButton userState={user?.state || state || "Lagos"} />

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-[#0b1220]/50 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-xl">
            <h2 className="text-xl font-heading font-black text-white mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => router.push("/incidents")} className="bg-primary/10 border border-primary/20 rounded-2xl p-5 text-center hover:bg-primary/20 hover:scale-[1.03] transition-all group">
                <span className="text-primary font-bold text-sm block group-hover:scale-105 transition-transform">Report Incident</span>
              </button>
              <button onClick={() => router.push("/map")} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 hover:scale-[1.03] transition-all">
                <span className="text-white font-bold text-sm">View Map</span>
              </button>
              <button onClick={() => router.push("/incidents")} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center hover:bg-slate-800 transition">
                <span className="text-white font-semibold text-sm">View Incidents</span>
              </button>
              <button onClick={() => router.push("/analytics")} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center hover:bg-slate-800 transition">
                <span className="text-white font-semibold text-sm">Analytics</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0b1220]/50 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-xl">
            <h2 className="text-xl font-heading font-black text-white mb-2">Your Status</h2>
            <p className="text-3xl font-black text-primary mb-6 tracking-tight">{state || "Unknown"}</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 text-sm">Role</span>
                <span className="text-white text-sm font-semibold">{user?.role || "CITIZEN"}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400 text-sm">State</span>
                <span className="text-white text-sm font-semibold">{user?.state || state || "Unknown"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400 text-sm">My Reports</span>
                <span className="text-primary text-sm font-semibold">{myIncidents.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1220]/50 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-xl overflow-y-auto max-h-[350px]">
            <h2 className="text-xl font-heading font-black text-white mb-6">My Reports</h2>
            <div className="space-y-4">
              {myIncidents.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No incidents reported yet</p>
              ) : (
                myIncidents.slice(0, 5).map((inc) => <IncidentCard key={inc.id} incident={inc} />)
              )}
            </div>
          </div>
        </div>

        {allIncidents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-white mb-4">
              Active Incidents in Your State
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allIncidents
                .filter((inc) => !user?.state || inc.user?.state === user?.state)
                .slice(0, 6)
                .map((inc) => <IncidentCard key={inc.id} incident={inc} />)}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">
            Live Map {state && state !== "Unknown" && <span className="text-base text-primary font-normal">— {state}</span>}
          </h2>
          <LiveMap userLocation={location} incidents={allIncidents} />
        </div>
      </section>
    </main>
  );
}
