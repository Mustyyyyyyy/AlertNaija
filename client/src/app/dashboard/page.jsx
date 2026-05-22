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
    <main className="min-h-screen bg-background-dark">
      <Topbar />
      <section className="px-6 lg:px-10 py-8">
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
          <div className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => router.push("/incidents")} className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center hover:bg-primary/20 transition">
                <span className="text-primary font-semibold text-sm">Report Incident</span>
              </button>
              <button onClick={() => router.push("/map")} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center hover:bg-slate-800 transition">
                <span className="text-white font-semibold text-sm">View Map</span>
              </button>
              <button onClick={() => router.push("/incidents")} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center hover:bg-slate-800 transition">
                <span className="text-white font-semibold text-sm">View Incidents</span>
              </button>
              <button onClick={() => router.push("/analytics")} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center hover:bg-slate-800 transition">
                <span className="text-white font-semibold text-sm">Analytics</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-heading font-bold text-white mb-2">Your Status</h2>
            <p className="text-2xl font-bold text-primary mb-4">{state || "Unknown"}</p>
            <div className="space-y-3">
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

          <div className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl p-6 overflow-y-auto max-h-[320px]">
            <h2 className="text-xl font-heading font-bold text-white mb-4">My Reports</h2>
            <div className="space-y-3">
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
