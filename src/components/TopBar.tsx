export default function TopBar() {
  return (
    <header className="w-full border-b border-border px-6 py-4 flex items-center justify-between">
      {/* Left: Search */}
      <div className="flex items-center gap-4 w-1/3">
        <input
          type="text"
          placeholder="SEARCH CITY"
          className="w-full bg-transparent border-b border-border text-sm tracking-widest uppercase placeholder-muted focus:outline-none focus:border-white"
        />
      </div>

      {/* Center: City + Time */}
      <div className="text-sm tracking-widest uppercase text-muted">
        DELHI, IN — 12:45
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-6 text-sm tracking-widest uppercase">
        <button className="text-muted hover:text-white">°C</button>
        <button className="text-muted hover:text-white">°F</button>
        <button className="text-muted hover:text-white">LOC</button>
      </div>
    </header>
  );
}