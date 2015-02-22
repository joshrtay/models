module.exports = function(model) {
  model.getters = model.getters || [];
  model.setters = model.setters || [];
  
  model.set = function(fn) {
    return this.extend(function(opts) {
      opts.setters.push(fn);
    });    
  };
   
  model.get = function(fn) {
    return this.extend(function(opts) {
      opts.getters.push(fn);
    });
  };
  
  model.runSetters = function(value, context) {
    this.setters.forEach(function(fn) {
      value = fn.call(context, value);
    });
    
    return value;
  };

  model.runGetters = function(value, context) {
    this.getters.forEach(function(fn) {
      value = fn.call(context, value);
    });
    
    return value;
  };
};