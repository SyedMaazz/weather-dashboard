export default function RainPanel() {
  const data = [
    { time: "10AM", value: 35 },
    { time: "11AM", value: 65 },
    { time: "12AM", value: 25 },
    { time: "01PM", value: 80 },
    { time: "02PM", value: 60 },
    { time: "03PM", value: 20 },
  ];

  return (
    <section className="bg-panel border border-border rounded-3xl p-6 h-[283.5px] flex flex-col">
      <h3 className="text-[20px] font-headline tracking-[0.08em] mb-6">
        Chance Of Rain
      </h3>

      {/* CHART AREA */}
      <div className="relative flex-1">
        {/* GRID + LABELS */}
        <div className="absolute inset-0 pt-4 pb-12 flex flex-col justify-between">
          {["Rainy", "Sunny", "Heavy"].map((label) => (
            <div key={label} className="relative">
              <span className="absolute left-0 -top-3 text-sm text-muted font-dot tracking-[0.18em]">
                {label}
              </span>
              <div className="border-t border-dashed border-border/70 ml-16" />
            </div>
          ))}
        </div>

        {/* BARS + TIMES */}
        <div className="absolute left-16 right-0 bottom-0 flex items-end justify-between">
          {data.map((d) => (
            <div key={d.time} className="flex flex-col items-center gap-2">
              <div
                className="w-[6px] rounded-full bg-white/80"
                style={{ height: `${d.value * 1.8}px` }}
              />
              <span className="text-xs text-muted font-mono">{d.time}</span>
            </div>
          ))}
        </div>

        {/* LINE OVERLAY */}
        <svg
          className="absolute left-16 right-0 bottom-0 h-full w-[calc(100%-4rem)] pointer-events-none"
          viewBox="0 0 600 300"
          preserveAspectRatio="none"
        >
          <path
            d="M0,190
               C80,180 120,160 180,130
               C240,110 300,210 360,170
               C420,140 480,190 600,180"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}