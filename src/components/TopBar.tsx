import { LayoutGrid, Bell, MapPin, Search, Moon } from "lucide-react";

export default function TopBar() {
  return (
    <div className="w-full border-white bg-black">
      <div className="max-w-8xl mx-auto flex items-center justify-between px-6 py-4 text-white">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">

          {/* ICON GROUP */}
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-white">
              <LayoutGrid size={16} />
            </button>

            <button className="w-9 h-9 flex items-center justify-center rounded-full border border-white">
              <Bell size={16} />
            </button>
          </div>

          {/* LOCATION */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} />
            <span className="font-medium">Lucknow, Uttar Pradesh</span>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-[420px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white"
            />
            <input
              placeholder="Search City"
              className="
                w-full
                bg-black
                border border-white
                rounded-lg
                pl-9 pr-3 py-2
                text-sm
                outline-none
                placeholder:text-gray-300
              "
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">

          {/* THEME BUTTON */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-white">
            <Moon size={16} />
          </button>

          {/* PROFILE AVATAR */}
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold">
            M
          </div>
        </div>

      </div>
    </div>
  );
}