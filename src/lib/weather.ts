import {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  AirQuality,
  WeatherData,
  Coordinates,
} from "@/types/weather";

// ── WMO Weather Code → human label ───────────────────────────
export function weatherLabel(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code <= 49) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain Showers";
  if (code <= 86) return "Snow Showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

// ── UV index label ────────────────────────────────────────────
export function uvLabel(uv: number): string {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}

// ── AQI label (European AQI from Open-Meteo) ─────────────────
export function aqiLabel(aqi: number): string {
  if (aqi <= 20) return "Good";
  if (aqi <= 40) return "Fair";
  if (aqi <= 60) return "Moderate";
  if (aqi <= 80) return "Poor";
  if (aqi <= 100) return "Very Poor";
  return "Extremely Poor";
}

// ── Wind direction degrees → compass label ────────────────────
export function windDirectionLabel(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

// ── Format Unix timestamp → "5:30 AM" ────────────────────────
function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ── Day abbreviation from date string ────────────────────────
function dayAbbr(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
}

// ── Fetch all weather data ────────────────────────────────────
export async function fetchWeather(coords: Coordinates): Promise<WeatherData> {
  const { lat, lon } = coords;

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,` +
    `precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,` +
    `is_day,visibility` +
    `&hourly=temperature_2m,weather_code,precipitation_probability,is_day` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,` +
    `sunrise,sunset,uv_index_max,precipitation_probability_max` +
    `&timezone=auto` +
    `&forecast_days=7`;

  const aqUrl =
    `https://air-quality-api.open-meteo.com/v1/air-quality?` +
    `latitude=${lat}&longitude=${lon}` +
    `&current=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone` +
    `&timezone=auto`;

  const uvUrl =
    `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}` +
    `&daily=uv_index_max&timezone=auto&forecast_days=1`;

  const [weatherRes, aqRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqUrl),
  ]);

  if (!weatherRes.ok) throw new Error("Weather fetch failed");
  if (!aqRes.ok) throw new Error("Air quality fetch failed");

  const w = await weatherRes.json();
  const aq = await aqRes.json();

  const c = w.current;
  const daily = w.daily;
  const hourly = w.hourly;

  // ── Current ─────────────────────────────────────────────────
  const current: CurrentWeather = {
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    humidity: Math.round(c.relative_humidity_2m),
    windSpeed: Math.round(c.wind_speed_10m),
    windDirection: c.wind_direction_10m,
    windDirectionLabel: windDirectionLabel(c.wind_direction_10m),
    visibility: Math.round((c.visibility ?? 10000) / 1000), // m → km
    uvIndex: Math.round(daily.uv_index_max?.[0] ?? 0),
    uvLabel: uvLabel(daily.uv_index_max?.[0] ?? 0),
    sunrise: formatTime(daily.sunrise[0]),
    sunset: formatTime(daily.sunset[0]),
    condition: weatherLabel(c.weather_code),
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
    pressure: Math.round(c.surface_pressure),
  };

  // ── Daily (7 days) ──────────────────────────────────────────
  const dailyForecast: DailyForecast[] = daily.time.map(
    (date: string, i: number) => ({
      day: dayAbbr(date),
      date,
      tempMax: Math.round(daily.temperature_2m_max[i]),
      tempMin: Math.round(daily.temperature_2m_min[i]),
      weatherCode: daily.weather_code[i],
      condition: weatherLabel(daily.weather_code[i]),
      precipitationProbability: daily.precipitation_probability_max[i] ?? 0,
      sunrise: formatTime(daily.sunrise[i]),
      sunset: formatTime(daily.sunset[i]),
      uvIndexMax: Math.round(daily.uv_index_max[i] ?? 0),
    })
  );

  // ── Hourly (next 24h only) ──────────────────────────────────
  const nowIndex = hourly.time.findIndex(
    (t: string) => new Date(t) >= new Date()
  );
  const start = nowIndex >= 0 ? nowIndex : 0;
  const hourlyForecast: HourlyForecast[] = hourly.time
    .slice(start, start + 24)
    .map((t: string, i: number) => {
      const d = new Date(t);
      return {
        time: d.toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        }),
        temp: Math.round(hourly.temperature_2m[start + i]),
        weatherCode: hourly.weather_code[start + i],
        precipitationProbability:
          hourly.precipitation_probability[start + i] ?? 0,
        isDay: hourly.is_day[start + i],
      };
    });

  // ── Air Quality ─────────────────────────────────────────────
  const aqc = aq.current;
  const airQuality: AirQuality = {
    aqi: Math.round(aqc.european_aqi ?? 0),
    aqiLabel: aqiLabel(aqc.european_aqi ?? 0),
    pm2_5: Math.round(aqc.pm2_5 ?? 0),
    pm10: Math.round(aqc.pm10 ?? 0),
    no2: Math.round(aqc.nitrogen_dioxide ?? 0),
    o3: Math.round(aqc.ozone ?? 0),
  };

  return {
    coords,
    current,
    daily: dailyForecast,
    hourly: hourlyForecast,
    airQuality,
    timezone: w.timezone as string,
  };
}