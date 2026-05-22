"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import API from "../../../lib/api";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/reset-password", { token, password });
      setSuccess(true);
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-2xl">
            ✅
          </div>
          <h1 className="text-2xl font-heading font-bold text-white mb-3">Password reset</h1>
          <p className="text-slate-400 text-sm mb-6">Your password has been reset successfully.</p>
          <Link href="/login" className="text-primary hover:underline text-sm">Sign in now</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Set new password</h1>
          <p className="text-slate-400 text-sm">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {err && (
            <div className="bg-critical/15 border border-critical/40 text-critical text-sm rounded-xl p-3">{err}</div>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 pr-10 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPw ? "*" : "👁"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-3 px-8 rounded-xl glow-primary transition disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </div>
    </main>
  );
}