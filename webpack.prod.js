const path = require("path");
const Webpack = require("webpack");
// creates index.html file by a template index.ejs
const HtmlWebpackPlugin = require("html-webpack-plugin");
// cleans dist folder
const CleanWebpackPlugin = require("clean-webpack-plugin");
// copies the assets folder into dist folder
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const distFolder = "./dist";

module.exports = {
  mode: "production",
  entry: {//入口文件
    game:"./src/scripts/index.js",
  }, 
  output: {
    filename: 'js/[name].[hash:5].js',
    path: path.resolve(__dirname, distFolder),
  },
  //devtool: "inline-source-map",
  plugins: [
    require("autoprefixer"),
    new MiniCssExtractPlugin({
      filename: "css/[name]_[hash:8].css",
      options: {
        publicPath: '../../'
      }
    }),
    new Webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(
      distFolder
      //{ root: path.resolve(__dirname, '../')}
    ),
    new HtmlWebpackPlugin({
      title: "首页",
      filename: "index.html",
      template: 'src/index.html',
      chunks:['vendors','game'],
      minify: {
        removeRedundantAttributes: true, // 删除多余的属性
        collapseWhitespace: true, // 折叠空白区域
        removeAttributeQuotes: true, // 移除属性的引号
        removeComments: true, // 移除注释
        collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
      }
    }),
    new CopyWebpackPlugin([{
      from: "src/static",
      to: "assets"
    }])
  ],
  module: {
    rules: [{
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader?importLoaders=1',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader?importLoaders=1',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        use: "url-loader"
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: '[name]_[hash:8].[ext]',
          // publicPath: "assets/images",
          outputPath: './images' //定义输出的图片文件夹 
        }
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css", ".less"]
  },
  // devServer: {
  //   contentBase: distFolder, //网站的根目录为 根目录/dist，如果配置不对，会报Cannot GET /错误
  //   port: 9000, //端口改为9000
  //   open: true, // 自动打开浏览器，适合懒人
  //   hot: true
  // },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  node: {
    fs: "empty"
  }
};