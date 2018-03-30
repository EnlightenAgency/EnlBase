const path = require('path');
var glob = require("glob");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
		vendors: glob.sync("./src/js/vendors/**/*.js")
	},
	output: {
		filename: './js/[name].bundle.js',
		path: path.resolve(__dirname, 'dest')
	},
	module: {
		rules: [
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
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "./css/[name].bundle.css",
		}),
		new CopyWebpackPlugin([
			{ from: './src/index.html', to: 'index.html' }
		])
	]
};