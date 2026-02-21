export default function TodayOverview() {
  return (
    <section className="mt-8 w-full max-w-[600px]">
      <h3 className="text-white text-lg mb-4">Today's Overview</h3>

      {/* GRID — 2 columns inside 600px */}
      <div className="grid grid-cols-2 gap-4">

        {/* WIND STATUS */}
        <div className="bg-panel border border-border rounded-2xl p-4 flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">Wind Status</p>

          {/* BARS */}
          <div className="flex items-end gap-[3px] h-[60px]">
            {[8, 14, 20, 26, 32, 36, 32, 26, 20, 14, 8].map((h, i) => (
              <div
                key={i}
                className="w-[3px] bg-white/70 rounded-full"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          <div className="flex justify-between text-xs text-muted mt-3">
            <span>7.50 km/h</span>
            <span>6:20 AM</span>
          </div>
        </div>

        {/* UV INDEX */}
        <div className="bg-panel border border-border rounded-2xl p-4 h-[200px] flex flex-col items-center justify-center">
          <p className="text-sm text-muted self-start mb-2">UV Index</p>

          {/* RING */}
          <div className="relative w-[110px] h-[110px] flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[10px] border-white/10" />
            <div
              className="absolute inset-0 rounded-full border-[10px] border-blue-400 border-t-transparent border-l-transparent rotate-[45deg]"
            />
            <span className="text-sm text-white">5.50 UV</span>
          </div>
        </div>

        {/* HUMIDITY */}
        <div className="bg-panel border border-border rounded-2xl p-4 h-[200px] flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">Humidity</p>

          <div className="flex flex-col items-start gap-2">
            <div className="text-2xl">💧</div>
            <p className="text-lg font-medium text-white">84%</p>
            <p className="text-xs text-muted">
              The dew point is 27° right now
            </p>
          </div>
        </div>

        {/* VISIBILITY */}
        <div className="bg-panel border border-border rounded-2xl p-4 flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">Visibility</p>

          <div className="flex flex-col items-start gap-2">
            <div className="text-2xl">🌫️</div>
            <p className="text-lg font-medium text-white">04 km</p>
            <p className="text-xs text-muted">
              Haze is affecting visibility
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}