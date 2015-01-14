// Requires & plugins
var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');

// if you want to replace the requires for gulp plugins, 
// you can use this plugin to load all of the dev-dependencies
/*var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/
});

// npm install gulp-load-plugins --save-dev
*/

var sass = require('gulp-ruby-sass'); // Ruby Sass
// var sass = require('gulp-sass'); // Lib Sass (much faster, less compatible)
var sourcemaps = require('gulp-sourcemaps');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var imagemin = require('gulp-imagemin');
	// imagemin plugins
	var optipng = require('imagemin-optipng');
	var pngquant = require('imagemin-pngquant');
	var mozjpeg = require('imagemin-mozjpeg');
	var svgo = require('imagemin-svgo');

var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');

/* to install the above plugins at the command prompt:

	npm install gulp --save-dev
	npm install gulp-util --save-dev
	npm install del --save-dev

	npm install gulp-ruby-sass --save-dev
	// npm install gulp-sass --save-dev
	npm install gulp-concat --save-dev
	npm install gulp-uglify --save-dev
	npm install gulp-imagemin --save-dev
		npm install gulp-optipng --save-dev
		npm install gulp-pngquant --save-dev
		npm install gulp-mozjpeg --save-dev
		npm install gulp-svgo --save-dev
	npm install gulp-webserver --save-dev
	npm install gulp-livereload --save-dev

*/


// File reference variables
var basePaths = {
    src: 'src/',
    dest: 'dist/'
};

var paths = {
    html: {
        src: basePaths.src,
        dest: basePaths.dest
    },
    images: {
        src: basePaths.src + 'images/' + '**/*.*',
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
    styles: paths.styles.src + '**/*.scss',
    scripts: [
		'vendor/jquery.min.js',
		'vendor/jquery.scrollTo.js', 
		'plugins.js', 
		'main.js'
	]
};





// Standard handler
function standardHandler(err){
	gutil.beep();
	// Log to console
	gutil.log(gutil.colors.red('Error: '), err.message);
}

// Clean
gulp.task('clean:all', ['clean:css', 'clean:js', 'clean:img', 'clean:html']);
gulp.task('clean:css', function(cb) {
	del('dist/css', cb);
});
gulp.task('clean:js', function(cb) {
	del('dist/js', cb);
});
gulp.task('clean:img', function(cb) {
	del('dist/img', cb);
});
gulp.task('clean:html', function(cb) {
	del('dist/**/*.html', cb);
});

// CSS / Sass compilation
gulp.task('css:dev', ['clean:css'], function () {
	gulp
		.src('src/css/scss/main.scss')
			.pipe(sourcemaps.init())
				.pipe(sass())
					.on('error', standardHandler)
			.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css/'));
});

gulp.task('css:nomaps', ['clean:css'], function () {
	gulp
		.src('src/css/scss/*.scss')
		.pipe(sass())
			.on('error', standardHandler)
		.pipe(gulp.dest('./src/css'));
});

gulp.task('css:dist', ['clean:css'], function () {
	gulp
		.src('src/css/scss/main.scss')
			.pipe(sourcemaps.init())
				.pipe(sass({outputStyle: 'compressed'}))
					.on('error', standardHandler)
			.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css/'));
});

// JavaScript compilation
gulp.task('js:dev', ['clean:js'], function () {
	gulp
		.src(jsFiles)
		.pipe(sourcemaps.init())
			.pipe(concat('mode.js', {newLine: ';\r\n'}))
				.on('error', standardHandler)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('js:dist', ['clean:js'], function () {
	gulp
		.src(jsFiles)
		.pipe(sourcemaps.init())
			.pipe(concat('mode.js', {newLine: ';\r\n'}))
				.on('error', standardHandler)
			.pipe(uglify())
				.on('error', standardHandler)
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/js/'));
});

// Copy files to Dist
gulp.task('copy', ['copy:html', 'copy:img']);
gulp.task('copy:html', ['clean:html'], function () {
	gulp
		.src('src/**/*.html')
		.pipe(gulp.dest('dist/'));
});
gulp.task('copy:img', ['clean:img'], function () {
	gulp
		.src('src/img/**/*.*')
		.pipe(gulp.dest('dist/img/'));
});

// Image Minification and compression
gulp.task('imagemin', ['clean:img'], function () {
    gulp
    	.src('src/img/**/**.{png,jpg,jpeg,gif,svg}')
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
        .pipe(gulp.dest('dist'));
});

// Webserver and watch 
gulp.task('webserver', function() {
	gulp
		.src('dist/')
		.pipe(webserver({
			livereload: true,
			directoryListing: true,
			open: true
		}));
});

gulp.task('watch', ['webserver', 'clean'], function () {
	// Create LiveReload server
	livereload.listen();
	
	gulp.watch('src/**/*.html', ['copy:html']).on('change', livereload.changed);
	gulp.watch('src/img/**/*.*', ['copy:img']).on('change', livereload.changed);
	gulp.watch('src/css/scss/**/*.scss', ['css:dev']).on('change', livereload.changed);
	gulp.watch('src/js/**/*.js', ['js:dev']).on('change', livereload.changed);
});

// Tasks
gulp.task('default', ['css:dev', 'js:dev', 'copy', 'watch']);
gulp.task('build', ['css:dist', 'js:dist', 'copy']);