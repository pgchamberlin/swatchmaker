var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var pump = require('pump');

gulp.task('js', function (cb) {
  pump([
        gulp.src('lib/shared/*.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('css', function () {
  gulp.src('css/*.css')
    .pipe(uglifycss())
    .pipe(gulp.dest('dist'));
});

// Default task
gulp.task('default', ['js', 'css']);
