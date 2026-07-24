import type { Config } from "tailwindcss";

// Confirmed exact values, pulled directly from Webflow's color picker.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midpoint: {
          dark: "#082121",        // u-surface-cyan_black — confirmed
          cyan: "#39EAE6",        // mid-cyan-block — confirmed
          "grey-100": "#CACDD5",  // light grey — updated from live-site scrape (2026-07-24), was #DADEDE
          "grey-400": "#6D7280",  // muted slate-grey (secondary text) — updated from live-site scrape (2026-07-24), was #526364
          // TODO: font family/weights still need verifying from
          // Site Settings -> Fonts.
        },
      },
      fontFamily: {
        sans: ["var(--font-primary)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1.5rem", // matches the rounded card corners seen on cards
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
