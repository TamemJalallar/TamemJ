import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 8px 24px rgba(15, 23, 42, 0.06)",
        card: "0 14px 40px rgba(15, 23, 42, 0.07)"
      },
      backgroundImage: {
        "mesh-soft":
          "radial-gradient(circle at 12% 10%, rgba(14,165,233,0.08), transparent 45%), radial-gradient(circle at 88% 18%, rgba(2,132,199,0.06), transparent 40%), radial-gradient(circle at 50% 100%, rgba(15,23,42,0.04), transparent 55%)"
      }
    }
  },
  plugins: []
};

export default config;
