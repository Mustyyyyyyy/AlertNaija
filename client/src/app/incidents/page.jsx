"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import API from "../../lib/api";
import IncidentCard from "../../components/incidents/IncidentCard";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";

const INCIDENT_TYPES = [
  "FIRE", "MEDICAL", "SECURITY", "RESCUE", "BANDITS",
];

export default function IncidentsPage() {
  const router = useRouter();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ACTIVE");
  const [showForm, setShowForm] = useState(false);   // ACTIVE | RESOLVED | ALL

  /* ── report form state ── */
  const [fType, setFType]       = useState("FIRE");
  const [fDesc, setFDesc]       = useState("");
  const [fLat, setFLat]         = useState("");
  const [fLng, setFLng]         = useState("");
  const [fDetectedState, setFDetectedState] = useState("Unknown");
  const [fLoc, setFLoc]         = useState("");  // status: "", "pending", "granted", "denied"
  const [fImg, setFImg]         = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  /* ─────────────────────────────────────────────────── */
  /* ── FETCH incidents ── */
  /* ─────────────────────────────────────────────────── */
  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/incidents");
      setIncidents(res.data || []);
    } catch { /* keep existing */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  /* ─────────────────────────────────────────────────── */
  /* ── FILTERED list ── */
  /* ─────────────────────────────────────────────────── */
  const filtered =
    filter === "ACTIVE"  ? incidents.filter((i) => i.status !== "RESOLVED") :
    filter === "RESOLVED"? incidents.filter((i) => i.status === "RESOLVED") :
    incidents;

  /* ─────────────────────────────────────────────────── */
  /* ── GEOLOCATION for report form ── */
  /* ─────────────────────────────────────────────────── */
  const getCurrentLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation is not supported by your browser."); return; }
    setFLoc("pending");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setFLat(latitude.toFixed(6));
        setFLng(longitude.toFixed(6));
        try {
          const r = await fetch(
            `/api/geo/lookup?lat=${latitude}&lng=${longitude}`,
            { signal: AbortSignal.timeout(5000) }
          );
          if (r.ok) { const j = await r.json(); setFDetectedState(j.state || "Unknown"); }
          else { setFDetectedState("Unknown"); }
        } catch { setFDetectedState("Unknown"); }
        setFLoc("granted");
      },
      () => { setFLoc("denied"); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  /* ─────────────────────────────────────────────────── */
  /* ── SUBMIT report ── */
  /* ─────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    if (!fLat.trim() || !fLng.trim()) {
      setSuccessMsg("Please capture your location first.");
      return;
    }
    setSubmitting(true);
    setSuccessMsg("");
    try {
      await API.post("/incidents", {
        type:    fType,
        description: fDesc.trim() || null,
        lat:     parseFloat(fLat),
        lng:     parseFloat(fLng),
        imageUrl: fImg.trim() || null,
      });
      setSuccessMsg("Incident reported successfully.");
      setFDesc(""); setFImg("");
      await fetchIncidents();
    } catch (ex) {
      setSuccessMsg(ex?.response?.data?.message || "Failed to report incident.");
    }
    setSubmitting(false);
  };

  /* ─────────────────────────────────────────────────── ── RENDER ── */
  return (
    <main className="min-h-screen bg-background-dark">
      <Topbar />

      <section className="px-6 lg:px-10 py-8">
        <BackButton />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <div>
            <BackButton />
            <h1 className="text-3xl font-heading font-bold text-white">Incidents</h1>
            <p className="text-slate-400 text-sm mt-1">
              {loading ? "Loading…" : `${incidents.length} total — ${incidents.filter(i=>i.status!=="RESOLVED").length} active`}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-black font-bold py-2.5 px-6 rounded-xl hover:brightness-110 transition"
          >
            {showForm ? "✕ Close Form" : "＋ Report Incident"}
          </button>
        </div>

        {/* ── Report Form ── */}
        {showForm && (
          <form className="mb-8 bg-[#111826] border border-slate-700/70 rounded-2xl p-6 space-y-5" onSubmit={handleSubmit}>
            <h2 className="text-lg font-heading font-bold text-white">Report New Incident</h2>

            {successMsg && (
              <div className={`p-3 rounded-xl text-sm ${
                successMsg.startsWith("Failed")
                  ? "bg-critical/15 border border-critical/40 text-critical"
                  : "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400"
              }`}>{successMsg}</div>
            )}

            {/* Incident type */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Incident Type</label>
              <div className="flex flex-wrap gap-2">
                {INCIDENT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFType(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      fType === t
                        ? "bg-primary text-black"
                        : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-primary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Description</label>
              <textarea
                rows={3}
                value={fDesc}
                onChange={(e) => setFDesc(e.target.value)}
                placeholder="Describe what happened…"
                className="w-full bg-[#0a0f1a] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Your Location</label>
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="bg-slate-800 border border-slate-700 text-primary text-sm font-semibold py-2 px-4 rounded-xl hover:bg-slate-700 transition"
                >
                  {fLoc === "pending" ? "Getting location…" :
                   fLoc === "granted"  ? "📍 Update"  :
                   fLoc === "denied"   ? "Permission denied" :
                   "📍 Use My Location"}
                </button>
                {fLoc === "denied" && <span className="text-amber-400 text-xs">Geolocation permission was denied.</span>}
              </div>

              {fLat && fLng && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono">
                  <span className="bg-slate-800/80 border border-slate-700 rounded-lg px-2 py-1 text-slate-300">
                    {fLat}, {fLng}
                  </span>
                  <span className="bg-primary/10 border border-primary/30 rounded-lg px-2 py-1 text-primary">
                    {fDetectedState}
                  </span>
                </div>
              )}

              {/* Manual lat/lng fallback */}
              <div className="mt-3 flex gap-3">
                <input
                  type="text"
                  placeholder="Manual lat"
                  value={fLat}
                  onChange={(e) => setFLat(e.target.value)}
                  className="w-28 bg-[#0a0f1a] border border-slate-700 rounded-lg p-2 text-white text-xs font-mono placeholder:text-slate-600"
                />
                <input
                  type="text"
                  placeholder="Manual lng"
                  value={fLng}
                  onChange={(e) => setFLng(e.target.value)}
                  className="w-28 bg-[#0a0f1a] border border-slate-700 rounded-lg p-2 text-white text-xs font-mono placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm text-slate-400 mb-1">Image URL <span className="text-slate-600">(optional)</span></label>
              <input
                type="url"
                value={fImg}
                onChange={(e) => setFImg(e.target.value)}
                placeholder="https://…"
                className="w-full bg-[#0a0f1a] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition text-sm"
              />
            </div>

{/* Submit */}
            {localStorage.getItem("token") ? (
             <button
               type="submit"
               disabled={submitting}
               className="w-full bg-primary text-black font-bold py-3 px-8 rounded-xl glow-primary transition disabled:opacity-50"
             >
               {submitting ? "Submitting…" : "Submit Report"}
             </button>
            ) : (
             <p className="text-amber-400 text-sm">You must be <button type="button" onClick={()=>router.push("/login")} className="underline">logged in</button> to report an incident.</p>
            )}
          </form>
        )}

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 mb-6">
          {["ACTIVE","RESOLVED","ALL"].map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                filter === k
                  ? "bg-primary text-black"
                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-primary"
              }`}
            >
              {k}
            </button>
          ))}
          <span className="ml-auto text-slate-500 text-sm self-center">{filtered.length} shown</span>
        </div>

        {/* ── Incident feed ── */}
        {loading ? (
          <p className="text-slate-500">Loading incidents…</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 text-center py-16 border border-dashed border-slate-700 rounded-2xl">
            No {filter === "ALL" ? "" : filter.toLowerCase()} incidents reported yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((inc) => (
              <IncidentCard key={inc.id} incident={inc} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
