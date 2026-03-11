"use client";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain,
  CloudDrizzle, CloudSnow, CloudLightning, Loader2,
} from "lucide-react";
import { CurrentWeather, DailyForecast } from "@/types/weather";

function WeatherIcon({ code, isDay = true, size = 24 }: { code: number; isDay?: boolean; size?: number }) {
  const props = { size, strokeWidth: 1.5 };
  if (code === 0) return isDay ? <Sun {...props} /> : <Moon {...props} />;
  if (code <= 2) return isDay ? <CloudSun {...props} /> : <CloudMoon {...props} />;
  if (code <= 3) return <Cloud {...props} />;
  if (code <= 57) return <CloudDrizzle {...props} />;
  if (code <= 67) return <CloudRain {...props} />;
  if (code <= 77) return <CloudSnow {...props} />;
  if (code <= 82) return <CloudRain {...props} />;
  if (code <= 86) return <CloudSnow {...props} />;
  return <CloudLightning {...props} />;
}

function fullDayName(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

function useLocationTime(timezone: string) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const msUntilNextMinute = (60 - new Date().getSeconds()) * 1000 - new Date().getMilliseconds();
    const initialTimeout = setTimeout(() => {
      setNow(new Date());
      const interval = setInterval(() => setNow(new Date()), 60000);
      return () => clearInterval(interval);
    }, msUntilNextMinute);
    return () => clearTimeout(initialTimeout);
  }, []);
  const day = (() => {
    try { return now.toLocaleDateString("en-US", { weekday: "long", timeZone: timezone }); }
    catch { return now.toLocaleDateString("en-US", { weekday: "long" }); }
  })();
  const time = (() => {
    try { return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: timezone }); }
    catch { return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }); }
  })();
  return { day, time };
}

// Renders the expanded card content for a given daily entry
function ExpandedCardContent({
  index,
  day,
  current,
  allDays,
  locationTime,
}: {
  index: number;
  day: DailyForecast | undefined;
  current: CurrentWeather | null;
  allDays: DailyForecast[];
  locationTime: { day: string; time: string };
}) {
  if (index === 0) {
    return (
      <>
        <div className="flex justify-between text-sm text-white/80">
          <span>{locationTime.day}</span>
          <span>{locationTime.time}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <h2 className="text-5xl font-medium">{current?.temp ?? "--"}°</h2>
          <WeatherIcon code={current?.weatherCode ?? 0} isDay={current?.isDay} size={40} />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
          <div className="space-y-1 text-white/80">
            <p>Real Feel {current?.feelsLike ?? "--"}°</p>
            <p className="whitespace-nowrap">Wind {current?.windDirectionLabel} {current?.windSpeed ?? "--"} km/h</p>
            <p>Pressure {current?.pressure ?? "--"} MB</p>
            <p>Humidity {current?.humidity ?? "--"}%</p>
          </div>
          <div className="space-y-1 text-white/80 text-right">
            <p>Sunrise {allDays[0]?.sunrise ?? "--"}</p>
            <p>Sunset {allDays[0]?.sunset ?? "--"}</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex justify-between text-sm text-white/80">
        <span>{day ? fullDayName(day.date) : "--"}</span>
        <span>{day?.date ?? "--"}</span>
      </div>
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-5xl font-medium">{day?.tempMax ?? "--"}°</h2>
        <WeatherIcon code={day?.weatherCode ?? 0} size={40} />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
        <div className="space-y-1 text-white/80">
          <p>Low {day?.tempMin ?? "--"}°</p>
          <p>Rain {day?.precipitationProbability ?? "--"}%</p>
          <p>UV Index {day?.uvIndexMax ?? "--"}</p>
          <p>{day?.condition ?? "--"}</p>
        </div>
        <div className="space-y-1 text-white/80 text-right">
          <p>Sunrise {day?.sunrise ?? "--"}</p>
          <p>Sunset {day?.sunset ?? "--"}</p>
        </div>
      </div>
    </>
  );
}

interface ForecastStripProps {
  daily: DailyForecast[];
  current: CurrentWeather | null;
  loading: boolean;
  timezone?: string;
}

export default function ForecastStrip({ daily, current, loading, timezone = "UTC" }: ForecastStripProps) {
  const locationTime = useLocationTime(timezone);
  const [mode, setMode] = useState<"forecast" | "air">("forecast");
  const [activeTab, setActiveTab] = useState<"today" | "tomorrow">("today");


  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = {
    today: useRef<HTMLButtonElement>(null),
    tomorrow: useRef<HTMLButtonElement>(null),
  };
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, x: 0 });

  useLayoutEffect(() => {
    const el = tabRefs[activeTab].current;
    const parent = containerRef.current;
    if (el && parent) {
      const parentRect = parent.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      const extra = 12;
      setUnderlineStyle({ width: rect.width + extra, x: rect.left - parentRect.left - extra / 2 });
    }
  }, [activeTab]);

  const allDays = daily.slice(0, 7);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // bigCardIndex: today=0, tomorrow=1, or whichever small card was clicked
  const bigCardIndex = expandedIndex !== null ? expandedIndex : (activeTab === "today" ? 0 : 1);
  const smallDays = allDays.filter((_, i) => i !== bigCardIndex);

  return (
    <section className="w-full pr-2">
      <div className="flex items-center justify-between mb-6">
        <div ref={containerRef} className="relative flex gap-6 text-sm">
          <span
            className="absolute bottom-0 h-[1px] bg-white transition-all duration-300 ease-out"
            style={{ width: underlineStyle.width, transform: `translateX(${underlineStyle.x}px)` }}
          />
          {(["today", "tomorrow"] as const).map((tab) => (
            <button
              key={tab}
              ref={tabRefs[tab]}
              onClick={() => {
                setActiveTab(tab);
                setExpandedIndex(null);
              }}
              className={`pb-1 transition-all duration-200 ${
                activeTab === tab
                  ? "text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] -translate-y-[1px]"
                  : "text-muted hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex gap-2 bg-panel border border-border rounded-full p-1">
          <div className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-white transition-transform duration-200 ease-out ${mode === "air" ? "translate-x-full" : "translate-x-0"}`} />
          <button onClick={() => setMode("forecast")} className={`relative z-10 px-4 py-1 text-xs rounded-full transition-colors duration-200 ${mode === "forecast" ? "text-black" : "text-muted"}`}>Forecast</button>
          <button onClick={() => setMode("air")} className={`relative z-10 px-4 py-1 text-xs rounded-full transition-colors duration-200 ${mode === "air" ? "text-black" : "text-muted"}`}>Air Quality</button>
        </div>
      </div>

      <div className="flex items-stretch gap-2 w-full">
          <div className="w-[340px] bg-panel border border-border rounded-2xl p-6 flex flex-col justify-between">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-white/40" />
              </div>
            ) : (
              <div key={bigCardIndex} className="flex flex-col justify-between h-full animate-fade-in">
                <ExpandedCardContent
                  index={bigCardIndex}
                  day={allDays[bigCardIndex]}
                  current={current}
                  allDays={allDays}
                  locationTime={locationTime}
                />
              </div>
            )}
          </div>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[150px] bg-panel border border-border rounded-2xl p-4 flex flex-col items-center justify-center">
                  <Loader2 size={16} className="animate-spin text-white/30" />
                </div>
              ))
            : smallDays.map((d) => (
                <button
                  key={d.date}
                  onClick={() => setExpandedIndex(allDays.findIndex(day => day.date === d.date))}
                  className="group w-[150px] bg-panel border border-border rounded-2xl p-4 flex flex-col items-center justify-between transition-all duration-150 hover:bg-white/[0.04] hover:border-white/40 transform hover:scale-[1.04] will-change-transform"
                >
                  <p className="text-sm text-white/80 transition-colors duration-150 group-hover:text-white">{d.day}</p>
                  <div className="text-2xl my-4 text-white/80 transition-all duration-150 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.65)]">
                    <WeatherIcon code={d.weatherCode} size={24} />
                  </div>
                  <p className="text-lg font-medium transition-colors duration-150 group-hover:text-white">{d.tempMax}°</p>
                </button>
              ))}
        </div>
    </section>
  );
}