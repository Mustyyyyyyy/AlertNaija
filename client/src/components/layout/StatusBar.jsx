"use client";

export default function StatusBar() {
  return (
    <div className="bg-[#0b1220]/50 backdrop-blur-md border border-white/5 rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>
      
      <div className="flex flex-col items-center text-center relative z-10">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse"></div>
          <span className="relative inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-black px-4 py-1.5 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            System Online
          </span>
        </div>
        
        <h3 className="text-white font-black text-lg mb-2">Command Center Active</h3>
        <p className="text-slate-400 text-xs leading-relaxed max-w-[200px]">
          All national emergency channels are monitored in real-time by NEMA operators.
        </p>

        <div className="mt-6 pt-6 border-t border-white/5 w-full grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Latency</p>
            <p className="text-white font-mono text-sm mt-1">12ms</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Responders</p>
            <p className="text-primary font-mono text-sm mt-1">Live</p>
          </div>
        </div>
      </div>
    </div>
  );
}
