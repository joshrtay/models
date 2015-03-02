var _ = require('lodash');

exports = module.exports = use.call(createModel(), function(Model) {
  Model.is = is;
  Model.use = use;
});


function ModelBase(){}

function createModel() {
  function Model(doc) {
    if(! (this instanceof Model))
      return new Model(doc);

    this.doc = doc;

    // initalizers can transform model
    var self = this.Model.transform('initializing', this, doc);
    this.Model.emit('initialize', self);
    return self;
  }

  Model.prototype = Object.create(ModelBase.prototype);
  Model.prototype.constructor = ModelBase;
  Model.prototype.model = Model;

  return Model;
}

function use(fn) {
  if(this.mutable) {
    fn(this);
    return this;
  }
  
  var Model = copy(this);

  Model.mutable = true;
  fn(Model);
  Model.mutable = false;
  
  return Model;
}

function is(model) {
  return model instanceof ModelBase
}

function copy(otherModel) {
  var Model = createModel();
  merge(Model, otherModel);
  return Model;
}

function merge(a, b) {
  return _.merge(a, b, function(a, b) {
    return _.isArray(a) ? a.concat(b) : undefined;
  });
}



