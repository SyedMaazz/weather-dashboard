import { LayoutGrid, Bell, MapPin, Search, Moon } from "lucide-react";

export default function TopBar() {
  return (
    <div className="w-full">
      <div className="mx-auto flex items-center justify-between px-6 py-4 text-white">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">

          {/* ICON GROUP */}
          <div className="flex items-center gap-2">
            <button className="group w-9 h-9 flex items-center justify-center rounded-full border border-border bg-panel/40 transition-all duration-150 hover:bg-white/5 hover:border-white/40">
              <LayoutGrid size={16} className="opacity-70 group-hover:opacity-100 transition" />
            </button>

            <button className="group w-9 h-9 flex items-center justify-center rounded-full border border-border bg-panel/40 transition-all duration-150 hover:bg-white/5 hover:border-white/40">
              <Bell size={16} className="opacity-70 group-hover:opacity-100 transition" />
            </button>
          </div>

          {/* LOCATION */}
          <div className="flex items-center gap-2 px-3 h-9 rounded-full border border-border bg-panel/40 transition-all duration-150 hover:bg-white/5 hover:border-white/40">
            <MapPin size={14} className="opacity-70" />
            <span className="text-sm font-dot tracking-[0.14em]">
              Lucknow, Uttar Pradesh
            </span>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-[420px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
            />

            <input
              placeholder="Search City"
              className="
                w-full
                bg-panel/40
                border border-border
                rounded-full
                pl-9 pr-3 py-2
                text-sm
                outline-none
                placeholder:text-muted
                transition-all duration-150
                hover:border-white/40
                focus:border-blue-400
                focus:bg-black
                focus:shadow-[0_0_0_1px_#60a5fa]
              "
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">

          {/* THEME BUTTON */}
          <button className="group w-10 h-10 flex items-center justify-center rounded-full border border-border bg-panel/40 transition-all duration-150 hover:bg-white/5 hover:border-white/40">
            <Moon size={16} className="opacity-70 group-hover:opacity-100 transition" />
          </button>

          {/* PROFILE AVATAR */}
          <div className="w-10 h-10 rounded-full border border-border bg-white text-black flex items-center justify-center text-xs font-bold transition-all duration-150 hover:bg-[#FF0000]/90 hover:border-white">
            M
          </div>
        </div>

      </div>
    </div>
  );
}