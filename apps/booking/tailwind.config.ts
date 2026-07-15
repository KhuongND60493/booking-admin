import type { Config } from "tailwindcss";

// Theo BR-12 (SPEC-booking-multipage-admin-sidebar-rebuild): KHÔNG hardcode giá trị
// màu/font mặc định ở đây. Toàn bộ giá trị thật được set runtime (CSS variable) từ
// StoreTheme nhận qua @skybooking/api-client (xem packages/hooks/src/usePageTheme.ts).
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        surface: "var(--color-bg)",
        ink: "var(--color-text)",
        "ink-muted": "var(--color-text-muted)",
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
      },
    },
  },
  plugins: [],
};
export default config;
