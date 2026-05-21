"use client";

import { useEffect } from "react";
import Link from "next/link";
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
    <main className="min-h-screen bg-background-dark">
      <Topbar />
      <section className="px-6 lg:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <p className="text-primary uppercase tracking-[0.3em] text-xs font-mono">
              NATIONAL EMERGENCY RESPONSE SYSTEM
            </p>
            <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-tight mt-4">
              Real-Time Emergency Monitoring Across Nigeria
            </h1>
            <p className="text-slate-400 max-w-2xl mt-6 text-lg leading-relaxed">
              AlertNaija is Nigeria&apos;s unified emergency response platform. Track incidents
              across the nation, dispatch responders instantly, and coordinate rapid action
              from a single command dashboard.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl">
              <div className="bg-slate-800/30 rounded-xl p-4 text-center border border-slate-700">
                <p className="text-2xl font-bold text-primary">{incidents.length}</p>
                <p className="text-slate-400 text-xs">Active Incidents</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4 text-center border border-slate-700">
                <p className="text-2xl font-bold text-primary">24/7</p>
                <p className="text-slate-400 text-xs">Monitoring</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4 text-center border border-slate-700">
                <p className="text-2xl font-bold text-primary">Fast</p>
                <p className="text-slate-400 text-xs">Response</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4 text-center border border-slate-700">
                <p className="text-2xl font-bold text-primary">Nationwide</p>
                <p className="text-slate-400 text-xs">Coverage</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/map" className="bg-primary text-black font-semibold px-8 py-3 rounded-xl glow-primary text-center">
                Open Live Map
              </Link>
              <Link href="/incidents" className="border border-slate-700 hover:border-primary transition px-8 py-3 rounded-xl text-center">
                View Incidents
              </Link>
              <Link href="/dashboard" className="border border-slate-700 hover:border-primary transition px-8 py-3 rounded-xl text-center">
                Dashboard
              </Link>
              <Link href="/register" className="bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-xl text-center transition">
                Register
              </Link>
            </div>
            <div className="mt-10 text-center sm:text-left">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">Login</Link>
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[380px]">
            <StatusBar />
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">Live Incident Map</h2>
          <LiveMap userLocation={location} incidents={incidents} />
        </div>

        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted uppercase tracking-widest text-xs">Live Incidents</p>
              <h2 className="text-3xl font-heading font-bold mt-2">Active Emergency Feed</h2>
            </div>
            <Link href="/incidents" className="text-primary text-sm hover:underline">View All</Link>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {incidents.length > 0 ? (
              incidents.slice(0, 6).map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))
            ) : (
              <p className="text-slate-400 col-span-full">No active incidents</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}