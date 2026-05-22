"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/layout/Topbar";
import BackButton from "../../components/layout/BackButton";
import API from "../../lib/api";
import IncidentCard from "../../components/incidents/IncidentCard";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [responders, setResponders] = useState([]);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const res = await API.get("/auth/me");
      // Redirect non-admin users to appropriate dashboard
      if (res.data.user.role && res.data.user.role.toUpperCase() !== "ADMIN") {
        // Redirect to appropriate dashboard based on role
        if (res.data.user.role.toUpperCase() === "OPERATOR") {
          router.push("/responder");
        } else {
          router.push("/dashboard");
        }
        return;
      }
      setUser(res.data.user);
    } catch { 
      localStorage.removeItem("token"); 
      router.push("/login"); 
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await API.get("/admin/dashboard/stats");
      setDashboardStats(res.data);
    } catch (err) { 
      console.error("Failed to fetch admin dashboard stats:", err); 
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/dashboard/users");
      setUsers(res.data.users || []);
    } catch (err) { 
      console.error("Failed to fetch users:", err); 
    }
  };

  const fetchResponders = async () => {
    try {
      const res = await API.get("/admin/dashboard/responders");
      setResponders(res.data.responders || []);
    } catch (err) { 
      console.error("Failed to fetch responders:", err); 
    }
  };

  useEffect(() => {
    Promise.all([fetchUser(), fetchDashboardStats(), fetchUsers(), fetchResponders()]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Unauthorized access</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-dark">
      <Topbar />
      <section className="px-6 lg:px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white">
            Welcome, Admin {user?.fullName?.split(" ")[0] || ""}
          </h1>
          <p className="text-slate-400">
            Admin Dashboard - System Overview
          </p>
        </div>

        {dashboardStats && (
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-heading font-bold text-white mb-4">Incidents Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total</span>
                  <span className="text-2xl font-bold text-primary">{dashboardStats.incidents?.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pending</span>
                  <span className="text-2xl font-bold text-red-500">{dashboardStats.incidents?.pending || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned</span>
                  <span className="text-2xl font-bold text-amber-500">{dashboardStats.incidents?.assigned || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">In Progress</span>
                  <span className="text-2xl font-bold text-yellow-500">{dashboardStats.incidents?.inProgress || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resolved</span>
                  <span className="text-2xl font-bold text-emerald-500">{dashboardStats.incidents?.resolved || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-heading font-bold text-white mb-4">Users & Responders</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Users</span>
                  <span className="text-2xl font-bold text-primary">{dashboardStats.users?.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Responders</span>
                  <span className="text-2xl font-bold text-primary">{dashboardStats.responders?.total || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Available Responders</span>
                  <span className="text-2xl font-bold text-emerald-500">{dashboardStats.responders?.available || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Busy Responders</span>
                  <span className="text-2xl font-bold text-red-500">{dashboardStats.responders?.busy || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-heading font-bold text-white mb-4">System Activity</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">User Growth</span>
                  <span className="text-2xl font-bold text-primary">+{Math.max(0, dashboardStats.userGrowth?._count || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">
            Recent Incidents
          </h2>
          {dashboardStats?.recentIncidents && dashboardStats.recentIncidents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardStats.recentIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-16 border border-dashed border-slate-700 rounded-2xl">
              No recent incidents
            </p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-white mb-4">System Users</h2>
            </div>
            <div>
              <button 
                onClick={() => router.push("/admin/users")}
                className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center hover:bg-primary/20 transition text-sm font-semibold"
              >
                Manage Users
              </button>
            </div>
          </div>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.slice(0, 5).map((userItem) => (
                <div key={userItem.id} className="bg-[#0b1220] border border-slate-700 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold text-sm">{userItem.fullName}</p>
                      <p className="text-slate-400 text-xs">
                        {userItem.role} â€¢ {userItem.state || "Not specified"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          userItem.role === "ADMIN" ? "bg-red-500/20 text-red-400" :
                          userItem.role === "OPERATOR" ? "bg-amber-500/20 text-amber-400" :
                          "bg-primary/20 text-primary"
                        }`}
                      >
                        {userItem.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-2">
                    Joined: {new Date(userItem.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {users.length > 5 && (
                <p className="text-center text-slate-500 text-xs mt-4">
                  and {users.length - 5} more users
                </p>
              )}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No users found</p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading font-bold text-white mb-4">Emergency Responders</h2>
            </div>
            <div>
              <button 
                onClick={() => router.push("/admin/responders")}
                className="bg-primary/10 border border-primary/30 rounded-xl p-3 text-center hover:bg-primary/20 transition text-sm font-semibold"
              >
                Manage Responders
              </button>
            </div>
          </div>
          {responders.length > 0 ? (
            <div className="space-y-4">
              {responders.slice(0, 5).map((responder) => (
                <div key={responder.id} className="bg-[#0b1220] border border-slate-700 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-semibold text-sm">{responder.name}</p>
                      <p className="text-slate-400 text-xs">
                        {responder.type} â€¢ {responder.state || "Not specified"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          responder.isAvailable ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {responder.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-slate-400 text-xs">Active Cases: {responder.activeCases}</span>
                    <span className="text-slate-400 text-xs">Location: {responder.lat?.toFixed(2)}, {responder.lng?.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {responders.length > 5 && (
                <p className="text-center text-slate-500 text-xs mt-4">
                  and {responders.length - 5} more responders
                </p>
              )}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">No responders found</p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-white mb-4">
            Live System Map
          </h2>
          <div className="bg-gradient-to-b from-[#111826] to-[#0a0f1a] border border-slate-800 rounded-2xl p-6">
            {/* Admin would see all incidents on map - using LiveMap with all incidents */}
            {/* Note: For a production admin map, you'd likely want a dedicated admin map component */}
            <div className="h-[400px]">
              {/* Placeholder for admin map - in reality this would show all incidents */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
