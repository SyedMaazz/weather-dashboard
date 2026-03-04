"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import the entire map component — avoids SSR + prop type issues
const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false });

interface MapCTAProps {
  lat?: number;
  lon?: number;
}

export default function MapCTA({ lat = 26.8467, lon = 80.9462 }: MapCTAProps) {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-border">
      <LeafletMap lat={lat} lon={lon} />

      {showIntro && (
        <div className="absolute inset-0 flex flex-col justify-between p-6 bg-black/30 pointer-events-none">
          <div className="bg-white/80 text-black text-sm font-medium rounded-xl px-4 py-2 w-fit backdrop-blur">
            Explore global map of wind weather and ocean condition
          </div>
          <button
            className="bg-white text-black font-semibold py-3 rounded-xl pointer-events-auto"
            onClick={() => setShowIntro(false)}
          >
            GET STARTED
          </button>
        </div>
      )}
    </div>
  );
}