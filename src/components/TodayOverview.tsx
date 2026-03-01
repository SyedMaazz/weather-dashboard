export default function TodayOverview() {
  return (
    <section className="mt-8 w-full max-w-[600px]">
      <h3 className="text-white text-lg mb-4">Today's Overview</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* AIR QUALITY */}
        <div className="bg-panel border border-border rounded-2xl p-4 flex flex-col justify-between">
          <p className="text-sm text-muted mb-2">Air quality</p>

          <div className="grid grid-cols-12 gap-[6px] py-2">
            {Array.from({ length: 72 }).map((_, i) => {
              const col = i % 12;

              let opacityClass = "bg-white/90"; // bright default

              if (col === 9) opacityClass = "bg-white/60"; // medium column
              if (col === 10) opacityClass = "bg-white/35"; // faint column
              if (col === 11) opacityClass = "bg-white/15"; // ghost column

              return (
                <div
                  key={i}
                  className={`w-[4px] h-[4px] rounded-full ${opacityClass}`}
                />
              );
            })}
          </div>

          <p className="text-sm text-white">
            201 <span className="text-muted">• Very Unhealthy</span>
          </p>
        </div>

        {/* UV INDEX */}
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
              <span className="absolute top-[-1px] right-[-1px] text-[10px] text-red-500">
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
          <div className="flex flex-col items-center justify-center flex-1 mr-5 mb-3">
            <svg width="160" height="80" viewBox="0 0 160 80" fill="none">
              {/* Cone lines from apex (left) spreading right */}
              <line
                x1="30"
                y1="40"
                x2="130"
                y2="10"
                stroke="white"
                strokeOpacity="0.7"
                strokeWidth="1.2"
              />
              <line
                x1="30"
                y1="40"
                x2="130"
                y2="70"
                stroke="white"
                strokeOpacity="0.7"
                strokeWidth="1.2"
              />

              {/* Arcs — centered on apex point (30, 40), curving right */}
              {/* Mid-outer arc */}
              <path
                d="M 115 16 A 88 88 0 0 1 115 64"
                stroke="white"
                strokeOpacity="0.9"
                strokeWidth="1.5"
              />
              {/* Mid arc */}
              <path
                d="M 100 22 A 72 72 0 0 1 100 58"
                stroke="white"
                strokeOpacity="0.9"
                strokeWidth="1"
              />
              {/* Inner white arc */}
              <path
                d="M 85 28 A 57 57 0 0 1 85 52"
                stroke="#E5161F"
                strokeOpacity="0.9"
                strokeWidth="1.5"
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
