module.exports = function(Model) {
  Model.on('init', function(model) {
    model.casters = [];
    
    model.on('extend', function(extender) {
      model.casters.forEach(function(caster) {
        extender.addCaster(caster);
      });
    });
  });
  
  Model.prototype.addCaster = function(fn) {
    this.casters.push(fn);
  };
   
  Model.prototype.cast = function(value) {
    this.casters.forEach(function(fn) {
      value = fn(value);
    });
    
    return value;
  };
};