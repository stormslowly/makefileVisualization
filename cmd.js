'use strict';

var path = require('path');
var spawn = require('child_process').spawn;
var LineStream = require('lstream');
var through = require('through');



var starts = ['File',
  'Finished prerequisites of target file',
  'Pruning file',
  'Considering target file'
];

var startWith = function(line, start) {
  return line.trimLeft().indexOf(start) === 0;
};

var getFullFileName = function(line) {
  var start, end;
  start = line.indexOf('`');
  end = line.indexOf('\'');
  return line.substr(start + 1, end - start - 1);
};

var startWith = function(line, t) {
  return line.trimLeft().search(t) === 0;
};

var filter = through(function write(data) {

  var str = data.toString();

  for (var i = 0, l = starts.length; i < l; i++) {
    if (startWith(str, starts[i])) {

      this.queue(str + '\n');
      return;
    }
  }
});


var depBuilder = function() {

  var deps = {};
  var targetStack = [];
  var currentTarget = null;

  return through(function(data) {
    // console.log(data);
    var line = data.toString();
    var fullName = getFullFileName(line);
    var baseName = path.basename(fullName);

    if (startWith(line, 'Considering target file')) {
      deps[currentTarget] &&
        deps[currentTarget].child.push({
          fullName: fullName
        });
      deps[fullName] = deps[fullName] || {
        basename: baseName,
        child: []
      };
      targetStack.push(currentTarget);
      currentTarget = fullName;

    } else if (startWith(line, 'Pruning file ')) {
      deps[currentTarget].child.push({
        fullName: fullName
      });
    } else if (startWith(line, 'Finished prerequisites of target file')) {
      currentTarget = targetStack.pop();
    }
  }, function() {

    this.queue(JSON.stringify(deps));
    console.log('end here!');
  });
};

var ls = spawn('cat', ['make.log']);


ls.stdout
  .pipe(new LineStream())
  .pipe(filter)
  .pipe(depBuilder())
  .pipe(process.stdout);