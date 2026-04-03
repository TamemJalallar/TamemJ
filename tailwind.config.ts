import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        soft: "0 10px 28px rgba(114, 129, 86, 0.16)",
        card: "0 18px 46px rgba(114, 129, 86, 0.22)"
      },
      backgroundImage: {
        "mesh-soft":
          "radial-gradient(circle at 12% 10%, rgba(182,201,155,0.4), transparent 30%), radial-gradient(circle at 85% 15%, rgba(152,167,124,0.18), transparent 28%), radial-gradient(circle at 50% 100%, rgba(136,151,108,0.12), transparent 52%)"
      }
    }
  },
  plugins: []
};

export default config;
