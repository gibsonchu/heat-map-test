'use client';

import { useState, useRef, useCallback } from 'react';

interface GeoSearchResult {
  label: string;
  coordinates: [number, number]; // [lng, lat]
  borough?: string;
}

interface Props {
  onSelect: (result: GeoSearchResult) => void;
}

const GEOSEARCH_AUTOCOMPLETE = 'https://geosearch.planninglabs.nyc/v2/autocomplete';

export function AddressSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (text: string) => {
    if (!text.trim() || text.length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const url = `${GEOSEARCH_AUTOCOMPLETE}?text=${encodeURIComponent(text)}&size=6`;
      const res = await fetch(url);
      const data = await res.json();
      const parsed: GeoSearchResult[] = (data.features || []).map(
        (f: { properties: { label: string; borough?: string }; geometry: { coordinates: [number, number] } }) => ({
          label: f.properties.label,
          coordinates: f.geometry.coordinates as [number, number],
          borough: f.properties.borough,
        })
      );
      setResults(parsed);
      setOpen(parsed.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (result: GeoSearchResult) => {
    setQuery(result.label);
    setResults([]);
    setOpen(false);
    onSelect(result);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm px-4">
      <div className="relative">
        <div className="flex items-center gap-2 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-200">
          <svg
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={handleChange}
            onFocus={() => results.length > 0 && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search NYC address or neighborhood…"
            className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
            aria-label="Search address"
            aria-autocomplete="list"
            aria-expanded={open}
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin flex-shrink-0" />
          )}
        </div>

        {open && results.length > 0 && (
          <ul
            role="listbox"
            className="absolute top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto"
          >
            {results.map((r, i) => (
              <li
                key={i}
                role="option"
                aria-selected={false}
                onMouseDown={() => handleSelect(r)}
                className="px-4 py-2.5 text-sm text-gray-800 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0"
              >
                {r.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
