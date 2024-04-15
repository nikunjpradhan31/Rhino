const path = require('path');

module.exports = {
  entry: './src/index.js', // Specify the entry point file
  output: {
    path: path.resolve(__dirname, './public/'),
    publicPath: '/public/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // Add other loaders for CSS, images, etc. as needed
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
