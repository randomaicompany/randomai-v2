export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        'bordered': 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
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
