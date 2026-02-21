import TopBar from "@/components/TopBar";
import ForecastStrip from "@/components/ForecastStrip";
import RainPanel from "@/components/RainPanel";

export default function Home() {
  return (
    <main className="min-h-screen px-6 pb-10">
      <TopBar />

      {/* 🔧 PIXEL CONTROLLED LAYOUT */}
      <div className="flex gap-2 mt-6">

        {/* LEFT — ForecastStrip width in px */}
        <div className="w-[1050px]">
          <ForecastStrip />
        </div>

        {/* RIGHT — RainPanel width in px */}
        <div className="w-[450px]">
          <RainPanel />
        </div>

      </div>
    </main>
  );
}