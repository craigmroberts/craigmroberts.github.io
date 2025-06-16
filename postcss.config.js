module.exports = {
  plugins: [
    require('postcss-import'), // Combines all CSS files
    require('autoprefixer'),   // Adds vendor prefixes
    require('cssnano')({
      preset: ['advanced', {
        discardComments: { removeAll: true },
        reduceIdents: false,
        zindex: false,
        mergeIdents: false
      }]
    }) // Minifies CSS
  ]
};
