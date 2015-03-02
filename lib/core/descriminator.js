module.exports = function(Model) {
  Model.descriminator = function(key, value, otherModel) {
    return this.on('initialize', function(model, doc) {
      if (doc[key] === value) {
        if (!Model.is(otherModel))
          otherModel = Model.lookup(otherModel);
       return otherModel(doc);
      }
    });
  };
}