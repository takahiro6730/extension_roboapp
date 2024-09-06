/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['NotoSansJP', 'noto-sans'],
      },
    },
  },
}