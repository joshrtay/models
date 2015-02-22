module.exports = function(Model) {
  Model.on('configure', function(opts) {
    opts.casters = opts.casters || [];
  });
  
  Model.on('pre:init', function(model) {
    model.set(function(value) {
      return model.cast(value);
    });
  });
  
  Model.prototype.caster = function(fn) {
    return this.extend(function(opts) {
      opts.casters.push(fn);
    });
  };
   
  Model.prototype.cast = function(value) {
    this.casters.forEach(function(fn) {
      value = fn(value);
    });
    
    return value;
  };
};