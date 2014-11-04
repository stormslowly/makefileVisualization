'use strict';

var eql = require('deep-eql');

Array.prototype.upush = Array.prototype.upush || function() {
  var self = this;

  var args = Array.prototype.slice.call(arguments);

  args.forEach(function(item) {

    var hasItem = self.some(function(obj) {
      return eql(obj, item);
    });

    if (!hasItem) {
      self.push(item);
    }
  });
  return this.length;
};


module.exports = null;