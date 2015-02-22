module.exports = function(model) {
  model.get(function(value, type) {
    return value === undefined
      ? type.defaultValue
      : value;
  });
  
  model.default = function(value) {
    return this.extend(function(model) {
      model.defaultValue = value;
    });
  };
};