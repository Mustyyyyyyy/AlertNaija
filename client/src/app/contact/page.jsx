"use client";

import { useState } from "react";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";

export default function ContactAgency() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background-dark text-slate-300">
      <Topbar />
      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <BackButton />
        
        <div className="grid lg:grid-cols-2 gap-16 mt-8">
          <div>
            <h1 className="text-4xl font-heading font-black text-white mb-6">Contact Agency</h1>
            <p className="text-lg text-slate-400 mb-10">
              For administrative inquiries, agency onboarding, or platform support. 
              <span className="block mt-2 text-primary font-bold italic">Do not use this form for active emergencies.</span>
            </p>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">🏛️</div>
                <div>
                  <h3 className="text-white font-bold mb-1">Headquarters</h3>
                  <p className="text-sm">Central District, Abuja, FCT, Nigeria</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">📧</div>
                <div>
                  <h3 className="text-white font-bold mb-1">Email Support</h3>
                  <p className="text-sm">support@alertnaija.ng</p>
                  <p className="text-xs text-slate-500 mt-1">Typical response time: 2-4 hours</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">📞</div>
                <div>
                  <h3 className="text-white font-bold mb-1">Administrative Hotline</h3>
                  <p className="text-sm">+234 (0) 800 123 4567</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1220] border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl pointer-events-none"></div>
            
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center text-2xl mb-6">✅</div>
                <h2 className="text-2xl font-bold text-white mb-2">Message Sent</h2>
                <p className="text-slate-400">Our administrative team will review your inquiry and get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="mt-8 text-primary hover:underline font-bold">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Send an Inquiry</h2>
                
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Your Name</label>
                  <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition" placeholder="John Doe" />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Subject</label>
                  <select required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition">
                    <option value="support">General Support</option>
                    <option value="agency">Agency Onboarding</option>
                    <option value="feedback">Platform Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Message</label>
                  <textarea required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition h-32" placeholder="How can we help your agency?"></textarea>
                </div>

                <button type="submit" className="w-full bg-primary text-black font-black py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition shadow-lg shadow-primary/20">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
