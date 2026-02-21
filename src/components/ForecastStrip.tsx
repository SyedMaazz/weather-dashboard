export default function ForecastStrip() {
  const days = [
    { day: "SAT", temp: "10°" },
    { day: "SUN", temp: "15°" },
    { day: "MON", temp: "11°" },
    { day: "TUE", temp: "10°" },
    { day: "WED", temp: "12°" },

    /* remaining days of month (example) */
    { day: "THU", temp: "10°" },
    { day: "FRI", temp: "14°" },
  ];

  return (
    <section className="w-full">
      {/* TOP ROW */}
      <div className="flex items-center justify-between mb-6">
        {/* LEFT TABS */}
        <div className="flex gap-6 text-sm">
          <button className="text-white">Today</button>
          <button className="text-muted hover:text-white">Tomorrow</button>
          <button className="text-white font-semibold border-b border-white pb-1">
            Next 7days
          </button>
        </div>

        {/* RIGHT TOGGLE */}
        <div className="flex gap-2 bg-panel border border-border rounded-full p-1">
          <button className="px-4 py-1 text-xs bg-white text-black rounded-full">
            Forecast
          </button>
          <button className="px-4 py-1 text-xs text-muted">Air Quality</button>
        </div>
      </div>

      {/* MAIN ROW */}
      <div className="flex gap-6 w-full">
        {/* TODAY CARD (FIXED) */}
        {/* TODAY CARD */}
        <div className="min-w-[260px] bg-panel border border-border rounded-2xl p-6 flex flex-col justify-between">
          {/* TOP ROW */}
          <div className="flex justify-between text-sm text-muted">
            <span>Friday</span>
            <span>11:45 AM</span>
          </div>

          {/* TEMP + ICON */}
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-5xl font-medium">16°</h2>
            <div className="text-3xl">⛅</div>
          </div>

          {/* BOTTOM GRID */}
          <div className="grid grid-cols-2 gap-x-6 mt-4 text-xs text-muted">
            {/* LEFT COLUMN */}
            <div className="space-y-1">
              <p>Real Feel 18°</p>

              <p className="whitespace-nowrap">
                Wind N-E <span className="text-white">6-7 km/h</span>
              </p>

              <p>Pressure 100MB</p>
              <p>Humidity 51%</p>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-1 text-right">
              <p>
                Sunrise <span className="text-white">5:30AM</span>
              </p>
              <p>
                Sunset <span className="text-white">6:45</span>
              </p>
            </div>
          </div>
        </div>

        {/* SCROLLABLE DAYS */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {days.map((d, i) => (
            <div
              key={i}
              className="min-w-[120px] bg-panel border border-border rounded-2xl p-4 flex flex-col items-center justify-between"
            >
              <p className="text-sm text-muted">{d.day}</p>

              <div className="text-2xl my-4">☁️</div>

              <p className="text-lg font-medium">{d.temp}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
