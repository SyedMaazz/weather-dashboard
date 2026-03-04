"use client";
import { MapPin, Search, Moon, Cog, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

function IconButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="relative w-9 h-9 flex items-center justify-center group">
      <span className="absolute inset-0 rounded-full bg-[#2C2F32] opacity-0 scale-75 transition-all duration-150 group-hover:opacity-100 group-hover:scale-100" />
      <span className="relative text-white transition-colors duration-150 group-hover:text-[#E5161F]">
        {children}
      </span>
    </button>
  );
}

interface TopBarProps {
  city: string;
  state?: string;
  country?: string;
  onSearch: (city: string) => void;
  onLocate: () => void;
  loading?: boolean;
}

export default function TopBar({ city, state, country, onSearch, onLocate, loading }: TopBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
      setQuery("");
      inputRef.current?.blur();
    }
  };

  const locationLabel = [city, state, country].filter(Boolean).join(", ");

  return (
    <div className="w-full">
      <div className="mx-auto flex items-center justify-between px-6 py-4 text-white">
        {/* LEFT — LOGO */}
        <div className="flex items-center gap-3 hover:cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-xs font-bold font-headline text-[#E5161F]">
            M
          </div>
          <span className="font-dot tracking-[0.08em] text-sm">nothing weather</span>
        </div>

        {/* CENTER — LOCATION */}
        <div className="flex items-center gap-2 text-sm font-dot ml-20 tracking-[0.14em]">
          {loading ? (
            <Loader2 size={14} className="text-white/70 animate-spin" />
          ) : (
            <MapPin size={14} className="text-white/70" />
          )}
          <span className="transition-all duration-300">{locationLabel || "Locating…"}</span>
        </div>

        {/* RIGHT — SEARCH + ICONS */}
        <div className="flex items-center gap-1">
          <form onSubmit={handleSearch} className="relative w-[420px] flex justify-end mr-2">
            <div className="flex items-center h-10 bg-[#EDEDED] text-black rounded-full overflow-hidden transition-all duration-200 w-[300px] focus-within:w-[420px] origin-right">
              <Search size={16} className="ml-3 mr-2 text-black/70 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search City"
                className="bg-transparent outline-none text-sm w-full pr-4 placeholder:text-black/60"
              />
            </div>
          </form>

          {/* locate button */}
          <IconButton onClick={onLocate}>
            <MapPin size={18} strokeWidth={1.5} />
          </IconButton>

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