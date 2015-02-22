var Emitter = require('component-emitter');
var Document = require('../document');
var util = require('util');
var _ = require('lodash');


function merge(a, b) {
  return _.merge(a, b, function(a, b) {
    return _.isArray(a) ? a.concat(b) : undefined;
  });
}

function Model(opts) {
  opts = opts || {};
  if('string' === typeof opts)
    opts = {name: opts};
  
  var type = Model.type(opts.type);
  delete opts.type;
  
  var model = type instanceof Model
    ? type.extend()
    : createModel();
  
  merge(model, opts);
  Model.plugins.forEach(function(plugin) {
    model = model.use(plugin);
  });
  model.attrs = model.attrs || {};
  return model;  
}

function createModel() {
  function AbstractDocument(doc) {
    if(! (this instanceof AbstractDocument))
      return new AbstractDocument(doc);

    Document.call(this, doc);
    this.model = AbstractDocument;
    this.model.emit('init', this);
  }
    
  AbstractDocument.__proto__ = Model.prototype;
  util.inherits(AbstractDocument, Document);
  return AbstractDocument;
}

Emitter(Model.prototype);

Model.plugins = [];
Model.use = function(plugin) {
  Model.plugins.push(plugin);
  return Model;
};

Model._types = {};  
Model.type = function(name, type) {
  if(arguments.length === 2) {
    this._types[name] = type;
    return this;
  }
  
  return name instanceof Model
    ? name
    : this._types[name];
};

Model.prototype.use = function(plugin) {
  this.plugins = this.plugins || [];
  this.plugins.push(plugin);
  return this.extend(plugin);
};

Model.prototype.attr = function(name, type) {
  if(arguments.length === 1)
    return this.attrs[name];
  
  if('string' === typeof type)
    type = {type: type};
  
  return this.extend(function(opts) {
    opts.complex = true;
    opts.attrs[name] = type instanceof Model
      ? type
      : Model(type);
  });
};

Model.prototype.extend = function(fn) {
  fn = fn || function() {};
  
  if(this.mutable) {
    fn(this);
    return this;
  }
  
  var model = createModel();
  merge(model, this);
  
  model.mutable = true;
  
  fn(model);

  model.plugins.forEach(function(plugin) {
    model.extend(plugin);
  });
  
  model.mutable = false;
  
  
  return model;
  
  // _.clone(this, true);
  
  // fn = fn || function() {};
  
  // var opts = _.clone(this, true);
  // fn(opts);
  // return Model(opts);
};

module.exports = Model;