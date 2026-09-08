/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#16231C",
          light: "#3D4A42",
          faint: "#748077",
        },
        paper: {
          DEFAULT: "#F6F7F2",
          card: "#FFFFFF",
          line: "#E4E7DF",
        },
        bazaar: {
          50: "#EEF6F0",
          100: "#D6EBDD",
          200: "#A9D6B7",
          300: "#75BC8C",
          400: "#3E9A63",
          500: "#1F7A4D",
          600: "#186640",
          700: "#135233",
          800: "#0E3F27",
          900: "#0A301E",
        },
        tag: {
          DEFAULT: "#E8A33D",
          dark: "#C9822A",
          light: "#FBEBD1",
        },
        alert: {
          DEFAULT: "#C1502E",
          light: "#F7E3DB",
        },
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        tag: "6px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,35,28,0.04), 0 8px 24px -12px rgba(22,35,28,0.12)",
        cardHover: "0 4px 8px rgba(22,35,28,0.06), 0 16px 32px -16px rgba(22,35,28,0.18)",
      },
    },
  },
  plugins: [],
};
