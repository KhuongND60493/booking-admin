// Tách riêng khỏi DevPreviewClient.tsx (import các container "use client" nặng) — dùng cho
// generateStaticParams() chạy ở Node lúc build, không cần load container thật.
export const DEV_PREVIEW_MODULE_KEYS = [
  "bookings",
  "bookings-new",
  "waitlist",
  "time-slots",
  "tables",
  "layout",
  "settings",
] as const;
