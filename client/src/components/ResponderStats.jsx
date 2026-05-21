"use client";

import {
  ShieldAlert,
  CheckCircle,
  Clock3,
} from "lucide-react";

export default function ResponderStats({ alerts }) {
  const pending = alerts.filter(
    (a) => a.status === "pending"
  );

  const resolved = alerts.filter(
    (a) => a.status === "resolved"
  );

  return (
    <div className="grid md:grid-cols-3 gap-4">

      <div className="bg-[#0f172a] rounded-3xl p-5">
        <div className="flex justify-between items-center">
          <p className="text-slate-400">
            Total Alerts
          </p>

          <ShieldAlert className="text-red-500" />
        </div>

        <h1 className="text-4xl font-bold mt-4">
          {alerts.length}
        </h1>
      </div>

      <div className="bg-[#0f172a] rounded-3xl p-5">
        <div className="flex justify-between items-center">
          <p className="text-slate-400">
            Pending
          </p>

          <Clock3 className="text-yellow-500" />
        </div>

        <h1 className="text-4xl font-bold mt-4">
          {pending.length}
        </h1>
      </div>

      <div className="bg-[#0f172a] rounded-3xl p-5">
        <div className="flex justify-between items-center">
          <p className="text-slate-400">
            Resolved
          </p>

          <CheckCircle className="text-green-500" />
        </div>

        <h1 className="text-4xl font-bold mt-4">
          {resolved.length}
        </h1>
      </div>

    </div>
  );
}