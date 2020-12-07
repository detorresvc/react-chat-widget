module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
       },
       maxWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
       },
       minWidth: {
        '80': '20rem',
       }
    },
    
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
