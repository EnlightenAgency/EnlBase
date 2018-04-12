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
4. Change all references to namespaced files throughout project, particularly `webpack.config.js` and `index.html`
5. Change the namespaced root object in JavaScript (defined in `index.html`, set in `ENL.base.js`, and referenced in `ENL.init.js`; it may also be extended in other files such as components, pages, or utils)
6. Run `npm run build`
7. ...
8. Profit

###Files that belong in the root:

 - `.git` (or other source control)
 - `.gitignore` (if using git)
 - `README.md` - project notes, setup instructions, changelog
 - `package.json` - for Node dependencies and build tools
 - `webpack.config.js` - build tool files
 - `.eslintrc` (for eslint rules - if using eslint)

###Files that should not be source controlled:

 - `/node_modules` - for Node dependencies and build tools
 - `/bower_components` - if using bower for client packages
 - `/dist` - the compiled version will likely not be source controlled unless using source control for deployment

###Node Versioning

    Last known Working (2/13/2018):
    	- node: v8.11.1 (LTS)
    		https://github.com/nodejs/LTS#lts_schedule
        - npm: v5.6.0
        	- https://www.npmjs.com/package/npm

    Switch Node Version (using NVM) - "nvm use [version]"  NOTE: If desired node version is not installed, install it using "nvm install [version]"
	Upgrade/Downgrade NPM - "npm install -g npm@[version]"

###Installation:
 - `npm install` to install the webpack packages via the `package.json` file

###Dev Dependency Definitions
 - "clean-webpack-plugin": "^0.1.19",
		-cleans old webpack files before build
 - "copy-webpack-plugin": "^4.5.1",
		-allows copying of files from one location to another
 - "css-loader": "^0.28.11",
		-compiles css and applies auto-prefixer
 - "del": "^3.0.0",
		-allows webpack to delete files
 - "eslint": "^4.19.1",
		-js linter tool
 - "eslint-loader": "^2.0.0",
		-load js linter
 - "file-loader": "^1.1.11",
		-allows loading of additional file types
 - "html-loader": "^0.5.5",
		-loads html files
 - "image-webpack-loader": "^4.2.0",
		-loads and parses images
 - "mini-css-extract-plugin": "^0.4.0",
		-extracts css to external file for loading in case javascript breaks.
 - "node-sass": "^4.8.3",
		-parses scss and sass files
 - "sass-loader": "^6.0.7",
		-loads scss and sass files for parsing
 - "style-loader": "^0.20.3",
		-loads style sheets for parsing
 - "ts-loader": "^4.1.0",
		-loads typescript files for parsing
 - "tslint": "^5.9.1",
		-ts linter tool
 - "tslint-loader": "^3.6.0",
		-loads ts files for compilation
 - "typescript": "^2.8.1",
		-compiles typescript files to ES5.
 - "uglifyjs-webpack-plugin": "^1.2.4",
		-minifies javascript after compilation
 - "webpack": "^4.4.1",
		-build tool to run loaders
 - "webpack-cli": "^2.0.13",
		-cli tools to run webpack from command line
 - "webpack-serve": "^0.3.0"
		-spins up development node server for testing