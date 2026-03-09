"use client";
import { useEffect, useRef } from "react";

interface LeafletMapProps {
  lat: number;
  lon: number;
}

export default function LeafletMap({ lat, lon }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([lat, lon], 10);
        return;
      }

      const map = L.map(mapRef.current!, {
        center: [lat, lon],
        zoom: 10,
        scrollWheelZoom: true,
        zoomControl: false, // we render our own buttons
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lon]);

  const zoom = (dir: 1 | -1) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + dir);
    }
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full map-container" />

      {/* Custom zoom buttons */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-[2px]">
        <button
          onClick={() => zoom(1)}
          className="w-8 h-8 bg-black/70 hover:bg-black/90 border border-white/20 hover:border-white/40 text-white rounded-t-lg flex items-center justify-center text-lg font-light transition-all duration-150 select-none [font-family:system-ui]"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => zoom(-1)}
          className="w-8 h-8 bg-black/70 hover:bg-black/90 border border-white/20 hover:border-white/40 text-white rounded-b-lg flex items-center justify-center text-lg font-light transition-all duration-150 select-none [font-family:system-ui]"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}