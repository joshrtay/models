var _ = require('lodash');

module.exports = function(Model) {

  Model.on('initializing', function(model) {
    model.cache = {};
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


    this.doc[path] = value;
    this.emit('change');
    return this.doc[path];
  };

  Model.prototype.get = function(path) {
    var splitPath = path.split('.');
    path = splitPath[0];

    var value = this.doc[path];
    var fn = this.model.attrs[path];
    var cached = this.cache[path];

    if (! cached || (cached.shouldUpdate && cached.shouldUpdate(value))) {
      value = this.cache[path] = fn(value);
    }

    if (splitPath.length === 1)
      return value;
    else
      return value.get(splitPath.slice(1).join('.'));
  };


  Model.prototype.shouldUpdate = function(nextValue) {
    return nextValue === this.doc;
  };

};
