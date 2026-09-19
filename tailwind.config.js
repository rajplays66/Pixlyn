/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        handwritten: ["var(--font-handwritten)", "cursive"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        ink: "#1a1a1a",
        muted: "#6b6b6b",
        hairline: "#ececec",
        surface: "#ffffff",
        subtle: "#fafafa",
      },
      maxWidth: {
        feed: "980px",
      },
    },
  },
  plugins: [],
};
