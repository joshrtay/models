module.exports = function(Model) {
  Model.descriminator = function(key, value, otherModel) {
    return this.on('initialize', function(model, value) {
      if (value[key] === value) {
        if (!Model.is(otherModel))
          otherModel = Model.lookup(otherModel);
       return otherModel(value);
      }
    });
  };
}