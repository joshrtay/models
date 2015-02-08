var chai = require('chai');
var expect = chai.expect;
var model = require('../');

describe('models', function() {
  it('should work', function() {
    var User = model('user');
    
    User.path('username', {type: 'string'});
    
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
    
    User.path('username', 'string');
    
    var Teacher = model('teacher')
      .extend(User)
      .path('class', 'string');
    
    var doc = new Teacher();
    expect(doc.get('username')).to.equal('');
    expect(doc.get('class')).to.to.equal('');
  });
});

describe('nesting', function() {
  it('should validate nested objects', function(done) {   
    var User = model('user')
      .path('name', model()
        .path('familyName', {type: 'string', required: true})
        .path('givenName', 'string'));
    
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
    
    Name.path('givenName', {type: 'string'});
    User.path('name', Name);
    
    var doc = new User();
    expect(doc.get('name.givenName')).to.equal('');
  });
});