import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#02071B",
        slateInk: "#071333",
        pearl: "rgba(255,255,255,0.92)",
        mist: "rgba(255,255,255,0.72)",
        haze: "rgba(255,255,255,0.55)",
        line: "rgba(96,178,255,0.22)",
        accent: "#34D3FF",
        accent2: "#2CE6B7",
      },
      boxShadow: {
        soft: "0 24px 70px rgba(0,0,0,.40)",
        soft2: "0 18px 50px rgba(0,0,0,.35)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        shimmer: "shimmer 1.25s ease-in-out infinite",
        breathe: "breathe 4.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
