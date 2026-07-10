"use client";

import { createContext, useContext } from "react";
import { fallbackLng, type AppLanguage } from "./settings";

interface I18nContextValue {
  lng: AppLanguage;
}

const I18nContext = createContext<I18nContextValue>({ lng: fallbackLng });

export function I18nProvider({
  lng = fallbackLng,
  children,
}: {
  lng?: AppLanguage;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ lng }}>{children}</I18nContext.Provider>
  );
}

export function useI18nContext() {
  return useContext(I18nContext);
}
