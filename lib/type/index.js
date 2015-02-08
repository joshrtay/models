var ware = require('ware');

function Type(opts) {   
  this.validators = [];
  this.casters = [];
  this.getters = [];
  this.setters = [];

  if(opts) {
    var parentType = opts.type || opts;
    if('string' === typeof parentType)
      parentType = require('./predefined')[parentType];
    this.inherit(parentType);
    
    if(opts.required) {
      this.addValidator(this.requiredValidator, 'required');
    }
  }
}

Type.prototype.requiredValidator = function(value, cb) {
  cb(!! value);
};

Type.prototype.inherit = function(type) {
  this.validators = this.validators.concat(type.validators);
  this.casters = this.casters.concat(type.casters);
  this.getters = this.getters.concat(type.getters);
  this.setters = this.setters.concat(type.setters);
  this.requiredValidator = type.requiredValidator;
  return this;
};

Type.prototype.addValidator = function(fn, key) {
  this.validators.push([fn, key]);
};

Type.prototype.validate = function(value, cb) {
  var mw = ware();
  
  this.validators.forEach(function(validator) {
    mw.use(function(value, next) {
      var fn = validator[0];
      fn.length === 1
        ? handle(fn(value))
        : fn(value, handle);
        
      function handle(valid) {
        if(valid === false) {
          var err = new Error();
          err.key = validator[1];
          return next(err);
        }       
        
        next(null, value);
      }
    });
  });
  
  mw.run(value, cb);
};

Type.prototype.addCaster = function(fn) {
  this.casters.push(fn);
};

Type.prototype.cast = function(value) {
  this.casters.forEach(function(fn) {
    value = fn(value);
  });
  
  return value;
};

Type.prototype.get = function(fn) {
  this.getters.push(fn);
};

Type.prototype.set = function(fn) {
  this.setters.push(fn);
};

Type.prototype.runSetters = function(value, context) {
  this.setters.forEach(function(fn) {
    value = fn.call(context, value);
  });
  
  return value;
};

Type.prototype.runGetters = function(value, context) {
  this.getters.forEach(function(fn) {
    value = fn.call(context, value);
  });
  
  return value;
}

module.exports = Type;