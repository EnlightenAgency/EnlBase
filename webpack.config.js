const path = require('path');
var glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true // set to true if you want JS source maps
			})
		],
		splitChunks: {
			cacheGroups: {
				styles: {
					name: 'styles',
					test: /\.scss$/,
					chunks: 'all',
					enforce: true
				}
			}
		}
	},
	entry: {
		scripts: ['./src/js/ENL.init.js', './src/js/ENL.base.js'],
		vendors: glob.sync("./src/js/vendors/**/*.js"),
		ts: ['./src/ts/ENL.index.ts']
	},
	devtool: 'inline-source-map',
	output: {
		filename: './js/[name].bundle.js',
		path: path.resolve(__dirname, 'dest')
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader',
					{
						loader: 'image-webpack-loader',
						options: {
							bypassOnDebug: true,
						},
					},
				]
			},
			{
				test: /\.(html)$/,
				use: [
					'file-loader?name=[path][name].[ext]',
					'extract-loader',
					'html-loader'
					/*options: {
						attrs: [':data-src'],
						//minimize: true,
						//removeComments: false,
						//collapseWhitespace: false
					}*/
				]
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	plugins: [
		new CleanWebpackPlugin(['dest']),
		new MiniCssExtractPlugin({
			filename: "./css/[name].bundle.css",
		}),
		new CopyWebpackPlugin([
			{ from: './src/index.html', to: 'index.html' }
		])
	]
};