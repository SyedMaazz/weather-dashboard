"use client";
import { useState } from "react";
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudHail,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Eye,
  SunMedium,
  Thermometer,
  Navigation,
} from "lucide-react";

export default function ForecastStrip() {
  const [mode, setMode] = useState<"forecast" | "air">("forecast");

  const days = [
    { day: "SAT", temp: "10°", icon: <Cloud strokeWidth={1.5} /> },
    { day: "SUN", temp: "15°", icon: <Sun strokeWidth={1.5} /> },
    { day: "MON", temp: "11°", icon: <CloudSun strokeWidth={1.5} /> },
    { day: "TUE", temp: "10°", icon: <CloudRain strokeWidth={1.5} /> },
    { day: "WED", temp: "12°", icon: <CloudDrizzle strokeWidth={1.5} /> },
    { day: "THU", temp: "10°", icon: <CloudLightning strokeWidth={1.5} /> },
  ];

  return (
    <section className="w-full pr-2">
      {/* TOP ROW */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6 text-sm">
          <button className="text-white">Today</button>
          <button className="text-muted hover:text-white">Tomorrow</button>
          <button className="text-white font-semibold border-b border-white pb-1">
            Next 7days
          </button>
        </div>

        {/* TOGGLE */}
        <div className="relative flex gap-2 bg-panel border border-border rounded-full p-1">
          <div
            className={`
              absolute top-1 bottom-1 left-1
              w-[calc(50%-4px)]
              rounded-full bg-white
              transition-transform duration-200 ease-out
              ${mode === "air" ? "translate-x-full" : "translate-x-0"}
            `}
          />

          <button
            onClick={() => setMode("forecast")}
            className={`relative z-10 px-4 py-1 text-xs rounded-full transition-colors duration-200 ${
              mode === "forecast" ? "text-black" : "text-muted"
            }`}
          >
            Forecast
          </button>

          <button
            onClick={() => setMode("air")}
            className={`relative z-10 px-4 py-1 text-xs rounded-full transition-colors duration-200 ${
              mode === "air" ? "text-black" : "text-muted"
            }`}
          >
            Air Quality
          </button>
        </div>
      </div>

      {/* CARDS ROW */}
      <div className="flex items-stretch gap-2 w-full">
        {/* TODAY CARD */}
        <div className="w-[340px] bg-panel border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between text-sm text-white/80">
            <span>Friday</span>
            <span>11:45 AM</span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <h2 className="text-5xl font-medium">16°</h2>
            <div>
              <CloudMoon size={40} strokeWidth={1.5} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
            <div className="space-y-1 text-white/80">
              <p>Real Feel 18°</p>
              <p className="whitespace-nowrap">Wind N-E 6-7 km/h</p>
              <p>Pressure 100MB</p>
              <p>Humidity 51%</p>
            </div>

            <div className="space-y-1 text-white/80 text-right">
              <p>Sunrise 5:30AM</p>
              <p>Sunset 6:45</p>
            </div>
          </div>
        </div>

        {/* NEXT 6 DAYS */}
        {days.map((d) => (
          <div
            key={d.day}
            className="
              group
              w-[150px]
              bg-panel
              border border-border
              rounded-2xl
              p-4
              flex flex-col items-center justify-between
              transition-all duration-150
              hover:bg-white/[0.04]
              hover:border-white/40
              transform hover:scale-[1.04]
              will-change-transform
            "
          >
            <p className="text-sm text-white/80 transition-colors duration-150 group-hover:text-white">
              {d.day}
            </p>

            <div
              className="
                text-2xl my-4 text-white/80
                transition-all duration-150
                group-hover:text-white
                group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.65)]
              "
            >
              {d.icon}
            </div>

            <p className="text-lg font-medium transition-colors duration-150 group-hover:text-white">
              {d.temp}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}