// Additional options for Gulp File



/*
// if you want to replace the requires for gulp plugins, 
// you can use this plugin to load all of the dev-dependencies
// npm install gulp-load-plugins --save-dev

*/
var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/
});


// To specify order for files, pass an array to the appFiles value, i.e.:
var scripts = [
	paths.scripts.src + 'vendor/jquery.min.js',
	paths.scripts.src + 'plugins.js', 
	paths.scripts.src + 'main.js'
];

// Want to create per page scripts that can all use a single task?
// Iterate over the following object
var pageScripts = {
	'section1': [
		paths.scripts.src + 'vendor/pluginFile.js',
		paths.scripts.src + 'vendor/aFramework.js', 
		paths.scripts.src + 'section/section1SpecificCode.js'
	],
	'section2': [
		paths.scripts.src + 'vendor/diffPluginFile.js',
		paths.scripts.src + 'vendor/secondPluginFile.js', 
		paths.scripts.src + 'section/section2SpecificCode.js'
	],
};

//Task Function (needs to be tested)
function processPageScripts() {
	for (var script in pageScripts) {
		gulp
			.src(pageScripts[script])
			//.pipe(lintjs())
			.pipe(isProduction ? gutil.noop : sourcemaps.init())
			.pipe(concat(script + '.js', {newLine: ';\r\n'})).on('error', standardHandler)
			.pipe(isProduction ? gutil.noop : uglify()).on('error', standardHandler)
			.pipe(isProduction ? gutil.noop : sourcemaps.write())
			.pipe(gulp.dest(paths.scripts.dest + script + '.js'));
	}
}
gulp.task('processpagescripts', processPageScripts);



var doClean = gutil.env.clean;
// Clean
function cleancss(cb) {
	if (doClean) { del('dist/css', cb); }
}

function cleanjs(cb) {
	if (doClean) { del('dist/js', cb); }
}

function cleanimg(cb) {
	if (doClean) { del('dist/images', cb); }
}

function cleanhtml(cb) {
	if (doClean) { del(paths.html.dest + '**/*.html', cb); }
}

// Clean Task(s)
gulp.task('clean:css', cleancss);
gulp.task('clean:js', cleanjs);
gulp.task('clean:img', cleanimg);
gulp.task('clean:html', cleanhtml);
gulp.task('clean', ['clean:css', 'clean:js', 'clean:img', 'clean:html']);


// Copy files to Dist
function copyhtml(cb) {
	gulp
		.src(appFiles.html)
		.pipe(gulp.dest(paths.html.dest));
}

function copyimg(cb) {
	gulp
		.src(appFiles.images)
		.pipe(compressImages())
		.pipe(gulp.dest(paths.images.dest));
}

// Copy Task(s)
gulp.task('copy:img', imagemin);
gulp.task('copy:html', copyhtml);
gulp.task('copy', ['copy:html', 'imagemin']);

// External configuration for file paths
// you can move all of the file path definitions out to a separate configuration file, that would have something like this:

// FILE = pathConfig.js
module.exports = {
	basePaths = {
		src: 'src/',
		dest: 'src/'  // current recommendation is to compile files to the same folder
	},
	paths = {
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
	},
	appFiles = {
		html: paths.html.src +  '**/*.html',
		images: paths.html.src +  '**/*.{jpg,jpeg,gif,svg}', //png fails on Windows 8.1 right now
		imagesPng: paths.html.src + '**/*.png',
		styles: paths.styles.src + '**/*.scss',
		scriptFile: 'enlBase.js'
	}
};

/* and in the Gulpfile */
var paths = require('pathConfig');