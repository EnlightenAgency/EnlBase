'use strict';

// File reference variables
var basePaths = {
	src: 'project2/',
	dest: 'project2/'  // current recommendation is to compile files to the same folder
};

var paths = {
	html: {
		src: basePaths.src,
		dest: basePaths.dest
	},
	images: {
		src: basePaths.src + 'images/',
		dest: basePaths.dest
	},
	scripts: {
		src: basePaths.src + 'js/',
		dest: basePaths.dest + 'js/'
	},
	styles: {
		src: basePaths.src + 'css/' + 'sass/',   // sass is reference for the type of preprocessor, we use the SCSS file format in Sass
		dest: basePaths.dest + 'css/'
	}
};

var appFiles = {
	html: paths.html.src +  '**/*.html',
	images: paths.html.src +  '**/*.{jpg,jpeg,gif,svg}', //png fails on Windows 8.1 right now
	imagesPng: paths.html.src + '**/*.png',
	styles: paths.styles.src + '**/*.scss',
	scriptFile: 'enlBase.js'
};
// Generally `/vendors` needs to be loaded first, exclude the built file(s)
appFiles.userScripts = [paths.scripts.src + '**/*.js', '!' + paths.scripts.src + 'vendors/**/*.js', '!' + paths.scripts.src + appFiles.scriptFile]; 
appFiles.allScripts = [paths.scripts.src + 'vendors/**/*.js', paths.scripts.src + '**/*.js', '!' + paths.scripts.src + appFiles.scriptFile]; 

// END Configuration

module.exports = {
	basePaths: basePaths,
	paths: paths,
	appFiles: appFiles
};
