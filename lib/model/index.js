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
  model.attrs = {};
  model.name = name;
  
  Type.call(model);
  return AbstractDocument;
}

util.inherits(Model, Type);


Model.prototype.extend = function(name) {
  var model = new Model(name);
  Type.prototype.extend.call(this, model);
  
  _.each(this.methods, function(fn, name) {
    model.method(name, fn);
  });
  
  _.each(this.statics, function(fn, name) {
    model.static(name, fn);
  });
  
  _.each(this.attrs, function(type, name) {
    model.attr(name, type);
  });
  
  return model;
};

Model.prototype.method = function(name, fn) {
  this.prototype[name] = this.methods[name] = fn;
  return this;
};

Model.prototype.static = function(name, fn) {
  this[name] = this.statics[name] = fn;
  return this;
};

Model.prototype.attr = function(name, type) {
  if(arguments.length === 1)
    return this.attrs[name];
  
  if(! (type instanceof Type))
    type = new Type(type);
  
  this.attrs[name] = type;
  return this;
};

Model.prototype.cast = function(value) {
  return new this(value);
};

// Over-ride Type's validate method
Model.prototype.validate = function(doc, cb) {
  var attrs = this.attrs;
  var keys = Object.keys(attrs);
  var n = keys.length;
  var errors = [];
  
  keys.forEach(function(path) {
    var type = attrs[path];
    var value = doc.get(path);
    type.validate(value, function(err) {
      n--;
      if(err) errors.push(err);
      if(n === 0) cb(errors.length ? errors : null);
    });
  });
};

module.exports = Model;