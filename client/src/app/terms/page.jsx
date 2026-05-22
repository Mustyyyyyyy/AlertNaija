"use client";

import Link from "next/link";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";

export default function TermsOfUse() {
  return (
    <main className="min-h-screen bg-background-dark text-slate-300">
      <Topbar />
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <BackButton />
        
        <h1 className="text-4xl font-heading font-black text-white mb-8">Terms of Use</h1>
        <p className="text-sm text-slate-500 mb-10">Effective Date: May 22, 2026</p>

        <section className="space-y-10">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing or using AlertNaija, you agree to be bound by these Terms of Use and all applicable laws and regulations in the Federal Republic of Nigeria.
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">2. Prohibition of False Alarms</h2>
            <p className="leading-relaxed text-white">
              The intentional reporting of false emergencies or misuse of the SOS feature is a criminal offense in Nigeria. AlertNaija reserves the right to terminate your account and provide your identity to law enforcement agencies for prosecution in the event of malicious or fraudulent reports.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">3. Use of Services</h2>
            <p className="leading-relaxed">
              AlertNaija is a coordination tool. While we strive for 100% uptime, AlertNaija is not liable for delayed responses caused by network failures, server downtime, or the operational constraints of third-party emergency agencies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">4. Content Ownership</h2>
            <p className="leading-relaxed">
              By uploading photos or reports to AlertNaija, you grant the platform a non-exclusive, royalty-free license to share this media with emergency responders and public safety officials for the purpose of resolving the incident.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">5. Account Responsibility</h2>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your login credentials. AlertNaija is not responsible for any unauthorized use of your account.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
