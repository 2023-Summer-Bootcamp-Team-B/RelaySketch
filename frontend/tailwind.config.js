/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        hs: ["HS", "sans-serif"],
        crayon: ["crayon", "sans-serif"],
      },
      keyframes: {
        fade: { to: { opacity: 1 } },
        updown: {
          from: { "margin-top": 0 },
          to: { "margin-top": "-3rem" },
        },
        tilting: {
          from: { transform: "rotate(-30deg)" },
          to: { transform: "rotate(5deg)" },
        },

        handwriting: {
          "0%": { width: "0", opacity: "0" },
          "100%": { width: "100", opacity: "1" },
        },

        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        slider_left: {
          "0%": {
            transform: "translateX(0px)",
          },
          "50%": {
            transform: "translateX(-1400px)",
          },

          "100%": {
            transform: "translateX(0px)",
          },
        },

        slider_right: {
          "0%": {
            transform: "translateX(0px)",
          },
          "50%": {
            transform: "translateX(1400px)",
          },

          "100%": {
            transform: "translateX(0px)",
          },
        },

        slider_left_invisible: {
          "0%": {
            transform: "translateX(1000px)",
          },
          "50%": {
            transform: "translateX(-1400px)",
          },
          "100%": {
            transform: "translateX(1000px)",
          },
        },
      },
      animation: {
        fade: "fade 100ms forwards",
        updown: "updown 1.4s infinite",
        tilting: "tilting 1s infinite",
        slider_left: "slider_left 120s linear infinite",
        slider_right: "slider_right 120s linear infinite",
        slider_left_fast: "slider_left 60s linear infinite",
        slider_left_invisible: "slider_left_invisible 60s linear infinite",
        wiggle: "wiggle 3s linear infinite",
        crayon: ["crayon", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
