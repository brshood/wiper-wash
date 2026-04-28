"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/wiper";

const STORAGE_KEY = "wiper-locale";

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "ar";
}

export function usePreferredLocale(defaultLocale: Locale = "en") {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return defaultLocale;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : defaultLocale;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  return { locale, setLocale, isRtl: locale === "ar" } as const;
}

export function toggleLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en";
}
