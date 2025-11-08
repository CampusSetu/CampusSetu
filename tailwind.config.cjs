const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        md: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'Inter Variable'", ...defaultTheme.fontFamily.sans],
        display: ["'Clash Display'", "'Inter Variable'", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          50: "#f5f8ff",
          100: "#e8eeff",
          200: "#cddaff",
          300: "#a3bbff",
          400: "#7999ff",
          500: "#4c72ff",
          600: "#2E6BFF",
          700: "#1f49c7",
          800: "#162f8a",
          900: "#0d1b57",
        },
        accent: {
          50: "#fff7eb",
          100: "#ffe9c4",
          200: "#ffd38b",
          300: "#ffb85a",
          400: "#ff9a2e",
          500: "#f17816",
          600: "#cd530e",
          700: "#a3360d",
        },
        slate: {
          50: "#f8f9fb",
          100: "#eff2f8",
          200: "#dbe2f0",
          300: "#c1cce0",
          400: "#98aac4",
          500: "#6f839f",
          600: "#4e5e78",
          700: "#37445a",
          800: "#252f3c",
          900: "#161c25",
          950: "#080b16",
        },
        neutral: {
          50: "#f6f7f9",
          100: "#eceff3",
          200: "#d6dae1",
          300: "#b7bcc8",
          400: "#9197a5",
          500: "#6b7280",
          600: "#505662",
          700: "#3a404c",
          800: "#272b35",
          900: "#181b22",
        },
        success: "#22c55e",
        warning: "#f97316",
        danger: "#ef4444",
        muted: "#6B7280",
        surface: "#f8fafc",
      },
      boxShadow: {
        card: "0 18px 36px -22px rgba(18, 28, 45, 0.28)",
        soft: "0 20px 42px -24px rgba(40, 60, 120, 0.22)",
        elevated: "0 42px 70px -32px rgba(11, 16, 28, 0.45)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,0.08)",
        focus: "0 0 0 8px rgba(76, 114, 255, 0.08)",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.5rem",
        full: "999px",
      },
      backgroundImage: {
        "gradient-glow": "radial-gradient(circle at top, rgba(76, 114, 255, 0.22), transparent 55%), radial-gradient(circle at 20% 80%, rgba(255, 154, 46, 0.2), transparent 60%)",
        "gradient-surface": "linear-gradient(135deg, rgba(76,114,255,0.08) 0%, rgba(255,255,255,0.9) 45%, rgba(255,154,46,0.08) 100%)",
        "grain-overlay": "radial-gradient(circle at 20% 20%, rgba(76,114,255,0.12), transparent 60%), radial-gradient(circle at 80% 0%, rgba(21, 94, 239, 0.08), transparent 65%), radial-gradient(circle at 50% 100%, rgba(255,154,46,0.12), transparent 60%)",
      },
      animation: {
        fade: "fade 400ms ease-in-out",
        "slide-up": "slideUp 420ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fade: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
