/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      /* You can extend Tailwind’s default palette or typography here */
      colors: {
        brand: {
          DEFAULT: '#FF4E00',
          dark: '#C43D00'
        }
      }
    }
  },
  plugins: [
    /* Add any first‑party plugins you like.  Example: */
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ]
};

