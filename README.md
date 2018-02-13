#PD Front End Base Project

The Perficient Digital Front End Base Project is a sample or starter project for proof of concept and a reference guide for structuring a project's front end code at Perficient Digital.  It is not set in stone, as things change too fast, and a single base will not fit all projects.  

**See the [Perficient Digital Front End Standards](https://github.com/EnlightenAgency/EnlBase/wiki/Enlighten-Front-End-Standards) Wiki for more details.**

###Recommended File Structure:

    |-Dist - distribution or build files, only generated code belongs in the dist folder
    |-Src - development files
        |-css
        |-images
        |-js
    |-Docs - documentation or information files
    |-Tests - unit tests

###Quick Start
1. Download base project git repo
2. Run `npm install`
3. Rename all namespaced files `ENL.base.js`, `ENL.init.js`, `ENL.styles.scss`; changing the namespace to the project's new namespace (i.e. `THF.styles.scss`, `UDR.base.js`, `UMA.init.js`, etc.)
4. Change all references to namespaced files throughout project, particularly `Gulpfile.js` and `index.html`
5. Change the namespaced root object in JavaScript (defined in `index.html`, set in `ENL.base.js`, and referenced in `ENL.init.js`; it may also be extended in other files such as components, pages, or utils)
6. Run `gulp`
7. ...
8. Profit

###Files that belong in the root:

 - `.git` (or other source control)
 - `.gitignore` (if using git)
 - `README.md` - project notes, setup instructions, changelog
 - `package.json` - for Node dependencies and build tools
 - `Gulpfile.js (or Gruntfile.js)` - build tool files
 - `.eslintrc` (for eslint rules - if using eslint)

###Files that should not be source controlled:

 - `/node_modules` - for Node dependencies and build tools
 - `/bower_components` - if using bower for client packages
 - `/dist` - the compiled version will likely not be source controlled unless using source control for deployment

###Node Versioning

    Last known Working (2/13/2018):
    	- node: v8.9.4 (LTS)
    		https://github.com/nodejs/LTS#lts_schedule
        - npm: v5.6.0
        	- https://www.npmjs.com/package/npm

    Switch Node Version (using NVM) - "nvm use [version]"  NOTE: If desired node version is not installed, install it using "nvm install [version]"
	Upgrade/Downgrade NPM - "npm install -g npm@[version]"

###Installation:
 - `npm install gulp@latest -g`
 - `npm install` to install the gulp packages via the `package.json` file
 - See the [Gulp Setup](https://github.com/EnlightenAgency/EnlBase/wiki/Gulp-Setup) for information on getting dependencies necessary for building the site.

###Dev Dependency Definitions

	- gulp: A task/build runner that can automate tasks like, CSS and JavaScript minification, file compression, etc.
		- https://github.com/gulpjs/gulp/tree/master/docs
	- gulp-autoprefixer: Adds verdor prefixes (-webkit-, -mos-, -ms-) options to CSS properties to help ensure cross-browser compatibility
		- https://github.com/postcss/autoprefixer
	- gulp-concat: Files will be concatenated in the order that they are specified in the gulp.src function (eg. return gulp.src(['./lib/file3.js', './lib/file1.js', './lib/file2.js']))
		- https://github.com/contra/gulp-concat
	- gulp-eslint: Code linting is used to find problematic patterns or code that doesn’t adhere to certain style guidelines.
		- https://www.npmjs.com/package/gulp-eslint
		- http://eslint.org/docs/about/
	- gulp-filesize: Extension to log filesizes in human readable Strings to the console.
		- https://github.com/Metrime/gulp-filesize
	- gulp-imagemin: Compresses GIF, JPEG, PNG, and SVG images
		- https://www.npmjs.com/package/gulp-imagemin
	- gulp-livereload: Automatically refreshes browser after saving CSS, image files, etc.
		- https://www.npmjs.com/package/gulp-livereload
	- gulp-load-plugins: Loads gulp plugins from package dependencies and attaches them to an object of your choice.
		- https://www.npmjs.com/package/gulp-load-plugins
	- gulp-sass: Compiles SASS files into CSS file
		- https://www.npmjs.com/package/gulp-sass
	- gulp-sourcemaps: Maps your CSS styles to the correct .scss file instead of the compiled .css in dist. Example: The browswer console will reveal that your body style is coming from global.scss line 28 instead of styles.css line 1064. This makes tracking down your styles for "debugging" much easier.
		- https://www.npmjs.com/package/gulp-sourcemaps
	- gulp-svg-sprite: Gulp plugin wrapping around svg-sprite which takes a bunch of SVG files, optimizes them and bakes them into SVG sprites of several types.
		- https://github.com/jkphl/gulp-svg-sprite
	- gulp-uglify: Minifies JS files
		- https://www.npmjs.com/package/gulp-uglify
	- gulp-util: Utilities for gulp plugins (gutil.log, gutil.replaceExtension)
		- https://www.npmjs.com/package/gulp-util
	- gulp-webserver: Gulp plugin to run a local webserver with LiveReload
		- https://www.npmjs.com/package/gulp-webserver
	- imagemin-gifsicle: Added options for image optimization - gifs
		- https://github.com/imagemin/imagemin-gifsicle
	- imagemin-mozjpeg: Added options for image optimization - jpeg
		- https://www.npmjs.com/package/mozjpeg
	- imagemin-optipng:Added options for image optimization - png
		- https://www.npmjs.com/package/imagemin-optipng
	- imagemin-pngquant: Added options for image optimization - png
		- https://www.npmjs.com/package/imagemin-pngquant
	- imagemin-svgo: Added options for image optimization - svg
		- https://www.npmjs.com/package/imagemin-svgo
	- map-stream: Create a through stream from an asyncronous function.
		- https://www.npmjs.com/package/map-stream
	- merge-stream: Create a stream that emits events from multiple other streams.
		- https://www.npmjs.com/package/merge-stream 