"use client";

import Link from "next/link";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background-dark text-slate-300">
      <Topbar />
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <BackButton />
        
        <h1 className="text-4xl font-heading font-black text-white mb-8">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-10">Last Updated: May 22, 2026</p>

        <section className="space-y-10">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="leading-relaxed">
              To provide effective emergency response services, AlertNaija collects information that identifies you or your location. This includes:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li><strong>Personal Identity:</strong> Your full name, email address, and phone number.</li>
              <li><strong>Precise Location:</strong> Real-time GPS coordinates when you use the SOS feature or report an incident.</li>
              <li><strong>Incident Data:</strong> Photos, descriptions, and timestamps of emergencies you report.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="leading-relaxed">
              Your data is used strictly for safety and emergency coordination:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2">
              <li>To route the nearest authorized responders to your exact location.</li>
              <li>To verify the authenticity of emergency reports and prevent false alarms.</li>
              <li>To provide you with updates on the status of your reported incidents.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">3. Data Sharing & Security</h2>
            <p className="leading-relaxed">
              We do not sell or rent your personal data to third parties. Your information is shared exclusively with official Nigerian emergency agencies (NPF, FRSC, NEMA, etc.) only when an active response is required.
            </p>
            <p className="mt-4">
              All data transmitted through AlertNaija is encrypted using industry-standard SSL/TLS protocols.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">4. Your Consent</h2>
            <p className="leading-relaxed">
              By using AlertNaija, you consent to the collection and processing of your location data during emergencies. You can revoke location permissions at any time through your browser or device settings, though this may limit the platform's effectiveness in a crisis.
            </p>
          </div>

          <div className="pt-10 border-t border-white/5 text-sm">
            <p>For privacy-related inquiries, please contact <span className="text-primary">privacy@alertnaija.ng</span></p>
          </div>
        </section>
      </div>
    </main>
  );
}
