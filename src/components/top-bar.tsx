"use client";
import { MapPin, Search, Moon, Cog, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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

interface Suggestion {
  display_name: string;
  name: string;
}

interface TopBarProps {
  city: string;
  state?: string;
  country?: string;
  onSearch: (city: string) => void;
  onLocate: () => void;
  loading?: boolean;
}

export default function TopBar({ city, state, onSearch, onLocate, loading }: TopBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fetchingDropdown, setFetchingDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const locationLabel = [city, state].filter(Boolean).join(", ");

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setFetchingDropdown(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`,
          { headers: { "User-Agent": "NothingWeatherApp/1.0", "Accept-Language": "en" } }
        );
        const data = await res.json();
        const seen = new Set<string>();
        const mapped: Suggestion[] = data
          .map((item: any) => {
            const addr = item.address || {};
            const name = addr.city || addr.town || addr.village || addr.county || item.name;
            const display = [name, addr.state, addr.country].filter(Boolean).join(", ");
            return { display_name: display, name };
          })
          .filter((s: Suggestion) => {
            if (seen.has(s.display_name)) return false;
            seen.add(s.display_name);
            return true;
          });
        setSuggestions(mapped);
        setShowDropdown(mapped.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setFetchingDropdown(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (s: Suggestion) => {
    onSearch(s.name);
    setQuery("");
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
      setQuery("");
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto flex items-center justify-between px-6 py-4 text-white">
        {/* LEFT — LOGO */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-xs font-bold font-headline text-[#E5161F]">M</div>
          <span className="font-dot tracking-[0.08em] text-sm">nothing weather</span>
        </div>

        {/* CENTER — LOCATION (click to geolocate) */}
        <button
          onClick={onLocate}
          className="flex items-center gap-2 text-sm font-dot ml-20 tracking-[0.14em] hover:text-white/70 transition-colors duration-150"
        >
          {loading
            ? <Loader2 size={14} className="text-white/70 animate-spin" />
            : <MapPin size={14} className="text-white/70" />
          }
          <span>{locationLabel || "Locating…"}</span>
        </button>

        {/* RIGHT — SEARCH + ICONS */}
        <div className="flex items-center gap-1">
          <div className="relative w-[420px] flex justify-end mr-2">
            <form
              onSubmit={handleSubmit}
              className="flex items-center h-10 bg-[#EDEDED] text-black rounded-full overflow-hidden transition-all duration-200 w-[300px] focus-within:w-[420px] origin-right"
            >
              {fetchingDropdown
                ? <Loader2 size={16} className="ml-3 mr-2 text-black/50 shrink-0 animate-spin" />
                : <Search size={16} className="ml-3 mr-2 text-black/70 shrink-0" />
              }
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                placeholder="Search City"
                className="bg-transparent outline-none text-sm w-full pr-4 placeholder:text-black/60"
                autoComplete="off"
              />
            </form>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-12 right-0 w-full bg-[#111] border border-border rounded-2xl overflow-hidden z-50 shadow-2xl"
              >
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onMouseDown={() => handleSelect(s)}
                    className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/[0.06] hover:text-white transition-colors border-b border-white/[0.06] last:border-0 flex items-center gap-2"
                  >
                    <MapPin size={12} className="text-white/30 shrink-0" />
                    <span>
                      <span className="font-medium text-white">{s.name}</span>
                      <span className="text-white/40 ml-2 text-xs">
                        {s.display_name.split(",").slice(1).join(",").trim()}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <IconButton><Moon size={18} strokeWidth={1} fill="currentcolor" /></IconButton>
          <IconButton><Cog size={18} strokeWidth={1.8} /></IconButton>
        </div>
      </div>
    </div>
  );
}