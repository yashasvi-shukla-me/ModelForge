import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        accent: {
          blue: "#3b82f6",
          green: "#22c55e",
          purple: "#8b5cf6",
          amber: "#d97706",
        },
      },
    },
  },
  plugins: [],
};

export default config;
