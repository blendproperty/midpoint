import type { Config } from "tailwindcss";

// NOTE: colors below are close approximations pulled from screenshots.
// Replace with exact hex values from Webflow's Style Manager (Site Settings ->
// Style Guide, or click each swatch used by "u-surface-cyan_black" /
// "mid-cyan-block" / "Button 5" / etc. to copy the exact hex) for a true
// pixel-match.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midpoint: {
          dark: "#0B1F1C",      // dark navy/teal card background — VERIFY
          cyan: "#2EE6D6",      // bright cyan card background — VERIFY
          "cyan-light": "#7CF5E8", // lighter cyan gradient accent — VERIFY
          blue: "#3B82F6",      // button blue — VERIFY
          "grey-400": "#6B7280", // body copy grey — VERIFY (cl-grey-400)
        },
      },
      fontFamily: {
        sans: ["var(--font-primary)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
