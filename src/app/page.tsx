import TopBar from "@/components/TopBar";
import ForecastStrip from "@/components/ForecastStrip";
import RainPanel from "@/components/RainPanel";
import TodayOverview from "@/components/TodayOverview";
import MapCTA from "@/components/MapCTA";
import OtherCitiesPanel from "@/components/OtherCitiesPanel";

export default function Home() {
  return (
<div className="dot-bg min-h-screen">
    <main className="px-6 pb-2">
      <TopBar />

      <div className="flex gap-2 mt-6">
        <div className="w-[1050px]">
          <ForecastStrip />

          <div className="flex gap-4 -mt-0.5">
            <div className="w-[600px]">
              <TodayOverview />
            </div>

            <div className="w-[448px] mt-[76px]">
              <MapCTA />
            </div>
          </div>
        </div>

        <div className="w-[450px]">
          <div className="h-[283.5px]">
            <RainPanel />
          </div>

          <div className="mt-[30px]">
            <OtherCitiesPanel />
          </div>
        </div>
      </div>
    </main>
</div>
  );
}
