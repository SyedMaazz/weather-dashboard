"use client";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false });

interface MapCTAProps {
  lat?: number;
  lon?: number;
}

export default function MapCTA({ lat = 26.8467, lon = 80.9462 }: MapCTAProps) {
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-border">
      <LeafletMap lat={lat} lon={lon} />
    </div>
  );
}