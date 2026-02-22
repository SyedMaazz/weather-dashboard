export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nothing: ["Nothing", "sans-serif"],
        dot: ["Nothing Dot", "sans-serif"],
      headline: ["NType82Headline", "sans-serif"],
        mono: ["Nothing Mono", "monospace"],
      },
      colors: {
        bg: "#000000",
        panel: "#111111",
        border: "#3A3A3A",
        text: "#FFFFFF",
        muted: "#9CA3AF",
      },
    },
  },
};