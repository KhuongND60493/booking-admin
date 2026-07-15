"use client";

import { useEffect } from "react";
import type { StoreTheme } from "@skybooking/api-client";

// Áp dụng theme (màu/font) nhận từ config lên DOM — theo BR-12
// (SPEC-booking-multipage-admin-sidebar-rebuild): KHÔNG hardcode màu/font,
// toàn bộ giá trị đến từ StoreTheme do Server Component tải qua storeThemeApi
// rồi truyền vào đây.
//
// `targetRef` optional: nếu có (vd: preview scoped trong admin), chỉ set CSS
// variable lên phần tử đó (cascade xuống con); nếu không, set lên <html> —
// dùng cho apps/booking, nơi toàn app chỉ thuộc 1 store.
export function usePageTheme(theme: StoreTheme | null, targetRef?: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!theme) return;
    const el: HTMLElement = targetRef?.current ?? document.documentElement;

    el.style.setProperty("--color-primary", theme.colors.primary);
    el.style.setProperty("--color-bg", theme.colors.background);
    el.style.setProperty("--color-text", theme.colors.text);
    el.style.setProperty("--color-text-muted", theme.colors.textMuted);
    el.style.setProperty("--font-heading", theme.fonts.heading);
    el.style.setProperty("--font-body", theme.fonts.body);

    // Nạp Google Fonts động theo tên font trong config (nếu là tên font thật,
    // không phải "inherit"/font hệ thống).
    const families = Array.from(new Set([theme.fonts.heading, theme.fonts.body])).filter(
      (f) => f && f !== "inherit"
    );
    families.forEach((family) => {
      const linkId = `gfont-${family.replace(/\s+/g, "-")}`;
      if (document.getElementById(linkId)) return;
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
        family
      )}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    });
  }, [theme, targetRef]);
}
