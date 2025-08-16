/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4F8AFA',
                accent: '#FFD166',
                background: '#F8FAFC',
            },
            fontFamily: {
                playful: ["'Baloo 2'", 'Comic Sans MS', 'cursive', 'sans-serif'],
            },
        },
    },
    plugins: [],
    darkMode: 'class',
};
