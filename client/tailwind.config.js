/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#0df2a6",
        critical: "#ff3366",
        warning: "#ffb703",
        muted: "#64748b",

        surface: "#111826",
        "surface-hover": "#1e293b",

        "background-dark": "#080c13",
      },

      fontFamily: {
        body: ["Outfit", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      animation: {
        radar: "radar 5s linear infinite",
        pulseSlow: "pulse 3s infinite",
      },

      keyframes: {
        radar: {
          "0%": {
            transform: "rotate(0deg)",
          },

          "100%": {
            transform: "rotate(360deg)",
          },
        },
      },
    },
  },

  plugins: [],
};