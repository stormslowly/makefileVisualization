'use strict';
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var through = require('through');



gulp.task('default', function() {
  gulp.src(['./dndTree.js',
      './web/app.js',
    ])
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));

  console.log('tes');

});


var test = through(function(data){
  console.log(JSON.stringify(data));

},function(){
  console.log('end....');
});


gulp.task('test',function(){

  console.log('test');
  gulp.src('./web/*.js').pipe(test);

});