#!/usr/bin/env node

/* gobal process */
'use strict';
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var LineStream = require('lstream');
var through = require('through');
var trumpet = require('trumpet');
var depBuilder = require('./depBuilder.js');
var filterStartwith = require('./filterDepline.js');
var mydeps = {};
var builder = depBuilder(mydeps);


var possibleFileNames = ['Makefile', 'makefile'];
var cwd = process.cwd();

var hasMakeFile = possibleFileNames
  .map(function(fileName) {
    return path.join(cwd, fileName);
  })
  .some(function(absFileName) {
    return fs.existsSync(absFileName);
  });

// it does not works in windows it ignores case sensitive and sucks
if (!hasMakeFile) {
  console.error('don\'t have Makefile here ', cwd);
  process.exit(2);
}

var makeProcess = spawn('make', ['-d', '--dry-run']);
makeProcess.on('exit', function(code) {
  if (code !== 0) {
    console.log('make exited with code ' + code);
    console.log('please check make -d -dry-run workwith your makefile');
    process.exit(code);
  }
});

makeProcess.stdout
  .pipe(new LineStream())
  .pipe(filterStartwith)
  .pipe(builder);

var depsInjector = through(function() {
  this.queue('window.__dep = ' + JSON.stringify(mydeps));
});

console.log('test', __dirname);

makeProcess.stdout.on('finish', function() {
  var tr = trumpet();
  var _deps = tr.select('#deps').createStream();

  _deps.pipe(depsInjector).pipe(_deps);

  var htmlp = fs.createReadStream(path.join(__dirname, '../asset/_template.html'));
  var dest = fs.createWriteStream(path.join(process.cwd(), 'deps.html'));
  htmlp.pipe(tr).pipe(dest);

  htmlp.on('end', function() {
    console.log('Check this out');
    console.log('open deps.html in your browser');
  });
});