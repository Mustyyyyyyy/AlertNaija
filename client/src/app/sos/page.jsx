"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EMERGENCY_CONTACTS, getEmergencyForState } from "../../utils/nigeriaStates";

/** Build a tel: URI from any number string */
function makeTel(raw) {
  return "tel:" + raw.replace(/[^\d+]/g, "");
}

/** Detect user's state via browser geolocation + geo lookup */
function detectUserState() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve("FCT"); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const r = await fetch(
            `/api/geo/lookup?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`,
            { signal: AbortSignal.timeout(5000) }
          );
          if (r.ok) { const j = await r.json(); resolve(j.state || "FCT"); }
          else { resolve("FCT"); }
        } catch { resolve("FCT"); }
      },
      () => resolve("FCT"),
      { enableHighAccuracy: true, timeout: 6000 }
    );
  });
}

export default function SOSPage() {
  const router = useRouter();
  const [state, setState]             = useState("FCT");
  const [locLoading, setLocLoading]   = useState(true);
  const [calling, setCalling]         = useState(null);
  const [sosActive, setSosActive]     = useState(false);
  const [sosTimer, setSosTimer]       = useState(5);
  const [sosReported, setSosReported] = useState(false);
  const [userName, setUserName]       = useState("");

  // ── hydration: load name, detect state ──
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u.fullName) setUserName(u.fullName.split(" ")[0]);
    } catch { /* ignore */ }
    detectUserState().then((s) => { setState(s || "FCT"); setLocLoading(false); });
  }, []);

  // ── SOS countdown ──
  useEffect(() => {
    if (!sosActive) return;
    if (sosTimer <= 0) { setSosActive(false); setSosReported(true); return; }
    const t = setTimeout(() => setSosTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [sosActive, sosTimer]);

  const triggerSOS = () => {
    if (sosActive) return;
    setSosActive(true);
    setSosTimer(5);
    // background: notify backend
    fetch("/api/alerts/sos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        state,
        caller: userName || "Anonymous",
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => { /* non-blocking */ });
  };

  const cancelSOS = () => { setSosActive(false); setSosTimer(5); setSosReported(false); };

  const stateData = !locLoading ? (EMERGENCY_CONTACTS[state] || EMERGENCY_CONTACTS.FCT) : null;

  return (
    <main className="min-h-screen bg-background-dark flex flex-col items-center px-4 py-10">
      {/* ── Header ── */}
      <div className="text-center mb-8 max-w-md">
        <p className="text-primary uppercase tracking-[0.2em] text-xs font-mono font-bold">
          Emergency SOS
        </p>
        <h1 className="text-3xl font-heading font-bold text-white mt-2">Get Help Now</h1>
        {!locLoading && (
          <p className="text-slate-400 text-sm mt-1">
            Showing contacts for{" "}
            <span className="text-primary font-semibold">{state}</span>
          </p>
        )}
      </div>

      {/* ── SOS Button ── */}
      <div className="relative mb-10 flex items-center justify-center w-56 h-56">
        {/* SOS active overlay */}
        {sosActive && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="bg-black/85 backdrop-blur-sm rounded-full w-[260px] h-[260px] flex flex-col items-center justify-center">
              <p className="text-white/70 text-xs font-mono uppercase tracking-widest mb-1">
                Alerting in
              </p>
              <p className="text-6xl font-bold text-white">{sosTimer}</p>
              <button onClick={cancelSOS} className="mt-4 text-critical text-sm font-semibold hover:underline">
                Cancel
              </button>
            </div>
          </div>
        )}

        {sosReported && !sosActive && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="bg-emerald-500/20 border-2 border-emerald-500 rounded-full w-[260px] h-[260px] flex flex-col items-center justify-center">
              <p className="text-emerald-400 text-4xl mb-1">✓</p>
              <p className="text-emerald-400 font-bold text-sm">Alert Sent</p>
              <button onClick={() => setSosReported(false)}
                className="mt-3 text-emerald-300 text-xs underline">
                Dismiss
              </button>
            </div>
          </div>
        )}

        <button
          onClick={sosActive ? undefined : triggerSOS}
          disabled={sosActive}
          className={`relative z-20 w-56 h-56 rounded-full flex flex-col items-center justify-center transition-all ${
            sosActive
              ? "bg-critical/30 border-4 border-critical cursor-default"
              : "bg-critical hover:brightness-110 active:scale-95 cursor-pointer shadow-[0_0_50px_rgba(255,51,102,0.65)]"
          }`}
        >
          <span className="text-7xl leading-none">🆘</span>
          <span className="text-white font-bold text-lg mt-1">SOS</span>
          <span className="text-white/70 text-[10px] font-mono uppercase tracking-widest mt-0.5">
            Tap for emergency
          </span>
        </button>
      </div>

      {/* ── State contacts ── */}
      <div className="w-full max-w-md space-y-2">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-3">
          Emergency Contacts — {state}
        </p>

        {locLoading ? (
          <div className="p-6 text-center text-slate-500 text-sm">Detecting your location…</div>
        ) : !stateData ? (
          <div className="p-6 text-center text-slate-500 text-sm border border-dashed border-slate-700 rounded-xl">
            No contacts configured for <strong>{state}</strong>.
            <br />
            <a href="tel:08032000196" className="text-primary hover:underline">Call Police → 0803-200-0196</a>
          </div>
        ) : (
          stateData.contacts.map((c, idx) => {
            const isCalling = calling === idx;
            return (
              <a
                key={idx}
                href={makeTel(c.phone)}
                onMouseDown={() => setCalling(idx)}
                onTouchStart={() => setCalling(idx)}
                className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                  isCalling
                    ? "bg-emerald-500/20 border border-emerald-500/40"
                    : "bg-[#111826] border border-slate-700 active:bg-slate-800"
                }`}
              >
                <span className="text-2xl flex-shrink-0">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{c.label}</p>
                  <p className="text-slate-400 text-xs font-mono">{c.phone}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest flex-shrink-0 ${
                  isCalling ? "text-emerald-400" : "text-primary"
                }`}>
                  {isCalling ? "Calling…" : "Tap"}
                </span>
              </a>
            );
          })
        )}

        {/* ── Safety tips ── */}
        <div className="mt-6 p-4 bg-[#111826] border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-2">When calling emergency services:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Stay calm and speak clearly.</li>
            <li>Give your exact location (landmark, street, LGA).</li>
            <li>Describe what happened and how many people are involved.</li>
            <li>If safe, move to a secure location and wait for help.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
