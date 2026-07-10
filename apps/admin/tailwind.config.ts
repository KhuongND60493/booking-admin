import type { Config } from "tailwindcss";

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
        admin: {
          bg: "#F9FAFB",
          surface: "#FFFFFF",
          border: "#E5E7EB",
          ink: "#111827",
          "ink-soft": "#374151",
          muted: "#6B7280",
          "muted-soft": "#9CA3AF",
          success: "#16A34A",
          danger: "#EF4444",
          warning: "#F59E0B",
          info: "#2563EB",
        },
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
