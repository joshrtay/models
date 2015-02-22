module.exports = function(model) {
  model.casters = model.casters || [];
    
  model.caster = function(fn) {
    return this.extend(function(opts) {
      opts.casters.push(fn);
    });
  }
     
  model.cast = function(value) {
    this.casters.forEach(function(fn) {
      value = fn(value);
    });
    
    return value;
  };
  
  model.set(function(value) {
    return model.cast(value);
  });
};