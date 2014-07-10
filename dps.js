'use strict';
var fs = require('fs');
var deps = require('./dep.json');
var path = require('path');

var tree = {};

var dps = function(fullname, children) {

  var d = deps[fullname];

  if (d.child && d.child.length > 0) {

    for (var i = 0, l = d.child.length; i < l; i++) {
      var c = d.child[i];
      var newNode = {
        fullname :  c.fullName,
        name:  path.basename(c.fullName),
        children: []
      };

      children.push(newNode);

      dps(c.fullName, newNode.children);
    }
  }
  return;
};

tree = {
  name: 'all',
  fullname:'all',
  children: []
};

dps('.intermediate/src/prb.ccc', tree.children);

console.log(JSON.stringify(tree));



fs.writeFile('maked.json', JSON.stringify(tree), function(err) {
  if (err) {
    throw err;
  }
  console.log('done');

});
