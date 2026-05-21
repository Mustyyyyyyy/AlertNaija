"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";
import API from "../../lib/api";
import { Camera } from "lucide-react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_NAME || "dqc0gwza3";
const UPLOAD_PRESET = "alertnaija";

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    state: "",
    image: "",
  });

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const res = await API.get("/auth/me");
      const u = res.data.user;
      setForm({
        fullName: u.fullName || "",
        email: u.email || "",
        phone: u.phone || "",
        state: u.state || "",
        image: u.image || "",
      });
    } catch { localStorage.removeItem("token"); router.push("/login"); }
    setLoading(false);
  };

  useEffect(() => { fetchUser(); }, [router]);

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd }
    );
    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();
    return json.secure_url;
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB"); return; }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch { alert("Failed to upload image"); }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      // persists to localStorage for now; swap for a PATCH /auth/profile endpoint when ready
      localStorage.setItem("user", JSON.stringify(form));
      setMsg("Profile updated successfully");
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("Failed to save profile"); }
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Loading profile…</div>
      </main>
    );
  }

  const initials = form.fullName
    ? form.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <main className="min-h-screen bg-background-dark">
      <Topbar />
      <section className="max-w-2xl mx-auto px-6 py-10">
        <BackButton />
        <h1 className="text-3xl font-heading font-bold text-white mb-2">My Profile</h1>
        <p className="text-slate-400 mb-8">View and update your personal information</p>

        {/* ── Avatar ── */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            {form.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.image}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-400">{initials}</span>
              </div>
            )}
            {/* Camera overlay button */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 bg-primary text-black rounded-full p-1.5 shadow-lg hover:brightness-110 transition disabled:opacity-50"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={14} />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-white font-semibold">{form.fullName || "Unnamed User"}</p>
            <p className="text-slate-400 text-sm">{form.email || "No email"}</p>
            <p className="text-slate-500 text-xs mt-1">{form.state || "State not set"}</p>
          </div>
        </div>

        {msg && (
          <div className="mb-6 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-sm">{msg}</div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Full Name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">State</label>
            <input
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="w-full bg-[#111826] border border-slate-700 rounded-xl p-3 text-white"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-black font-bold py-3 px-8 rounded-xl transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="border border-critical/50 text-critical py-3 px-6 rounded-xl hover:bg-critical/10 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
