export default function OtherCitiesPanel() {
  const cities = [
    {
      country: "China",
      city: "Beijing",
      condition: "Cloudy",
      icon: "🌧️",
    },
    {
      country: "US",
      city: "California",
      condition: "Windly",
      icon: "🌬️",
    },
    {
      country: "Dubai",
      city: "Arab Emirates",
      condition: "Mostly Sunny",
      icon: "⛅",
    },
    {
      country: "Canada",
      city: "Charlottetown",
      condition: "Light SnowShower",
      icon: "🌨️",
    },
  ];

  return (
    <section className="mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-white">Other Cities</h3>
        <button className="text-xs text-muted hover:text-white">
          See All
        </button>
      </div>

      {/* CITY CARDS */}
      <div className="space-y-3">
        {cities.map((c) => (
          <div
            key={c.city}
            className="bg-panel border border-border rounded-2xl px-4 py-5 flex items-center justify-between"
          >
            {/* LEFT TEXT */}
            <div>
              <p className="text-[10px] text-muted">{c.country}</p>
              <p className="text-sm font-medium text-white">{c.city}</p>
              <p className="text-xs text-muted">{c.condition}</p>
            </div>

            {/* RIGHT ICON */}
            <div className="text-2xl">{c.icon}</div>
          </div>
        ))}
      </div>
    </section>
  );
}