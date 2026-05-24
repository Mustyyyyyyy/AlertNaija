"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Topbar from "../components/layout/Topbar";
import StatusBar from "../components/layout/StatusBar";
import LiveMap from "../components/map/LiveMap";
import IncidentCard from "../components/incidents/IncidentCard";
import useIncidentStore from "../store/incident.store";
import API from "../lib/api";
import useUserLocation from "../hooks/useUserLocation";

export default function HomePage() {
  const { incidents, setIncidents } = useIncidentStore();
  const { location } = useUserLocation();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await API.get("/incidents");
        setIncidents(response.data);
      } catch (err) {
        console.error("Failed to fetch incidents:", err);
      }
    };
    fetchIncidents();
  }, [setIncidents]);

  return (
    <main className="min-h-screen bg-background-dark text-slate-200">
      <Topbar />

      <section className="relative pt-20 pb-24 overflow-hidden mt-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              {/* <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-primary uppercase tracking-widest text-[10px] font-bold">National Emergency Network</span>
              </div> */}

              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <Image src="/logo.png" alt="AlertNaija Logo" width={60} height={60} className="rounded-xl shadow-lg border border-white/10" />
                <h1 className="text-4xl lg:text-6xl font-heading font-black text-white leading-tight">
                  Protecting <span className="text-primary italic">Every</span> Citizen.
                </h1>
              </div>

              <p className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
                AlertNaija is the unified digital command infrastructure for Nigeria's emergency services. We bridge the gap between citizens in distress and rapid-response teams nationwide.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/incidents" className="bg-primary text-black font-bold px-10 py-4 rounded-2xl glow-primary transition-all hover:scale-105 active:scale-95">
                  Report Incident
                </Link>
                <Link href="/map" className="bg-slate-800/80 backdrop-blur border border-slate-700 text-white font-semibold px-10 py-4 rounded-2xl hover:bg-slate-700 transition-all">
                  Live Crisis Map
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <p className="text-xs uppercase tracking-tighter">Trusted By</p>
                <span className="text-xs font-bold">NPF</span>
                <span className="text-xs font-bold">FRSC</span>
                <span className="text-xs font-bold">NEMA</span>
                <span className="text-xs font-bold">LASEMA</span>
              </div>
            </div>

            <div className="w-full lg:w-[400px]">
              <StatusBar />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#0b1220] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl lg:text-5xl font-black text-white mb-2">{incidents.length}</p>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-mono">Active Cases</p>
            </div>
            <div className="text-center">
              <p className="text-3xl lg:text-5xl font-black text-primary mb-2">36+1</p>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-mono">States Covered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl lg:text-5xl font-black text-white mb-2">24/7</p>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-mono">System Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl lg:text-5xl font-black text-primary mb-2">100%</p>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-mono">Response Priority</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-heading font-black text-white">National Crisis Overview</h2>
            <p className="text-slate-400 mt-2">Real-time geospatial tracking of all active emergency reports across the federation.</p>
          </div>
          <Link href="/map" className="text-primary font-bold text-sm hover:underline flex items-center gap-2">
            Expand Fulll Map <span>&rarr;</span>
          </Link>
        </div>
        <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
          <LiveMap userLocation={location} incidents={incidents} />
        </div>
      </section>

      {/* Incidents Feed */}
      <section className="py-24 bg-[#070b14]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-primary uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Live updates</p>
              <h2 className="text-3xl font-heading font-black text-white">Active Incident Feed</h2>
            </div>
            <Link href="/incidents" className="bg-slate-800 px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-700 transition">View Archive</Link>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {incidents.length > 0 ? (
              incidents.slice(0, 6).map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-slate-800 rounded-3xl">
                <p className="text-slate-500 italic">The network is currently clear. No active incidents reported.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-3xl font-heading font-black text-white mb-6">Stay Alert, Stay Safe.</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10">AlertNaija is a non-profit initiative dedicated to improving public safety through technology. Register today to protect yourself and your community.</p>
          <div className="flex justify-center gap-6">
            <Link href="/register" className="text-white hover:text-primary font-bold transition">Get Started</Link>
            <Link href="/login" className="text-white hover:text-primary font-bold transition">Login</Link>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; 2026 AlertNaija. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Use</Link>
              <Link href="/contact" className="hover:text-white">Contact Agency</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}