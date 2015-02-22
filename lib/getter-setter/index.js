module.exports = function(model) {
  model.getters = model.getters || [];
  model.setters = model.setters || [];
  
  model.set = function(fn) {
    return this.use(function(opts) {
      opts.setters.push(fn);
    });    
  };
   
  model.get = function(fn) {
    return this.use(function(opts) {
      opts.getters.push(fn);
    });
  };
  
  model.runSetters = function(value, context) {
    var self = this;
    this.setters.forEach(function(fn) {
      value = fn.call(context, value, self);
    });
    
    return value;
  };

  model.runGetters = function(value, context) {
    var self = this;
    this.getters.forEach(function(fn) {
      value = fn.call(context, value, self);
    });
    
    return value;
  };
};