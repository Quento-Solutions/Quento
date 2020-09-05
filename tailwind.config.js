/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  important: true,
  theme: {
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxlmin: '1351px',
      xxlmax: { max: '1350px' }
    },
    fontFamily: {
      display: ['Quicksand', 'sans-serif'],
      body: ['Quicksand', 'sans-serif'],
      'ginger' : ['ginger-light', 'sans-serif'],
      'ginger-n' : ['ginger-normal', 'sans-serif'],
      'ginger-b' : ['ginger-bold', 'sans-serif'],
      'open': ['Open Sans']
    },
    borderWidth: {
      default: '1px',
      '0': '0',
      '2': '2px',
      '4': '4px'
    },
    borderRadius: {
      'super': '1.25rem',
    },
    extend: {
      colors: {
        cyan: '#9cdbff',
        grey: '#eeeeee'
      },
      spacing: {
        '96': '24rem',
        '128': '32rem',
        '100%': '100%',
        '50%': '49%',
        '33%': '32.9%'
      },
      height: {
        '84': '22rem'
      },
      width: {
        '3/2': '150%',
        '4/2': '200%',
        '1/2-screen': '50vw'
      },
      margin: {
        '-fullh': '-100vh'
      }
    },
    inset: {
      '0': 0,
      '16': '16px',
      '32': '32px',
      '64': '64px',
      '2rem': '2rem',
      '3rem': '3rem'
    }
  },
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js'
    ]
  },
  variants: {},
  plugins: [
  ]
}