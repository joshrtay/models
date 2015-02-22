module.exports = function(Model) {
  Model.on('pre:init', function(model) {
    model.get(function(value) {
      return value === undefined
        ? model.defaultValue
        : value;
    });
  });
  
  Model.prototype.default = function(value) {
    return this.extend(function(opts) {
      opts.defaultValue = value;
    });
  };
};