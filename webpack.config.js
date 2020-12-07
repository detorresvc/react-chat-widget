const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/scenes/widget/Widget.js'
  },
  output: {
    path: path.resolve('lib'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            "presets": ["@babel/preset-react", "@babel/preset-env"],
            "plugins": ["@babel/plugin-transform-react-jsx"]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  }
  // ,
  // resolve: {
  //   alias: {
  //     'react': path.resolve(__dirname, './node_modules/react'),
  //     'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
  //   }
  // },
  // externals: {
  //   // Don't bundle react or react-dom      
  //   react: {
  //     commonjs: "react",
  //     commonjs2: "react",
  //     amd: "React",
  //     root: "React"
  //   },
  //   "react-dom": {
  //     commonjs: "react-dom",
  //     commonjs2: "react-dom",
  //     amd: "ReactDOM",
  //     root: "ReactDOM"
  //   }
  // }
};