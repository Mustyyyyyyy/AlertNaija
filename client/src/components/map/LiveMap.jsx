"use client";

import useIncidentStore from "../../store/incident.store";

/**
 * LiveMap
 *
 * Displays a dark grid-map with:
 *  - The user's own dot (if coordinates available)
 *  - Incident markers for any non-resolved incidents you own
 *
 * Props
 *  userLocation — "lat, lng" string | null
 *  incidents    — optional override; falls back to Zustand store
 */
export default function LiveMap({ userLocation, incidents: externalIncidents }) {
  const storeIncidents = useIncidentStore((s) => s.incidents);
  const incidents = externalIncidents ?? storeIncidents;

  // active incidents only
  const markers = incidents.filter((i) => i.status !== "RESOLVED");

  // Derive user dot coords from the "lat, lng" string
  const userDot = (() => {
    if (!userLocation || userLocation === "location denied" || userLocation === "geolocation unsupported") return null;
    const [lat, lng] = userLocation.split(",").map(Number);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return { top: Math.min(95, Math.max(5, 100 - (lat + 90) * 0.555)), left: Math.min(95, Math.max(5, (lng + 180) * 0.278)) };
  })();

  return (
    <div className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl overflow-hidden h-[420px] relative">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.25) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(59,130,246,0.25) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Subtle radial glow in centre */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,242,166,0.06)_0%,transparent_70%)]" />

      {/* ── Incident markers ── */}
      {markers.map((inc) => {
        const lat = typeof inc.lat === "number"  ? inc.lat : parseFloat(inc.lat);
        const lng = typeof inc.lng === "number"  ? inc.lng : parseFloat(inc.lng);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
        // crude equirectangular projection for display
        const top  = Math.min(95, Math.max(3, 100 - (lat + 90) * 0.555));
        const left = Math.min(97, Math.max(1, (lng + 180) * 0.278));
        const isFire    = inc.type === "FIRE";
        const isMedical = inc.type === "MEDICAL";
        const isSecurity= inc.type === "SECURITY";
        const isRescue  = inc.type === "RESCUE";
        const dotColor  = isFire ? "bg-red-500" : isMedical ? "bg-pink-500" : isSecurity ? "bg-amber-400" : "bg-sky-400";
        const ringColor = isFire ? "ring-red-500/50" : isMedical ? "ring-pink-500/50" : isSecurity ? "ring-amber-400/50" : "ring-sky-400/50";

        return (
          <div
            key={inc.id}
            className="absolute -translate-x-1/2 -translate-y-full pointer-events-none"
            style={{ top: `${top}%`, left: `${left}%` }}
            title={`${inc.type} — ${inc.user?.state || "unknown"} — ${inc.status}`}
          >
            {/* pulse ring */}
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 ${ringColor} rounded-full ${isFire ? "animate-pulse" : "animate-pulseSlow"}`} />
            {/* dot */}
            <div className={`w-2.5 h-2.5 rounded-full ${dotColor} ring-2 ring-black/60 relative z-10`} />
          </div>
        );
      })}

      {/* ── User location dot ── */}
      {userDot && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full z-20 flex flex-col items-center"
          style={{ top: `${userDot.top}%`, left: `${userDot.left}%` }}
        >
          <div className="w-4 h-4 bg-primary rounded-full border-2 border-black animate-pulseSlow shadow-[0_0_12px_rgba(13,242,166,0.7)]" />
          <span className="text-[9px] text-primary mt-0.5 font-mono whitespace-nowrap">you</span>
        </div>
      )}

      {/* Empty state / legend */}
      <div className="absolute bottom-4 right-4 z-10 space-y-1 text-right">
        {markers.length === 0 && (
          <p className="text-slate-600 text-xs">{userLocation ? "No active incidents" : "Waiting for user location…"}</p>
        )}
        {markers.length > 0 && (
          <div className="bg-black/50 backdrop-blur rounded-lg px-3 py-2 space-y-1 text-[11px]">
            {["FIRE","MEDICAL","SECURITY","RESCUE"].map((t) => {
              const count = markers.filter((i) => i.type === t).length;
              if (!count) return null;
              const color = t === "FIRE" ? "text-red-400" : t === "MEDICAL" ? "text-pink-400" : t === "SECURITY" ? "text-amber-400" : "text-sky-400";
              return <p key={t} className={color}>{t} · {count}</p>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
