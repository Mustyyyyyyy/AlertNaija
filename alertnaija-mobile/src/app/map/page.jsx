"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import API from "../../lib/api";
import useUserLocation from "../../hooks/useUserLocation";

const TYPE_COLORS = {
  FIRE:    "#ef4444",
  MEDICAL: "#ec4899",
  SECURITY:"#f59e0b",
  RESCUE:  "#0ea5e9",
  BANDITS: "#f97316",
};

export default function LiveMapPage() {
  const router = useRouter();
  const { location, state: userState, status: locStatus } = useUserLocation();

  const [incidents, setIncidents] = useState([]);
  const [selected, setSelected]     = useState(null);
  const [mapReady, setMapReady]     = useState(false);
  const [tab, setTab]               = useState("ACTIVE");
  const mapContainerRef = useRef(null);
  const mapRef          = useRef(null);
  const markersRef      = useRef({});

  /* â”€â”€ Fetch incidents â”€â”€ */
  const fetchIncidents = useCallback(async () => {
    try {
      const res = await API.get("/incidents");
      setIncidents(res.data || []);
    } catch { /* keep existing */ }
  }, []);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  /* â”€â”€ Mapbox GL JS initialisation (lazy-load) â”€â”€ */
  useEffect(() => {
    if (typeof window === "undefined" || mapReady) return;

    const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    if (!MAPBOX_TOKEN) return;

    const load = async () => {
      await new Promise((resolve) => {
        if (window.mapboxgl) { resolve(); return; }
        const s = document.createElement("script");
        s.src = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js";
        s.onload = resolve; document.head.appendChild(s);
      });

      await new Promise((resolve) => {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css";
        l.onload = resolve; document.head.appendChild(l);
      });

      window.mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new window.mapboxgl.Map({
        container:  mapContainerRef.current,
        style:      "mapbox://styles/mapbox/dark-v11",
        center:     [7.396, 9.082],
        zoom:       5,
        pitch:      35,
        bearing:    0,
        antialias:  true,
        hash:       true,             // shareable URL
      });

      map.addControl(new window.mapboxgl.NavigationControl({ showCompass: true }), "bottom-right");

      // GeolocateBtn â€” button only; we handle flyTo ourselves via useUserLocation
      const geoCtrl = new window.mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true, timeout: 10000 },
        trackUserLocation: true,
        showUserHeading: true,
      });
      map.addControl(geoCtrl, "bottom-right");

      map.on("load", () => {
        mapRef.current = map;
        setMapReady(true);
      });
    };

    load();

    return () => {
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch { /* ignore */ }
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* â”€â”€ Fly to user location the moment it resolves â”€â”€ */
  useEffect(() => {
    if (!mapReady || !mapRef.current || !location || locStatus !== "found") return;
    const [lat, lng] = location.split(",").map(Number);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    mapRef.current.flyTo({ center: [lng, lat], zoom: 14, pitch: 40, bearing: 0, duration: 1500 });
  }, [mapReady, location, locStatus]);

  /* â”€â”€ Manual "Locate Me" button â€” fires getCurrentPosition on demand â”€â”€ */
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    if (!mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapRef.current.flyTo({
          center:    [longitude, latitude],
          zoom:      14,
          pitch:     40,
          duration:  1200,
        });
      },
      (err) => {
        console.warn("LocateMe failed:", err.message);
        // escalate the built-in GeolocateControl so browser shows the native prompt
        mapRef.current?.getControl(mapRef.current._controls?.findIndex(c => c instanceof window.mapboxgl.GeolocateControl))?.trigger();
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  }, []);

  /* â”€â”€ Draw / update incident markers â”€â”€ */
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;

    const filtered = tab === "ACTIVE"
      ? incidents.filter((i) => i.status !== "RESOLVED")
      : incidents;

    // Remove stale markers
    Object.keys(markersRef.current).forEach((id) => {
      if (!filtered.find((i) => i.id === id)) {
        try { map.removeLayer(`inc-${id}-ring`); } catch { /* ok */ }
        try { map.removeLayer(`inc-${id}-circle`); } catch { /* ok */ }
        try { map.removeSource(`inc-${id}`); } catch { /* ok */ }
        delete markersRef.current[id];
      }
    });

    filtered.forEach((inc) => {
      const color = TYPE_COLORS[inc.type] || "#94a3b8";
      const lat   = typeof inc.lat === "number" ? inc.lat : parseFloat(inc.lat);
      const lng   = typeof inc.lng === "number" ? inc.lng : parseFloat(inc.lng);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      const id = `inc-${inc.id}`;

      if (!map.getSource(id)) {
        markersRef.current[inc.id] = true;

        map.addSource(id, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: { id: inc.id },
            geometry:    { type: "Point", coordinates: [lng, lat] },
          },
        });

        // Pulse ring
        map.addLayer({
          id:     `${id}-ring`,
          type:   "circle",
          source: id,
          paint: {
            "circle-radius":          ["interpolate", ["exponential", 1.5], ["zoom"], 10, 14, 15, 26],
            "circle-color":           color,
            "circle-opacity":         0.2,
            "circle-stroke-width":    0,
          },
        });

        // Inner dot
        map.addLayer({
          id:     `${id}-circle`,
          type:   "circle",
          source: id,
          paint: {
            "circle-radius":          ["interpolate", ["exponential", 1.5], ["zoom"], 10, 6, 15, 10],
            "circle-color":           color,
            "circle-stroke-width":    2,
            "circle-stroke-color":    "#ffffff",
            "circle-opacity":         0.9,
          },
        });

        map.on("click", `${id}-circle`, () => setSelected(inc));
        map.on("mouseenter", `${id}-circle`, () => { map.getCanvas().style.cursor = "pointer"; });
        map.on("mouseleave", `${id}-circle`, () => { map.getCanvas().style.cursor = ""; });

      } else {
        map.getSource(id)?.setData({
          type: "Feature",
          properties: { id: inc.id },
          geometry:    { type: "Point", coordinates: [lng, lat] },
        });
      }
    });
  }, [mapReady, incidents, tab]);

  /* â”€â”€ User dot â”€â”€ */
  useEffect(() => {
    if (!mapReady || !mapRef.current || !location) return;
    const [lat, lng] = location.split(",").map(Number);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    const map   = mapRef.current;
    const srcId = "user-dot";

    if (!map.getSource(srcId)) {
      map.addSource(srcId, {
        type: "geojson",
        data: { type: "Feature", geometry: { type: "Point", coordinates: [lng, lat] } },
      });

      // Soft glow ring
      map.addLayer({
        id: "user-ring", type: "circle", source: srcId,
        paint: {
          "circle-radius": 20, "circle-color": "#0df2a6",
          "circle-opacity": 0.18, "circle-stroke-width": 0,
        },
      });

      // Hard dot
      map.addLayer({
        id: "user-dot", type: "circle", source: srcId,
        paint: {
          "circle-radius": 8, "circle-color": "#0df2a6",
          "circle-stroke-width": 3, "circle-stroke-color": "#000000",
        },
      });
    } else {
      map.getSource(srcId)?.setData({
        type: "Feature", geometry: { type: "Point", coordinates: [lng, lat] },
      });
    }
  }, [mapReady, location]);

  /* â”€â”€ Derived list / counts â”€â”€ */
  const list   = tab === "ACTIVE" ? incidents.filter((i) => i.status !== "RESOLVED") : incidents;
  const counts = {};
  list.forEach((i) => { counts[i.type] = (counts[i.type] || 0) + 1; });

  /* â”€â”€ Compose LatLng string for the locateMe label â”€â”€ */
  const coordsDisplay = location && !location.startsWith("Location") && !location.startsWith("GPS")
    ? location
    : null;

  return (
    <main className="min-h-screen bg-background-dark flex flex-col">
      {/* â”€â”€ Topbar â”€â”€ */}
      <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">
          <h1 className="text-lg font-heading font-bold text-white">
            Alert<span className="text-primary">Naija</span>{" "}
            <span className="text-slate-500 text-sm font-body font-normal">Â· Live Map</span>
          </h1>
          <div className="flex items-center gap-3 text-sm">
            {userState && userState !== "Unknown" && (
              <span className="text-primary text-xs font-mono bg-primary/10 border border-primary/30 rounded-full px-2.5 py-0.5">
                {userState}
              </span>
            )}
            <a
              href="tel:08032000196"
              className="bg-critical/15 border border-critical/40 text-critical text-xs font-bold px-3 py-1.5 rounded-full hover:bg-critical/25 transition"
            >
              ðŸ†˜ 0803-200-0196
            </a>
          </div>
        </div>
      </header>

      {/* â”€â”€ Map + overlays â”€â”€ */}
      <div className="flex-1 relative">
        <div ref={mapContainerRef} className="w-full h-[calc(100vh-56px)]" />

        {/* â”€â”€ Legend â”€â”€ */}
        {mapReady && (
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
            {Object.entries(counts).map(([type, cnt]) => {
              const color = TYPE_COLORS[type] || "#94a3b8";
              return (
                <div key={type} className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-slate-300">{type}</span>
                  <span className="text-white font-bold">{cnt}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* â”€â”€ Locate Me pill â”€â”€ */}
        <button
          onClick={handleLocateMe}
          className="absolute top-4 left-4 z-20 bg-black/55 backdrop-blur-md border border-white/15 hover:border-primary/60 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5"
        >
          {/* simple crosshair SVG */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span>
            {locStatus === "acquiring" ? "Locatingâ€¦" : coordsDisplay ? "Recenter on me" : "Find my location"}
          </span>
        </button>

        {/* â”€â”€ Coordinates + status label â”€â”€ */}
        <div className="absolute bottom-4 left-4 z-10 space-y-1">
          {coordsDisplay && (
            <div className="bg-black/55 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[11px] font-mono text-primary border border-primary/30">
              ðŸ“ {coordsDisplay}
            </div>
          )}
          {locStatus === "acquiring" && (
            <div className="bg-black/55 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-400">
              â³ Getting your locationâ€¦
            </div>
          )}
          {locStatus === "denied" && (
            <div className="bg-critical/15 border border-critical/40 rounded-lg px-3 py-1.5 text-[11px] font-mono text-critical">
              âš  Location permission denied
            </div>
          )}
          {locStatus === "error" && (
            <div className="bg-amber-500/15 border border-amber-500/40 rounded-lg px-3 py-1.5 text-[11px] font-mono text-amber-400">
              âš  GPS unavailable
            </div>
          )}
        </div>
      </div>

      {/* â”€â”€ Incident detail drawer â”€â”€ */}
      {selected && <IncidentDrawer incident={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/* IncidentDrawer                                   */
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function IncidentDrawer({ incident, onClose }) {
  const statusCls = {
    PENDING:      "text-slate-300 border-slate-600 bg-slate-500/10",
    ASSIGNED:     "text-primary   border-primary   bg-primary/10",
    IN_PROGRESS:  "text-amber-400 border-amber-500  bg-amber-500/10",
    RESOLVED:     "text-emerald-400 border-emerald-500 bg-emerald-500/10",
  }[incident.status] || "text-slate-300 border-slate-600 bg-slate-500/10";

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-h-[60vh] bg-[#0a0f1a] border-t border-slate-700 rounded-t-3xl p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] uppercase tracking-widest font-bold border px-2.5 py-1 rounded-md ${statusCls}`}>
            {incident.status}
          </span>
          <span className="text-slate-500 text-xs">
            {incident.type?.toLowerCase().replace("_", " ")}
          </span>
        </div>

        <h2 className="text-xl font-heading font-bold text-white mb-1">
          {incident.type?.toLowerCase().replace("_", " ") || "Unknown incident"}
        </h2>

        {incident.description && (
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">{incident.description}</p>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#111826] rounded-xl p-3">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">Location</p>
            <p className="text-white text-sm font-mono mt-0.5">
              {typeof incident.lat === "number" && typeof incident.lng === "number"
                ? `${incident.lat.toFixed(5)}, ${incident.lng.toFixed(5)}`
                : `${incident.lat}, ${incident.lng}`}
            </p>
          </div>
          <div className="bg-[#111826] rounded-xl p-3">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">State</p>
            <p className="text-white text-sm mt-0.5">
              {incident.user?.state || incident.responder?.state || "Unknown"}
            </p>
          </div>
        </div>

        {incident.user && (
          <div className="bg-[#111826] rounded-xl p-3 mb-4">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Reported by</p>
            <p className="text-white text-sm font-semibold">{incident.user.fullName}</p>
            <p className="text-slate-500 text-xs">{incident.user.state}</p>
          </div>
        )}

        {incident.responder && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-xs">ðŸš‘</span>
            <p className="text-primary text-sm font-semibold">{incident.responder.name}</p>
            <span className="text-slate-500 text-xs">Â· {incident.responder.type}</span>
          </div>
        )}
      </div>
    </div>
  );
}
