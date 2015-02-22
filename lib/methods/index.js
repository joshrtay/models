var _ = require('lodash');

module.exports = function(Model) {
  Model.on('configure', function(opts) {
    opts.methods = opts.methods || {};
    opts.statics = opts.statics || {};
  });
  
  Model.on('init', function(model) {  
    _.each(model.methods, function(fn, name) {
      model.prototype[name] = fn;
    });
    
    _.each(model.statics, function(fn, name) {
      model[name] = fn;
    });
  });
  
  Model.prototype.method = function(name, fn) {
    return this.extend(function(opts) {
      opts.methods[name] = fn;
    });
  };

  Model.prototype.static = function(name, fn) {
    return this.extend(function(opts) {
      opts.statics[name] = fn;
    });
  };
};