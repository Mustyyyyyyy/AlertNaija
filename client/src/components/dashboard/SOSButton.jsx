"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Phone, Shield, Flame, X, Ambulance } from "lucide-react";

const STATE_NUMBERS = {
  "Lagos": { police: "767", ambulance: "112", fire: "08033019020" },
  "FCT": { police: "08061581938", ambulance: "112", fire: "08032003557" },
  "Rivers": { police: "08032003514", ambulance: "112", fire: "08033019020" },
  "Kano": { police: "08032419754", ambulance: "112", fire: "08166668842" },
  "Oyo": { police: "08081768614", ambulance: "112", fire: "08033019020" },
  "Default": { police: "112", ambulance: "112", fire: "112" }
};

export default function SOSButton({ userState }) {
  const [isOpen, setIsOpen] = useState(false);
  const info = STATE_NUMBERS[userState] || STATE_NUMBERS["Default"];

  return (
    <div className="w-full mb-8">
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full p-6 bg-gradient-to-r from-red-600 to-red-900 rounded-[32px] shadow-2xl shadow-red-900/40 group relative overflow-hidden active:scale-95 transition-all"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <AlertCircle size={32} className="text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-black text-white tracking-tight">TRIGGER SOS</h2>
              <p className="text-red-200 text-sm font-bold uppercase tracking-widest">Instant Emergency Action</p>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-full border border-white/20 text-white text-xs font-black">
            {userState} ACTIVE
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            ></motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0b1220] border border-white/10 w-full max-w-md rounded-[40px] p-8 relative z-[210] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-emerald-500" />
                  <span className="text-white font-black text-xl">Direct Links</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <a 
                  href={`tel:${info.police}`}
                  className="flex items-center justify-between p-6 bg-blue-500/10 border border-blue-500/30 rounded-3xl hover:bg-blue-500/20 transition-all group no-underline"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white">
                      <Shield size={24} />
                    </div>
                    <div>
                      <p className="text-white font-black text-lg">POLICE</p>
                      <p className="text-blue-400 text-xs font-bold">{info.police}</p>
                    </div>
                  </div>
                  <Phone size={20} className="text-blue-400 group-hover:scale-125 transition-transform" />
                </a>

                <a 
                  href={`tel:${info.fire}`}
                  className="flex items-center justify-between p-6 bg-red-500/10 border border-red-500/30 rounded-3xl hover:bg-red-500/20 transition-all group no-underline"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white">
                      <Flame size={24} />
                    </div>
                    <div>
                      <p className="text-white font-black text-lg">FIRE SERVICE</p>
                      <p className="text-red-400 text-xs font-bold">{info.fire}</p>
                    </div>
                  </div>
                  <Phone size={20} className="text-red-400 group-hover:scale-125 transition-transform" />
                </a>

                <a 
                  href={`tel:${info.ambulance}`}
                  className="flex items-center justify-between p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl hover:bg-emerald-500/20 transition-all group no-underline"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                      <Ambulance size={24} />
                    </div>
                    <div>
                      <p className="text-white font-black text-lg">AMBULANCE (NEMA)</p>
                      <p className="text-emerald-400 text-xs font-bold">{info.ambulance}</p>
                    </div>
                  </div>
                  <Phone size={20} className="text-emerald-400 group-hover:scale-125 transition-transform" />
                </a>
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Disclaimer</p>
                <p className="text-[11px] text-slate-400 mt-1">Calls will go directly to {userState} state emergency command centers.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
