"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useIncidentStore from "../../store/incident.store";

export default function NotificationManager() {
  const { incidents } = useIncidentStore();

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  // Monitor for new incidents to show browser notification
  // Note: In a real app, this would be triggered by a Socket.io event
  useEffect(() => {
    if (incidents.length > 0) {
      const latest = incidents[0];
      
      // Only notify if notification is recent (last 10 seconds)
      const isNew = new Date().getTime() - new Date(latest.createdAt).getTime() < 10000;
      
      if (isNew && Notification.permission === "granted") {
        new Notification(`New Emergency: ${latest.type}`, {
          body: latest.description || "An incident has been reported in your area.",
          icon: "/icon.png"
        });
        
        toast.error(`NEW ALERT: ${latest.type}`, {
          duration: 6000,
          position: "top-right",
          style: {
            background: "#0b1220",
            color: "#fff",
            border: "1px solid #FF3366"
          }
        });
      }
    }
  }, [incidents.length]);

  return null;
}
