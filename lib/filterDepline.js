'use strict';
var through = require('through');
// module.exports = function() {


// }

var starts = ['File',
  'Finished prerequisites of target file',
  'Pruning file',
  'Considering target file'
];

var startWith = function(line, start) {
  return line.trimLeft().indexOf(start) === 0;
};

module.exports = through(function write(data) {
  var str = data.toString();
  for (var i = 0, l = starts.length; i < l; i++) {
    if (startWith(str, starts[i])) {
      this.queue(str + '\n');
      return;
    }
  }
});