"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const pathname = usePathname();

  // If the user is in the admin section, "Dashboard" should mean the admin dashboard
  const isAdminPage = pathname.startsWith("/admin");
  const dashboardPath = isAdminPage ? "/admin" : "/dashboard";

  return (
    <Link 
      href={dashboardPath} 
      className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-6 no-underline"
    >
      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
        <ChevronLeft size={18} className="group-hover:text-primary transition-colors" />
      </div>
      <span className="text-sm font-bold tracking-tight">Back to Dashboard</span>
    </Link>
  );
