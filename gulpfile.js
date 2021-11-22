/*
 # *************************************************************************************
 # Copyright (C) 2021 Ritwik Murali, Harshit Agarwal, Rajkumar S, Gali Mary Sanjana
 # This file is part of Flowgramming <https://github.com/flowgrammers-org/flowgramming>.
 #
 # Flowgramming is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # Flowgramming is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with Flowgramming.  If not, see <http://www.gnu.org/licenses/>.
 # *************************************************************************************
 */

const gulp = require('gulp')
const concat = require('gulp-concat')
const nodemon = require('gulp-nodemon')
const uglify = require('gulp-uglify-es').default
const uglifyCss = require('gulp-uglifycss')
let watchTask, nodemonTask

function stopScripts() {
    watchTask()
    nodemonTask()
}
let indexMain = ['js/main.js', 'js/!(functions)*.js']
let indexVendor = [
    'js/vendor/fileSaver.min.js',
    'js/vendor/jszip.min.js',
    'js/vendor/jquery.js',
    'js/vendor/popper.js',
    'js/vendor/bootstrap.js',
    'js/vendor/handlebars.min.js',
    'js/vendor/swal.js',
    'js/vendor/lodash.js',
    'js/vendor/backbone.js',
    'js/vendor/cycle.js',
    'js/vendor/joint.js',
    'js/vendor/require.js'
]

let functionVendor = [
    'js/vendor/jquery.js',
    'js/vendor/popper.js',
    'js/vendor/bootstrap.js',
    'js/vendor/swal.js',
]

let functionMain = [
    'js/swal.js',
    'js/events.js',
    'js/tab.js',
    'js/functions.js',
    'js/vendor/cycle.js',
    'js/save.js',
]

let mainCss = [
    'css/vendor/bootstrap.min.css',
    'css/vendor/joint.css',
    'css/main.css',
    'css/chat.css',
]
let functionCss = ['css/vendor/bootstrap.min.css', 'css/functions.css']
let codeCss = [
    'css/vendor/bootstrap.min.css',
    'css/code.css',
    'css/vendor/prism.css',
]

let codeVendor = [
    'js/vendor/jquery.js',
    'js/vendor/bootstrap.js',
    'js/vendor/prism.js',
]
let codeMain = ['js/tab.js', 'js/save.js']
gulp.task('concat', function () {
    gulp.src(indexVendor)
        .pipe(concat('indexVendor.js'))
        .pipe(uglify({ keep_fnames: true }))
        .pipe(gulp.dest('js/build'))
    gulp.src(indexMain)
        .pipe(concat('indexMain.js'))
        .pipe(uglify({ keep_fnames: true }))
        .pipe(gulp.dest('js/build'))
    gulp.src(codeMain)
        .pipe(concat('codeMain.js'))
        .pipe(uglify({ keep_fnames: true }))
        .pipe(gulp.dest('js/build'))
    gulp.src(codeVendor)
        .pipe(concat('codeVendor.js'))
        .pipe(uglify({ keep_fnames: true }))
        .pipe(gulp.dest('js/build'))
    gulp.src(functionVendor)
        .pipe(concat('functionVendor.js'))
        .pipe(uglify({ keep_fnames: true }))
        .pipe(gulp.dest('js/build'))
    gulp.src(functionMain)
        .pipe(concat('functionMain.js'))
        .pipe(uglify({ keep_fnames: true }))
        .pipe(gulp.dest('js/build'))
    gulp.src(mainCss)
        .pipe(concat('main.css'))
        .pipe(
            uglifyCss({
                maxLineLen: 80,
                uglyComments: true,
            })
        )
        .pipe(gulp.dest('css/build'))
    gulp.src(codeCss)
        .pipe(concat('code.css'))
        .pipe(
            uglifyCss({
                maxLineLen: 80,
                uglyComments: true,
            })
        )
        .pipe(gulp.dest('css/build'))
    return gulp
        .src(functionCss)
        .pipe(concat('functions.css'))
        .pipe(
            uglifyCss({
                maxLineLen: 80,
                uglyComments: true,
            })
        )
        .pipe(gulp.dest('css/build'))
})

gulp.task('watch', function (done) {
    watchTask = done
    return gulp.watch(['js/*.js', 'css/*.css'], gulp.series('concat'))
})

gulp.task('start', function (done) {
    nodemonTask = done
    nodemon({
        script: 'index.js',
        ext: 'js html',
        env: { NODE_ENV: 'development' },
        ignore: ['assets/', 'js/vendor/', '*/build/', 'css/vendor'],
        done: stopScripts,
    })
})
gulp.task('default', gulp.series('concat', gulp.parallel('watch', 'start')))
