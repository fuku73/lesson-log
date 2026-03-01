/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(74, 74, 74, 0.06)",
        "soft-lg": "0 15px 40px rgba(74, 74, 74, 0.08)"
      },
      colors: {
        primary: "#DDC7C4",
        "primary-dark": "#C4A99E",
        background: "#F5F3F0",
        card: "#FFFFFF",
        text: "#4A4A4A",
        muted: "#9B9B9B",
        sub: "#EAE6E1",
        border: "#DCD8D3",
        accent: "#E8D5D2"
      },
      fontFamily: {
        rounded: ["M PLUS Rounded 1c", "sans-serif"]
      }
    }
  },
  plugins: []
};
