"use client";
import { useEffect, useState } from "react";
import { Cloud, Sun, CloudSun, CloudSnow, CloudRain, CloudDrizzle, CloudLightning, Moon, CloudMoon, Loader2 } from "lucide-react";
import { geocodeCity } from "@/lib/geocoding";
import { fetchWeather } from "@/lib/weather";

// Regional city suggestions — keyed by country name
const REGIONAL_CITIES: Record<string, { country: string; city: string }[]> = {
  India: [
    { country: "India", city: "Mumbai" },
    { country: "India", city: "Delhi" },
    { country: "India", city: "Bangalore" },
    { country: "India", city: "Chennai" },
    { country: "India", city: "Kolkata" },
    { country: "India", city: "Hyderabad" },
    { country: "India", city: "Lucknow" },
    { country: "India", city: "Jaipur" },
  ],
  "United States": [
    { country: "US", city: "New York" },
    { country: "US", city: "Los Angeles" },
    { country: "US", city: "Chicago" },
    { country: "US", city: "Houston" },
    { country: "US", city: "Miami" },
    { country: "US", city: "Seattle" },
  ],
  "United Kingdom": [
    { country: "UK", city: "London" },
    { country: "UK", city: "Manchester" },
    { country: "UK", city: "Birmingham" },
    { country: "UK", city: "Edinburgh" },
    { country: "UK", city: "Bristol" },
  ],
  Germany: [
    { country: "Germany", city: "Berlin" },
    { country: "Germany", city: "Munich" },
    { country: "Germany", city: "Hamburg" },
    { country: "Germany", city: "Frankfurt" },
    { country: "Germany", city: "Cologne" },
  ],
  France: [
    { country: "France", city: "Paris" },
    { country: "France", city: "Lyon" },
    { country: "France", city: "Marseille" },
    { country: "France", city: "Bordeaux" },
  ],
  China: [
    { country: "China", city: "Beijing" },
    { country: "China", city: "Shanghai" },
    { country: "China", city: "Shenzhen" },
    { country: "China", city: "Chengdu" },
  ],
  Japan: [
    { country: "Japan", city: "Tokyo" },
    { country: "Japan", city: "Osaka" },
    { country: "Japan", city: "Kyoto" },
    { country: "Japan", city: "Sapporo" },
  ],
  Australia: [
    { country: "Australia", city: "Sydney" },
    { country: "Australia", city: "Melbourne" },
    { country: "Australia", city: "Brisbane" },
    { country: "Australia", city: "Perth" },
  ],
  Canada: [
    { country: "Canada", city: "Toronto" },
    { country: "Canada", city: "Vancouver" },
    { country: "Canada", city: "Montreal" },
    { country: "Canada", city: "Calgary" },
  ],
  Brazil: [
    { country: "Brazil", city: "São Paulo" },
    { country: "Brazil", city: "Rio de Janeiro" },
    { country: "Brazil", city: "Brasília" },
    { country: "Brazil", city: "Salvador" },
  ],
};

// Fallback cities if country not in list
const FALLBACK_CITIES = [
  { country: "China", city: "Beijing" },
  { country: "US", city: "New York" },
  { country: "UAE", city: "Dubai" },
  { country: "Canada", city: "Toronto" },
];

function getCitiesForCountry(country: string, excludeCity: string) {
  // Try exact match first, then partial match
  const key = Object.keys(REGIONAL_CITIES).find(
    k => country.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(country.toLowerCase())
  );
  const pool = key ? REGIONAL_CITIES[key] : FALLBACK_CITIES;
  // Exclude the user's current city and pick 4
  return pool.filter(c => c.city.toLowerCase() !== excludeCity.toLowerCase()).slice(0, 4);
}

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

interface OtherCitiesPanelProps {
  userCountry: string;
  userCity: string;
  onSearch: (city: string) => void;
}

export default function OtherCitiesPanel({ userCountry, userCity, onSearch }: OtherCitiesPanelProps) {
  const [cityData, setCityData] = useState<Record<string, CityWeather | null>>({});
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState(FALLBACK_CITIES);

  useEffect(() => {
    if (!userCountry) return;
    const resolved = getCitiesForCountry(userCountry, userCity);
    setCities(resolved);
  }, [userCountry, userCity]);

  useEffect(() => {
    if (!cities.length) return;

    setLoading(true);
    setCityData({});

    async function loadAll() {
      const results: Record<string, CityWeather | null> = {};
      await Promise.all(
        cities.map(async ({ city }) => {
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
  }, [cities]);

  return (
    <section className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-white">Other Cities</h3>
        <button className="text-xs text-muted hover:text-white transition-colors duration-150">See All</button>
      </div>
      <div className="space-y-3">
        {cities.map(({ country, city }) => {
          const w = cityData[city];
          return (
            <button
              key={city}
              onClick={() => onSearch(city)}
              className="group w-full bg-panel border border-border rounded-2xl px-4 py-5 flex items-center justify-between transition-all duration-150 hover:bg-white/[0.04] hover:border-white/40 transform hover:scale-[1.02] will-change-transform text-left"
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
            </button>
          );
        })}
      </div>
    </section>
  );
}