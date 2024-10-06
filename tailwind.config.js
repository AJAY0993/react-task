/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        tanis: ["Tinos", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
}