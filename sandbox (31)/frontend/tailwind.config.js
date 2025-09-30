/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        secondary: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
