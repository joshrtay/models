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
  
  Model.emit('configure', opts);

  var type = opts.type;
  delete opts.type;
  
  var model = type instanceof Model
    ? type.extend()
    : createModel();
    
  merge(model, opts);
  model.attrs = model.attrs || {};
  
  model.finalized = false;
  Model.emit('pre:init', model);
  model.finalized = true;
  Model.emit('init', model);
  
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

Emitter(Model);
Emitter(Model.prototype);

Model.use = function(plugin) {
  plugin(Model, Document);
  return Model;
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
  if(! this.finalized) {
    fn(this);
    return this;
  }
  fn = fn || function() {};
  
  var opts = _.clone(this, true);
  fn(opts);
  return Model(opts);
};

module.exports = Model;