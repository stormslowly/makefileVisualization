'use strict';
var expect = require('chai').expect;
var BuilderFactor = require('../lib/depBuilder.js');


describe('dependence Builder', function() {

  var builder = null;
  var dep = null;
  beforeEach(function() {
    dep = {};
    builder = BuilderFactor(dep);
  });
  afterEach(function() {
    dep = null;
  });

  it('should return empty object', function() {
    builder.end();

    builder.on('end', function() {
      expect(dep).to.deep.equal({});
    });

  });

  it('should work only one all target', function(done) {

    builder.on('end', function() {
      expect(dep).to.deep.equal({
        all: {
          basename: 'all',
          child: []
        }
      });
      done();
    });

    builder.write('Considering target file `all\'.');
    builder.write('Finished prerequisites of target file `all\'.');
    builder.end();
  });

  it('should work only one all target', function(done) {

    builder.on('end', function() {
      expect(dep).to.deep.equal({
        all: {
          basename: 'all',
          child: [{
            fullName: 'filea'
          }]
        },
        filea: {
          basename: 'filea',
          child: []
        }
      });
      done();
    });

    builder.write('Considering target file `all\'.');
    builder.write('Considering target file `filea\'.');
    builder.write('Finished prerequisites of target file `filea\'.');
    builder.write('Finished prerequisites of target file `all\'.');
    builder.end();
  });

  it('should work only one all target', function(done) {

    builder.on('end', function() {
      expect(dep).to.deep.equal({
        all: {
          basename: 'all',
          child: [{
            fullName: 'filea'
          }]
        },
        filea: {
          basename: 'filea',
          child: []
        }
      });
      done();
    });

    builder.write('Considering target file `all\'.');
    builder.write('Considering target file `filea\'.');
    builder.write('Finished prerequisites of target file `filea\'.');
    builder.write('Considering target file `filea\'.');
    builder.write('Finished prerequisites of target file `filea\'.');
    builder.write('Finished prerequisites of target file `all\'.');
    builder.end();
  });

});