module.exports = function(Model) {
  Model.on('init', function(model) {
    model.getters = [];
    model.setters = [];
    model.on('extend', function(extender) {
      model.getters.forEach(function(fn) {
        extender.get(fn);
      });
      
      model.setters.forEach(function(fn) {
        extender.set(fn);
      });
    });
  });
  
  Model.prototype.set = function(fn) {
    this.setters.push(fn);
  };
  
  Model.prototype.get = function(fn) {
    this.getters.push(fn);
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