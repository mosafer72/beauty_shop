/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fontFamily: {
          vazir: ["var(--font-vazir)"],
        },
      },
    },
  },
  plugins: [],
};
