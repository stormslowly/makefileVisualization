'use strict';
/* global d3,drawTree*/


var basename = function (path){
  var parts = path.split('/');
  return parts[parts.length-1];
};

angular.module('vmake', [])
  .controller('main', function($scope) {
    d3.json('../dep.json', function(err, json) {
      // $scope.data = json;
      $scope.$apply(function() {
        $scope.data = json;
        $scope.targets = Object.keys(json);
      });
      // console.log('i got data', $scope.data);
    });


    var dps = function(fullname, children) {
      var d = $scope.data[fullname];
      if (d.child && d.child.length > 0) {

        for (var i = 0, l = d.child.length; i < l; i++) {
          var c = d.child[i];
          var newNode = {
            fullname :  c.fullName,
            name: basename(c.fullName),
            children: []
          };
          children.push(newNode);
          dps(c.fullName, newNode.children);
        }
      }
      return;
    };



    $scope.click= function(target){
      console.log(arguments);
      var tree ={
        name: basename(target),
        fullname: target,
        children: []
      };
      dps(target, tree.children);
      console.log(tree);
      drawTree(null,tree);
    };


  })
  .filter('shortName', function() {
    return function(name, len) {
      if (name.length < len) {
        return name;
      } else {
        return '...' + name.substr(name.length - len, name.length - 1);
      }
      // return angularDateFilter(theDate, 'dd MMMM @ HH:mm:ss');
    };
  });

angular.module('vmake')
  .filter('byBasename', function() {

    return function(fullnames, key,delimiter) {
      var out = [];
      var _delimiter = delimiter||'/';
      if (fullnames && key) {
        for (var i = 0, l = fullnames.length; i < l; i++) {
          var fullname = fullnames[i];
          var parts = fullname.split(_delimiter);
          var basename = parts[parts.length - 1];
          if (basename.indexOf(key) >=0 ) {
            out.push(fullname);
          }
        }
        return out;
      }
      return fullnames||out;
    };
  });
