import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        page: "rgb(var(--page) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        "fg-secondary": "rgb(var(--fg-secondary) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        disabled: "rgb(var(--disabled) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        "line-soft": "rgb(var(--line-soft) / <alpha-value>)",
        "line-strong": "rgb(var(--line-strong) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-2": "rgb(var(--card-2) / <alpha-value>)",
        "card-3": "rgb(var(--card-3) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          50: "#EEF4FF",
          100: "#DCE8FF",
          200: "#B9D2FF",
          300: "#84B1FF",
          400: "#4D8BFF",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
          800: "#1E3A8A",
          900: "#172554"
        },
        accent: {
          DEFAULT: "rgb(var(--accent-default) / <alpha-value>)",
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63"
        },
        neutral: {
          0: "#FFFFFF",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617"
        },
        success: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
          700: "#047857"
        },
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309"
        },
        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C"
        },
        info: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "Manrope", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "ui-monospace", "monospace"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.06)",
        card: "0 18px 46px rgba(15, 23, 42, 0.10)",
        glow: "0 10px 30px rgba(37, 99, 235, 0.18)",
        cta: "0 10px 30px rgba(37, 99, 235, 0.25)",
        "soft-dark": "0 10px 30px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "mesh-soft":
          "radial-gradient(circle at 84% 8%, rgba(37,99,235,0.08), transparent 28%), radial-gradient(circle at 10% 32%, rgba(6,182,212,0.05), transparent 24%), linear-gradient(180deg, #F8FAFC 0%, #F8FAFC 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #F8FAFC 0%, #EEF4FF 45%, #ECFEFF 100%)",
        "hero-gradient-dark":
          "linear-gradient(135deg, #020617 0%, #0F172A 45%, #0E7490 140%)"
      }
    }
  },
  plugins: []
};

export default config;
