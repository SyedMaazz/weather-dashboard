"use client";
import { Loader2 } from "lucide-react";
import { CurrentWeather, AirQuality } from "@/types/weather";

interface TodayOverviewProps {
  current: CurrentWeather | null;
  airQuality: AirQuality | null;
  loading: boolean;
}

// ── AQI dot grid — brighter dots = worse air ──────────────────
function AqiDotGrid({ aqi }: { aqi: number }) {
  // Map aqi 0–100+ to 0–72 lit dots
  const litCount = Math.min(Math.round((aqi / 100) * 72), 72);
  return (
    <div className="grid grid-cols-12 gap-[6px] py-2">
      {Array.from({ length: 72 }).map((_, i) => {
        const lit = i < litCount;
        const col = i % 12;
        let opacityClass = lit ? "bg-white/90" : "bg-white/10";
        if (lit && col >= 9) opacityClass = "bg-white/60";
        if (lit && col >= 10) opacityClass = "bg-white/35";
        return (
          <div key={i} className={`w-[4px] h-[4px] rounded-full ${opacityClass}`} />
        );
      })}
    </div>
  );
}

// ── Wind compass ──────────────────────────────────────────────
function WindCompass({ direction, speed, label }: { direction: number; speed: number; label: string }) {
  // needle rotates to wind direction
  const needleStyle = { transform: `rotate(${direction}deg)` };
  return (
    <div className="relative w-[90px] h-[90px] rounded-full border border-white/40 flex items-center justify-center">
      <div
        className="absolute w-[2px] h-[28px] bg-red-500 origin-bottom rounded-full"
        style={{
          bottom: "50%",
          left: "calc(50% - 1px)",
          ...needleStyle,
          transformOrigin: "bottom center",
        }}
      />
      <span
        className="absolute text-[10px] text-red-500 font-mono"
        style={{
          top: "6px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function TodayOverview({ current, airQuality, loading }: TodayOverviewProps) {
  return (
    <section className="mt-8 w-full max-w-[600px]">
      <h3 className="text-white text-lg mb-4">Today's Overview</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* AIR QUALITY */}
        <div className="bg-panel border border-border rounded-2xl p-4 flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">Air quality</p>
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-4">
              <Loader2 size={16} className="animate-spin text-white/30" />
            </div>
          ) : (
            <AqiDotGrid aqi={airQuality?.aqi ?? 0} />
          )}
          <p className="text-sm text-white">
            {airQuality?.aqi ?? "--"}{" "}
            <span className="text-muted">• {airQuality?.aqiLabel ?? "—"}</span>
          </p>
        </div>

        {/* UV INDEX */}
        <div className="bg-panel border border-border rounded-2xl p-4 h-[200px] flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">UV Index</p>
          <div className="flex items-center justify-center flex-1">
            <img src="/images/uv_index.svg" alt="UV Index" className="w-[140px] h-[80px] object-contain" />
          </div>
          <p className="text-sm text-white text-center">
            {loading ? "--" : String(current?.uvIndex ?? "--").padStart(2, "0")}{" "}
            <span className="text-muted">• {current?.uvLabel ?? "—"}</span>
          </p>
        </div>

        {/* WIND SPEED */}
        <div className="bg-panel border border-border rounded-2xl p-4 h-[200px] flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">Wind speed</p>
          <div className="flex flex-col items-center justify-center flex-1">
            {loading ? (
              <Loader2 size={16} className="animate-spin text-white/30" />
            ) : (
              <WindCompass
                direction={current?.windDirection ?? 0}
                speed={current?.windSpeed ?? 0}
                label={current?.windDirectionLabel ?? "N"}
              />
            )}
          </div>
          <p className="text-sm text-white">
            {current?.windSpeed ?? "--"} km/h{" "}
            <span className="text-muted">
              • {(current?.windSpeed ?? 0) < 5 ? "Calm" : (current?.windSpeed ?? 0) < 20 ? "Light breeze" : "Moderate wind"}
            </span>
          </p>
        </div>

        {/* VISIBILITY */}
        <div className="bg-panel border border-border rounded-2xl p-4 flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">Visibility</p>
          <div className="flex flex-col items-center justify-center flex-1 mr-5 mb-3">
            <svg width="160" height="80" viewBox="0 0 160 80" fill="none">
              <line x1="30" y1="40" x2="130" y2="10" stroke="white" strokeOpacity="0.7" strokeWidth="1.2" />
              <line x1="30" y1="40" x2="130" y2="70" stroke="white" strokeOpacity="0.7" strokeWidth="1.2" />
              <path d="M 115 16 A 88 88 0 0 1 115 64" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" />
              <path d="M 100 22 A 72 72 0 0 1 100 58" stroke="white" strokeOpacity="0.9" strokeWidth="1" />
              <path d="M 85 28 A 57 57 0 0 1 85 52" stroke="#E5161F" strokeOpacity="0.9" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="text-sm text-white">
            {current?.visibility ?? "--"} km{" "}
            <span className="text-muted">
              • {(current?.visibility ?? 10) < 5 ? "Haze is affecting visibility" : "Clear visibility"}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}