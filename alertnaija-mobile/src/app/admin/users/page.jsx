"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";
import API from "../../lib/api";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await API.delete(`/api/admin/users/${userId}`);
      // Remove from local state
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError("Failed to delete user");
      console.error("Failed to delete user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Loading users...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-dark">
      <Topbar />
      <section className="px-6 lg:px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-heading font-bold text-white">System Users</h1>
          <div className="flex items-center gap-3">
            <BackButton />
            <button 
              onClick={() => router.push("/admin")}
              className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center hover:bg-primary/20 transition text-sm font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        
        {users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-[#0b1220] border border-slate-700 rounded-xl p-6 hover:bg-[#111826] transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold text-lg">{user.fullName}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "ADMIN" ? "bg-red-500/20 text-red-400" :
                          user.role === "OPERATOR" ? "bg-amber-500/20 text-amber-400" :
                          "bg-primary/20 text-primary"
                        }`}
                      >
                        {user.role}
                      </span>
                      {user.state && (
                        <span className="text-slate-400 text-xs">{user.state}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-slate-400 text-xs">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-200 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">No users found</p>
          </div>
        )}
        
        <div className="mt-8 text-center text-slate-500 text-sm">
          Total Users: {users.length}
        </div>
      </section>
    </main>
  );
}