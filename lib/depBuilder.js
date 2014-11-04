'use strict';
var through = require('through');
var path = require('path');
var startWith = require('./startWith.js');

var getFullFileName = function(line) {
  var start, end;
  start = line.indexOf('`');
  end = line.indexOf('\'');
  return line.substr(start + 1, end - start - 1);
};

module.exports = function(deps) {
  var targetStack = [];
  var currentTarget = null;

  return through(function(data) {
    var line = data.toString();
    var fullName = getFullFileName(line);
    var baseName = path.basename(fullName);

    if (startWith(line, 'Considering target file')) {
      deps[currentTarget] &&
        deps[currentTarget].child.upush({
          fullName: fullName
        });

      deps[fullName] = deps[fullName] || {
        basename: baseName,
        child: []
      };
      targetStack.upush(currentTarget);
      currentTarget = fullName;
    } else if (startWith(line, 'Pruning file ')) {
      deps[currentTarget].child.upush({
        fullName: fullName
      });
    } else if (startWith(line, 'Finished prerequisites of target file')) {
      currentTarget = targetStack.pop();
    }
  }, function() {

    this.queue('window.__dep = ' + JSON.stringify(deps));
  });
};