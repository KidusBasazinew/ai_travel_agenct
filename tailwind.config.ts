// import type { Config } from "tailwindcss";

// const config: Config = {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "var(--background)",
//         foreground: "var(--foreground)",
//       },
//     },
//   },
//   plugins: [],
// };
// export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // light
        "light-100": "var(--color-light-100)",
        "light-200": "var(--color-light-200)",
        "light-300": "var(--color-light-300)",
        "light-400": "var(--color-light-400)",
        "light-500": "var(--color-light-500)",

        // dark
        "dark-100": "var(--color-dark-100)",
        "dark-200": "var(--color-dark-200)",
        "dark-300": "var(--color-dark-300)",
        "dark-400": "var(--color-dark-400)",

        // gray
        "gray-100": "var(--color-gray-100)",
        "gray-200": "var(--color-gray-200)",
        "gray-500": "var(--color-gray-500)",
        "gray-700": "var(--color-gray-700)",

        // primary
        "primary-50": "var(--color-primary-50)",
        "primary-100": "var(--color-primary-100)",
        "primary-500": "var(--color-primary-500)",

        // success
        "success-50": "var(--color-success-50)",
        "success-500": "var(--color-success-500)",
        "success-700": "var(--color-success-700)",

        // pink
        "pink-50": "var(--color-pink-50)",
        "pink-500": "var(--color-pink-500)",

        // navy
        "navy-50": "var(--color-navy-50)",
        "navy-500": "var(--color-navy-500)",

        // red
        "red-50": "var(--color-red-50)",
        "red-100": "var(--color-red-100)",
        "red-500": "var(--color-red-500)",
      },
    },
  },
  plugins: [],
};
