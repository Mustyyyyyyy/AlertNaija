"use client";

import {
  Siren,
  MapPinned,
  Phone,
} from "lucide-react";

export default function EmergencyActions({
  triggerSOS,
}) {
  return (
    <div className="grid md:grid-cols-3 gap-5">

      <button
        onClick={triggerSOS}
        className="
          bg-red-600
          hover:bg-red-700
          rounded-3xl
          p-6
          text-left
          transition
        "
      >
        <Siren size={35} />

        <h2 className="text-2xl font-bold mt-5">
          Send SOS
        </h2>

        <p className="mt-2 text-red-100">
          Notify emergency contacts
        </p>
      </button>


      <button
        className="
          glass
          rounded-3xl
          p-6
          text-left
        "
      >
        <MapPinned size={35} />

        <h2 className="text-2xl font-bold mt-5">
          Share Location
        </h2>

        <p className="mt-2 text-slate-400">
          Send live GPS coordinates
        </p>
      </button>


      <a
        href="tel:112"
        className="
          glass
          rounded-3xl
          p-6
          text-left
        "
      >
        <Phone size={35} />

        <h2 className="text-2xl font-bold mt-5">
          Quick Call
        </h2>

        <p className="mt-2 text-slate-400">
          Instantly call emergency line
        </p>
      </a>
    </div>
  );
}