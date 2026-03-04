import { Coordinates } from "@/types/weather";

export async function geocodeCity(query: string): Promise<Coordinates> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      // Nominatim requires a User-Agent
      "User-Agent": "NothingWeatherApp/1.0",
      "Accept-Language": "en",
    },
  });

  if (!res.ok) throw new Error("Geocoding failed");

  const data = await res.json();
  if (!data.length) throw new Error(`City not found: ${query}`);

  const place = data[0];
  const address = place.address || {};

  return {
    lat: parseFloat(place.lat),
    lon: parseFloat(place.lon),
    name:
      address.city ||
      address.town ||
      address.village ||
      address.county ||
      query,
    country: address.country || "",
    state: address.state,
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<Coordinates> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "NothingWeatherApp/1.0",
      "Accept-Language": "en",
    },
  });

  if (!res.ok) throw new Error("Reverse geocoding failed");

  const data = await res.json();
  const address = data.address || {};

  return {
    lat,
    lon,
    name:
      address.city ||
      address.town ||
      address.village ||
      address.county ||
      "Unknown",
    country: address.country || "",
    state: address.state,
  };
}