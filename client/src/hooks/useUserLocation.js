"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * useUserLocation
 *
 * - Uses `getCurrentPosition` on mount (single high-accuracy shot)
 * - Falls back to `watchPosition` if `getCurrentPosition` times out
 * - Resolves the user's Nigerian state via the local geo-lookup route
 * - Never throws — always returns a stable string
 */
export default function useUserLocation() {
  const [location, setLocation] = useState(null);  // "lat, lng" | error string
  const [state, setState]       = useState("Unknown");
  const [status, setStatus]     = useState("idle"); // idle | acquiring | found | denied | error

  const lookupState = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `/api/geo/lookup?lat=${lat}&lng=${lng}`,
        { signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : null },
      );
      if (res.ok) {
        const j = await res.json();
        setState(j.state || "Unknown");
      } else {
        setState("Unknown");
      }
    } catch {
      // next-hop: try backend directly
      try {
        const r = await fetch(
          `http://localhost:5001/api/geo/lookup?lat=${lat}&lng=${lng}`,
        );
        if (r.ok) {
          const j = await r.json();
          setState(j.state || "Unknown");
        }
      } catch { /* leave Unknown */ }
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation("GPS not available");
      setState("FCT");
      setStatus("error");
      return;
    }

    setStatus("acquiring");

    // Primary: one-shot high-accuracy read
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const label = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setLocation(label);
        setStatus("found");
        lookupState(latitude, longitude);
      },
      (err) => {
        console.warn("getCurrentPosition failed:", err.message);
        // Fallback: live watch
        const watcher = navigator.geolocation.watchPosition(
          (p) => {
            const { latitude, longitude } = p.coords;
            const label = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setLocation(label);
            setStatus("found");
            lookupState(latitude, longitude);
          },
          (e2) => {
            console.warn("watchPosition also failed:", e2.message);
            setLocation("Location denied");
            setState("FCT");
            setStatus("denied");
          },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000, distanceFilter: 5 },
        );
        return () => navigator.geolocation.clearWatch(watcher);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [lookupState]);

  return { location, state, status };
}
