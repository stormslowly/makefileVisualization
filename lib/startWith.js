'use strict';

module.exports = function(line, start) {
  return line.trimLeft().indexOf(start) === 0;
};