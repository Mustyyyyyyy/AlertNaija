"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";
import API from "../../lib/api";

export default function AdminRespondersPage() {
  const router = useRouter();
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResponders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/admin/responders");
      setResponders(res.data.responders || []);
    } catch (err) {
      setError("Failed to fetch responders");
      console.error("Failed to fetch responders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (responderId, isAvailable) => {
    try {
      await API.patch(`/api/admin/responders/${responderId}/availability`, {
        isAvailable: !isAvailable
      });
      // Update local state
      setResponders(prevResponders =>
        prevResponders.map(r =>
          r.id === responderId ? { ...r, isAvailable: !r.isAvailable } : r
        )
      );
    } catch (err) {
      setError("Failed to update responder availability");
      console.error("Failed to update responder availability:", err);
    }
  };

  useEffect(() => {
    fetchResponders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Loading responders...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-dark">
      <Topbar />
      <section className="px-6 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-heading font-bold text-white">Emergency Responders</h1>
          <div className="flex items-center gap-3">
            <BackButton />
            <button 
              onClick={() => router.push("/admin")}
              className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center hover:bg-primary/20 transition text-sm font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        
        {responders.length > 0 ? (
          <div className="space-y-4">
            {responders.map((responder) => (
              <div key={responder.id} className="bg-[#0b1220] border border-slate-700 rounded-xl p-6 hover:bg-[#111826] transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold text-lg">{responder.name}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          responder.type === "AMBULANCE" ? "bg-emerald-500/20 text-emerald-400" :
                          responder.type === "FIRE" ? "bg-red-500/20 text-red-400" :
                          responder.type === "POLICE" ? "bg-blue-500/20 text-blue-400" :
                                                        "bg-primary/20 text-primary"
                        }`}
                      >
                        {responder.type}
                      </span>
                      {responder.state && (
                        <span className="text-slate-400 text-xs">{responder.state}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-slate-400 text-xs">
                      Active Cases: {responder.activeCases}
                    </p>
                    <button 
                      onClick={() => handleToggleAvailability(responder.id, responder.isAvailable)}
                      className={`text-xs font-medium ${
                        responder.isAvailable 
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      }`} 
                      px-3 py-1 rounded
                    >
                      {responder.isAvailable ? "Set Unavailable" : "Set Available"}
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <span className="text-slate-400 text-xs">
                    Last Updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">No responders found</p>
          </div>
        )}
        
        <div className="mt-8 text-center text-slate-500 text-sm">
          Total Responders: {responders.length}
        </div>
      </section>
    </main>
  );
}