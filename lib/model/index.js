var Emitter = require('component-emitter');
var Document = require('../document');
var util = require('util');
var _ = require('lodash');


function merge(a, b) {
  return _.merge(a, b, function(a, b) {
    return _.isArray(a) ? a.concat(b) : undefined;
  });
}

function Model() {
  var model = createModel();
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

var types = {};

Model.prototype.type = function(name) {
  types[name] = this;
  return this;  
};

Model.prototype.attr = function(name, type) {
  if(arguments.length === 1) {
    type = this.attrs[name];
    if(! type) return;

    if(! (type instanceof Model)) {
      var opts = type;
      type = opts.type instanceof Model
        ? opts.type
        : types[opts.type];
        
      if(! type) throw new Error('type "' + opts.type + '" has not been registered');
      this.attrs[name] = type.use(_.omit(opts, 'type'));
    }
    
    return this.attrs[name];
  }
  
  if('string' === typeof type)
    type = {type: type};
  
  return this.use(function(model) {
    model.complex = true;
    model.attrs[name] = type;
  });
};

Model.prototype.use = function(fn) {
  fn = fn || function() {};
  if('function' !== typeof fn) {
    var opts = fn;
    fn = function(model) {
      _.each(opts, function(val, key) {
        model = model[key](val);
      });
    };
  }
  
  if(this.mutable) {
    fn(this);
    return this;
  }
  
  var model = createModel();
  merge(model, this);
  
  model.mutable = true;
  fn(model);
  model.mutable = false;
  
  return model;
};

module.exports = Model;