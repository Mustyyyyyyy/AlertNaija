"use client";

import { useState } from "react";
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

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email:    "",
    phone:    "",
    password: "",
    state:    "",
  });
  const [showPw, setShowPw]   = useState(false);
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const validate = () => {
    if (!form.fullName.trim())           return "Full name is required.";
    if (!/^\d{10,15}$/.test(form.phone)) return "Enter a valid phone number (10-15 digits).";
    if (form.password.length < 6)        return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const vErr = validate();
    console.log('Validation result:', vErr);
    if (vErr) { setErr(vErr); return; }

    setLoading(true);
    try {
      console.log('Sending register request with:', {
        fullName: form.fullName.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim(),
        password: form.password ? '***' : undefined,
        state: form.state || undefined
      });
      const response = await API.post("/auth/register", {
        fullName: form.fullName.trim(),
        email:    form.email.trim() || undefined,
        phone:    form.phone.trim(),
        password: form.password,
        state:    form.state || undefined,
        // role is intentionally omitted â€” the server defaults to CITIZEN
      });
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      const { success, token, user, message } = response.data;
      console.log('Register response:', response.data);

      if (!success) { setErr(message || "Registration failed."); return; }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (ex) {
      console.error('Register error:', ex.response?.data || ex.message);
      const serverData = ex?.response?.data;
      const msg = typeof serverData === 'object' 
        ? (serverData.message || serverData.error || JSON.stringify(serverData))
        : "Network error. Please try again.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm">
            Join AlertNaija â€” all new accounts are created as Citizens
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {err && (
            <div className="bg-critical/15 border border-critical/40 text-critical text-sm rounded-xl p-3">{err}</div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="e.g. John Musa Danjuma"
              className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Email <span className="text-slate-600">(optional)</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 15))}
              placeholder="0803 000 0000"
              className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              State of Residence <span className="text-slate-600">(optional)</span>
            </label>
            <select
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition"
            >
              <option value="">â€” Select your state â€”</option>
              {NIGERIA_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="At least 6 characters"
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
            {loading ? "Creating accountâ€¦" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
