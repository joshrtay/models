var Document = require('../document');
var util = require('util');
var _ = require('lodash');

function Model(opts) {
  function AbstractDocument(doc) {
    if(! (this instanceof AbstractDocument))
      return new AbstractDocument(doc);

    Document.call(this, doc);
    this.model = model;
  }
  
  AbstractDocument.__proto__ = Model.prototype;
  util.inherits(AbstractDocument, Document);
  
  opts = opts || {};
  
  var model = AbstractDocument;
  
  model.attrs = {};
  model.modelName = opts.name;
  
  Emitter(model);
  Model.emit('init', model);
  model.emit('init', opts);
  
  return model;
}

Emitter(model);

Model.prototype.extend = function(name) {
  var model = new Model(name);
  
  this.emit('extend', model);
    
  _.each(this.attrs, function(type, name) {
    model.attr(name, type);
  });
  
  return model;
};

Model.prototype.attr = function(name, type) {
  if(arguments.length === 1)
    return this.attrs[name];
  
  if(! (type instanceof Type))
    type = new Type(type);
  
  this.attrs[name] = type;
  return this;
};

module.exports = Model;