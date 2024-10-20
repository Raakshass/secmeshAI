module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        secondary: '#28a745',
        background: '#f4f4f4',
      },
      boxShadow: {
        '3xl': '0 0 15px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'lg': '12px',
      },
      spacing: {
        '96': '24rem',
      },
    },
  },
  plugins: [],
};
