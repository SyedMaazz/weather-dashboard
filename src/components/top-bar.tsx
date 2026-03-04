"use client";
import { MapPin, Search, Moon, Cog, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

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
  const [activeIndex, setActiveIndex] = useState(0); // 0 = first item pre-selected
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const locationLabel = [city, state].filter(Boolean).join(", ");

  // Reset active index to 0 (first item) whenever suggestions change
  useEffect(() => {
    setActiveIndex(0);
    itemRefs.current = [];
  }, [suggestions]);

  // Scroll active item into view
  useEffect(() => {
    if (showDropdown && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, showDropdown]);

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

  // Close on outside click
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

  const handleSelect = useCallback((s: Suggestion) => {
    onSearch(s.name);
    setQuery("");
    setShowDropdown(false);
    inputRef.current?.blur();
  }, [onSearch]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If dropdown is open, select the active item
    if (showDropdown && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex]);
      return;
    }
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

        {/* CENTER — LOCATION */}
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
                onKeyDown={handleKeyDown}
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
                    ref={(el) => { itemRefs.current[i] = el; }}
                    onMouseDown={() => handleSelect(s)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-white/[0.06] last:border-0 flex items-center gap-2 ${
                      i === activeIndex
                        ? "bg-white/[0.08] text-white"
                        : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <MapPin
                      size={12}
                      className={i === activeIndex ? "text-white/60 shrink-0" : "text-white/25 shrink-0"}
                    />
                    <span>
                      <span className="font-medium text-white">{s.name}</span>
                      <span className="text-white/40 ml-2 text-xs">
                        {s.display_name.split(",").slice(1).join(",").trim()}
                      </span>
                    </span>
                  </button>
                ))}

                {/* keyboard hint */}
                <div className="px-4 py-2 flex items-center gap-3 border-t border-white/[0.06]">
                  <span className="text-[10px] text-white/25 flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">↑↓</kbd> navigate
                  </span>
                  <span className="text-[10px] text-white/25 flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">↵</kbd> select
                  </span>
                  <span className="text-[10px] text-white/25 flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">esc</kbd> close
                  </span>
                </div>
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