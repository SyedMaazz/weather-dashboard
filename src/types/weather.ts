export interface Coordinates {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windDirectionLabel: string;
  visibility: number; // km
  uvIndex: number;
  uvLabel: string;
  sunrise: string; // "5:30 AM"
  sunset: string;  // "6:45 PM"
  condition: string; // "Hazy clouds"
  weatherCode: number;
  isDay: boolean;
  pressure: number;
}

export interface DailyForecast {
  day: string;       // "SAT"
  date: string;      // "2024-03-02"
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  condition: string;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface HourlyForecast {
  time: string;      // "11 AM"
  temp: number;
  weatherCode: number;
  precipitationProbability: number;
  isDay: number;
}

export interface AirQuality {
  aqi: number;       // European AQI
  aqiLabel: string;  // "Good" | "Fair" | "Moderate" | "Poor" | "Very Poor"
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
}

export interface WeatherData {
  timezone: string;   // e.g. "Asia/Dubai"
  coords: Coordinates;
  current: CurrentWeather;
  daily: DailyForecast[];   // 7 days
  hourly: HourlyForecast[]; // next 24 hours
  airQuality: AirQuality;
}