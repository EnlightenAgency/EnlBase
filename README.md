#Enl Base Project

The Enlighten Base Project is a sample or starter project for proof of concept and a reference guide for structuring projects at Enlighten.  It is not set in stone, as things change too fast, and a single base will not fit all projects.  

Recommended File Structure:

    |-Dist - distribution or build files, only generated code belongs in the dist folder
    |-Src - development files
        |-css
        |-images
        |-js
    |-Docs - documentation or information files
    |-Tests - unit tests

Files that belong in the root:

 - `.git` (or other source control)
 - `.gitignore` (if using git)
 - `README.md` - project notes, setup instructions, changelog
 - `package.json` - for Node dependencies and build tools
 - `Gulpfile.js (or Gruntfile.js)` - build tool files

Files that should not be source controlled:

 - `/node_modules` - for Node dependencies and build tools
 - `/bower_components` - if using bower for client packages
 - `/dist` - the compiled version will likely not be source controlled unless using source control for deployment
