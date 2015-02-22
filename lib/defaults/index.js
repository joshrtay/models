module.exports = function(model) {
  model.get(function(value) {
    console.log('asdf', this.model.defaultValue);
    return value === undefined
      ? this.model.defaultValue
      : value;
  });
  
  model.default = function(value) {
    return this.extend(function(model) {
      model.defaultValue = value;
    });
  };
};