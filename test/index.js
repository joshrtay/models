var chai = require('chai');
var expect = chai.expect;
var model = require('../');

describe('models', function() {
  it('should work', function() {
    var User = model('user');
    
    User.attr('username', {type: 'string'});
    
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
    var User = model('user');
    
    User.attr('username', 'string');
    
    var Teacher = User.extend('teacher')
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
  
  it('should work with nested models', function() {
    var User = model('user');
    var Name = model('name');
    
    Name.attr('givenName', {type: 'string'});
    User.attr('name', Name);
    
    var doc = new User();
    expect(doc.get('name.givenName')).to.equal('');
  });
});