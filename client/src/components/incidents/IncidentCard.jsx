"use client";

const statusMeta = {
  PENDING:       { label: "Pending",        color: "text-slate-300", border: "border-slate-600", bg: "bg-slate-500/10" },
  ASSIGNED:      { label: "Assigned",       color: "text-primary",   border: "border-primary",   bg: "bg-primary/10" },
  IN_PROGRESS:   { label: "In Progress",    color: "text-amber-400",  border: "border-amber-500",  bg: "bg-amber-500/10" },
  RESOLVED:      { label: "Resolved",       color: "text-emerald-400",border: "border-emerald-500",bg: "bg-emerald-500/10" },
};

const typeMeta = {
  FIRE:    { color: "text-red-400",       bg: "bg-red-500/10",    icon: "ðŸ”¥" },
  MEDICAL: { color: "text-pink-400",      bg: "bg-pink-500/10",   icon: "ðŸš‘" },
  SECURITY:{ color: "text-amber-400",     bg: "bg-amber-500/10",  icon: "ðŸ›¡ï¸" },
  RESCUE:  { color: "text-sky-400",       bg: "bg-sky-500/10",    icon: "â›´" },
  BANDITS: { color: "text-orange-400",    bg: "bg-orange-500/10", icon: "âš ï¸" },
};

function fmtTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.round((now - d) / 60000);
  if (diff < 1)      return "just now";
  if (diff < 60)     return `${diff}m ago`;
  if (diff < 1440)   return `${Math.round(diff / 60)}h ago`;
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export default function IncidentCard({ incident }) {
  const sm = statusMeta[incident.status] || statusMeta.PENDING;
  const tm = typeMeta[incident.type] || typeMeta.FIRE;

  return (
    <div
      className="bg-[#0b1220]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 space-y-4 hover:border-primary/30 hover:bg-[#0b1220]/80 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-lg">{tm.icon}</span>
          <span
            className={`text-[10px] uppercase tracking-[0.2em] font-black ${tm.color} ${tm.bg} px-2.5 py-1 rounded-lg border border-white/5`}
          >
            {incident.type}
          </span>
        </div>
        <span
          className={`text-[9px] uppercase tracking-[0.2em] font-black ${sm.color} border px-2.5 py-1 rounded-lg shadow-sm ${sm.bg} ${sm.border}/30`}
        >
          {sm.label}
        </span>
      </div>

      <p className="text-white text-sm font-bold leading-relaxed line-clamp-2 relative z-10 group-hover:text-primary transition-colors">
        {incident.description || "No description provided"}
      </p>

      <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase tracking-widest relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
          <span>
            {incident.user?.state || `${incident.lat?.toFixed(1)}, ${incident.lng?.toFixed(1)}`}
          </span>
        </div>
        <span className="bg-white/5 px-2 py-0.5 rounded-full">{fmtTime(incident.createdAt)}</span>
      </div>
    </div>
  );
}
