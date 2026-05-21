"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "../../lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!identifier.trim()) {
      setErr("Please enter your email or phone number.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { emailOrPhone: identifier.trim() });
      setSent(true);
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 border border-primary/40 text-2xl">
            📧
          </div>
          <h1 className="text-2xl font-heading font-bold text-white mb-3">Check your email</h1>
          <p className="text-slate-400 text-sm mb-6">
            If an account exists with that email or phone, a reset link has been sent.
          </p>
          <Link href="/login" className="text-primary hover:underline text-sm">Back to sign in</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Reset password</h1>
          <p className="text-slate-400 text-sm">Enter your email or phone to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {err && (
            <div className="bg-critical/15 border border-critical/40 text-critical text-sm rounded-xl p-3">{err}</div>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-1">Email or Phone</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or 0803..."
              className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-3 px-8 rounded-xl glow-primary transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </div>
    </main>
  );
}