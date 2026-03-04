/** @type {import('tailwindcss').Config} */
module.exports = {
  // Nota: Es crucial que estas rutas coincidan con tu estructura
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
