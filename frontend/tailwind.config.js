/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bmjua: ["BMJUA", "sans-serif"],
      },
      keyframes: {
        animeTextup: {
          "0%, 40%, 60%, 80%, 100%": { top: 0 },
          "20%": { top: "-1rem" },
        },
        fade: { to: { opacity: 1 } },
        updown: {
          from: { "margin-top": 0 },
          to: { "margin-top": "-1rem" },
        },
        tilting: {
          from: { transform: "rotate(-15deg)" },
        },
      },
      animation: {
        animeTextup: "animeTextup 1500ms infinite",
        fade: "fade 100ms forwards",
        updown: "updown 1.4s infinite",
        tilting: "tilting 1s infinite",
      },
    },
  },
  plugins: [],
};
