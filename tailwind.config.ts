import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#D92B83",
          pinkHover: "#C2186E",
          softPink: "#FDF2F8",
          yellow: "#FFB800",
          yellowHover: "#E5A600",
          softYellow: "#FFFBEB",
          navy: "#0F172A",
          slate: "#334155",
          muted: "#64748B",
          border: "#E2E8F0",
          bg: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
