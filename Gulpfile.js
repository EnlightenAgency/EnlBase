// Requires & plugins
var gulp = require('gulp');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver'); // optional - use for POC or if a webserver is needed for serving project files (i.e. template only)
var livereload = require('gulp-livereload'); // livereload browser plugin is also required for this to work
var filesize = require('gulp-filesize');

// Styles
var sass = require('gulp-sass'); // LibSass = faster than Ruby Sass, not quite 100% Sass compliant.  require('gulp-ruby-sass') for Ruby Sass
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

// Scripts
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var map = require('map-stream');

// Images
var imagemin = require('gulp-imagemin');
	// imagemin plugins
	var gifsicle = require('imagemin-gifsicle');
	var optipng = require('imagemin-optipng');
	var pngquant = require('imagemin-pngquant');
	var mozjpeg = require('imagemin-mozjpeg');
	var svgo = require('imagemin-svgo');

// Configuration and environment variables

// use "gulp --prod" to trigger production/build mode from commandline
var isProduction = false;
var sassStyle = 'expanded';
var sourceMap = true;
var showErrorStack = gutil.env.stacktrace;

if (gutil.env.prod) {
	isProduction = true;
	sassStyle = 'compressed';
	sourceMap = false;
}

var target = gutil.env.target || 'project1'; // default to project1
var options = require('./' + target + '/gulp-options');

// Standard error handler
function errorHandler(err){
	gutil.beep();
	// Log to console
	gutil.log(gutil.colors.red('Error: '), err.message, ' - ', err.fileName);
	if (showErrorStack) {
		gutil.log(err.stack);
	}
}

// CSS / Sass compilation
function styles() {
	var  stream = gulp.src(options.appFiles.styles)
		.pipe(isProduction ? sourcemaps.init() : gutil.noop())
		.pipe(sass({outputStyle: sassStyle})).on('error', errorHandler)
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false })).on('error', errorHandler)
		.pipe(isProduction ? sourcemaps.write() : gutil.noop())
		.pipe(gulp.dest(options.paths.styles.dest))
		.pipe(filesize());

	return stream;
}

// JavaScript tasks and compilation
function lintjs(scriptsToLint) {

	// Create a custom reporter to show Lint Errors nicely formatted
	var customReporter = map(lintReporter);
	function lintReporter(file, cb) {
		if (!file.jshint.success) {
			var numErrors = file.jshint.results.length;
			gutil.log(gutil.colors.bgRed('JSHint Error' + (numErrors > 1 ? '(s)' : '') + ': (' + numErrors + ')'));
			file.jshint.results.forEach(function (err) {
				if (err) {
					gutil.log(' - ' + file.path + ': ' + err.error.line + ':' + err.error.character + ' - ' + err.error.reason);
				}
			});
		}
		if (typeof cb === 'function') cb(null, file);
	}

	var stream = gulp.src(scriptsToLint) 
		.pipe(jshint())
		.pipe(customReporter);

	return stream;
}

function scripts() {
	// lint JavaScript files, but doesn't prevent scripts task from continuing
	lintjs(options.appFiles.userScripts);  // don't lint `/vendor` scripts

	var stream = gulp.src(options.appFiles.allScripts)
		.pipe(isProduction ? sourcemaps.init() : gutil.noop())
		.pipe(concat(options.appFiles.scriptFile, {newLine: ';\r\n'})).on('error', errorHandler)
		.pipe(isProduction ? filesize() : gutil.noop())
		.pipe(isProduction ? uglify() : gutil.noop()).on('error', errorHandler)
		.pipe(isProduction ? sourcemaps.write() : gutil.noop())
		.pipe(gulp.dest(options.paths.scripts.dest))
		.pipe(filesize());

	return stream;
}

// Image Minification and compression
// More info: http://www.devworkflows.com/posts/adding-image-optimization-to-your-gulp-workflow/
function compressImages() {
	var stream = gulp.src(options.appFiles.images)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [
				gifsicle({interlaced: true}),
				optipng({optimizationLevel: 3}),
				pngquant({quality: '65-80', speed: 4}),
				mozjpeg({quality: '70'}),
				svgo()
			]
		})).on('error', errorHandler)
		.pipe(gulp.dest(options.paths.images.dest));

	return stream;
}

// TODO: This does not currently work (tested on Windows 8.1)
// TODO: Check on a Mac
// TODO: Figure out how to get PNG files working, recombine image compression tasks
function compressPngImages() {
	var stream = gulp.src(options.appFiles.imagesPng)
		.pipe(imagemin({
			progressive: true,
			use: [
				optipng({optimizationLevel: 3}),
				pngquant({quality: '65-80', speed: 4})
			]
		})).on('error', errorHandler)
		.pipe(gulp.dest(options.paths.images.dest));

	return stream;
}

// Webserver and watch
function webserver() {
	if (isProduction) { return; }
	
	var stream = gulp.src(options.basePaths.dest)
		.pipe(webserver({
			livereload: true,
			directoryListing: true,
			open: true,
			port: 8000
		}));

	return stream;
}

function watchAndReload(done) {
	if (isProduction) { return; }

	// Remove this if you do not need webserver to view files locally
	webserver();

	// Create LiveReload server
	livereload.listen();
	
	// TODO: Can't watch image files if writing back to the same directory, would create infinite loop
	// TODO: Need to look into seeing if there is a way to disable the watch, run the task, and re-enable the watch once done
	// gulp.watch(appFiles.images, compressImages).on('change', livereload.changed);

	gulp.watch(options.appFiles.styles, ['styles']).on('change', livereload.changed);
	gulp.watch([options.appFiles.allScripts, '!' + options.paths.scripts.src + options.appFiles.scriptFile], ['scripts']).on('change', livereload.changed);

	// return a callback function to signify the task has finished running (the watches will continue to run)
	if (typeof done === 'function') { done(); }
}

/*********************
	Task(s)

	- Tasks all listed at the bottom for easy scanning, 
	- Each task references the function that will be called
	- Task functions should return a stream so Gulp can know when the task is finished
	    More info: https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support

*********************/

// Style Task(s)
gulp.task('styles', styles);

// Script Task(s)
gulp.task('scripts', scripts);

// Image Compression Task(s)
gulp.task('imagemin', compressImages);
gulp.task('imagemin:png', compressPngImages);

// Webserver/Watch Task(s)
gulp.task('watch', watchAndReload);

// Default task
// by default it will run the dev process. 
// Use "gulp --prod" to build for production
gulp.task('default', ['styles', 'scripts', 'watch']);

// Build task, skips the watch, 
// same can be accomplished with gulp --prod
gulp.task('build', ['styles', 'scripts']);
