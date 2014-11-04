'use strict';
var expect = require('chai').expect;

var UArray = require('../lib/uarray.js');
describe('Unique Array', function() {

  var ua = null;

  beforeEach(function() {
    ua = [];
  });


  it('can push', function() {
    expect(ua.upush('first')).equal(1);

  });

  it('only push not-containing String item', function() {
    expect(ua.upush('first')).equal(1);
    expect(ua.upush('first')).equal(1);
    expect(ua.upush('second')).equal(2);
  });

  it('only push not-containning object item', function() {
    expect(ua.upush({
      a: 1
    })).to.equal(1);
    expect(ua.upush({
      a: 1
    })).to.equal(1);
    expect(ua.upush({
      a: 2
    })).to.equal(2);

  });

});