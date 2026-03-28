/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50: "#eff9f7",
          100: "#d5f0ea",
          200: "#abe0d5",
          300: "#75caba",
          400: "#44ad9b",
          500: "#2a9d8f",
          600: "#227c70",
          700: "#1e6860",
          800: "#1d554f",
          900: "#1a4743",
        },
        ink: {
          DEFAULT: "#1a3d38",
          muted: "#5c7a73",
        },
        danger: {
          50: "#fef2f2",
          500: "#b42318",
          600: "#912018",
          700: "#7f1d18",
        },
        accent: {
          warm: "#e9c46a",
        },
      },
      boxShadow: {
        card: "0 4px 6px -1px rgb(15 52 45 / 0.06), 0 14px 32px -6px rgb(15 52 45 / 0.1)",
        "card-sm": "0 2px 8px rgb(15 52 45 / 0.06)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
