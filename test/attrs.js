/**
 * Modules
 */
var Model = require('../lib/model');
var attrs  = require('../lib/attrs');

/**
 * Testing Modules
 */
var chai = require('chai');
var expect = chai.expect;


describe('Model.use attrs', function() {
  before(function() {
    Model = Model.use(attrs);
  })

  it.only('should be able to create document', function() {
    var doc = Model({foo: 'bar', nested: {foo: 'bat'}});
    expect(doc.get('foo').value).to.equal('bar');
    expect(doc.get('nested.foo').value).to.equal('bat');
  });
  
});