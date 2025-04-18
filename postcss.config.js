module.exports = {
  plugins: [
    require('postcss-import'), // Combines all CSS files
    require('autoprefixer'),   // Adds vendor prefixes
    require('cssnano')({ preset: 'default' }) // Minifies CSS
  ]
};
