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
let indexMain = [
    'js/chat.js',
    'js/swal.js',
    'js/events.js',
    'js/main.js',
    'js/utility.js',
    'js/variable-watch.js',
    'js/!(functions)*.js',
]
let indexVendor = [
    'js/vendor/jquery.js',
    'js/vendor/popper.js',
    'js/vendor/bootstrap.js',
    'js/vendor/handlebars.min.js',
    'js/vendor/swal.js',
    'js/vendor/lodash.js',
    'js/vendor/backbone.js',
    'js/vendor/cycle.js',
    'js/vendor/joint.js',
    'js/vendor/require.js',
]

let functionVendor = [
    'js/vendor/jquery.js',
    'js/vendor/popper.js',
    'js/vendor/bootstrap.js',
    'js/vendor/swal.js',
]

let functionMain = ['js/swal.js', 'js/events.js', 'js/functions.js']

let mainCss = [
    'css/vendor/bootstrap.min.css',
    'css/vendor/joint.css',
    'css/main.css',
    'css/chat.css',
]
let functionCss = ['css/vendor/bootstrap.min.css', 'css/functions.css']

gulp.task('concat', function () {
    gulp.src(indexVendor)
        .pipe(concat('indexVendor.js'))
        .pipe(uglify({ keep_fnames: true }))
        .pipe(gulp.dest('js/build'))
    gulp.src(indexMain)
        .pipe(concat('indexMain.js'))
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