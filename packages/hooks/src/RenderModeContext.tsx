"use client";

import { createContext, useContext } from "react";

// "edit"  -> đang render trong admin builder (Puck) -> hook không gọi API thật
// "live"  -> đang render ở storefront thật -> hook gọi API thật
export type RenderMode = "edit" | "live";

const RenderModeContext = createContext<RenderMode>("live");

export function RenderModeProvider({
  mode,
  children,
}: {
  mode: RenderMode;
  children: React.ReactNode;
}) {
  return (
    <RenderModeContext.Provider value={mode}>
      {children}
    </RenderModeContext.Provider>
  );
}

export function useRenderMode() {
  return useContext(RenderModeContext);
}
