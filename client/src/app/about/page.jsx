"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Zap, Users, Globe, ChevronRight } from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background-dark text-slate-300 pb-20">
      <Topbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <BackButton />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">Our Mission</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-heading font-black text-white mb-8 leading-tight"
          >
            Safeguarding Nigeria Through <span className="text-primary">Innovation.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 leading-relaxed"
          >
            AlertNaija is more than just an app—it's Nigeria's first unified digital infrastructure dedicated to real-time emergency coordination and community protection.
          </motion.p>
        </div>
      </section>

      {/* Stats/Highlight Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Zap className="text-primary" />, title: "Instant Routing", desc: "Our system automatically routes distress signals to the nearest qualified responder in seconds." },
            { icon: <Shield className="text-primary" />, title: "Verified Data", desc: "Multi-layered verification ensures that emergency resources are never wasted on false alarms." },
            { icon: <Users className="text-primary" />, title: "Citizen Driven", desc: "Empowering 200 million Nigerians to be the eyes and ears of national safety agencies." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0b1220] border border-white/5 rounded-3xl p-8 hover:border-primary/20 transition-colors group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-emerald-900/20 rounded-[40px] border border-white/5 overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center">
                  <Shield size={120} className="text-primary/20" />
               </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#0b1220] border border-white/10 p-6 rounded-3xl shadow-2xl max-w-xs">
              <p className="text-white font-bold text-lg mb-1">State-of-the-art</p>
              <p className="text-slate-500 text-xs">Proprietary geospatial mapping technology built specifically for the Nigerian terrain.</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-heading font-black text-white mb-6">Built for the Nigerian Reality</h2>
            <div className="space-y-6 text-slate-400 leading-relaxed">
              <p>
                In moments of crisis, every second counts. Traditional emergency response in Nigeria has often been hindered by fragmented communication and geographic uncertainty. 
              </p>
              <p>
                AlertNaija was conceived as a solution to this challenge. By bridging the gap between national agencies like the **NPF**, **FRSC**, and **NEMA** through a single, intelligent platform, we ensure that help arrives precisely where and when it's needed.
              </p>
              <p>
                Our vision is a Nigeria where no citizen feels alone in a crisis, and where every emergency responder is equipped with the real-time data they need to save lives.
              </p>
            </div>
            <div className="mt-10">
              <Link href="/register" className="inline-flex items-center gap-2 text-white font-bold hover:text-primary transition-colors">
                Become a contributor to national safety <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-[#070b14] py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-black text-white mb-4">Core Platform Pillars</h2>
            <p className="text-slate-500">The technology driving the next generation of Nigerian safety.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Live Map", content: "Interactive nationwide geospatial viewing." },
              { label: "SOS Trigger", content: "Instant broadcast of location and ID." },
              { label: "Agency API", content: "Seamless integration for government bodies." },
              { label: "Analytics", content: "Data-driven insights for policy & prevention." }
            ].map((pillar, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <p className="text-white font-bold mb-2">{pillar.label}</p>
                <p className="text-xs text-slate-500">{pillar.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 pt-32 text-center">
        <h2 className="text-4xl font-heading font-black text-white mb-8">Ready to secure your community?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register" className="bg-primary text-black font-black px-10 py-4 rounded-2xl hover:scale-105 transition-all">
            Join the Network
          </Link>
          <Link href="/contact" className="bg-slate-800 text-white font-bold px-10 py-4 rounded-2xl hover:bg-slate-700 transition-all">
            Contact as Agency
          </Link>
        </div>
      </section>
    </main>
  );
}
