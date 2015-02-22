var chai = require('chai');
var expect = chai.expect;
var model = require('../');

describe('models', function() {
  it('should work', function() {
    var User = model('user')
      .attr('username', {type: 'string'});

    var doc = new User();
    expect(doc.get('username')).to.equal('');
    
    doc.set('username', 'test');
    expect(doc.get('username')).to.equal('test');
    
    doc.set('username', 1);
    expect(doc.get('username')).to.not.equal(1);
    expect(doc.get('username')).to.equal('1');
  });
});

describe('inheritance', function() {
  it('should work', function() {
    var User = model('user')
      .attr('username', 'string');
       
    var Teacher = User
      .attr('class', 'string');
    
    // Should inherit
    var doc = new Teacher();
    expect(doc.get('username')).to.equal('');
    expect(doc.get('class')).to.to.equal('');
    
    // Should not pollute the parent
    doc = new User();
    expect(doc.get('username')).to.equal('');
    expect(doc.get('class')).to.equal(undefined);
  });
});

describe('nesting', function() {
  it('should validate nested objects', function(done) {
    var User = model('user')
      .attr('name', model()
        .attr('familyName', {type: 'string', required: true})
        .attr('givenName', 'string'));
    
    var doc = new User();
    expect(doc.get('name.familyName')).to.equal('');
    expect(doc.get('name.givenName')).to.equal('');

    doc.validate(function(err) {
      expect(err).not.to.be.null;
      done();
    });
  });
  
  it('should set nested properties', function() {
    var User = model('user')
      .attr('name', model('name')
        .attr('familyName', 'string'));
      
    var doc = new User();
    doc.set('name.familyName', 'test');
    expect(doc.get('name.familyName')).to.equal('test');
  });
  
  it('should allow validators to be set on objects', function(done) {
    // Define a validator that expresses
    // a relation between two properties
    // on the root of this model
    var Name = model('name')
      .attr('familyName', 'string')
      .attr('givenName', 'string')
      .validator(function(value) {
        return !! (value.get('givenName') || value.get('familyName'));
      });
      
    var User = model('user')
      .attr('name', Name);
       
    var doc = new User();
    doc.validate(function(err) {
      expect(err).not.to.be.null;
      doc.set('name.givenName', 'test');
      doc.validate(function(err) {
        expect(err).to.be.null;
        doc.set('name.familyName', 'test');
        doc.set('name.givenName', null);
        doc.validate(function(err) {
          expect(err).to.be.null;
          doc.set('name.familyName', 'test');
          doc.validate(function(err) {
            expect(err).to.be.null;
            done();
          });
        });
      });
    });
  });
  
  it('should work with nested models', function() {
    var Name = model('name')
      .attr('givenName', {type: 'string'});
      
    var User = model('user')
      .attr('name', Name);
       
    var doc = new User();
    expect(doc.get('name.givenName')).to.equal('');
  });
});