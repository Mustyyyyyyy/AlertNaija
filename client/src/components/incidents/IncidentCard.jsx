"use client";

const statusMeta = {
  PENDING:       { label: "Pending",        color: "text-slate-300", border: "border-slate-600", bg: "bg-slate-500/10" },
  ASSIGNED:      { label: "Assigned",       color: "text-primary",   border: "border-primary",   bg: "bg-primary/10" },
  IN_PROGRESS:   { label: "In Progress",    color: "text-amber-400",  border: "border-amber-500",  bg: "bg-amber-500/10" },
  RESOLVED:      { label: "Resolved",       color: "text-emerald-400",border: "border-emerald-500",bg: "bg-emerald-500/10" },
};

const typeMeta = {
  FIRE:    { color: "text-red-400",       bg: "bg-red-500/10"     },
  MEDICAL: { color: "text-pink-400",      bg: "bg-pink-500/10"    },
  SECURITY:{ color: "text-amber-400",     bg: "bg-amber-500/10"   },
  RESCUE:  { color: "text-sky-400",       bg: "bg-sky-500/10"     },
  BANDITS: { color: "text-orange-400",    bg: "bg-orange-500/10"  },
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
      className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl p-5 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] uppercase tracking-widest font-bold ${tm.color} ${tm.bg} px-2 py-1 rounded-md`}
        >
          {incident.type}
        </span>
        <span
          className={`text-[10px] uppercase tracking-widest font-bold ${sm.color} ${sm.border} border px-2 py-1 rounded-md ${sm.bg}`}
        >
          {sm.label}
        </span>
      </div>

      <p className="text-white text-sm font-semibold leading-snug line-clamp-2">
        {incident.description || "No description provided"}
      </p>

      <div className="flex items-center justify-between text-slate-500 text-xs">
        <span>
          {incident.type ? incident.type.replace("_", " ") : "Unknown type"} &middot;{" "}
          {incident.user?.state || `${incident.lat?.toFixed(2)}, ${incident.lng?.toFixed(2)}`}
        </span>
        <span>{fmtTime(incident.createdAt)}</span>
      </div>
    </div>
  );
}
