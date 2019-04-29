var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var vinylSource = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var browserify = require('browserify');

gulp.task('build', function() {
    console.log("Creating il-bank-account-validator.js");
    console.log("Use it in browsers");

    const browserified = browserify({
        entries: './index.js',
        standalone: 'bankAccountValidation'
    });

    return browserified.bundle()
    .pipe(vinylSource('il-bank-account-validator.js'))
    .pipe(vinylBuffer())
    .pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(concat('il-bank-account-validator.min.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
    gulp.watch('index.js', gulp.series['build']);
});

gulp.task('default', gulp.series('watch', 'build'));
