"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";
import LiveMap from "../../components/map/LiveMap";
import IncidentCard from "../../components/incidents/IncidentCard";
import API from "../../lib/api";
import useIncidentStore from "../../store/incident.store";

export default function ResponderPage() {
  const router = useRouter();
  const { incidents, setIncidents } = useIncidentStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await API.get("/incidents");
        setIncidents(res.data);
      } catch { /* silent */ }
    };
    fetchIncidents();
  }, [setIncidents]);

  // Simulated: responder's assigned incidents (filtered in a real app from user's token)
  const myIncidents = incidents.filter((i) => i.status !== "RESOLVED");

  const handleStatusChange = async (incidentId, status) => {
    try {
      await API.patch(`/incidents/${incidentId}`, { status });
      const res = await API.get("/incidents");
      setIncidents(res.data);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-background-dark">
      <Topbar />

      <section className="px-6 lg:px-10 py-8">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white">Responder Dashboard</h1>
          <p className="text-slate-400">Your active incidents and nearby alerts</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LiveMap userLocation={null} incidents={myIncidents} />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-heading font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => router.push("/map")}
                  className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center hover:bg-primary/20 transition">
                  <span className="text-primary font-semibold text-sm">Open Map</span>
                </button>
                <button onClick={() => router.push("/responders")}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center hover:bg-slate-700 transition">
                  <span className="text-white font-semibold text-sm">Team</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-heading font-bold text-white mb-4">Your Incidents</h2>
              <div className="space-y-3">
                {myIncidents.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No active incidents assigned</p>
                ) : (
                  myIncidents.slice(0, 5).map((inc) => (
                    <div key={inc.id} className="bg-[#0b1220] border border-slate-700 rounded-xl p-4">
                      <p className="text-white font-semibold text-sm mb-1">{inc.type?.toLowerCase().replace("_", " ")}</p>
                      <p className="text-slate-400 text-xs mb-2">
                        {inc.user?.state || `${inc.lat?.toFixed(2)}, ${inc.lng?.toFixed(2)}`}
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusChange(inc.id, "IN_PROGRESS")}
                          className="flex-1 bg-primary/20 text-primary text-xs py-1 rounded hover:bg-primary/30">
                          Respond
                        </button>
                        <button onClick={() => handleStatusChange(inc.id, "RESOLVED")}
                          className="flex-1 bg-emerald-500/20 text-emerald-400 text-xs py-1 rounded hover:bg-emerald-500/30">
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted uppercase tracking-widest text-xs">Incident Feed</p>
              <h2 className="text-3xl font-heading font-bold mt-2">All Active Incidents</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {incidents
              .filter((i) => i.status !== "RESOLVED")
              .slice(0, 6)
              .map((inc) => (
                <IncidentCard key={inc.id} incident={inc} />
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
