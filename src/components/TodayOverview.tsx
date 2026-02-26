export default function TodayOverview() {
  return (
    <section className="mt-8 w-full max-w-[600px]">
      <h3 className="text-white text-lg mb-4">Today's Overview</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* AIR QUALITY */}
        <div className="bg-panel border border-border rounded-2xl p-4 flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">Air quality</p>

          <div className="grid grid-cols-10 gap-[6px] py-2">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className={`w-[4px] h-[4px] rounded-full ${
                  i > 40 ? "bg-white/20" : "bg-white/80"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-white">
            201 <span className="text-muted">• Very Unhealthy</span>
          </p>
        </div>

        <div className="bg-panel border border-border rounded-2xl p-4 h-[200px] flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">UV Index</p>

          <div className="flex items-center justify-center flex-1">
            <img
              src="/images/uv_index.svg"
              alt="UV Index"
              className="w-[140px] h-[80px] object-contain"
            />
          </div>

          <p className="text-sm text-white text-center">
            04 <span className="text-muted">• Moderate</span>
          </p>
        </div>

        {/* WIND SPEED */}
        <div className="bg-panel border border-border rounded-2xl p-4 h-[200px] flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">Wind speed</p>

          <div className="flex flex-col items-center justify-center flex-1">
            <div className="relative w-[90px] h-[90px] rounded-full border border-white/40 flex items-center justify-center">
              <div className="absolute top-[14px] right-[22px] w-[2px] h-[14px] bg-red-500 rotate-45" />
              <span className="absolute top-[6px] right-[10px] text-[10px] text-red-500">
                NE
              </span>
            </div>
          </div>

          <p className="text-sm text-white">
            9 km/h <span className="text-muted">• Calm</span>
          </p>
        </div>

        {/* VISIBILITY */}
        <div className="bg-panel border border-border rounded-2xl p-4 flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">Visibility</p>

          <div className="flex flex-col items-center justify-center flex-1">
            <svg width="120" height="60" viewBox="0 0 120 60">
              <path
                d="M10 50 Q60 10 110 50"
                stroke="white"
                strokeOpacity="0.2"
                fill="none"
              />
              <path
                d="M20 50 Q60 20 100 50"
                stroke="white"
                strokeOpacity="0.3"
                fill="none"
              />
              <path
                d="M30 50 Q60 30 90 50"
                stroke="white"
                strokeOpacity="0.5"
                fill="none"
              />
              <path
                d="M40 50 Q60 35 80 50"
                stroke="red"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          <p className="text-sm text-white">
            04 km{" "}
            <span className="text-muted">• Haze is affecting visibility</span>
          </p>
        </div>
      </div>
    </section>
  );
}