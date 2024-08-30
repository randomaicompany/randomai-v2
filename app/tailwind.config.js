export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        "brand-primary": "#3D3D3D",
        "brand-secondary": "#434D56",
        "brand-tertiary": "#A9B2B9",
        "brand-accent": "#CA3C4A",
        "brand-accent-light": "#ED7675",
        "brand-black": "#090B0D",
        "brand-black-2": "#1A2129",
        "brand-green": "#58885A",
        "brand-mint": "#E3EBE0",
        "brand-smoke": "#FAFAFA",
        "brand-smoke-darker": "#F2F2F2",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
