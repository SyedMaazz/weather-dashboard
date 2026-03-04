"use client";
import { useEffect, useState } from "react";
import { Cloud, Sun, CloudSun, CloudSnow, CloudRain, CloudDrizzle, CloudLightning, Moon, CloudMoon, Loader2 } from "lucide-react";
import { geocodeCity } from "@/lib/geocoding";
import { fetchWeather } from "@/lib/weather";

const CITIES = [
  { country: "China", city: "Beijing" },
  { country: "US", city: "California" },
  { country: "UAE", city: "Dubai" },
  { country: "Canada", city: "Charlottetown" },
];

function WeatherIcon({ code, isDay = true }: { code: number; isDay?: boolean }) {
  const props = { size: 20, strokeWidth: 1.5 };
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

interface CityWeather {
  temp: number;
  condition: string;
  weatherCode: number;
  isDay: boolean;
}

export default function OtherCitiesPanel() {
  const [cityData, setCityData] = useState<Record<string, CityWeather | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      const results: Record<string, CityWeather | null> = {};
      await Promise.all(
        CITIES.map(async ({ city }) => {
          try {
            const coords = await geocodeCity(city);
            const data = await fetchWeather(coords);
            results[city] = {
              temp: data.current.temp,
              condition: data.current.condition,
              weatherCode: data.current.weatherCode,
              isDay: data.current.isDay,
            };
          } catch {
            results[city] = null;
          }
        })
      );
      setCityData(results);
      setLoading(false);
    }
    loadAll();
  }, []);

  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-white">Other Cities</h3>
        <button className="text-xs text-muted hover:text-white transition-colors duration-150">See All</button>
      </div>
      <div className="space-y-3">
        {CITIES.map(({ country, city }) => {
          const w = cityData[city];
          return (
            <div
              key={city}
              className="group bg-panel border border-border rounded-2xl px-4 py-5 flex items-center justify-between transition-all duration-150 hover:bg-white/[0.04] hover:border-white/40 transform hover:scale-[1.02] will-change-transform"
            >
              <div>
                <p className="text-[10px] text-muted">{country}</p>
                <p className="text-sm font-medium text-white">{city}</p>
                <p className="text-xs text-muted">
                  {loading ? "Loading…" : w ? w.condition : "Unavailable"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!loading && w && (
                  <span className="text-sm text-white/70">{w.temp}°</span>
                )}
                <div className="text-white/80 transition-all duration-150 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.65)]">
                  {loading ? (
                    <Loader2 size={20} className="animate-spin text-white/30" />
                  ) : w ? (
                    <WeatherIcon code={w.weatherCode} isDay={w.isDay} />
                  ) : (
                    <Cloud size={20} strokeWidth={1.5} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}