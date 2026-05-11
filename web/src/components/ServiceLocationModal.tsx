"use client";

import { useMemo, useState } from "react";
import { SERVICE_LOCATIONS, bookCopy, type Locale } from "@/lib/wiper";

type ServiceLocationModalProps = {
  open: boolean;
  locale: Locale;
  selected: string;
  onClose: () => void;
  onSelect: (zone: string) => void;
};

export function ServiceLocationModal({
  open,
  locale,
  selected,
  onClose,
  onSelect,
}: ServiceLocationModalProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...SERVICE_LOCATIONS];
    return SERVICE_LOCATIONS.filter((name) => name.toLowerCase().includes(q));
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#1E3951]/45 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loc-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="max-h-[85dvh] w-full max-w-lg overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_90px_rgba(30,57,81,0.28)] sm:rounded-[2rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#1E3951]/10 px-5 py-4">
          <h2 id="loc-modal-title" className="text-lg font-black text-[#1E3951]">
            {bookCopy.chooseLocation[locale]}
          </h2>
          <button
            type="button"
            className="focus-ring rounded-full border border-[#1E3951]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.14em]"
            onClick={onClose}
          >
            {bookCopy.back[locale]}
          </button>
        </div>
        <div className="px-5 py-3">
          <input
            type="search"
            className="focus-ring w-full rounded-2xl border border-[#1E3951]/10 bg-[#f7f7f6] px-4 py-3 text-sm font-bold text-[#1E3951] placeholder:text-[#1E3951]/38"
            placeholder={bookCopy.searchLocations[locale]}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <ul className="max-h-[min(52vh,22rem)] overflow-y-auto px-3 pb-4">
          {filtered.map((name) => (
            <li key={name}>
              <button
                type="button"
                className={`focus-ring mb-1 w-full rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                  selected === name ? "bg-[#FF007D]/14 text-[#FF007D]" : "bg-[#f7f7f6] text-[#1E3951] hover:bg-[#1E3951]/6"
                }`}
                onClick={() => {
                  onSelect(name);
                  setQuery("");
                  onClose();
                }}
              >
                {name}
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm font-bold text-[#1E3951]/45">
              {locale === "ar" ? "لا توجد نتائج" : "No matches"}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
