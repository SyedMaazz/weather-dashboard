export default function RainPanel() {
  const hours = ["10AM", "11AM", "12AM", "01PM", "02PM", "03PM"];
  const bars = [40, 65, 35, 80, 55, 25];

  return (
    <section className="bg-panel border border-border rounded-2xl p-6 h-full flex flex-col">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-semibold">Chance Of Rain</p>

        <div className="flex gap-2 bg-panel border border-border rounded-full p-1">
          <button className="px-4 py-1 text-xs bg-white text-black rounded-full">
            Forecast
          </button>
          <button className="px-4 py-1 text-xs text-muted">
            Air Quality
          </button>
        </div>
      </div>

      {/* CHART AREA */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="relative h-48 w-full">
          
          {/* Y AXIS LABELS */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-muted pr-2">
            <span>Rainy</span>
            <span>Sunny</span>
            <span>Heavy</span>
          </div>

          {/* BARS + LINE */}
          <div className="ml-10 h-full flex items-end justify-between relative">
            
            {/* LINE GRAPH */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0,70 C10,65 20,75 30,40 C40,20 50,80 60,55 C70,35 80,85 100,70"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="1.5"
                opacity="0.9"
              />
            </svg>

            {/* BARS */}
            {bars.map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <div
                  className="bg-white/80 w-2 rounded-sm"
                  style={{ height: `${h * 1.6}px` }}
                />
                <p className="text-[10px] text-muted">{hours[i]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}