module.exports = function(Model) {
  Model.on('init', function(model) {
    model.methods = {};
    model.statics = {};
       
    model.on('extend', function(extender) {
      Object.keys(model.methods).forEach(function(name) {
        extender.method(name, model.methods[name]);
      });
      
      Object.keys(model.statics).forEach(function(name) {
        extender.static(name, model.statics[name]);
      });
    });
  });
  
  Model.prototype.method = function(name, fn) {
    this.prototype[name] = this.methods[name] = fn;
    return this;
  };

  Model.prototype.static = function(name, fn) {
    this[name] = this.statics[name] = fn;
    return this;
  };
};