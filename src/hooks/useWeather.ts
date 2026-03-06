"use client";
import { useState, useEffect, useCallback, useRef } from "react";
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

const FALLBACK_CITY = "Lucknow";

export function useWeather(): UseWeatherReturn {
  const [city, setCity] = useState<string | null>(null); // null = not yet resolved
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);
  const geoAttempted = useRef(false);

  // On first mount — try geolocation, fall back to Lucknow if denied/unavailable
  useEffect(() => {
    if (geoAttempted.current) return;
    geoAttempted.current = true;

    if (!navigator.geolocation) {
      setCity(FALLBACK_CITY);
      return;
    }

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
        } catch {
          setCity(FALLBACK_CITY);
        } finally {
          setLoading(false);
        }
      },
      () => {
        // Permission denied or timeout — fall back silently
        setCity(FALLBACK_CITY);
      },
      { timeout: 6000, maximumAge: 60000 }
    );
  }, []);

  // Load weather whenever city is set via search
  const load = useCallback(async () => {
    if (!city) return; // wait for geolocation to resolve
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
    // Only run load() for search-triggered city changes, not the initial geo fetch
    // (initial geo fetch sets data directly to avoid double-fetching)
    if (!city || data?.coords.name === city) return;
    load();
  }, [city, trigger]);

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

  return {
    data,
    loading,
    error,
    city: city ?? FALLBACK_CITY,
    setCity,
    refresh,
    useCurrentLocation,
  };
}