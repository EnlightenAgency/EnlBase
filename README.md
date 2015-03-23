#Enl Base Project

The Enlighten Base Project is a sample or starter project for proof of concept and a reference guide for structuring projects at Enlighten.  It is not set in stone, as things change too fast, and a single base will not fit all projects.  

**Recommended File Structure:**

    |-Dist - distribution or build files, only generated code belongs in the dist folder
    |-Src - development files
        |-css
        |-images
        |-js
    |-Docs - documentation or information files
    |-Tests - unit tests

**Files that belong in the root:**

 - `.git` (or other source control)
 - `.gitignore` (if using git)
 - `README.md` - project notes, setup instructions, changelog
 - `package.json` - for Node dependencies and build tools
 - `Gulpfile.js (or Gruntfile.js)` - build tool files

**Files that should not be source controlled:**

 - `/node_modules` - for Node dependencies and build tools
 - `/bower_components` - if using bower for client packages
 - `/dist` - the compiled version will likely not be source controlled unless using source control for deployment

**Installation:**

 - `npm install` to install the gulp packages via the `package.json` file

 Install required Gulp Plugins:

	The "--save-dev" flag will automatically add it to your package.json.  
	If the files already exist there, you don't need that flag, and can just run "npm install"

	To install the above plugins at the command prompt:

	npm install gulp --save-dev
	npm install gulp-util --save-dev
	npm install gulp-webserver --save-dev
	npm install gulp-livereload --save-dev
	npm install filesize --save-dev

	npm install gulp-sass --save-dev   // LibSass = faster than Ruby Sass, not quite 100% Sass compliant.  "npm install gulp-ruby-sass" for Ruby Sass
	npm install gulp-sourcemaps --save-dev
	npm install gulp-autoprefixer --save-dev

	npm install gulp-concat --save-dev
	npm install gulp-uglify --save-dev
	npm install gulp-jshint --save-dev
	npm install map-stream --save-dev

	npm install gulp-imagemin --save-dev
		npm install imagemin-gifsicle --save-dev
		npm install imagemin-optipng --save-dev
		npm install imagemin-pngquant --save-dev
		npm install imagemin-mozjpeg --save-dev
		npm install imagemin-svgo --save-dev

	To install all of the above at one time, run the following line at the command prompt:
		npm install gulp gulp-util gulp-webserver gulp-livereload filesize gulp-sass gulp-sourcemaps gulp-autoprefixer gulp-concat gulp-uglify gulp-jshint map-stream gulp-imagemin imagemin-gifsicle imagemin-optipng imagemin-pngquant imagemin-mozjpeg imagemin-svgo --save-dev

