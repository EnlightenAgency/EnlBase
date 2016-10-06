'use strict';

// Requires & plugins
// 
// ****************************************************************************************************
//  Double check and update version numbers in the package.json file when setting 
//  up a new project to ensure that the project is using up to date packages.
// ****************************************************************************************************

var gulp         = require('gulp');
var gutil        = require('gulp-util');
var webserver    = require('gulp-webserver'); // optional - use for POC or if a webserver is needed for serving project files (i.e. template only)
var ssi          = require('ssi'); // for use with adding includes
var livereload   = require('gulp-livereload'); // livereload browser plugin is also required for this to work
var runSequence  = require('run-sequence'); // allows you to specify ordering of tasks both synchronous and asynchronously
var del          = require('del');

// Styles
var sass         = require('gulp-sass'); // LibSass = faster than Ruby Sass, not quite 100% Sass compliant.  require('gulp-ruby-sass') for Ruby Sass
var minifyCSS    = require('gulp-clean-css');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

// Scripts
var concat       = require('gulp-concat');
var ts           = require('gulp-typescript');
var uglify       = require('gulp-uglify');
var eslint       = require('gulp-eslint');
var map          = require('map-stream');
var merge        = require('merge-stream');

// Images
var imagemin     = require('gulp-imagemin');
	// imagemin plugins
	var gifsicle = require('imagemin-gifsicle');
	var optipng  = require('imagemin-optipng');
	var pngquant = require('imagemin-pngquant');
	var mozjpeg  = require('imagemin-mozjpeg');
	var svgo     = require('imagemin-svgo');

// SVGs
var svgSprite = require('gulp-svg-sprite');

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
	dest: 'dest/' 
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
		src: basePaths.src + 'css/' + 'scss/',  
		dest: basePaths.dest + 'css/'
	}
};

var appFiles = {
	html: paths.html.src +  '**/*.html',
	images: paths.html.src +  '**/*.{jpg,jpeg,png,gif,svg}',
	svgs: [paths.images.src + '**/*.svg', '!' + paths.images.src + '**/sprite.symbol.svg'],
	styles: paths.styles.src + '**/*.scss',
	css: paths.styles.src + '**/*.css',
	scripts: paths.scripts.src + '**/*.js',
	vendorScriptFile: 'vendors.js',
	scriptFile: 'enlBase.js'
};
// Generally `/vendors` needs to be loaded first, exclude the built file(s)
appFiles.siteScripts = [
	//paths.scripts.src + 'enl.base.js', // suggsted place to setup namespace
	//paths.scripts.src + 'utils/*.js', // suggsted place to create utils
	//paths.scripts.src + 'enl.init.js', // suggsted place to setup init process
	paths.scripts.src + '**/*.js', 
	'!' + paths.scripts.src + 'vendors/**/*.js', 
	'!' + paths.scripts.src + appFiles.scriptFile,
	'!' + paths.scripts.src + appFiles.vendorScriptFile
]; 

appFiles.vendorScripts = [
	paths.scripts.src + 'vendors/*.js'
]; 

// END Configuration

/**
 * function errorHandler()
 *
 * Standard Error Handling
 */
function errorHandler(err){
	gutil.beep();
	// Log to console
	gutil.log(gutil.colors.red('Error: '), err.message, ' - ', err.fileName);
	if (showErrorStack) {
		gutil.log(err.stack);
	}
	this.emit('end');
}

/**
 * function styles()
 *
 * CSS / Sass compilation
 */
function styles() {
	return gulp.src(appFiles.styles)
		.pipe(!isProduction ? sourcemaps.init() : gutil.noop())
		.pipe(sass({outputStyle: sassStyle})).on('error', errorHandler)
		.pipe(autoprefixer({ 
			browsers: ['last 2 versions', '> 1%'], 
			cascade: false 
		})).on('error', errorHandler)
		.pipe(!isProduction ? sourcemaps.write() : gutil.noop())
		.pipe(isProduction ? minifyCSS() : gutil.noop() )
		.pipe(gulp.dest(paths.styles.dest))
}

/**
 * function jsValidate()
 *
 * Lint and stylecheck JavaScript with ESLint
 * Exclude vendor files
 * Print results
 */
function jsValidate() {
	if (isProduction) {
		return;
	}

	return gulp.src(appFiles.siteScripts)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.results(function(results) {
			if (results.warningCount == 0 && results.errorCount == 0) {
				gutil.log(gutil.colors.green('Congratulations! No ESLint warnings or errors.'));
			} else {
				gutil.beep();
			}
		}));
}

/**
 * function jsSite()
 *
 * Init sourcemaps
 * Concatenate JS files
 * Write sourcemaps
 * Uglify / minify (if production)
 * Save
 */
function jsSite() {
	return gulp.src(appFiles.siteScripts)
		.pipe(sourcemaps.init())
		.pipe(concat(appFiles.scriptFile))
		.pipe(sourcemaps.write())
		.pipe(isProduction ? uglify() : gutil.noop() )
		.pipe(gulp.dest(paths.scripts.dest));
}

/**
 * function jsVendor()
 *
 * Concatenate JS vendor files / libraries
 * Uglify / minify
 * Save
 */
function jsVendor() {
	return gulp.src(appFiles.vendorScripts)
		.pipe(concat(appFiles.vendorScriptFile, {newLine: ';\r\n'})).on('error', errorHandler)
		.pipe(ts({
            target: 'ES5',
            allowJs: true
        }))
		.pipe(isProduction ? uglify() : gutil.noop() )	// to unminify vendor in dev, remove "isProduction" ternary
		.pipe(gulp.dest(paths.scripts.dest));
}

/**
 * function compressImages()
 *
 * Image Minification and compression
 * More info: http://www.devworkflows.com/posts/adding-image-optimization-to-your-gulp-workflow/
 */
function compressImages(done) {
	 var plugins = [
        gifsicle({interlaced: true, optimizationLevel: 3}),
        optipng({optimizationLevel: 3}),
        pngquant({speed: 3, verbose: false}),
        svgo({
        		plugins: [
	        		{removeViewBox: false}
	        	]
        	}),
        mozjpeg({quality: '85, 95'})
    ];

    if (!isProduction) {
        return done();
    }

	return gulp.src(appFiles.images.src)
		.pipe(imagemin(plugins, {progressive: true, verbose: false}))
		.on('error', errorHandler)
		.pipe(gulp.dest(paths.images.dest));
}

/**
 * function spriteSVGs()
 *
 * Turn SVG files into SVG Sprite
 */
function spriteSVGs() {
    var svgSpriteConfig = {
            mode: {
                css: false,
                symbol: {
                    dest: paths.images.dest
                }
            },
            shape: {
                dimension: {
                    precision: -1,
                },
                transform: [
                    {
                        svgo: {removeViewBox: false}
                    }
                ]
            }
        };

    return gulp.src(appFiles.svgs)
        .pipe(svgSprite(svgSpriteConfig)).on('error', errorHandler)
        .pipe(gulp.dest('.'));
}

/**
 * function processSSI()
 *
 * compile includes into the html
 */
function processSSI() {
	var inputDirectory = paths.html.src;
	var outputDirectory = paths.html.dest;
	var matcher = "/**/*.html";

	var includes = new ssi(inputDirectory, outputDirectory, matcher, true);
	includes.compile();
}


// Copy files to Dest
function copyhtml(done) {
	processSSI();
	done();
}
function copyimg(done) {
	return compressImages(done);
}
function copycss(done) {
	runSequence('styles', done)
}
function copyjs(done) {
	runSequence(['js:site', 'js:vendor'], done)
}
function copy(done) {
	runSequence('copy:html', 'copy:img', 'copy:css', 'copy:js', done);
}

var doClean = !gutil.env.noclean;

// Clean
function cleanhtml(done) {
	if (doClean) { return del(paths.html.dest + '**/*.html'); }
	done();
}
function cleanimg(done) {
	if (doClean) { return del(paths.images.dest + '**/*.{jpg,jpeg,png,gif,svg}'); }
	done();
}
function cleancss(done) {
	if (doClean) { return del(paths.styles.dest + '**/*.css'); }
	done();
}
function cleanjs(done) {
	if (doClean) { return del(paths.scripts.dest + '**/*.js'); }
	done();
}
function clean(done) {
	if (doClean) { return del(basePaths.dest); }
	done();
}

/**
 * function startWebserver()
 *
 * Webserver and watch
 */
function startWebserver(options) {
	var port = gutil.env.port || isHttps ? 8443 : 8000;
	var isHttps = options && options.https;
	
	if (isProduction) { return; }

	return gulp.src(basePaths.dest)
		.pipe(webserver({
			directoryListing: false,
			fallback: 'index.html',
			host: '0.0.0.0',
			livereload: false,
			open: false,
			port: port,
			https: isHttps
		}));
}


function watchAndServer(done) {
	if (isProduction) { return; }

	// Remove this if you do not need webserver to view files locally
	startWebserver();
	// startWebserver({https: true}); // Comment this line in if HTTPS is desired

	gulp.watch(appFiles.html, ['copy:html']);
	gulp.watch(appFiles.images, ['copy:img']);
	gulp.watch(appFiles.svgs, ['spriteSVGs']);
	gulp.watch(appFiles.styles, ['copy:css']);
	gulp.watch(appFiles.siteScripts, ['js:site']);
	gulp.watch(appFiles.vendorScripts, ['js:vendor']);
	gulp.watch([appFiles.vendorScriptFile, appFiles.scriptFile], ['copy:js']);

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
gulp.task('js:validate', jsValidate);
gulp.task('js:site', jsSite);
gulp.task('js:vendor', jsVendor);

// Image Compression Task(s)
gulp.task('imagemin', compressImages);
gulp.task('spriteSVGs', spriteSVGs);

// Copy Task(s)
gulp.task('copy:html', ['clean:html'], copyhtml);
gulp.task('copy:img', ['clean:img'], copyimg);
gulp.task('copy:css', ['clean:css'], copycss);
gulp.task('copy:js', ['clean:js'], copyjs);
gulp.task('copy', copy);

// Clean Task(s)
gulp.task('clean:html', cleanhtml);
gulp.task('clean:img', cleanimg);
gulp.task('clean:css', cleancss);
gulp.task('clean:js', cleanjs);
gulp.task('clean', clean);

// Webserver/Watch Task(s)
gulp.task('watch', watchAndServer);

// Default task
// by default it will run the dev process. 
// Use "gulp --prod" to build for production
gulp.task('default', defaultTask);

// Build task, skips the watch, 
// same can be accomplished with gulp --prod
gulp.task('build', buildTask);

function defaultTask(done) {
	runSequence('clean',
		['js:validate', 'js:site', 'js:vendor', 'styles'],
		'copy',
		'spriteSVGs',
		'watch',
		done);
}

function buildTask(done) {
	runSequence('clean',
		['js:validate', 'js:site', 'js:vendor', 'styles'],
		'copy',
		'spriteSVGs',
		done);
}