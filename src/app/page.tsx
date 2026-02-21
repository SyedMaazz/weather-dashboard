import TopBar from "@/components/TopBar";
import ForecastStrip from "@/components/ForecastStrip";
import RainPanel from "@/components/RainPanel";
import TodayOverview from "@/components/TodayOverview";
import MapCTA from "@/components/MapCTA";
import OtherCitiesPanel from "@/components/OtherCitiesPanel";

export default function Home() {
  return (
    <main className="min-h-screen px-6 pb-10">
      <TopBar />

      {/* 🔧 PIXEL CONTROLLED LAYOUT */}
      <div className="flex gap-2 mt-6">
        {/* LEFT — ForecastStrip width in px */}
        <div className="w-[1050px]">
          <ForecastStrip />

          {/* ROW: TodayOverview + Map */}
          <div className="flex gap-4 -mt-0.5">
            {/* TodayOverview — unchanged */}
            <div className="w-[600px]">
              <TodayOverview />
            </div>

            {/* Map — same position logic, valid Tailwind spacing */}
            <div className="w-[448px] mt-[76px]">
              <MapCTA />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — RainPanel + OtherCities stacked */}
        <div className="w-[450px]">
          {/* Rain panel (unchanged) */}
          <div className="h-[283.5px]">
            <RainPanel />
          </div>

          {/* Other Cities — aligned with TodayOverview & Map */}
          <div className="mt-[30px] h-[520px]">
            <OtherCitiesPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
