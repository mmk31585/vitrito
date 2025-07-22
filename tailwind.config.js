// tailwind.config.js
import { heroui } from "@heroui/theme";
import "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(button|card|input|ripple|spinner|form).js",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};
