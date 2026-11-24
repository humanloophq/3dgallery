import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#09090B",
          900: "#0C0C10",
          800: "#121218",
          700: "#1A1A22",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          soft: "#A78BFA",
          deep: "#6D4BD8",
        },
        silver: "#D9D9E2",
        chalk: "#F7F7FA",
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial", "sans-serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"],
      },
      maxWidth: {
        editorial: "1600px",
      },
      letterSpacing: {
        tightest: "-0.055em",
        label: "0.18em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "scroll-cue": {
          "0%": { transform: "translateY(-60%)", opacity: "0" },
          "35%": { opacity: "1" },
          "100%": { transform: "translateY(180%)", opacity: "0" },
        },
        "slow-spin": {
          to: { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.5" },
          "70%": { transform: "scale(1.35)", opacity: "0" },
          "100%": { transform: "scale(1.35)", opacity: "0" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "scroll-cue": "scroll-cue 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        "slow-spin": "slow-spin 26s linear infinite",
        "pulse-ring": "pulse-ring 3.2s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
