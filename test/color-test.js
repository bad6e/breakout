const chai = require('chai');
const assert = chai.assert;

const Colors = require('../lib/colors');

describe('colors', function () {

  it('should instatiate a new color', function () {
    let color = Colors.colors();
    assert.isArray(color);
  });

  it('should have 60 colors', function () {
    let color = Colors.colors();
    assert.equal(color.length, 60);
  });

  it('should have pink as first color', function(){
    let color = Colors.colors();
    assert.equal(color[0], "#CC3ED0");
  });

  it('should have red as second color', function(){
    let color = Colors.colors();
    assert.equal(color[1], "#F95255");
  });

  it('should have orange as third color', function(){
    let color = Colors.colors();
    assert.equal(color[2], "#FE801A");
  });

  it('should have yellow as fourth color', function(){
    let color = Colors.colors();
    assert.equal(color[3], "#FF911B");
  });

  it('should have green as fifth color', function(){
    let color = Colors.colors();
    assert.equal(color[4], "#10AC24");
  });

  it('should have blue as sixth color', function(){
    let color = Colors.colors();
    assert.equal(color[5], "#6667FF");
  });
});