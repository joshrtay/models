module.exports = function(Model) {
  Model.method = function(name, fn) {
    return this.use(function(Model) {
      Model.prototype[name] = fn;
    });
  };

  Model.static = function(name, fn) {
    return this.use(function(Model) {
      Model[name] = fn;
    });
  };
};