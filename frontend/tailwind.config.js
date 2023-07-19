/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bmjua: ["BMJUA", "sans-serif"],
      },
      keyframes: {
        fade: { to: { opacity: 1 } },
        updown: {
          from: { "margin-top": 0 },
          to: { "margin-top": "-3rem" },
        },
        tilting: {
          from: { transform: "rotate(-35deg)" },
          to: { transform: "rotate(15deg)" },
        },
      },
      animation: {
        fade: "fade 100ms forwards",
        updown: "updown 1.4s infinite",
        tilting: "tilting 1s infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
