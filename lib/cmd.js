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

var starts = ['File',
  'Finished prerequisites of target file',
  'Pruning file',
  'Considering target file'
];

var startWith = function(line, start) {
  return line.trimLeft().indexOf(start) === 0;
};

var filterStartwith = through(function write(data) {
  var str = data.toString();
  for (var i = 0, l = starts.length; i < l; i++) {
    if (startWith(str, starts[i])) {
      this.queue(str + '\n');
      return;
    }
  }
});


var makeProcess = spawn('make', ['-q']);
var mydeps = {};

var builder = depBuilder(mydeps);

makeProcess.on('close', function(code) {
  if (code !== 0) {
    console.log('make exited with code ' + code);
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