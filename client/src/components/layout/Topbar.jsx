"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  LogOut, 
  Bell, 
  Shield, 
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  Settings,
  Map as MapIcon,
  AlertCircle
} from "lucide-react";
import API from "../../lib/api";

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Check for user
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await API.get("/auth/me");
          setUser(res.data.user);
        } catch (err) {
          localStorage.removeItem("token");
        }
      }
    };
    checkUser();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const isPublicPage = pathname === "/";

  return (
    <header className={`fixed top-0 z-[100] w-full transition-all duration-300 ${
      scrolled || !isPublicPage 
        ? "bg-background-dark/80 backdrop-blur-xl border-b border-white/5 py-3" 
        : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield size={18} className="text-black fill-current" />
          </div>
          <span className="text-xl font-heading font-black text-white tracking-tight">
            Alert<span className="text-primary group-hover:text-white transition-colors">Naija</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {isPublicPage ? (
            <>
              <Link href="/about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">How it works</Link>
              <Link href="/incidents" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Live Reports</Link>
              <Link href="/contact" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Agency Portal</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className={`text-sm font-medium flex items-center gap-2 ${pathname === "/dashboard" ? "text-primary" : "text-slate-400 hover:text-white"} transition-colors`}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <Link href="/map" className={`text-sm font-medium flex items-center gap-2 ${pathname === "/map" ? "text-primary" : "text-slate-400 hover:text-white"} transition-colors`}>
                <MapIcon size={14} /> Global Map
              </Link>
            </>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all hover:bg-white/10 group relative">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background-dark"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-black font-bold text-xs">
                    {user.fullName?.[0]?.toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#0b1220] border border-white/10 shadow-2xl p-2 z-[110]"
                      >
                        <div className="px-4 py-3 border-b border-white/5 mb-2">
                          <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                          <p className="text-[10px] uppercase tracking-widest text-primary font-bold mt-0.5">{user.role}</p>
                        </div>
                        
                        <Link 
                          href="/profile" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <User size={16} /> Profile Settings
                        </Link>
                        
                        <Link 
                          href="/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <LayoutDashboard size={16} /> My Dashboard
                        </Link>

                        <div className="my-2 border-t border-white/5 pt-2">
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                      <div className="fixed inset-0 z-[105]" onClick={() => setIsDropdownOpen(false)}></div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:block px-5 py-2 text-sm font-bold text-white hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/register" className="px-6 py-2.5 text-sm font-black bg-white text-black rounded-xl hover:bg-primary transition-all shadow-lg hover:shadow-primary/20">
                Join Network
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background-dark border-t border-white/5 px-6 py-8"
          >
            <div className="flex flex-col gap-6">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-lg font-bold text-white flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                    <LayoutDashboard size={20} className="text-primary" /> Dashboard
                  </Link>
                  <Link href="/map" className="text-lg font-bold text-white flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                    <MapIcon size={20} className="text-primary" /> Live Map
                  </Link>
                  <Link href="/profile" className="text-lg font-bold text-white flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={20} className="text-primary" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="text-lg font-bold text-red-500 flex items-center gap-3">
                    <LogOut size={20} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-lg font-bold text-white" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link href="/register" className="text-lg font-bold text-primary" onClick={() => setIsMobileMenuOpen(false)}>Create Account</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
