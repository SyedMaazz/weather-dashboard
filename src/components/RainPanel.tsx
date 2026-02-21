export default function RainPanel() {
  const bars = [45, 70, 35, 85, 60, 25];
  const times = ["10AM", "11AM", "12AM", "01PM", "02PM", "03PM"];

  return (
    <section className="h-full bg-panel border border-border rounded-3xl p-6 flex flex-col">
      {/* HEADER */}
      <h3 className="text-lg font-semibold mb-6">Chance Of Rain</h3>

      {/* CHART AREA */}
      <div className="relative flex-1 flex">
        {/* LEFT LABELS */}
        <div className="w-16 flex flex-col justify-between text-sm text-muted font-medium pr-2">
          <span className="mt-1">Rainy</span>
          <span className="mt-6">Sunny</span>
          <span className="mb-8">Heavy</span>
        </div>

        {/* RIGHT CHART */}
        <div className="flex-1 relative">
          {/* DOTTED GUIDE LINES */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-dashed border-white/10" />
            <div className="border-t border-dashed border-white/10" />
            <div className="border-t border-dashed border-white/10" />
          </div>

          {/* BARS */}
          <div className="absolute inset-0 flex items-end justify-between px-2 pb-8">
            {bars.map((h, i) => (
              <div
                key={i}
                className="w-2 rounded-full bg-white/80"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          {/* SMOOTH LINE (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full pb-8"
            viewBox="0 0 300 150"
            preserveAspectRatio="none"
          >
            <path
              d="M0,110 
                 C40,100 60,90 80,70
                 C100,50 120,55 140,80
                 C160,105 180,95 200,75
                 C220,55 240,65 260,85
                 C280,105 300,100 300,100"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* TIME LABELS */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted px-1">
            {times.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}