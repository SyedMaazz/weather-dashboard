"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

export default function MapCTA() {
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden border border-border">
      {/* 🌍 MAP */}
      <MapContainer
        center={[26.8467, 80.9462]}
        zoom={10}
        scrollWheelZoom={false}
        className="h-full w-full map-container"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>

      {/* 🔳 Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 bg-black/30">
        <div className="bg-white/80 text-black text-sm font-medium rounded-xl px-4 py-2 w-fit backdrop-blur">
          Explore global map of wind weather and ocean condition
        </div>

        <button className="bg-white text-black font-semibold py-3 rounded-xl">
          GET STARTED
        </button>
      </div>
    </div>
  );
}