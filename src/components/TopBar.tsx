import { MapPin, Search, Moon, Cog } from "lucide-react";

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="relative w-9 h-9 flex items-center justify-center group">
      {/* HOVER CIRCLE */}
      <span className="absolute inset-0 rounded-full bg-[#2C2F32] opacity-0 scale-75 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100" />

      {/* ICON */}
      <span className="relative text-white transition-colors duration-150 group-hover:text-[#E5161F]">
        {children}
      </span>
    </button>
  );
}

export default function TopBar() {
  return (
    <div className="w-full">
      <div className="mx-auto flex items-center justify-between px-6 py-4 text-white">
        {/* LEFT — LOGO + TITLE */}
        <div className="flex items-center gap-3 hover:cursor-pointer">
          {/* LOGO CIRCLE */}
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-xs font-bold font-headline text-[#E5161F]">
            M
          </div>

          {/* TITLE */}
          <span className="font-dot tracking-[0.08em] text-sm">
            nothing weather
          </span>
        </div>

        {/* CENTER — LOCATION */}
        <div className="flex items-center gap-2 text-sm font-dot ml-20 tracking-[0.14em]">
          <MapPin size={14} className="text-white/70" />
          <span>Lucknow, UttarPradesh</span>
        </div>

        {/* RIGHT — SEARCH + ICONS */}
        <div className="flex items-center gap-1">
          {/* SEARCH */}
          <div className="relative w-[420px] flex justify-end mr-2">
            <div
              className="
                flex items-center
                h-10
                bg-[#EDEDED]
                text-black
                rounded-full
                overflow-hidden
                transition-all duration-200
                w-[300px]
                focus-within:w-[420px]
                origin-right
              "
            >
              <Search size={16} className="ml-3 mr-2 text-black/70 shrink-0" />

              <input
                placeholder="Search City"
                className="
                  bg-transparent
                  outline-none
                  text-sm
                  w-full
                  pr-4
                  placeholder:text-black/60
                "
              />
            </div>
          </div>

          {/* MOON ICON */}
          <IconButton>
            <Moon size={18} strokeWidth={1} fill="currentcolor" />
          </IconButton>

          <IconButton>
            <Cog size={18} strokeWidth={1.8} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
