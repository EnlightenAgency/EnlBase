#Enl Front End Base Project

The Enlighten Front End Base Project is a sample or starter project for proof of concept and a reference guide for structuring a project's front end code at Enlighten.  It is not set in stone, as things change too fast, and a single base will not fit all projects.  

**See the [Enlighten Front End Standards](https://github.com/EnlightenAgency/EnlBase/wiki/Enlighten-Front-End-Standards) Wiki for more details.**

###Recommended File Structure:

    |-Dist - distribution or build files, only generated code belongs in the dist folder
    |-Src - development files
        |-css
        |-images
        |-js
    |-Docs - documentation or information files
    |-Tests - unit tests

###Files that belong in the root:

 - `.git` (or other source control)
 - `.gitignore` (if using git)
 - `README.md` - project notes, setup instructions, changelog
 - `package.json` - for Node dependencies and build tools
 - `Gulpfile.js (or Gruntfile.js)` - build tool files
 - '.eslintrc' (for eslint rules - if using eslint)

###Files that should not be source controlled:

 - `/node_modules` - for Node dependencies and build tools
 - `/bower_components` - if using bower for client packages
 - `/dist` - the compiled version will likely not be source controlled unless using source control for deployment

###Installation:

 - `npm install` to install the gulp packages via the `package.json` file
 - See the [Gulp Setup](https://github.com/EnlightenAgency/EnlBase/wiki/Gulp-Setup) for information on getting dependencies necessary for building the site.
