module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist1.dest %>']
                }
            }
        },
        concat: {
                options: {
                    // define a string to put between each file in the concatenated output
                    separator: ';'
                },
                dist1: {
                    // the files to concatenate
                    src: ['src/app.js',
                        'src/**/*.js',
                        '!src/enlBase.js',
                        '!app/vendors.js'],
                    // the location of the resulting JS file
                    dest: 'app/dist/<%= pkg.name %>.js'
                },
                dist2: {
                    // the files to concatenate
                    src: ['app/spec/*.spec.js'],
                    // the location of the resulting JS file
                    dest: 'app/dist/<%= pkg.name %>Test.js'
                }
        },
        watch: {
            files: ['app/**/*.js', '!app/dist/*'],
            tasks: ['concat', 'uglify']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);

};