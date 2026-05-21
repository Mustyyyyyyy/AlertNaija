"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "../../lib/api";

const NIGERIA_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers",
  "Sokoto","Taraba","Yobe","Zamfara",
];

export default function LoginPage() {
  const router = useRouter();

  // â”€â”€ Step 0 = credential form â”€â”€
  const [step, setStep] = useState(0);
  const [identifier, setId]   = useState("");   // email or phone
  const [password, setPass]    = useState("");
  const [showPw, setShowPw]    = useState(false);
  const [err, setErr]          = useState("");
  const [loading, setLoading]  = useState(false);

  // â”€â”€ Step 1 = location consent â”€â”€
  const [locStatus, setLocStatus] = useState("");   // "", "pending", "granted", "denied"

  // â”€â”€ Step 2 = detected coords / state â”€â”€
  const [coords, setCoords] = useState("");
  const [detectedState, setDetectedState] = useState("");
  const [useManualState, setUseManual] = useState(false);
  const [manualState, setManualState] = useState("");
  const [savingLoc, setSavingLoc] = useState(false);

  const resolveState = useCallback(async (lat, lng) => {
    try {
      const r = await fetch(
        `/api/geo/lookup?lat=${lat}&lng=${lng}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (r.ok) {
        const j = await r.json();
        setDetectedState(j.state || "Unknown");
      } else {
        setDetectedState("Unknown");
      }
    } catch {
      setDetectedState("Unknown");
    }
  }, []);

  /** Step-0 handler: validate + call /login */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!identifier.trim() || !password.trim()) {
      setErr("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { emailOrPhone: identifier.trim(), password });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.removeItem("locationConsent");
        setStep(1);   // advance to location consent
        setErr("");
      } else {
        setErr(res.data.message || "Login failed.");
      }
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Network error â€” please try again.");
    }
    setLoading(false);
  };

  /** Step-1 handler: ask browser for geolocation */
  const handleLocationConsent = async (granted) => {
    if (!granted) {
      setStep(3);   // skip to "no location" summary
      return;
    }
    setLocStatus("pending");
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 8000,
        });
      });
      const { latitude, longitude } = pos.coords;
      const label = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      setCoords(label);
      await resolveState(latitude, longitude);
      setLocStatus("granted");
      setStep(2);
    } catch {
      setLocStatus("denied");
      setStep(3);
    }
  };

  /** Step-3 terminal: save profile with detected+selected state, then go to dashboard */
  const handleFinish = async () => {
    setSavingLoc(true);
    try {
      const stateToSave = useManualState ? (manualState || detectedState) : detectedState;
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // best-effort: persist state back to user profile
          await API.patch("/auth/profile", { state: stateToSave });
        } catch { /* non-critical */ }
      }
      localStorage.setItem("locationConsent", "true");
      localStorage.setItem("userState", stateToSave || "Unknown");
      router.push("/dashboard");
    } finally {
      setSavingLoc(false);
    }
  };

  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  /* â”€â”€ RENDER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  /* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

  /* â”€â”€ STEP 0 : Login form â”€â”€ */
  if (step === 0) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-white mb-2">
              Welcome back<span className="text-primary">.</span>
            </h1>
            <p className="text-slate-400 text-sm">Sign in to your AlertNaija account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {err && (
              <div className="bg-critical/15 border border-critical/40 text-critical text-sm rounded-xl p-3">{err}</div>
            )}

            <div>
              <label className="block text-sm text-slate-400 mb-1">Email or Phone Number</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setId(e.target.value)}
                placeholder="you@example.com or 0803â€¦"
                className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-slate-400">Password</label>
                <Link href="/forgot" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 pr-10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPw ? "ðŸ™ˆ" : "ðŸ‘"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-3 px-8 rounded-xl glow-primary transition disabled:opacity-60"
            >
              {loading ? "Signing inâ€¦" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">Create one</Link>
          </p>
        </div>
      </main>
    );
  }

  /* â”€â”€ STEP 1 : Location permission dialog â”€â”€ */
  if (step === 1) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 border border-primary/40 text-2xl">
            ðŸ“
          </div>
          <h1 className="text-2xl font-heading font-bold text-white mb-3">
            Enable Location Access?
          </h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            AlertNaija uses your location to show nearby emergencies and route responders to you faster.
            Your GPS coordinates are <span className="text-primary">never shared</span> with third parties.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => handleLocationConsent(true)}
              className="w-full bg-primary text-black font-bold py-3 px-8 rounded-xl transition"
            >
              Yes, Share My Location
            </button>
            <button
              onClick={() => handleLocationConsent(false)}
              className="w-full border border-slate-700 text-slate-400 font-medium py-3 px-8 rounded-xl hover:bg-slate-800/60 transition"
            >
              Not Now â€” I&apos;ll Do It Later
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* â”€â”€ STEP 2 : Confirm detected state â”€â”€ */
  if (step === 2 && locStatus === "granted") {
    const stateKnown = detectedState && detectedState !== "Unknown";
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-2xl">
              âœ…
            </div>
            <h1 className="text-2xl font-heading font-bold text-white mb-2">Location detected</h1>
            <p className="text-slate-400 text-sm">
              We picked up your position: <span className="text-primary font-mono">{coords}</span>
            </p>
          </div>

          <div className="space-y-5">
            {stateKnown ? (
              <div className="bg-[#111826] border border-slate-700 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Your state</p>
                <p className="text-white font-bold text-lg">{detectedState}</p>
                <p className="text-slate-500 text-xs mt-1">Tap "Is this right?" to save.</p>
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center">We couldn&apos;t auto-detect your state â€” please select it below.</p>
            )}

            {/* Confidence check */}
            {stateKnown && (
              <div className="flex items-start gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <input
                  type="checkbox"
                  id="auto-ok"
                  defaultChecked
                  className="mt-1 accent-primary"
                  onInput={(e) => setUseManual(!e.target.checked)}
                />
                <label htmlFor="auto-ok" className="text-sm text-slate-300">
                  <span className="text-white font-semibold">{detectedState}</span> looks right â€” save and continue
                </label>
              </div>
            )}

            {/* Manual override */}
            {(!stateKnown || useManualState) && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">Select your state</label>
                <select
                  value={manualState}
                  onChange={(e) => setManualState(e.target.value)}
                  className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-primary"
                >
                  <option value="">â€” Choose a state â€”</option>
                  {NIGERIA_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleFinish}
              disabled={savingLoc || (!stateKnown && !manualState)}
              className="w-full bg-primary text-black font-bold py-3 px-8 rounded-xl glow-primary transition disabled:opacity-50"
            >
              {savingLoc ? "Savingâ€¦" : "Go to Dashboard"}
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-full text-center text-slate-500 text-sm hover:text-slate-300"
            >
              Skip for now
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* â”€â”€ STEP 3 : Location denied / skipped â”€â”€ */
  return (
    <main className="min-h-screen bg-background-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/30 text-2xl">
          ðŸ“¡
        </div>
        <h1 className="text-2xl font-heading font-bold text-white mb-3">
          No location set
        </h1>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          You can still access the platform without sharing your location. Some features may be limited.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => setStep(1)}
            className="w-full bg-primary text-black font-bold py-3 px-8 rounded-xl transition"
          >
            Try Again
          </button>
          <button
            onClick={() => { localStorage.setItem("userState","Unknown"); router.push("/dashboard"); }}
            className="w-full border border-slate-700 text-slate-400 font-medium py-3 px-8 rounded-xl hover:bg-slate-800/60 transition"
          >
            Continue Without Location
          </button>
        </div>
      </div>
    </main>
  );
}
