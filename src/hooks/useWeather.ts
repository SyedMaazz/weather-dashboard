"use client";
import { useState, useEffect, useCallback } from "react";
import { geocodeCity, reverseGeocode } from "@/lib/geocoding";
import { fetchWeather } from "@/lib/weather";
import { WeatherData } from "@/types/weather";

interface UseWeatherReturn {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  city: string;
  setCity: (city: string) => void;
  refresh: () => void;
  useCurrentLocation: () => void;
}

const DEFAULT_CITY = "Lucknow";

export function useWeather(): UseWeatherReturn {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const coords = await geocodeCity(city);
      const weather = await fetchWeather(coords);
      setData(weather);
    } catch (e: any) {
      setError(e.message ?? "Failed to load weather");
    } finally {
      setLoading(false);
    }
  }, [city, trigger]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => setTrigger((t) => t + 1);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const coords = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setCity(coords.name);
          const weather = await fetchWeather(coords);
          setData(weather);
        } catch (e: any) {
          setError(e.message ?? "Location fetch failed");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  }, []);

  return { data, loading, error, city, setCity, refresh, useCurrentLocation };
}