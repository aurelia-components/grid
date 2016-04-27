var gulp = require('gulp');
var paths = require('../paths');
var jade = require('gulp-jade');
var path = require('path');
var del = require('del');
var runSequence = require('run-sequence');

function compileJade(event) {
  //logWatchEventInfo('Jade compile', event);
  var destPath = path.relative(paths.root, event.path);
  console.log(destPath)
  destPath = path.dirname(destPath);
  console.log(event.path)
  console.log(destPath)
  gulp.src(event.path)
    .pipe(jade({
      pretty: true
    }))
    //.pipe(gulp.dest(destPath));
    .pipe(gulp.dest('./src/' + destPath));
}

gulp.task('watch', ['prep'], function () {
  gulp.watch([paths.jade, 'index.jade'], compileJade);
});

gulp.task('prep', function (callback) {
  return runSequence(
    'rm-html',
    'compile-jade-index',
    'compile-jade',
    callback
  );
});

gulp.task('compile-jade-index', function () {
  return gulp.src('index.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('compile-jade', function () {
  return gulp.src(paths.jade)
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('src/.'));
});

gulp.task('clean-custom', function (cb) {
  del([paths.html, 'index.html', 'styles/styles.css'], cb);
});

