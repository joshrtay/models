/**
 * Modules
 */
var Model = require('../lib/model');


/**
 * Testing Modules
 */
var chai = require('chai');
var expect = chai.expect;


describe('Model', function() {
  describe('root', function() {
    it('should have is and use', function() {
      expect(Model.is).to.be.a.Function;
      expect(Model.use).to.be.a.Function;
    });

    it('should create a model', function() {
      var model = Model();
      expect(Model.is(model)).to.be.true;
    });

  })
  
  describe('plugins', function() {
    it('should create a new Model and add statics and methods', function() {
      var User = Model
        .use(function(Model) {
          Model.prototype.isUser = function() {
            return true;
          }
          Model.type = 'user';
        });

      var user = User();
      expect(user.isUser()).to.be.true;
      expect(User.type).to.equal('user');
    });

    it('should create a new Model and instanceof should work', function() {
      var User = Model
        .use(function(Model) {
          Model.type = 'user';
        });

      var Activity = Model
        .use(function(Model) {
          Model.type = 'Activity';
        });

      var user = User();
      expect(User.is(user)).to.be.true;
      expect(Model.is(user)).to.be.true;
      expect(Activity.is(user)).to.be.false;
    });
  });
  

  describe('hooks', function() {
    it('should be immutable', function() {
      var Hooked = Model.on('initializing', function(model, doc) {
        model.hooked = true;
      });

      expect(Hooked === Model).to.be.false;
    });

    it('initializing should be called on instantiation', function() {
      var Hooked = Model.on('initializing', function(model, doc) {
        model.hooked = true;
      });
      var doc = Hooked();
      expect(doc.hooked).to.be.true;
    });

    it('initializing hooks should able to transform type', function() {
      var User = Model.use(function(Model) {
        var types = {};

        Model.prototype.type = function() {
          return 'user';
        };

        Model.type = function(name, M) {
          types[name] = M;
        };

        Model.on('initializing', function(model, doc) {
          if (doc && doc.type && types[doc.type] && types[doc.type] !== model.model) {
            return types[doc.type](doc);
          }
        });

      });

      var Student = User.use(function(Model) {
        var type = Model.prototype.type;
        Model.prototype.type = function() {
          return type() + ':student' ;
        };
        Model.type('student', Model);
      });

      var user = User();
      var student = Student();
      var student2 = User({type: 'student'});

      expect(user.type()).to.equal('user');
      expect(student.type()).to.equal('user:student');
      expect(student2.type()).to.equal('user:student');



    });

  });
  


});