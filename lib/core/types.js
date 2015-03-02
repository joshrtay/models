module.exports = function(Model) {
  var types = {};

  Model.lookup = function(name) {
    return types[name];
  };

  Model.type = function(name) {
    types[name] = this;
    return this;
  };

  Model.link = function(options) {
    var type = options.type;
    delete options.type;
    var Model = null;
    var self = this;
    return function() {
      if (Model)
        return Model;
      else {
        Model = self.lookup(type) || self.lookup('*');
        options.forEach(function(value, key) {
          Model = Model[key](value);
        });
      }
    };
  };
};



