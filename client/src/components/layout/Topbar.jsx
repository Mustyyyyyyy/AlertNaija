"use client";

import Link from "next/link";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">
        <Link href="/" className="no-underline">
          <h1 className="text-lg font-heading font-bold text-white">
            Alert<span className="text-primary">Naija</span>
          </h1>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-slate-300 hover:text-white transition no-underline text-xs">
            Home
          </Link>
          <Link href="/dashboard" className="text-slate-300 hover:text-white transition no-underline text-xs">
            Dashboard
          </Link>
          <Link href="/responder" className="text-slate-300 hover:text-white transition no-underline text-xs">
            Responders
          </Link>
        </nav>
      </div>
    </header>
  );
}
