var _ = require('lodash');
var hooks = require('./hooks');

function ModelBase(){}

ModelBase.is = function(model) {
  return model.model && model.model.parents && 
    (model.model === this || model.model.parents.indexOf(this) >= 0);
};

ModelBase.use = function(fn) {
  if(this.mutable) {
    fn(this);
    return this;
  }
  
  var Model = createModel(this);

  Model.mutable = true;
  fn(Model);
  Model.mutable = false;
  
  return Model;
};

ModelBase.parents = [];
  

function createModel(Base) {
  Base = Base || ModelBase;

  function Model(doc) {
    if(! (this instanceof Model))
      return new Model(doc);

    this.doc = doc;

    // initalizers can transform model
    var self = this.model.transform('initializing', this, doc);
    this.model.emit('initialize', self);
    return self;
  }

  Model.prototype = Object.create(ModelBase.prototype);
  Model.prototype.constructor = ModelBase;
  Model.prototype.model = Model;


  // copy statics
  for (key in Base) {
    Model[key] = clone(Base[key]);
  }

  // copy prototype
  for (key in Base.prototype) {
    if (key !== 'model' && key !== 'constructor')
      Model.prototype[key] = clone(Base.prototype[key]);
  }

  Model.parents.push(Base);

  return Model;
}


function clone(val) {
  if (!_.isFunction(val))
    return _.cloneDeep(val);
  else
    return val;
}


module.exports = createModel().use(hooks);





