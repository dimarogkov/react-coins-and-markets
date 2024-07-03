/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                dark: '#1b262c',
                blue: '#5356ff',
                gray: '#ddd',
                light: '#f5f7f8',
            },
        },
    },
    plugins: [],
};
