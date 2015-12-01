'use strict';

// Requires & plugins
// 
// ****************************************************************************************************
//  Double check and update version numbers in the package.json file when setting 
//  up a new project to ensure that the project is using up to date packages.
// ****************************************************************************************************

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
var merge = require('merge-stream');

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
        src: basePaths.src + 'lib/images/',
        dest: basePaths.dest
    },
    scripts: {
        src: basePaths.src,
        dest: basePaths.dest
    },
    styles: {
        src: basePaths.src + 'lib/css/' + 'sass/',   // sass is reference for the type of preprocessor, we use the SCSS file format in Sass
        dest: basePaths.dest + 'lib/css/'
    },
	e2e:{
		src:'tests/',
		dest:'tests/'
	}
};

var appFiles = {
    html: paths.html.src + '**/*.html',
    images: paths.html.src + '**/*.{jpg,jpeg,png,gif,svg}',
    styles: paths.styles.src + '**/*.scss',
    vendorScriptFile: 'vendors.js',
    scriptFile: 'enlBase.js',
    testFile: "tests.js",
	e2eTestFile: "e2e.js"
};
// Generally `/vendors` needs to be loaded first, exclude the built file(s)
appFiles.userScripts = [paths.scripts.src + 'app/**/*.js', '!' + paths.scripts.src + 'app/**/*.spec.js', '!' + paths.scripts.src + 'app/tests/**/*.js'];
appFiles.testScripts = [paths.scripts.src + 'app/**/*.spec.js' ];
appFiles.e2eScripts = [paths.e2e.src + 'e2e/*.spec.js'];
appFiles.vendorScripts = [paths.scripts.src + 'lib/js/vendor/jquery 2.1.4/jquery-2.1.4.js', paths.scripts.src + 'lib/js/vendor/angular/angular.js', paths.scripts.src + 'lib/js/vendor/**/*.js'];
appFiles.allScripts = [
    paths.scripts.src + 'lib/js/vendor/jquery 2.1.4/jquery-2.1.4.js', paths.scripts.src + 'lib/js/vendor/**/*.js',
    paths.scripts.src + 'app/**/*.js',
    paths.scripts.src + 'app/**/*.spec.js',
	paths.e2e.src + 'e2e/*.spec.js',
    '!' + paths.scripts.src + appFiles.scriptFile
];

// END Configuration

// Standard error handler
function errorHandler(err) {
    gutil.beep();
    // Log to console
    gutil.log(gutil.colors.red('Error: '), err.message, ' - ', err.fileName);
    if (showErrorStack) {
        gutil.log(err.stack);
    }
    this.emit('end');
}

// CSS / Sass compilation
function styles() {
    var stream = gulp.src(appFiles.styles)
		.pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: sassStyle })).on('error', errorHandler)
		.pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false })).on('error', errorHandler)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(filesize());

    return stream;
}

// JavaScript tasks and compilation
function jslinter(scriptsToLint) {

    // Create a custom reporter to show Lint Errors nicely formatted
    var customReporter = map(lintReporter);
    function lintReporter(file, cb) {
        if (!file.jshint.success) {
            var numErrors = file.jshint.results.length;
            var errIndex = 1;
            gutil.log('----------------------------------------');
            gutil.log(gutil.colors.bgRed('JSHint Error' + (numErrors > 1 ? '(s)' : '') + ': (' + numErrors + ')'));
            file.jshint.results.forEach(displayError);
            gutil.log('----------------------------------------');
            gutil.beep();
        }
        if (typeof cb === 'function') { cb(null, file); }

        function displayError(err) {
            var filepathparts = file.path.indexOf('/') > -1 ? file.path.split('/') : file.path.split('\\');
            var filename = filepathparts.length > 1 ?
					'.../' + filepathparts[filepathparts.length - 2] + '/' + filepathparts[filepathparts.length - 1] :
					file.path;
            if (err) {
                gutil.log(' ' + errIndex + ') ' +
							gutil.colors.magenta(filename) + ': ' +
							gutil.colors.yellow(err.error.line + ':' + err.error.character) + ' - ' +
							gutil.colors.blue(err.error.reason));
            }
            errIndex++;
        }
    }

    var stream = gulp.src(scriptsToLint)
		.pipe(jshint())
		.pipe(customReporter);

    return stream;
}

function lintjs() {
    jslinter(appFiles.userScripts); // don't lint `/vendor` scripts
}

function scripts() {
    // lint JavaScript files, but don't prevent scripts task from continuing
    lintjs();

    // don't generate map files for vendor files
    var vendorStream = gulp.src(appFiles.vendorScripts)
		.pipe(concat(appFiles.vendorScriptFile, { newLine: ';\r\n' })).on('error', errorHandler)
		.pipe(isProduction ? filesize() : gutil.noop())
		.pipe(isProduction ? uglify() : gutil.noop()).on('error', errorHandler)
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(filesize());

    var userStream = gulp.src(appFiles.userScripts)
		.pipe(sourcemaps.init())
		.pipe(concat(appFiles.scriptFile, { newLine: ';\r\n' })).on('error', errorHandler)
		.pipe(isProduction ? filesize() : gutil.noop())
		.pipe(isProduction ? uglify() : gutil.noop()).on('error', errorHandler)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(filesize());

    var testStream = gulp.src(appFiles.testScripts)
		.pipe(sourcemaps.init())
		.pipe(concat(appFiles.testFile, { newLine: ';\r\n' })).on('error', errorHandler)
		.pipe(isProduction ? filesize() : gutil.noop())
		.pipe(isProduction ? uglify() : gutil.noop()).on('error', errorHandler)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.scripts.dest))
		.pipe(filesize());
	var e2eStream = gulp.src(appFiles.e2eScripts)
		.pipe(sourcemaps.init())
		.pipe(concat(appFiles.e2eTestFile, { newLine: ';\r\n' })).on('error', errorHandler)
		.pipe(isProduction ? filesize() : gutil.noop())
		.pipe(isProduction ? uglify() : gutil.noop()).on('error', errorHandler)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.e2e.dest))
		.pipe(filesize());

    // See this link for recipe for multiple streams: 
    // https://github.com/gulpjs/gulp/blob/master/docs/recipes/using-multiple-sources-in-one-task.md
    return merge(vendorStream, userStream);
}

// Image Minification and compression
// More info: http://www.devworkflows.com/posts/adding-image-optimization-to-your-gulp-workflow/
function compressImages() {
    var stream = gulp.src(appFiles.images)
		.pipe(imagemin({
		    progressive: true,
		    svgoPlugins: [{ removeViewBox: false }],
		    use: [
				gifsicle({ interlaced: true }),
				optipng({ optimizationLevel: 3 }),
				pngquant({ quality: '65-80', speed: 4 }),
				mozjpeg({ quality: '70' }),
				svgo()
		    ]
		})).on('error', errorHandler)
		.pipe(gulp.dest(paths.images.dest));

    return stream;
}

// Webserver and watch
function startWebserver() {
    if (isProduction) { return; }

    var stream = gulp.src(basePaths.dest)
		.pipe(webserver({
		    open: true,
		    port: 8000,
		    fallback: 'index.html'
		}));

    return stream;
}

function watchAndServer(done) {
    if (isProduction) { return; }

    // Remove this if you do not need webserver to view files locally
    //startWebserver();

    // TODO: Can't watch image files if writing back to the same directory, would create infinite loop
    // TODO: Need to look into seeing if there is a way to disable the watch, run the task, and re-enable the watch once done
    // gulp.watch(appFiles.images, compressImages);

    gulp.watch(appFiles.styles, ['styles']);
    gulp.watch([appFiles.allScripts,
				'!' + paths.scripts.src + appFiles.scriptFile,
				'!' + paths.scripts.src + appFiles.vendorScriptFile
    ], ['scripts']);

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
gulp.task('lintjs', lintjs);
gulp.task('scripts', scripts);

// Image Compression Task(s)
gulp.task('imagemin', compressImages);

// Webserver/Watch Task(s)
gulp.task('watch', watchAndServer);

// Default task
// by default it will run the dev process. 
// Use "gulp --prod" to build for production
gulp.task('default', ['styles', 'scripts', 'watch']);

// Build task, skips the watch, 
// same can be accomplished with gulp --prod
gulp.task('build', ['styles', 'scripts']);
