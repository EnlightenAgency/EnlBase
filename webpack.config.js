const path = require('path');
var glob = require("glob");

module.exports = {
	entry: {
		scripts: ['./src/js/ENL.init.js', './src/js/ENL.base.js'],
		vendors: glob.sync("./src/js/vendors/**/*.js")
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dest/js')
	}
};