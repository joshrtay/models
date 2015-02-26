var _ = require('lodash');

module.exports = function(Model) {
  Model.on('initializing', function(model, value) {
    if (value === undefined) {
      model.doc = _.clone(this.model.prototype.doc);
    }
  })

  Model.default = function(value) {
    return this.use(function(Model) {
      Model.prototype.doc = value;
    });
  };
};