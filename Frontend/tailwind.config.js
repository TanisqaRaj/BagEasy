/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {colors: {
        darkblue: "#1A374D",
        midnight: "#406882",
        lightblue: "#6998AB",
        grey: "#ADCBD7",
        purple: "#9A55F3",
      },},
  },
  plugins: [],
}

