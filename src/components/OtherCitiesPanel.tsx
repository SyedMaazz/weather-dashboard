"use client";
import { Cloud, Sun, CloudSun, CloudSnow } from "lucide-react";

export default function OtherCitiesPanel() {
  const cities = [
    {
      country: "China",
      city: "Beijing",
      condition: "Cloudy",
      icon: <Cloud strokeWidth={1.5} />,
    },
    {
      country: "US",
      city: "California",
      condition: "Windly",
      icon: <Sun strokeWidth={1.5} />,
    },
    {
      country: "Dubai",
      city: "Arab Emirates",
      condition: "Mostly Sunny",
      icon: <CloudSun strokeWidth={1.5} />,
    },
    {
      country: "Canada",
      city: "Charlottetown",
      condition: "Light SnowShower",
      icon: <CloudSnow strokeWidth={1.5} />,
    },
  ];

  return (
    <section className="mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-white">Other Cities</h3>
        <button className="text-xs text-muted hover:text-white transition-colors duration-150">
          See All
        </button>
      </div>

      {/* CITY CARDS */}
      <div className="space-y-3">
        {cities.map((c) => (
          <div
            key={c.city}
            className="
              group
              bg-panel border border-border rounded-2xl px-4 py-5
              flex items-center justify-between
              transition-all duration-150
              hover:bg-white/[0.04]
              hover:border-white/40
              transform hover:scale-[1.02]
              will-change-transform
            "
          >
            {/* LEFT TEXT */}
            <div>
              <p className="text-[10px] text-muted">{c.country}</p>
              <p className="text-sm font-medium text-white transition-colors duration-150 group-hover:text-white">
                {c.city}
              </p>
              <p className="text-xs text-muted">{c.condition}</p>
            </div>

            {/* RIGHT ICON */}
            <div
              className="
                text-white/80
                transition-all duration-150
                group-hover:text-white
                group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.65)]
              "
            >
              {c.icon}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}