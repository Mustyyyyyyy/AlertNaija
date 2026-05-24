"use client";

import {
  Siren,
  MapPinned,
  Phone,
} from "lucide-react";

export default function EmergencyActions({
  triggerSOS,
}) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-10">

      <button
        onClick={triggerSOS}
        className="
          bg-red-600/90
          hover:bg-red-600
          hover:scale-[1.02]
          active:scale-[0.98]
          rounded-[32px]
          p-8
          text-left
          transition-all
          shadow-2xl shadow-red-900/20
          border border-red-500/30
          group
          relative
          overflow-hidden
        "
      >
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
        <Siren size={40} className="text-white animate-pulse" />

        <h2 className="text-2xl font-black mt-6 text-white tracking-tight">
          ALERT SOS
        </h2>

        <p className="mt-2 text-red-100/80 text-sm font-medium">
          Multi-agency emergency dispatch.
        </p>
      </button>


      <button
        className="
          bg-[#0b1220]/50
          backdrop-blur-md
          border border-white/5
          hover:border-primary/30
          hover:bg-[#0b1220]/80
          hover:scale-[1.02]
          active:scale-[0.98]
          rounded-[32px]
          p-8
          text-left
          transition-all
          group
        "
      >
        <MapPinned size={40} className="text-primary" />

        <h2 className="text-2xl font-black mt-6 text-white tracking-tight">
          SHARE LOCATION
        </h2>

        <p className="mt-2 text-slate-400 text-sm font-medium">
          Broadcast your live GPS coordinates.
        </p>
      </button>


      <a
        href="tel:112"
        className="
          bg-[#0b1220]/50
          backdrop-blur-md
          border border-white/10
          hover:border-white/20
          hover:bg-[#0b1220]/80
          hover:scale-[1.02]
          active:scale-[0.98]
          rounded-[32px]
          p-8
          text-left
          transition-all
          group
          no-underline
        "
      >
        <Phone size={40} className="text-white" />

        <h2 className="text-2xl font-black mt-6 text-white tracking-tight">
          QUICK CALL
        </h2>

        <p className="mt-2 text-slate-400 text-sm font-medium">
          Dial national emergency line 112.
        </p>
      </a>
    </div>
  );
}