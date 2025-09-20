/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FFE066', // yellow
          DEFAULT: '#FFB300', // orange
          dark: '#FF8800', // deep orange
        },
        accent: {
          light: '#FFF9E3', // off-white
          DEFAULT: '#FFF', // white
        },
        brown: {
          light: '#BCA177',
          DEFAULT: '#8D6748',
          dark: '#5C4321',
        },
      },
    },
  },
  plugins: [],
}

