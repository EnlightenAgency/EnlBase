// Requires & plugins
var gulp = require('gulp');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
var filesize = require('gulp-filesize');
var debug = require('gulp-debug');

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
	var optipng = require('imagemin-optipng');
	var pngquant = require('imagemin-pngquant');
	var mozjpeg = require('imagemin-mozjpeg');
	var svgo = require('imagemin-svgo');

// Configuration and environment variables

// use "gulp --prod" to trigger production/build mode from commandline
var isProduction = false;
var sassStyle = 'expanded';
var sourceMap = true;

if (gutil.env.prod) {
	isProduction = true;
	sassStyle = 'compressed';
	sourceMap = false;
}

// File reference variables
var basePaths = {
    src: 'src/',
    dest: 'src/'  // current recommendation is to compile files to the same folder
};

var paths = {
    html: {
        src: basePaths.src,
        dest: basePaths.dest
    },
    images: {
        src: basePaths.src + 'images/',
        dest: basePaths.dest + 'images/'
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
	images: paths.html.src +  '**/*.{png,jpg,jpeg,gif,svg}',
    styles: paths.styles.src + '**/*.scss',
    scriptFile: 'enlBase.js'
};
// Generally `/vendors` needs to be loaded first, exclude the built file(s)
appFiles.userScripts = [paths.scripts.src + '**/*.js', '!' + paths.scripts.src + 'vendors/**/*.js', '!' + paths.scripts.src + appFiles.scriptFile]; 
appFiles.allScripts = [paths.scripts.src + 'vendors/**/*.js', paths.scripts.src + '**/*.js', '!' + paths.scripts.src + appFiles.scriptFile]; 


// END Configuration

// Standard error handler
function errorHandler(err){
	gutil.beep();
	// Log to console
	gutil.log(gutil.colors.red('Error: '), err.message);
}

// CSS / Sass compilation
function styles(cb) {
	gulp
		.src(appFiles.styles)
		.pipe(isProduction ? sourcemaps.init() : gutil.noop())
		.pipe(sass({outputStyle: sassStyle})).on('error', errorHandler)
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false })).on('error', errorHandler)
		.pipe(isProduction ? sourcemaps.write() : gutil.noop())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(filesize());

	if (typeof cb === 'function') cb();
}

// JavaScript tasks and compilation
function lintjs(cb) {
    var myReporter = map(lintReporter);
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

    gulp
    	.src(appFiles.userScripts) // don't lint `/vendor` scripts
        .pipe(jshint())
        //.pipe(jshint.reporter('default'))
        .pipe(myReporter);

    if (typeof cb === 'function') cb();
}

function scripts(cb) {
	lintjs(); // runs lint, but doesn't prevent scripts task from continuing

	gulp
		.src(appFiles.allScripts)
		.pipe(isProduction ? sourcemaps.init() : gutil.noop())
		.pipe(concat(appFiles.scriptFile, {newLine: ';\r\n'}))
		.pipe(isProduction ? uglify() : gutil.noop())
		.pipe(isProduction ? sourcemaps.write() : gutil.noop())
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(filesize());

	if (typeof cb === 'function') cb();
}

// Image Minification and compression
// More info: http://www.devworkflows.com/posts/adding-image-optimization-to-your-gulp-workflow/
function compressImages(cb) {
	gulp
    	.src(appFiles.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [
            	pngquant({quality: '65-80', speed: 4}),
            	optipng({optimizationLevel: 3}),
            	mozjpeg({quality: '70'}),
            	svgo()
            ]
        }))
        .pipe(gulp.dest(paths.images.dest));

    if (typeof cb === 'function') cb();
}

// Webserver and watch
function webserver(cb) {
	if (isProduction) { return; }
	gulp
		.src(basePaths.dest)
		.pipe(webserver({
			livereload: true,
			directoryListing: true,
			open: true
		}));

	if (typeof cb === 'function') cb();
}

function watchAndReload(cb) {
	if (isProduction) { return; }

	webserver(cb);

	// Create LiveReload server
	livereload.listen();
	
	// Can't watch image files if writing back to the same directory, would create infinite loop
	// gulp.watch(appFiles.images, compressImages).on('change', livereload.changed);

	gulp.watch(appFiles.styles, styles).on('change', livereload.changed);
	gulp.watch([appFiles.allScripts, '!' + paths.scripts.src + appFiles.scriptFile], scripts).on('change', livereload.changed);

	if (typeof cb === 'function') cb();
}

/*********************
    Task(s)
*********************/

// Style Task(s)
gulp.task('styles', styles);

// Script Task(s)
gulp.task('scripts', scripts);

// Image Compression Task(s)
gulp.task('imagemin', compressImages);

// Webserver/Watch Task(s)
gulp.task('watch', watchAndReload);

gulp.task('build', ['styles', 'scripts']);
// Default task
// by default it will run the dev process. 
// Use "gulp --prod" to build for production
gulp.task('default', ['styles', 'scripts', 'watch']);
