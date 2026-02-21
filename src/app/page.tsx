import TopBar from "@/components/TopBar";
import ForecastStrip from "@/components/ForecastStrip";
import RainPanel from "@/components/RainPanel";
import TodayOverview from "@/components/TodayOverview";
import MapCTA from "@/components/MapCTA";

export default function Home() {
  return (
    <main className="min-h-screen px-6 pb-10">
      <TopBar />

      {/* 🔧 PIXEL CONTROLLED LAYOUT */}
      <div className="flex gap-2 mt-6">
        {/* LEFT — ForecastStrip width in px */}
        <div className="w-[1050px]">
          <ForecastStrip />

          {/* ROW: TodayOverview + Map (same baseline, no shift) */}
          <div className="flex gap-2 -mt-0.5">
            {/* TodayOverview — unchanged */}
            <div className="w-[600px]">
              <TodayOverview />
            </div>

            {/* Map — fills remaining space of 1050px column */}
            <div className="w-[448px] mt-10">
              <MapCTA />
            </div>
          </div>
        </div>

        {/* RIGHT — RainPanel width in px */}
        <div className="w-[450px] h-[283.5px]">
          <RainPanel />
        </div>
      </div>
    </main>
  );
}