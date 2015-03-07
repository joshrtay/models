var _ = require('lodash');

module.exports = function(Model) {

  Model.on('initializing', function(model) {
    model.sub = {};
  });

  Model.attrs = Model.attrs || {};
  
  Model.attr = function(name, fn) {
    return this.use(function(Model) {
      Model.attrs[name] = fn;
    });
  };

  Model.prototype.set = function(path, value) {
    var splitPath = path.split('.');

    if (splitPath.length > 1) {
      return this.get(splitPath.slice(0, -1).join('.')).set(splitPath[splitPath.length - 1]);
    }


    this.value[path] = value;
    this.emit('change');
    return this.value[path];
  };

  Model.prototype.get = function(path) {
    if (!path) return this;

    var splitPath = path.split('.');
    path = splitPath[0];

    var value = this.value[path];
    var fn = this.model.attrs[path] || Model;
    var subModel = this.sub[path];

    if (! subModel || (subModel.shouldUpdate && subModel.shouldUpdate(value))) {
      subModel = this.sub[path] = fn(value);
    }

    return subModel.get(splitPath.slice(1).join('.'));
  };


  Model.prototype.shouldUpdate = function(nextValue) {
    return nextValue === this.value;
  };

};
