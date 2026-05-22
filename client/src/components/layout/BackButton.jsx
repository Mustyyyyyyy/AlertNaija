"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const pathname = usePathname();

  // Smart Routing Logic:
  // 1. If in Admin section -> Go to /admin
  // 2. If in Dashboard section -> Go to /dashboard
  // 3. If on public pages (About, Privacy, etc.) -> Go to / (Home)
  
  let targetPath = "/";
  let label = "Home";

  if (pathname.startsWith("/admin")) {
    targetPath = "/admin";
    label = "Dashboard";
  } else if (pathname.startsWith("/dashboard") || pathname.startsWith("/report") || pathname.startsWith("/incidents")) {
    targetPath = "/dashboard";
    label = "Dashboard";
  }

  return (
    <Link 
      href={targetPath} 
      className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-6 no-underline bg-white/5 border border-white/10 px-4 py-2 rounded-2xl"
    >
      <ChevronLeft size={18} className="group-hover:text-primary transition-colors" />
      <span className="text-sm font-bold tracking-tight">Back to {label}</span>
    </Link>
  );
}
