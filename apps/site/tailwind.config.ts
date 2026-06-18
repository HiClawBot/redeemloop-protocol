import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["SFMono-Regular", "ui-monospace", "Menlo", "monospace"],
      },
      colors: {
        paper: "#f3f6f9",
        chalk: "#ffffff",
        ink: "#0d1b2a",
        muted: "#5f6f7c",
        line: "#dce7ea",
        field: "#dff3ef",
        pine: "#0a7b6e",
        moss: "#5eb6aa",
        rust: "#0a7b6e",
        brass: "#0a7b6e",
        night: "#0d1b2a",
      },
      boxShadow: {
        panel: "0 20px 42px -26px rgba(13, 27, 42, 0.32)",
      },
    },
  },
  plugins: [],
};

export default config;
