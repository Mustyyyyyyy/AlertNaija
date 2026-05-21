"use client";

import API from "../lib/api";
import socket from "../lib/socket";

export default function SOSButton() {
  const sendSOS = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const alertData = {
            type: "Emergency",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };

          const res = await API.post(
            "/alerts",
            alertData
          );

          socket.emit("new-alert", res.data);

          alert("Emergency Alert Sent 🚨");
        } catch (err) {
          console.log(err);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  return (
    <button
      onClick={sendSOS}
      className="
        w-40
        h-40
        rounded-full
        bg-red-600
        text-white
        text-3xl
        font-bold
        shadow-[0_0_50px_rgba(255,0,0,0.8)]
        animate-pulse
      "
    >
      SOS
    </button>
  );
}