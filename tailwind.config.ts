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
        soft: "0 10px 28px rgba(43, 18, 76, 0.12)",
        card: "0 18px 46px rgba(43, 18, 76, 0.16)"
      },
      backgroundImage: {
        "mesh-soft":
          "radial-gradient(circle at 12% 10%, rgba(223,182,178,0.35), transparent 30%), radial-gradient(circle at 85% 15%, rgba(133,79,108,0.14), transparent 28%), radial-gradient(circle at 50% 100%, rgba(82,43,91,0.1), transparent 52%)"
      }
    }
  },
  plugins: []
};

export default config;
