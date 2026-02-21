import TopBar from '@/components/TopBar';
import ForecastStrip from '@/components/ForecastStrip';
import RainPanel from '@/components/RainPanel';

export default function Home() {
  return (
    <main className="min-h-screen">
      <TopBar />

      <section className="max-w-[1400px] mx-auto px-6 mt-6 grid grid-cols-12 gap-6">
        {/* LEFT SIDE */}
        <div className="col-span-12 lg:col-span-8">
          <ForecastStrip />
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-12 lg:col-span-4">
          <RainPanel />
        </div>
      </section>
    </main>
  );
}