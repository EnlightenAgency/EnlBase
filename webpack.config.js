const path = require('path');

module.exports = {
	entry: ['./src/js/ENL.init.js', './src/js/ENL.base.js'],
	output: {
		filename: 'ENL.scripts.js',
		path: path.resolve(__dirname, 'dest/js')
	}
};