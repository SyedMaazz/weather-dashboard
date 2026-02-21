import TopBar from "@/components/TopBar";
import ForecastStrip from "@/components/ForecastStrip";
import RainPanel from "@/components/RainPanel";

export default function Home() {
  return (
    <main className="min-h-screen px-6 pb-10">
      <TopBar />

      <div className="grid grid-cols-12 gap-6 mt-6 items-stretch">
        <div className="col-span-8">
          <ForecastStrip />
        </div>

        <div className="col-span-4">
          <RainPanel />
        </div>
      </div>
    </main>
  );
}