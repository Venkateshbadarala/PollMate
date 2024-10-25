/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      
      screens: {
        'x-sm': '310px',
        'sm': '640px',
        'md': '1024px',
        'lg': '1280px',
      },
    },
  },
  plugins: [],
};
