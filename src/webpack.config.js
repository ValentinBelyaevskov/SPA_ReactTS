const path = require("node:path/win32");

module.exports = {
   output: {
      publicPath: '/react_ts_app/build/',
   },

   devServer: {
      historyApiFallback: {
         rewrites: [{ from: /\/react_ts_app\/[^?]/, to: '/404.html' }],
      },
   },

   resolve: {
      alias: {
         alwaysPresent: path.resolve(__dirname, '/src/alwaysPresent'),
         API: path.resolve(__dirname, '/src/API'),
         common: path.resolve(__dirname, '/src/common'),
         functions: path.resolve(__dirname, '/src/functions'),
         hooks: path.resolve(__dirname, '/src/hooks'),
         pages: path.resolve(__dirname, '/src/pages'),
         redux: path.resolve(__dirname, '/src/redux'),
         types: path.resolve(__dirname, '/src/types'),
      },

      fallback: { process: require.resolve("process/browser") }
   }
}