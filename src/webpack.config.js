module.exports = {
   output: {
     publicPath: '/react_ts_app/build/',
   },

   devServer: {
      historyApiFallback: {
        rewrites: [{ from: /\/react_ts_app\/[^?]/, to: '/404.html' }],
      },
    },
}