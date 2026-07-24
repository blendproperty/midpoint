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
          "grey-100": "#DADEDE",  // light grey/off-white — confirmed
          "grey-400": "#526364",  // muted slate-teal (secondary text) — confirmed
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
    },
  },
  plugins: [],
};

export default config;
