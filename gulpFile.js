'use strict';
var gulp = require('gulp');
var uglify = require('gulp-uglify');



gulp.task('default', function() {
  gulp.src(['./dndTree.js',
      './web/app.js',
    ])
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));

  console.log('tes');

});
