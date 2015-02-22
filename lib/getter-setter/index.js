module.exports = function(Model) {
  Model.on('configure', function(opts) {
    opts.getters = opts.getters || [];
    opts.setters = opts.setters || [];
  });
  
  Model.prototype.set = function(fn) {
    return this.extend(function(opts) {
      opts.setters.push(fn);
    });
  };
  
  Model.prototype.get = function(fn) {
    return this.extend(function(opts) {
      opts.getters.push(fn);
    });
  };
  
  Model.prototype.runSetters = function(value, context) {
    this.setters.forEach(function(fn) {
      value = fn.call(context, value);
    });
    
    return value;
  };

  Model.prototype.runGetters = function(value, context) {
    this.getters.forEach(function(fn) {
      value = fn.call(context, value);
    });
    
    return value;
  };
};