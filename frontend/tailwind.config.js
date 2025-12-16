/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fafbfc",
          100: "#f3f5f8",
          200: "#e7ebf1",
          300: "#d1dae8",
          400: "#b1c2d8",
          500: "#7a8fa3",
          600: "#556b82",
          700: "#3d4d62",
          800: "#2a3445",
          900: "#1a2332",
        },
        accent: {
          50: "#fafaf9",
          100: "#f5f5f3",
          400: "#78716c",
          500: "#6f6e69",
          600: "#57534e",
          700: "#3f3f3c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        safe: "max(1rem, env(safe-area-inset-bottom))",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in",
        "slide-up": "slideUp 0.4s ease-out",
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
      },
    },
  },
  plugins: [],
};
