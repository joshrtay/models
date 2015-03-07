var _ = require('lodash');

module.exports = function(Model) {
  Model.on('initialize', function(model, value) {
    if (value === undefined) {
      model.value = _.clone(this.model.prototype.value);
    }
  })

  Model.default = function(value) {
    return this.use(function(Model) {
      Model.prototype.value = value;
    });
  };
};