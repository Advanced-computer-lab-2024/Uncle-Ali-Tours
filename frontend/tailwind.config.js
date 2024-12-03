/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
			transitionDuration: {
        '2000': '6000ms',
      },
animation: {
        'spin-slow': 'spin 14s linear infinite',
      },
		},
  },
  plugins: [],
}
