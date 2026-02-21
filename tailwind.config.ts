const config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        panel: '#0F0F0F',
        border: '#2A2A2A',
        text: '#FFFFFF',
        muted: '#BFBFBF',
      },
    },
  },
  plugins: [],
};

export default config;