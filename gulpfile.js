var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var htmlmin = require('gulp-html-minifier');
var pump = require('pump');

gulp.task('uglify_js', function (cb) {
  pump([
        gulp.src('lib/shared/*.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('uglify_css', function () {
  gulp.src('css/*.css')
    .pipe(uglifycss())
    .pipe(gulp.dest('dist'));
});

gulp.task('minify_html', function() {
  gulp.src('templates/*.mu')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
});

gulp.task('default', ['uglify_js', 'uglify_css', 'minify_html']);
