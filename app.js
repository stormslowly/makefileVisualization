'use strict';
/*global require,console*/

var fs = require('fs');
var path = require('path');

var indentAt = function(line) {

  var indent = 0;
  for (var i = 0, l = line.length; i < l; i++) {
    if (line[i] !== ' ') {
      break;
    }
    indent++;
  }

  return indent;
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

fs.readFile('clean.make.log', 'utf-8', function(err, content) {

  var lines = content.split('\n');
  var deps = {};
  var targetStack = [];
  // deps.all = {
  //   name: 'all',
  //   childrens: []
  // };

  var currentTarget = null;
  // targetStack.push(currentTarget);


  for (var i = 0,l=lines.length; i < l; i++) {
    var line = lines[i];
    var fullName = getFullFileName(line);
    var baseName = path.basename(fullName);
    var indent = indentAt(line);

    console.log(indentAt(line), baseName, fullName);

    if (startWith(line, 'Considering target file')) {

      deps[currentTarget]&&
        deps[currentTarget].child.push({fullName: fullName});

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
  }

  fs.writeFile('dep.json',JSON.stringify(deps),'utf-8',function(e){
    if(e) throw e;
    console.log('file saved');
  });






  // console.log(JSON.stringify(deps));
  console.log(deps.dogfooding);
});
