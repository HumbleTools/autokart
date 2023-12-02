const colors = require("tailwindcss/colors");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'fastaction': ['fastaction']
      },
      colors: {
        primary: "#33c3f0",
        neutral: colors.gray,
        whitesmoke: "#f5f5f5",
      },
    },
  },
  plugins: [],
};
