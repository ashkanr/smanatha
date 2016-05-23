var hermesLoad = require('../hermes-load');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

describe('hermes-load', function(){
  it('should fail if there is no plugin with connect definition', function(){
    expect(hermesLoad).to.throw(TypeError);
  });
});
