var _ = require('lodash');

module.exports = function(model) {
  model.methods = model.methods || {};
  model.statics = model.statics || {};
  
  _.each(model.methods, function(fn, name) {
    model.prototype[name] = fn;
  });
  
  _.each(model.statics, function(fn, name) {
    model[name] = fn;
  });
  
  model.method = function(name, fn) {
    return this.extend(function(opts) {
      opts.methods[name] = fn;
    });
  };

  model.static = function(name, fn) {
    return this.extend(function(opts) {
      opts.statics[name] = fn;
    });
  };
};