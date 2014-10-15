'use strict';
var through = require('through');
var startWith = require('./startWith.js');

var _starts = ['File',
  'Finished prerequisites of target file',
  'Pruning file',
  'Considering target file'
];

module.exports = through(function write(data) {
  var str = data.toString();
  for (var i = 0, l = _starts.length; i < l; i++) {
    if (startWith(str, _starts[i])) {
      this.queue(str + '\n');
      return;
    }
  }
});