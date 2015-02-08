function Document(doc) {
  this.doc = doc || {};
}

Document.prototype.set = function(path, value) {
  var type = this.model.paths[path];
  this.doc[path] = type.runSetters(type.cast(value), this);
};

Document.prototype.get = function(path) {
  if(path.indexOf('.') !== -1)
    return this._getNested(path);
  
  var type = this.model.paths[path];
  var value = this.doc[path];
  return type.runGetters(type.cast(value), this);
};

Document.prototype._getNested = function(path) {
  var val = this;

  path.split('.').forEach(function(part) {
    val = val.get(part);
  });
  
  return val;
};

Document.prototype.validate = function(cb) {
  this.model.validate(this, cb);
};

module.exports = Document;