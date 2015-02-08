var Document = require('../document');
var Type = require('../type');
var util = require('util');
var _ = require('lodash');

function Model(name) {
  function AbstractDocument(doc) {
    if(! (this instanceof AbstractDocument))
      return new AbstractDocument(doc);

    Document.call(this, doc);
    this.model = model;
  }
  
  AbstractDocument.__proto__ = Model.prototype;
  util.inherits(AbstractDocument, Document);
  
  var model = AbstractDocument;
  
  model.methods = {};
  model.statics = {};
  model.paths = {};
  model.name = name;
  
  Type.call(model);
  return AbstractDocument;
}

util.inherits(Model, Type);


Model.prototype.extend = function(model) {
  var self = this;
  Type.prototype.extend.call(this, model);
  _.each(model.methods, function(fn, name) {
    self.method(name, fn);
  });
  
  _.each(model.statics, function(fn, name) {
    self.static(name, fn);
  });
  
  _.each(model.paths, function(path, name) {
    self.path(name, path);
  });
  
  return this;
};

Model.prototype.method = function(name, fn) {
  this.prototype[name] = this.methods[name] = fn;
  return this;
};

Model.prototype.static = function(name, fn) {
  this[name] = this.statics[name] = fn;
  return this;
};

Model.prototype.path = function(path, type) {
  if(arguments.length === 1)
    return this.paths[path];
  
  if(! (type instanceof Type))
    type = new Type(type);
  
  this.paths[path] = type;
  return this;
};

Model.prototype.cast = function(value) {
  return new this(value);
};

// Over-ride Type's validate method
Model.prototype.validate = function(doc, cb) {
  var paths = this.paths;
  var keys = Object.keys(paths);
  var n = keys.length;
  var errors = [];
  
  keys.forEach(function(path) {
    var type = paths[path];
    var value = doc.get(path);
    type.validate(value, function(err) {
      n--;
      if(err) errors.push(err);
      if(n === 0) cb(errors.length ? errors : null);
    });
  });
};

module.exports = Model;