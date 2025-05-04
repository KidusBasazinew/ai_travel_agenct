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
  images: {
    domains: ["lh3.googleusercontent.com"], // Add this line
  },
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
      backgroundImage: {
        auth: 'url("/assets/images/auth-img.webp")',
        hero: 'url("/assets/images/hero-img.png")',
        "card-1": 'url("/assets/images/card-img-1.png")',
        "card-2": 'url("/assets/images/card-img-2.png")',
        "card-3": 'url("/assets/images/card-img-3.png")',
        "card-4": 'url("/assets/images/card-img-4.png")',
        "card-5": 'url("/assets/images/card-img-5.png")',
        "card-6": 'url("/assets/images/card-img-6.png")',
        "linear-100":
          "linear-gradient(105deg, rgba(207, 241, 255, 0.8) 14.17%, rgba(255, 255, 255, 0) 54.71%)",
        "linear-200":
          "linear-gradient(39deg, rgba(3, 3, 3, 0.54) -3.66%, rgba(6, 6, 6, 0) 45.57%)",
      },
      boxShadow: {
        100: "0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)",
        200: "0px 12px 16px -4px rgba(16, 24, 40, 0.1), 0px 4px 20px -2px rgba(16, 24, 40, 0.2)",
        300: "0px 2px 30px 0px rgba(0, 0, 0, 0.05)",
        400: "0px 2px 6px 0px rgba(13, 10, 44, 0.08)",
        500: "0px 12px 16px -4px rgba(16, 24, 40, 0.1)",
      },
      borderRadius: {
        20: "20px",
      },
    },
  },
  plugins: [],
};
