import TopBar from '@/components/TopBar';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <TopBar />

      <section className="flex-1 p-6 grid grid-cols-12 gap-6">
        {/* LEFT MAIN PANEL */}
        <div className="col-span-8 flex flex-col gap-6">
          {/* Hero Temperature Block */}
          <div className="border border-border p-6 min-h-[180px] flex flex-col justify-between">
            <div className="text-sm uppercase tracking-widest text-muted">
              Today — Partly Cloudy
            </div>

            <div className="text-7xl font-bold">24°C</div>

            <div className="text-xs text-muted uppercase tracking-widest">
              Feels like 22° • H:28° L:19°
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-6">
            {['Humidity', 'Wind Speed', 'Visibility', 'Pressure'].map(
              (item) => (
                <div
                  key={item}
                  className="border border-border p-4 flex flex-col gap-2"
                >
                  <div className="text-xs uppercase tracking-widest text-muted">
                    {item}
                  </div>
                  <div className="text-2xl">--</div>
                </div>
              ),
            )}
          </div>

          {/* Hourly Forecast Placeholder */}
          <div className="border border-border p-6 min-h-[140px]">
            <div className="text-xs uppercase tracking-widest text-muted mb-4">
              Hourly Forecast
            </div>
            <div className="text-muted text-sm">
              Chart will go here
            </div>
          </div>

          {/* 5-Day Forecast Placeholder */}
          <div className="border border-border p-6 min-h-[140px]">
            <div className="text-xs uppercase tracking-widest text-muted mb-4">
              5-Day Forecast
            </div>
            <div className="text-muted text-sm">
              Forecast strip will go here
            </div>
          </div>
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* UV Index */}
          <div className="border border-border p-6 min-h-[120px]">
            <div className="text-xs uppercase tracking-widest text-muted">
              UV Index
            </div>
            <div className="text-3xl mt-2">6</div>
          </div>

          {/* Sunrise */}
          <div className="border border-border p-6 min-h-[120px]">
            <div className="text-xs uppercase tracking-widest text-muted">
              Sunrise
            </div>
            <div className="text-3xl mt-2">06:24</div>
          </div>

          {/* Sunset */}
          <div className="border border-border p-6 min-h-[120px]">
            <div className="text-xs uppercase tracking-widest text-muted">
              Sunset
            </div>
            <div className="text-3xl mt-2">19:47</div>
          </div>

          {/* Moon Phase */}
          <div className="border border-border p-6 min-h-[120px]">
            <div className="text-xs uppercase tracking-widest text-muted">
              Moon Phase
            </div>
            <div className="text-sm mt-2 text-muted">
              First Quarter
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}