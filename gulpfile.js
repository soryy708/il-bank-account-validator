var gulp = require('gulp');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

gulp.task('build', function() {
    console.log("Creating il-bank-account-validator.js");
    console.log("Use it in browsers");

    gulp.src('index.js')
    .pipe(browserify({standalone: 'bankAccountValidation'}))
    .pipe(concat('il-bank-account-validator.js'))
    .pipe(gulp.dest('.'))
    .pipe(uglify())
    .pipe(concat('il-bank-account-validator.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
    gulp.watch('index.js', ['build']);
});

gulp.task('default', ['watch', 'build']);