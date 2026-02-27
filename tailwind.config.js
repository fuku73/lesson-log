/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: { soft: "0 10px 30px rgba(0, 0, 0, 0.04)" },
      colors: {
        background: "#F7F5F2",
        card: "#FFFFFF",
        primary: "#6B8E7E",
        accent: "#D8C3A5",
        sub: "#EAE7DC",
        text: "#2E2E2E",
        muted: "#7A7A7A",
        border: "#E5E2DC"
      }
    }
  },
  plugins: []
};
