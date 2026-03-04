"use client";
import TopBar from "@/components/top-bar";
import ForecastStrip from "@/components/forecast-strip";
import DotCanvas from "@/components/dot-canvas";
import TodayOverview from "@/components/today-overview";
import MapCTA from "@/components/map-cta";
import OtherCitiesPanel from "@/components/other-cities-panel";
import { useWeather } from "@/hooks/useWeather";

export default function Home() {
  const weather = useWeather();

  return (
    <div className="dot-bg min-h-screen">
      <main className="px-6 pb-2">
        <TopBar
          city={weather.data?.coords.name ?? "Lucknow"}
          state={weather.data?.coords.state}
          country={weather.data?.coords.country}
          onSearch={weather.setCity}
          onLocate={weather.useCurrentLocation}
          loading={weather.loading}
        />
        <div className="flex gap-2 mt-6">
          <div className="w-[1050px]">
            <ForecastStrip
              daily={weather.data?.daily ?? []}
              current={weather.data?.current ?? null}
              loading={weather.loading}
            />
            <div className="flex gap-4 -mt-0.5">
              <div className="w-[600px]">
                <TodayOverview
                  current={weather.data?.current ?? null}
                  airQuality={weather.data?.airQuality ?? null}
                  loading={weather.loading}
                />
              </div>
              <div className="w-[448px] mt-[76px]">
                <MapCTA
                  lat={weather.data?.coords.lat}
                  lon={weather.data?.coords.lon}
                />
              </div>
            </div>
          </div>
          <div className="w-[450px]">
            <div className="h-[283.5px]">
              <DotCanvas weatherCode={weather.data?.current.weatherCode} />
            </div>
            <div className="mt-[30px]">
              <OtherCitiesPanel />
            </div>
          </div>
        </div>

        {/* Error toast */}
        {weather.error && (
          <div className="fixed bottom-4 right-4 bg-red-900/80 border border-red-500/40 text-white text-xs px-4 py-2 rounded-xl">
            {weather.error}
          </div>
        )}
      </main>
    </div>
  );
}