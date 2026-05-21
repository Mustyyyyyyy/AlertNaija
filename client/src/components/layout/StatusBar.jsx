"use client";

export default function StatusBar() {
  return (
    <div className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl p-5 text-center">
      <span className="inline-block bg-emerald-500/15 text-emerald-400 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-emerald-500/30">
        System Online
      </span>
      <p className="text-slate-400 text-xs mt-3 leading-relaxed">
        All national emergency channels are active and
        monitoring is running in real time.
      </p>
    </div>
  );
}
