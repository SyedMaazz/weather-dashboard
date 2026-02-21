export default function MapCTA() {
  return (
    <div className="relative h-full min-h-[420px] rounded-2xl overflow-hidden border border-border bg-panel">

      {/* 🌍 DYNAMIC MAP (WINDY EMBED) */}
      <iframe
        className="absolute inset-0 w-full h-full"
        src="https://embed.windy.com/embed2.html?lat=26.85&lon=80.95&zoom=5&level=surface&overlay=wind&menu=&message=&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&detailLat=26.85&detailLon=80.95&metricWind=km%2Fh&metricTemp=%C2%B0C"
        frameBorder="0"
      />

      {/* 🌫️ DARK OVERLAY for readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* 📝 CONTENT */}
      <div className="relative h-full flex flex-col justify-between p-6">

        {/* TOP TEXT */}
        <div className="bg-white/80 text-black text-sm font-semibold rounded-xl px-4 py-3 max-w-[260px]">
          Explore global map of wind weather and ocean condition
        </div>

        {/* BUTTON */}
        <button className="self-start bg-white text-black font-semibold px-6 py-3 rounded-xl">
          GET STARTED
        </button>
      </div>
    </div>
  );
}